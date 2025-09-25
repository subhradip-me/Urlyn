import express from 'express';
import {
  getUrlMetadata,
  getBatchUrlMetadata
} from '../../controllers/common/metadataController.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// All metadata routes require authentication
router.use(protect);

// Single URL metadata extraction
router.post('/', getUrlMetadata);

// Batch URL metadata extraction
router.post('/batch', getBatchUrlMetadata);

export default router;
