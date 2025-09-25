import express from 'express';
const router = express.Router();
import {
  getDashboardStats,
  getQuickActions
} from '../../controllers/dashboard/dashboardController.js';
import { protect } from '../../middlewares/authMiddleware.js';

// @route   GET /api/dashboard/stats
router.get('/stats', protect, getDashboardStats);

// @route   GET /api/dashboard/quick-actions
router.get('/quick-actions', protect, getQuickActions);

export default router;
