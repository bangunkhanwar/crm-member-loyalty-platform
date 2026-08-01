import { query } from '../config/db.js';

// Get Member Profile
export const getProfile = async (req, res) => {
  const memberCode = req.user.memberCode;

  try {
    const memberRes = await query(
      `SELECT m."MemberCode", m."Handpone", m."Name", m."Email", m."Gender", 
              m."DateOfBirth", m."Address", m."City", m."StoreCode", m."RegistrationDate",
              m."TierMember", m."referralCode", p."TotalPoints"
       FROM member."Member" m
       LEFT JOIN member."MemberPointsCurrently" p ON m."MemberCode" = p."MemberCode"
       WHERE m."MemberCode" = $1`,
      [memberCode]
    );

    if (memberRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Member tidak ditemukan.' });
    }

    const row = memberRes.rows[0];
    return res.json({
      success: true,
      data: {
        memberCode: row.MemberCode,
        phone: row.Handpone,
        name: row.Name,
        email: row.Email || '',
        gender: row.Gender,
        dateOfBirth: row.DateOfBirth,
        address: row.Address || '',
        city: row.City || '',
        storeCode: row.StoreCode || 'STR01',
        registrationDate: row.RegistrationDate,
        tier: row.TierMember || 'SILVER',
        referralCode: row.referralCode || '',
        totalPoints: parseInt(row.TotalPoints || 0)
      }
    });
  } catch (err) {
    console.error('Error getProfile:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data profil.' });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  const memberCode = req.user.memberCode;
  const { name, email, gender, dateOfBirth, address, city } = req.body;

  try {
    await query(
      `UPDATE member."Member"
       SET "Name" = COALESCE($1, "Name"),
           "Email" = COALESCE($2, "Email"),
           "Gender" = COALESCE($3, "Gender"),
           "DateOfBirth" = COALESCE($4, "DateOfBirth"),
           "Address" = COALESCE($5, "Address"),
           "City" = COALESCE($6, "City"),
           "LastUpdate" = CURRENT_TIMESTAMP
       WHERE "MemberCode" = $7`,
      [name, email, gender, dateOfBirth, address, city, memberCode]
    );

    return res.json({ success: true, message: 'Profil berhasil diperbarui.' });
  } catch (err) {
    console.error('Error updateProfile:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui profil.' });
  }
};

// Get Member Point History (dengan running balance akurat)
// Get Member Point History (dengan running balance akurat)
export const getPointHistory = async (req, res) => {
  const memberCode = req.user.memberCode;
  const { startDate, endDate, limit } = req.query;

  try {
    const balanceRes = await query(
      `SELECT COALESCE("TotalPoints", 0) AS "TotalPoints" FROM member."MemberPointsCurrently" WHERE "MemberCode" = $1`,
      [memberCode]
    );
    const currentBalance = parseInt(balanceRes.rows[0]?.TotalPoints || 0);

    const allRes = await query(
      `SELECT "IdRec", "TransNumRef", "TransType", "Debit", "Credit", "Description", "CreateTime"
       FROM points."Points"
       WHERE "MemberCode" = $1
       ORDER BY "CreateTime" DESC, "IdRec" DESC`,
      [memberCode]
    );

    let runningBalance = currentBalance;
    const withBalance = allRes.rows.map((item) => {
      const debit = parseInt(item.Debit || 0);
      const credit = parseInt(item.Credit || 0);
      const balanceAfter = runningBalance;
      runningBalance = runningBalance - debit + credit;

      return {
        id: item.IdRec,
        refNum: item.TransNumRef,
        type: item.TransType === 1 ? 'IN' : item.TransType === 2 ? 'OUT' : 'ADJUSTMENT',
        debit,
        credit,
        description: item.Description,
        date: item.CreateTime,
        balance: balanceAfter
      };
    });

    // Filter rentang tanggal, inklusif, boleh isi salah satu saja (startDate atau endDate)
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;

    const filtered = (start || end)
      ? withBalance.filter((t) => {
          const d = new Date(t.date);
          if (start && d < start) return false;
          if (end && d > end) return false;
          return true;
        })
      : withBalance;

    const total = filtered.length;
    const limited = limit ? filtered.slice(0, parseInt(limit)) : filtered;

    return res.json({ success: true, data: limited, total });
  } catch (err) {
    console.error('Error getPointHistory:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil riwayat poin.' });
  }
};

// Get Active & Claimed Member Vouchers
export const getMemberVouchers = async (req, res) => {
  const memberCode = req.user.memberCode;

  try {
    const result = await query(
      `SELECT "VoucherId", "Title", "VoucherAmount", "ExpiryDate", "UniqueCode", "fidVoucherStatus", "CreatedDate"
       FROM voucher."Voucher"
       WHERE "MemberCode" = $1
       ORDER BY "CreatedDate" DESC`,
      [memberCode]
    );

    const vouchers = result.rows.map(v => ({
      voucherId: v.VoucherId,
      title: v.Title,
      amount: parseFloat(v.VoucherAmount || 0),
      expiryDate: v.ExpiryDate,
      uniqueCode: v.UniqueCode,
      status: v.fidVoucherStatus === 1 ? 'ACTIVE' : v.fidVoucherStatus === 2 ? 'USED' : 'EXPIRED',
      createdDate: v.CreatedDate
    }));

    return res.json({ success: true, data: vouchers });
  } catch (err) {
    console.error('Error getMemberVouchers:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data voucher.' });
  }
};

// Get Dashboard Banners
export const getBanners = async (req, res) => {
  try {
    const result = await query(
      `SELECT "idBanner", "Title", "ImagePath", "Link" FROM public."Banner" WHERE "isActive" = 1 ORDER BY "Order" ASC`
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error getBanners:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data banner.' });
  }
};
