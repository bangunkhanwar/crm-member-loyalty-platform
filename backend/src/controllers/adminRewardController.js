import { query } from '../config/db.js';
import path from 'path';

const mapReward = (row) => {
  const stock = Number(row.Stock || 0);
  const redeemedThisMonth = Number(row.redeemedThisMonth || 0);

  return {
    giftId: row.GiftId,
    code: `RWD-${String(row.GiftId).padStart(4, '0')}`,
    name: row.GiftDescription,
    category: row.Category || 'Voucher',
    pointRequired: Number(row.PointQuantity),
    amount: Number(row.GiftAmount || 0),
    stock,
    image: row.ImagePath || '',
    expiryDays: Number(row.ExpiryDays || 30),
    isActive: row.isActive === 1,
    terms: row.Terms || '',
    redeemedTotal: Number(row.redeemedTotal || 0),
    redeemedThisMonth,
    stockStatus:
      stock <= 0 ? 'OUT_OF_STOCK' :
      stock <= 10 ? 'LOW_STOCK' :
      'HEALTHY',
    runwayDays:
      redeemedThisMonth > 0
        ? Math.floor(stock / (redeemedThisMonth / 30))
        : null,
  };
};

export const getRewardInventory = async (req, res) => {
  const { search = '' } = req.query;

  try {
    const result = await query(
      `SELECT
        g.*,
        COUNT(v."VoucherId") AS "redeemedTotal",
        COUNT(v."VoucherId") FILTER (
          WHERE v."CreatedDate" >= date_trunc('month', CURRENT_DATE)
        ) AS "redeemedThisMonth"
      FROM points."PointGiftRedeemption" g
      LEFT JOIN voucher."Voucher" v ON v."GiftId" = g."GiftId"
      WHERE (
        $1 = ''
        OR g."GiftDescription" ILIKE '%' || $1 || '%'
        OR g."Category" ILIKE '%' || $1 || '%'
      )
      GROUP BY g."GiftId"
      ORDER BY g."GiftId" DESC`,
      [search.trim()]
    );

    return res.json({
      success: true,
      data: result.rows.map(mapReward),
    });
  } catch (err) {
    console.error('getRewardInventory:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil inventaris reward.' });
  }
};

export const getRewardStats = async (req, res) => {
  try {
    const [activeRes, stockRes, topRes, pointsRes] = await Promise.all([
      query(`SELECT COUNT(*) FROM points."PointGiftRedeemption" WHERE "isActive" = 1`),
      query(`SELECT COUNT(*) FROM points."PointGiftRedeemption" WHERE "isActive" = 1 AND "Stock" <= 10`),
      query(
        `SELECT g."GiftDescription", COUNT(v."VoucherId") AS count
         FROM points."PointGiftRedeemption" g
         LEFT JOIN voucher."Voucher" v ON v."GiftId" = g."GiftId"
         GROUP BY g."GiftId"
         ORDER BY count DESC, g."GiftDescription" ASC
         LIMIT 1`
      ),
      query(`SELECT COALESCE(SUM("TotalPoints"), 0) AS total FROM member."MemberPointsCurrently"`)
    ]);

    const top = topRes.rows[0];

    return res.json({
      success: true,
      data: {
        totalActiveRewards: Number(activeRes.rows[0].count),
        outOfStockSoon: Number(stockRes.rows[0].count),
        topRedeemed: top && Number(top.count) > 0
          ? { name: top.GiftDescription, count: Number(top.count) }
          : null,
        pointsOutstanding: Number(pointsRes.rows[0].total),
      },
    });
  } catch (err) {
    console.error('getRewardStats:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil statistik reward.' });
  }
};

export const createReward = async (req, res) => {
  const { name, category, terms } = req.body;
  const pointRequired = parseInt(req.body.pointRequired, 10);
  const initialStock = parseInt(req.body.initialStock, 10);
  const amount = Number(req.body.amount) || 0;
  const expiryDays = parseInt(req.body.expiryDays, 10) || 30;
  const imagePath = req.file ? `/uploads/${path.relative('uploads', req.file.path).split(path.sep).join('/')}` : '';

  if (!name || !Number.isInteger(pointRequired) || pointRequired <= 0 ||
      !Number.isInteger(initialStock) || initialStock < 0) {
    return res.status(400).json({ success: false, message: 'Data reward tidak valid.' });
  }

  try {
    const result = await query(
      `INSERT INTO points."PointGiftRedeemption"
        ("GiftDescription", "GiftAmount", "PointQuantity", "Stock", "ExpiryDays", "Category", "ImagePath", "Terms", "isActive")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1)
       RETURNING *`,
      [name.trim(), amount, pointRequired, initialStock, expiryDays, category || 'Voucher', imagePath, terms || null]
    );

    return res.status(201).json({ success: true, data: mapReward(result.rows[0]) });
  } catch (err) {
    console.error('createReward:', err);
    return res.status(500).json({ success: false, message: 'Gagal membuat reward.' });
  }
};

export const updateReward = async (req, res) => {
  const giftId = Number(req.params.giftId);
  const { name, category, terms } = req.body;
  const pointRequired = parseInt(req.body.pointRequired, 10);
  const amount = Number(req.body.amount) || 0;
  const expiryDays = parseInt(req.body.expiryDays, 10) || 30;
  const newImagePath = req.file ? `/uploads/${path.relative('uploads', req.file.path).split(path.sep).join('/')}` : null;

  if (
    !Number.isInteger(giftId) ||
    !name ||
    !Number.isInteger(pointRequired) ||
    pointRequired <= 0 ||
    !Number.isFinite(amount) ||
    !Number.isInteger(expiryDays) ||
    expiryDays <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'Data reward tidak valid.',
    });
  }

  try {
    const result = await query(
      `UPDATE points."PointGiftRedeemption"
       SET "GiftDescription" = $1,
           "Category" = $2,
           "PointQuantity" = $3,
           "GiftAmount" = $4,
           "ExpiryDays" = $5,
           "Terms" = $6,
           "ImagePath" = COALESCE($7, "ImagePath")
       WHERE "GiftId" = $8
       RETURNING *`,
      [name.trim(), category || 'Voucher', pointRequired, amount, expiryDays, terms || null, newImagePath, giftId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Reward tidak ditemukan.' });
    }

    return res.json({ success: true, data: mapReward(result.rows[0]) });
  } catch (err) {
    console.error('updateReward:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui reward.' });
  }
};

export const restockReward = async (req, res) => {
  const giftId = Number(req.params.giftId);
  const addStock = Number(req.body.addStock);

  if (!Number.isInteger(giftId) || !Number.isInteger(addStock) || addStock <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Jumlah stok harus berupa bilangan bulat positif.',
    });
  }

  try {
    const result = await query(
      `UPDATE points."PointGiftRedeemption"
       SET "Stock" = "Stock" + $1
       WHERE "GiftId" = $2
       RETURNING *`,
      [addStock, giftId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Reward tidak ditemukan.' });
    }

    return res.json({ success: true, data: mapReward(result.rows[0]) });
  } catch (err) {
    console.error('restockReward:', err);
    return res.status(500).json({ success: false, message: 'Gagal menambah stok reward.' });
  }
};

export const toggleRewardActive = async (req, res) => {
  const giftId = Number(req.params.giftId);

  if (!Number.isInteger(giftId)) {
    return res.status(400).json({ success: false, message: 'ID reward tidak valid.' });
  }

  try {
    const result = await query(
      `UPDATE points."PointGiftRedeemption"
       SET "isActive" = CASE WHEN "isActive" = 1 THEN 0 ELSE 1 END
       WHERE "GiftId" = $1
       RETURNING *`,
      [giftId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Reward tidak ditemukan.' });
    }

    return res.json({ success: true, data: mapReward(result.rows[0]) });
  } catch (err) {
    console.error('toggleRewardActive:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengubah status reward.' });
  }
};

export const deleteReward = async (req, res) => {
  const giftId = Number(req.params.giftId);

  if (!Number.isInteger(giftId)) {
    return res.status(400).json({ success: false, message: 'ID reward tidak valid.' });
  }

  try {
    const usageRes = await query(
      `SELECT COUNT(*) FROM voucher."Voucher" WHERE "GiftId" = $1`,
      [giftId]
    );

    if (Number(usageRes.rows[0].count) > 0) {
      return res.status(409).json({
        success: false,
        message: 'Reward yang sudah pernah diredeem tidak dapat dihapus. Nonaktifkan reward tersebut.',
      });
    }

    const result = await query(
      `DELETE FROM points."PointGiftRedeemption"
       WHERE "GiftId" = $1
       RETURNING "GiftId"`,
      [giftId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Reward tidak ditemukan.' });
    }

    return res.json({ success: true, message: 'Reward berhasil dihapus.' });
  } catch (err) {
    console.error('deleteReward:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus reward.' });
  }
};