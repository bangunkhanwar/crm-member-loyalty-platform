import express from 'express';
import { registerMember, requestOtp, verifyOtp, operatorLogin } from '../controllers/authController.js';

const router = express.Router();

// Member Auth Routes
router.post('/register', registerMember);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

// Operator (Admin, Toko, Head) — route & UI terpisah dari Member Portal
router.post('/operator-login', operatorLogin);

export default router;