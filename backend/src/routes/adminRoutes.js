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

export default router;
