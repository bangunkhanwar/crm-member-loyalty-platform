import { query } from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'crm_member_loyalty_secret_key_2026_super_secure';

// Helper function untuk standardisasi nomor HP ke format 08...
const formatPhone = (phone) => {
  if (!phone) return '';
  let cleaned = String(phone).trim().replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+62')) {
    return '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('62')) {
    return '0' + cleaned.slice(2);
  } else if (!cleaned.startsWith('0')) {
    return '0' + cleaned;
  }
  return cleaned;
};

// 1. MEMBER: Request OTP Login
export const requestOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: 'Nomor handphone wajib diisi.' });
  }

  const formattedPhone = formatPhone(phone);

  try {
    let memberRes = await query(
      `SELECT "MemberCode", "Handpone", "Name", "OTPAttempts" FROM member."Member" WHERE "Handpone" = $1`,
      [formattedPhone]
    );

    let member = memberRes.rows[0];
    // GUNAKAN 4 DIGIT OTP KARENA UI UTAMA MENGGUNAKAN 4 DIGIT
    const otp = '1234'; 
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    if (!member) {
      const countRes = await query(`SELECT COUNT(*) FROM member."Member"`);
      const nextNum = parseInt(countRes.rows[0].count) + 1;
      const memberCode = `MBR${String(nextNum).padStart(8, '0')}`;
      const defaultName = `Member ${formattedPhone.slice(-4)}`;

      const insertRes = await query(
        `INSERT INTO member."Member" 
         ("MemberCode", "Handpone", "Name", "OTP", "OTPExpiry", "OTPAttempts", "TierMember", "CreatedBy")
         VALUES ($1, $2, $3, $4, $5, 0, 'SILVER', 'OTP_REGISTRATION')
         RETURNING *`,
        [memberCode, formattedPhone, defaultName, otp, expiry]
      );

      await query(
        `INSERT INTO member."MemberPointsCurrently" ("MemberCode", "TotalPoints") VALUES ($1, 0) ON CONFLICT DO NOTHING`,
        [memberCode]
      );

      member = insertRes.rows[0];
    } else {
      if (member.OTPAttempts >= 3 && new Date() < new Date(member.OTPExpiry)) {
        return res.status(429).json({ 
          success: false, 
          message: 'Batas percobaan OTP tercapai. Silakan tunggu 5 menit sebelum mencoba kembali.' 
        });
      }

      await query(
        `UPDATE member."Member" 
         SET "OTP" = $1, "OTPExpiry" = $2, "OTPAttempts" = COALESCE("OTPAttempts", 0) + 1, "LastUpdate" = CURRENT_TIMESTAMP
         WHERE "Handpone" = $3`,
        [otp, expiry, formattedPhone]
      );
    }

    await query(
      `INSERT INTO message."trNotify" ("MemberCode", "Title", "Content", "NotifyType", "NotifyStatus")
       VALUES ($1, 'Kode OTP CRM', $2, 1, 1)`,
      [member.MemberCode, `Kode OTP Anda adalah: ${otp}. Valid 5 menit.`]
    );

    return res.json({
      success: true,
      message: 'Kode OTP telah dikirimkan ke nomor Anda.',
      devOtpHint: '1234',
      phone: formattedPhone
    });
  } catch (err) {
    console.error('Error requestOtp:', err);
    return res.status(500).json({ success: false, message: 'Gagal memproses OTP.' });
  }
};

// 2. MEMBER: Verify OTP Login
export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Nomor HP dan kode OTP wajib diisi.' });
  }

  const formattedPhone = formatPhone(phone);

  try {
    const memberRes = await query(
      `SELECT m.*, COALESCE(p."TotalPoints", 0) AS "TotalPoints"
       FROM member."Member" m
       LEFT JOIN member."MemberPointsCurrently" p ON m."MemberCode" = p."MemberCode"
       WHERE m."Handpone" = $1`,
      [formattedPhone]
    );

    const member = memberRes.rows[0];

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member tidak ditemukan.' });
    }

    // TERIMA '1234' ATAU '123456' ATAU OTP DARI DATABASE
    if (otp !== '1234' && otp !== '123456' && member.OTP !== otp) {
      return res.status(400).json({ success: false, message: 'Kode OTP tidak sesuai.' });
    }

    await query(
      `UPDATE member."Member" SET "OTP" = NULL, "OTPAttempts" = 0, "LastUpdate" = CURRENT_TIMESTAMP WHERE "Handpone" = $1`,
      [formattedPhone]
    );

    const token = jwt.sign(
      { memberCode: member.MemberCode, phone: member.Handpone, role: 'MEMBER' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login berhasil.',
      token,
      member: {
        memberCode: member.MemberCode,
        name: member.Name,
        phone: member.Handpone,
        email: member.Email,
        tier: member.TierMember || 'SILVER',
        totalPoints: parseInt(member.TotalPoints || 0),
        referralCode: member.referralCode
      }
    });
  } catch (err) {
    console.error('Error verifyOtp:', err);
    return res.status(500).json({ success: false, message: 'Gagal memverifikasi OTP.' });
  }
};

// 3. OPERATOR / INTERNAL: Login Admin, Toko, Head/Direksi
export const operatorLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan Password wajib diisi.' });
  }

  try {
    const opRes = await query(
      `SELECT * FROM admpanel."msOperator" WHERE "LoginName" = $1 AND "isActive" = 1`,
      [username.trim()]
    );

    const operator = opRes.rows[0];

    if (!operator) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }

    // Check password (Bcrypt or plain comparison fallback for initial seed)
    let isMatch = false;
    if (operator.LoginPass.startsWith('$2a$') || operator.LoginPass.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, operator.LoginPass);
    }
    
    // Fallback for easy testing if hash mismatch
    if (!isMatch) {
      if (
        (username === 'admin' && password === 'admin123') ||
        (username === 'toko_jkt' && password === 'toko123') ||
        (username === 'head_direksi' && password === 'head123')
      ) {
        isMatch = true;
      }
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }

    // Generate Operator Token
    const token = jwt.sign(
      {
        idMsOperator: operator.idMsOperator,
        username: operator.LoginName,
        fullName: operator.FullName,
        role: operator.Role, // 'ADMIN', 'TOKO', 'HEAD'
        storeCode: operator.StoreCode
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Audit log
    await query(
      `INSERT INTO admpanel."trActionLog" ("fidMsOperator", "FormCaller", "Message")
       VALUES ($1, 'Login', $2)`,
      [operator.idMsOperator, `User ${operator.FullName} (${operator.Role}) berhasil login.`]
    );

    return res.json({
      success: true,
      message: `Login berhasil sebagai ${operator.Role}.`,
      token,
      user: {
        idMsOperator: operator.idMsOperator,
        username: operator.LoginName,
        fullName: operator.FullName,
        role: operator.Role,
        storeCode: operator.StoreCode,
        email: operator.Email
      }
    });
  } catch (err) {
    console.error('Error operatorLogin:', err);
    return res.status(500).json({ success: false, message: 'Gagal melakukan login operator.' });
  }
};
