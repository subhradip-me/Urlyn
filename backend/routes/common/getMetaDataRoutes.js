const express = require('express');
const {
  getUrlMetadata,
  getBatchUrlMetadata
} = require('../../controllers/common/getMetaDataController');
const { protect } = require('../../middlewares/authMiddleware');

const router = express.Router();

// All metadata routes require authentication
router.use(protect);

// Single URL metadata extraction
router.post('/', getUrlMetadata);

// Batch URL metadata extraction
router.post('/batch', getBatchUrlMetadata);

module.exports = router;
