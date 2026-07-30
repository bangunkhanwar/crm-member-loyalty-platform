import { query } from '../config/db.js';

// Get Reward Catalog
export const getRewards = async (req, res) => {
  try {
    const result = await query(
      `SELECT "GiftId", "GiftDescription", "GiftAmount", "PointQuantity", "Stock", "ImagePath", "ExpiryDays", "Category"
       FROM points."PointGiftRedeemption"
       WHERE "isActive" = 1
       ORDER BY "PointQuantity" ASC`
    );

    const rewards = result.rows.map(r => ({
      id: r.GiftId,
      name: r.GiftDescription,
      amount: parseFloat(r.GiftAmount || 0),
      pointsNeeded: parseInt(r.PointQuantity),
      stock: parseInt(r.Stock || 0),
      image: r.ImagePath || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400',
      expiryDays: r.ExpiryDays || 30,
      category: r.Category || 'Voucher'
    }));

    return res.json({ success: true, data: rewards });
  } catch (err) {
    console.error('Error getRewards:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil katalog reward.' });
  }
};

// Redeem Reward Gift -> Deduct Points & Issue Voucher
export const redeemReward = async (req, res) => {
  const memberCode = req.user.memberCode;
  const { rewardId } = req.body;

  if (!rewardId) {
    return res.status(400).json({ success: false, message: 'ID Reward wajib ditentukan.' });
  }

  try {
    // 1. Fetch Reward Details
    const giftRes = await query(
      `SELECT * FROM points."PointGiftRedeemption" WHERE "GiftId" = $1 AND "isActive" = 1`,
      [rewardId]
    );

    const gift = giftRes.rows[0];
    if (!gift) {
      return res.status(404).json({ success: false, message: 'Reward tidak ditemukan atau sudah tidak aktif.' });
    }

    if (gift.Stock <= 0) {
      return res.status(400).json({ success: false, message: 'Stok reward telah habis.' });
    }

    // 2. Check Member Point Balance
    const balanceRes = await query(
      `SELECT "TotalPoints" FROM member."MemberPointsCurrently" WHERE "MemberCode" = $1`,
      [memberCode]
    );

    const currentPoints = parseInt(balanceRes.rows[0]?.TotalPoints || 0);

    if (currentPoints < gift.PointQuantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Poin Anda (${currentPoints}) tidak mencukupi untuk menukar reward ini (${gift.PointQuantity} Poin).` 
      });
    }

    // 3. Deduct Points & Update Balance
    const newBalance = currentPoints - gift.PointQuantity;

    await query(
      `UPDATE member."MemberPointsCurrently" SET "TotalPoints" = $1, "LastUpdate" = CURRENT_TIMESTAMP WHERE "MemberCode" = $2`,
      [newBalance, memberCode]
    );

    // 4. Insert Point Mutasi (Credit / Out)
    const refNum = `RDM${Date.now()}`;
    await query(
      `INSERT INTO points."Points" ("MemberCode", "TransNumRef", "TransType", "Debit", "Credit", "Description", "CreateBy")
       VALUES ($1, $2, 2, 0, $3, $4, $5)`,
      [memberCode, refNum, gift.PointQuantity, `Redeem: ${gift.GiftDescription}`, memberCode]
    );

    // 5. Deduct Gift Stock
    await query(
      `UPDATE points."PointGiftRedeemption" SET "Stock" = "Stock" - 1 WHERE "GiftId" = $1`,
      [rewardId]
    );

    // 6. Issue Voucher for Member
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (gift.ExpiryDays || 30));

    const uniqueCode = `VCH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const voucherId = `VCH${Date.now()}`;

    await query(
      `INSERT INTO voucher."Voucher" 
       ("VoucherId", "MemberCode", "PromoCode", "Title", "VoucherAmount", "ExpiryDate", "UniqueCode", "fidVoucherStatus")
       VALUES ($1, $2, 'REDEEM', $3, $4, $5, $6, 1)`,
      [voucherId, memberCode, gift.GiftDescription, gift.GiftAmount, expiryDate, uniqueCode]
    );

    return res.json({
      success: true,
      message: 'Penukaran reward berhasil! Voucher telah ditambahkan ke akun Anda.',
      data: {
        voucherId,
        title: gift.GiftDescription,
        uniqueCode,
        amount: gift.GiftAmount,
        expiryDate,
        remainingPoints: newBalance
      }
    });
  } catch (err) {
    console.error('Error redeemReward:', err);
    return res.status(500).json({ success: false, message: 'Gagal melakukan penukaran reward.' });
  }
};
