import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

// ─── 1. Verifikasi JWT Token ───────────────────────────────────────────────
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn(`[AUTH WARNING] Request ${req.method} ${req.originalUrl} ditolak: Token tidak ditemukan.`);
    return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'crm_member_loyalty_secret_key_2026_super_secure');
    req.user = decoded;
    next();
  } catch (err) {
    console.warn(`[AUTH WARNING] Request ${req.method} ${req.originalUrl} ditolak: Token tidak valid/expired.`);
    return res.status(401).json({ success: false, message: 'Token tidak valid atau telah kadaluarsa.' });
  }
};

// ─── 2. Cek Role yang Diizinkan ────────────────────────────────────────────
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.warn(`[ROLE DENIED] User '${req.user?.username || req.user?.phone}' dengan role '${req.user?.role}' mencoba mengakses ${req.originalUrl} (Wajib: ${roles.join('/')})`);
      return res.status(403).json({ 
        success: false, 
        message: `Akses ditolak. Peran Anda (${req.user?.role || 'MEMBER'}) tidak memiliki izin.` 
      });
    }
    next();
  };
};

// ─── 3. Cek Akses Portal Admin dari Database (Dinamis) ─────────────────────
export const requireAdminPortalAccess = async (req, res, next) => {
  const role = req.user?.role;

  if (!role) {
    return res.status(401).json({ success: false, message: 'Token tidak valid.' });
  }

  try {
    const result = await query(
      `SELECT "AllowAdminPortal" FROM admpanel."msPortalAccess" WHERE "RoleCode" = $1 AND "IsActive" = 1`,
      [role]
    );

    if (result.rows.length === 0 || result.rows[0].AllowAdminPortal !== 1) {
      console.warn(`[PORTAL DENIED] Role '${role}' mencoba akses Admin Portal - ditolak.`);
      return res.status(403).json({ 
        success: false, 
        message: `Akses Portal Admin ditolak untuk peran '${role}'. Silakan gunakan Portal Member.` 
      });
    }

    next();
  } catch (err) {
    console.error('[PORTAL ACCESS ERROR]', err);
    return res.status(500).json({ success: false, message: 'Gagal memverifikasi akses portal.' });
  }
};