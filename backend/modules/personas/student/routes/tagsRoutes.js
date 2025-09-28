import express from 'express';
const router = express.Router();
import {
  getTags,
  getTagStats,
  getContentByTag,
  searchTags,
  deleteTag,
  getTagsByCategory
} from '../../controllers/student/tagsController.js';

// Note: Authentication is already applied at the parent router level

// For development testing - add a simple test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Tags endpoint is working',
    timestamp: new Date().toISOString()
  });
});

// @desc    Get all tags for student
// @route   GET /api/student/tags
// @access  Private (Student only)
router.get('/', getTags);

// @desc    Get tag statistics
// @route   GET /api/student/tags/stats
// @access  Private (Student only)
router.get('/stats', getTagStats);

// @desc    Search tags
// @route   GET /api/student/tags/search
// @access  Private (Student only)
router.get('/search', searchTags);

// @desc    Get tags by category
// @route   GET /api/student/tags/category/:category
// @access  Private (Student only)
router.get('/category/:category', getTagsByCategory);

// @desc    Get content by tag
// @route   GET /api/student/tags/:tagName/content
// @access  Private (Student only)
router.get('/:tagName/content', getContentByTag);

// @desc    Delete tag
// @route   DELETE /api/student/tags/:tagId
// @access  Private (Student only)
router.delete('/:tagId', deleteTag);

export default router;
