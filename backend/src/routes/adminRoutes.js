import express from 'express';
import { verifyToken, requireRole, requireAdminPortalAccess } from '../middleware/authMiddleware.js';
import { 
  getDashboardKPIs, 
  getMemberList, 
  getMemberDetail, 
  updateMemberDetail,
  adjustMemberPoints, 
  registerNewMemberByStore 
} from '../controllers/adminController.js';

import {
  getRewardInventory,
  getRewardStats,
  createReward,
  updateReward,
  restockReward,
  toggleRewardActive,
  deleteReward,
} from '../controllers/adminRewardController.js';
import { uploadRewardImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Protected for ADMIN, TOKO, and HEAD roles
router.get('/dashboard-kpi', verifyToken, requireAdminPortalAccess, requireRole('ADMIN', 'HEAD', 'TOKO'), getDashboardKPIs);
router.get('/members', verifyToken, requireAdminPortalAccess, requireRole('ADMIN', 'HEAD', 'TOKO'), getMemberList);
router.get('/members/:memberCode', verifyToken, requireAdminPortalAccess, requireRole('ADMIN', 'HEAD', 'TOKO'), getMemberDetail);
router.put('/members/:memberCode', verifyToken, requireAdminPortalAccess, requireRole('ADMIN', 'HEAD'), updateMemberDetail);

// Point adjustment (ADMIN only)
router.post('/adjust-points', verifyToken, requireAdminPortalAccess, requireRole('ADMIN'), adjustMemberPoints);

// Register member at store (TOKO & ADMIN)
router.post('/register-member', verifyToken, requireAdminPortalAccess, requireRole('ADMIN', 'TOKO'), registerNewMemberByStore);

router.get('/rewards', verifyToken, requireAdminPortalAccess, requireRole('ADMIN', 'HEAD'), getRewardInventory);
router.get('/rewards/stats', verifyToken, requireAdminPortalAccess, requireRole('ADMIN', 'HEAD'), getRewardStats);

router.post('/rewards', verifyToken, requireAdminPortalAccess, requireRole('ADMIN'), uploadRewardImage.single('image'), createReward);
router.put('/rewards/:giftId', verifyToken, requireAdminPortalAccess, requireRole('ADMIN'), uploadRewardImage.single('image'), updateReward);
router.post('/rewards/:giftId/restock', verifyToken, requireAdminPortalAccess, requireRole('ADMIN'), restockReward);
router.patch('/rewards/:giftId/toggle', verifyToken, requireAdminPortalAccess, requireRole('ADMIN'), toggleRewardActive);
router.delete('/rewards/:giftId', verifyToken, requireAdminPortalAccess, requireRole('ADMIN'), deleteReward);

export default router;
