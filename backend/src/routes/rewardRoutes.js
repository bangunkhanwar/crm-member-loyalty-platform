import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getRewards, redeemReward } from '../controllers/rewardController.js';

const router = express.Router();

router.get('/', getRewards);
router.post('/redeem', verifyToken, redeemReward);

export default router;
