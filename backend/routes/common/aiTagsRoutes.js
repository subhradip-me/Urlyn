import express from 'express';
const router = express.Router();
import {
  generateAITags,
  generateBatchAITags
} from '../../controllers/common/getAITagsController.js';
import { protect } from '../../middlewares/authMiddleware.js';

// Apply authentication middleware to all routes
router.use(protect);

// AI Tags routes
router.post('/generate', generateAITags);
router.post('/batch', generateBatchAITags);

export default router;
