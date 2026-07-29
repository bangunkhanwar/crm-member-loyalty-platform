import express from 'express';
import { requestOtp, verifyOtp, operatorLogin } from '../controllers/authController.js';

const router = express.Router();

// Member Auth Routes
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

// Operator (Admin, Toko, Head) Auth Route
router.post('/operator-login', operatorLogin);

export default router;
