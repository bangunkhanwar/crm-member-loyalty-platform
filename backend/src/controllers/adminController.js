import { generateMemberCode } from '../utils/generateMemberCode.js';
import { query } from '../config/db.js';

// 1. Dashboard KPI Metrics (Admin & Head Portal)
export const getDashboardKPIs = async (req, res) => {
  try {
    // Total Members
    const totalMemberRes = await query(`SELECT COUNT(*) FROM member."Member"`);
    const totalMembers = parseInt(totalMemberRes.rows[0].count);

    // Active Members (isActive = 1)
    const activeMemberRes = await query(`SELECT COUNT(*) FROM member."Member" WHERE "isActive" = 1`);
    const activeMembers = parseInt(activeMemberRes.rows[0].count);

    // Total Points Redeemed
    const redeemedRes = await query(
      `SELECT COALESCE(SUM("Credit"), 0) AS total_redeemed FROM points."Points" WHERE "TransType" = 2`
    );
    const totalPointsRedeemed = parseInt(redeemedRes.rows[0].total_redeemed);

    // Total Points Earned
    const earnedRes = await query(
      `SELECT COALESCE(SUM("Debit"), 0) AS total_earned FROM points."Points" WHERE "TransType" = 1`
    );
    const totalPointsEarned = parseInt(earnedRes.rows[0].total_earned);

    const redemptionRate = totalPointsEarned > 0 
      ? ((totalPointsRedeemed / totalPointsEarned) * 100).toFixed(1) 
      : '0.0';

    // Top 10 Members by Point Balance
    const topMembersRes = await query(
      `SELECT m."MemberCode", m."Name", m."Handpone", m."TierMember", COALESCE(p."TotalPoints", 0) AS "TotalPoints"
       FROM member."Member" m
       LEFT JOIN member."MemberPointsCurrently" p ON m."MemberCode" = p."MemberCode"
       ORDER BY "TotalPoints" DESC
       LIMIT 10`
    );

    // Tier Segmentation Breakdown
    const tierRes = await query(
      `SELECT "TierMember", COUNT(*) AS count FROM member."Member" GROUP BY "TierMember"`
    );

    return res.json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        totalPointsRedeemed,
        totalPointsEarned,
        redemptionRate: `${redemptionRate}%`,
        topMembers: topMembersRes.rows.map(m => ({
          memberCode: m.MemberCode,
          name: m.Name,
          phone: m.Handpone,
          tier: m.TierMember || 'SILVER',
          totalPoints: parseInt(m.TotalPoints)
        })),
        tierBreakdown: tierRes.rows
      }
    });
  } catch (err) {
    console.error('Error getDashboardKPIs:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data KPI dashboard.' });
  }
};

// 2. Member Management List (Search & Filter)
export const getMemberList = async (req, res) => {
  const { search, storeCode, limit = 50, page = 1 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let sql = `
      SELECT m."MemberCode", m."Handpone", m."Name", m."Email", m."City", 
             m."StoreCode", m."RegistrationDate", m."TierMember", m."isActive",
             COALESCE(p."TotalPoints", 0) AS "TotalPoints"
      FROM member."Member" m
      LEFT JOIN member."MemberPointsCurrently" p ON m."MemberCode" = p."MemberCode"
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search.trim()}%`);
      sql += ` AND (m."Name" ILIKE $${params.length} OR m."Handpone" ILIKE $${params.length} OR m."MemberCode" ILIKE $${params.length})`;
    }

    if (storeCode) {
      params.push(storeCode);
      sql += ` AND m."StoreCode" = $${params.length}`;
    }

    sql += ` ORDER BY m."RegistrationDate" DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    const members = result.rows.map(m => ({
      memberCode: m.MemberCode,
      name: m.Name,
      phone: m.Handpone,
      email: m.Email,
      city: m.City,
      storeCode: m.StoreCode,
      registrationDate: m.RegistrationDate,
      tier: m.TierMember || 'SILVER',
      isActive: m.isActive === 1,
      totalPoints: parseInt(m.TotalPoints)
    }));

    return res.json({ success: true, data: members });
  } catch (err) {
    console.error('Error getMemberList:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil daftar member.' });
  }
};

// 3. Member Detail
export const getMemberDetail = async (req, res) => {
  const { memberCode } = req.params;

  try {
    const memberRes = await query(
      `SELECT m.*, COALESCE(p."TotalPoints", 0) AS "TotalPoints"
       FROM member."Member" m
       LEFT JOIN member."MemberPointsCurrently" p ON m."MemberCode" = p."MemberCode"
       WHERE m."MemberCode" = $1`,
      [memberCode]
    );

    if (memberRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Member tidak ditemukan.' });
    }

    const m = memberRes.rows[0];

    // Fetch point history
    const historyRes = await query(
      `SELECT * FROM points."Points" WHERE "MemberCode" = $1 ORDER BY "CreateTime" DESC LIMIT 20`,
      [memberCode]
    );

    // Fetch vouchers
    const voucherRes = await query(
      `SELECT * FROM voucher."Voucher" WHERE "MemberCode" = $1 ORDER BY "CreatedDate" DESC`,
      [memberCode]
    );

    return res.json({
      success: true,
      data: {
        memberCode: m.MemberCode,
        name: m.Name,
        phone: m.Handpone,
        email: m.Email,
        gender: m.Gender,
        dateOfBirth: m.DateOfBirth,
        address: m.Address,
        city: m.City,
        storeCode: m.StoreCode,
        registrationDate: m.RegistrationDate,
        tier: m.TierMember || 'SILVER',
        totalPoints: parseInt(m.TotalPoints),
        isActive: m.isActive === 1,
        pointHistory: historyRes.rows,
        vouchers: voucherRes.rows
      }
    });
  } catch (err) {
    console.error('Error getMemberDetail:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail member.' });
  }
};

// 4. Point Adjustment (PRD Section 5.3.A03 - Wajib Alasan & Nominal)
export const adjustMemberPoints = async (req, res) => {
  const { memberCode, type, nominal, reason } = req.body;
  const operatorId = req.user.idMsOperator;
  const operatorName = req.user.fullName || req.user.username;

  if (!memberCode || !type || !nominal || !reason) {
    return res.status(400).json({ 
      success: false, 
      message: 'MemberCode, Type (ADD/DEDUCT), Nominal, dan Alasan wajib diisi.' 
    });
  }

  const pointNominal = parseInt(nominal);
  if (isNaN(pointNominal) || pointNominal <= 0) {
    return res.status(400).json({ success: false, message: 'Nominal poin harus berupa angka positif.' });
  }

  try {
    // Check member
    const balanceRes = await query(
      `SELECT "TotalPoints" FROM member."MemberPointsCurrently" WHERE "MemberCode" = $1`,
      [memberCode]
    );

    if (balanceRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Member tidak ditemukan.' });
    }

    const currentPoints = parseInt(balanceRes.rows[0].TotalPoints || 0);
    let newBalance = currentPoints;

    if (type === 'ADD') {
      newBalance += pointNominal;
    } else if (type === 'DEDUCT') {
      if (currentPoints < pointNominal) {
        return res.status(400).json({ 
          success: false, 
          message: `Saldo poin member (${currentPoints}) kurang dari nominal pengurangan (${pointNominal}).` 
        });
      }
      newBalance -= pointNominal;
    } else {
      return res.status(400).json({ success: false, message: 'Type harus ADD atau DEDUCT.' });
    }

    // Update Balance
    await query(
      `UPDATE member."MemberPointsCurrently" SET "TotalPoints" = $1, "LastUpdate" = CURRENT_TIMESTAMP WHERE "MemberCode" = $2`,
      [newBalance, memberCode]
    );

    // Insert Ledger Entry
    const refNum = `ADJ${Date.now()}`;
    await query(
      `INSERT INTO points."Points" ("MemberCode", "TransNumRef", "TransType", "Debit", "Credit", "Description", "CreateBy")
       VALUES ($1, $2, 3, $3, $4, $5, $6)`,
      [
        memberCode, 
        refNum, 
        type === 'ADD' ? pointNominal : 0, 
        type === 'DEDUCT' ? pointNominal : 0, 
        `Adjustment ${type}: ${reason}`, 
        operatorName
      ]
    );

    // Log Adjustment with mandatory reason
    await query(
      `INSERT INTO points."PointAdjustmentLog" ("MemberCode", "fidMsOperator", "AdjustmentType", "PointsNominal", "Reason")
       VALUES ($1, $2, $3, $4, $5)`,
      [memberCode, operatorId, type, pointNominal, reason]
    );

    // Action Log Audit Trail
    await query(
      `INSERT INTO admpanel."trActionLog" ("fidMsOperator", "FormCaller", "Message", "ValueBefore", "ValueAfter")
       VALUES ($1, 'PointAdjustment', $2, $3, $4)`,
      [
        operatorId, 
        `Penyesuaian poin ${type} sebesar ${pointNominal} untuk ${memberCode}. Alasan: ${reason}`,
        `Saldo: ${currentPoints}`,
        `Saldo: ${newBalance}`
      ]
    );

    return res.json({
      success: true,
      message: `Penyesuaian poin ${type} sebesar ${pointNominal} berhasil disimpan.`,
      data: {
        memberCode,
        previousPoints: currentPoints,
        newBalance
      }
    });
  } catch (err) {
    console.error('Error adjustMemberPoints:', err);
    return res.status(500).json({ success: false, message: 'Gagal memproses penyesuaian poin.' });
  }
};

// 5. Register Member Baru di Toko (Karyawan Toko / Admin Portal)
export const registerNewMemberByStore = async (req, res) => {
  const { name, phone, email, storeCode, categoryCode = 'MEMBER' } = req.body;
  const operatorName = req.user.fullName || req.user.username;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Nama dan Nomor HP wajib diisi.' });
  }

  const formattedPhone = phone.trim().replace(/^\+62/, '0');

  try {
    const checkRes = await query(
      `SELECT "MemberCode" FROM member."Member" WHERE "Handpone" = $1`,
      [formattedPhone]
    );
    if (checkRes.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Nomor HP ini sudah terdaftar.' });
    }

    const seqMap = { MEMBER: 'member.member_seq', RESELLER: 'member.reseller_seq', AGENT: 'member.agent_seq' };
    const prefixMap = { MEMBER: 'MBR', RESELLER: 'RSL', AGENT: 'AGN' };
    const seqName = seqMap[categoryCode] || seqMap.MEMBER;
    const prefix = prefixMap[categoryCode] || 'MBR';

    const seqRes = await query(`SELECT nextval('${seqName}') AS next`);
    const nextNum = parseInt(seqRes.rows[0].next);
    const memberCode = `${prefix}${String(nextNum).padStart(8, '0')}`;

    const insertRes = await query(
      `INSERT INTO member."Member" 
       ("MemberCode", "Handpone", "Name", "Email", "StoreCode", "CreatedBy", "MemberCategory", "TierMember")
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'SILVER')
       RETURNING *`,
      [memberCode, formattedPhone, name, email || '', storeCode || req.user.storeCode || 'STR01', operatorName, categoryCode]
    );

    await query(
      `INSERT INTO member."MemberPointsCurrently" ("MemberCode", "TotalPoints") VALUES ($1, 0)
       ON CONFLICT ("MemberCode") DO NOTHING`,
      [memberCode]
    );

    return res.json({
      success: true,
      message: `Pendaftaran ${categoryCode} baru (${memberCode}) berhasil disimpan.`,
      data: insertRes.rows[0]
    });
  } catch (err) {
    console.error('Error registerNewMemberByStore:', err);
    return res.status(500).json({ success: false, message: 'Gagal memproses pendaftaran.' });
  }
};
