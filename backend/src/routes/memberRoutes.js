import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { 
  getProfile, 
  updateProfile, 
  getPointHistory, 
  getMemberVouchers, 
  getBanners 
} from '../controllers/memberController.js';

const router = express.Router();

// Public Banner route
router.get('/banners', getBanners);

// Protected Member Routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.get('/points/history', verifyToken, getPointHistory);
router.get('/vouchers', verifyToken, getMemberVouchers);

export default router;
