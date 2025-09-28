import TagService from '../../services/common/tagService.js';
import { handleAsync, sendSuccess, sendError } from '../../utils/responseHelpers.js';

// @desc    Get all tags for a student
// @route   GET /api/student/tags
// @access  Private (Student only)
const getTags = handleAsync(async (req, res) => {
  const userId = req.user._id;
  const {
    search = '',
    category = '',
    sortBy = 'usageCount',
    sortOrder = 'desc',
    page = 1,
    limit = 50
  } = req.query;

  const result = await TagService.getTagsWithContent(userId, {
    search,
    category,
    sortBy,
    sortOrder,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  sendSuccess(res, { tags: result });
});

// @desc    Get tag statistics
// @route   GET /api/student/tags/stats
// @access  Private (Student only)
const getTagStats = handleAsync(async (req, res) => {
  const userId = req.user._id;
  const stats = await TagService.getTagStats(userId);
  sendSuccess(res, stats);
});

// @desc    Get content by tag
// @route   GET /api/student/tags/:tagName/content
// @access  Private (Student only)
const getContentByTag = handleAsync(async (req, res) => {
  const userId = req.user._id;
  const { tagName } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const result = await TagService.getContentByTag(userId, tagName, {
    page: parseInt(page),
    limit: parseInt(limit)
  });

  // Return the service result directly since it already has the correct structure
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json(result);
  }
});

// @desc    Search tags
// @route   GET /api/student/tags/search
// @access  Private (Student only)
const searchTags = handleAsync(async (req, res) => {
  const userId = req.user._id;
  const { q, limit = 10 } = req.query;

  if (!q) {
    return sendSuccess(res, []);
  }

  const tags = await TagService.searchTags(userId, q, parseInt(limit));
  sendSuccess(res, tags);
});

// @desc    Delete a tag
// @route   DELETE /api/student/tags/:tagId
// @access  Private (Student only)
const deleteTag = handleAsync(async (req, res) => {
  const userId = req.user._id;
  const { tagId } = req.params;

  const result = await TagService.deleteTag(userId, tagId);
  sendSuccess(res, result);
});

// @desc    Get tags by category
// @route   GET /api/student/tags/category/:category
// @access  Private (Student only)
const getTagsByCategory = handleAsync(async (req, res) => {
  const userId = req.user._id;
  const { category } = req.params;

  const tags = await TagService.getTagsByCategory(userId, category);
  sendSuccess(res, tags);
});

export {
  getTags,
  getTagStats,
  getContentByTag,
  searchTags,
  deleteTag,
  getTagsByCategory
};

export default {
  getTags,
  getTagStats,
  getContentByTag,
  searchTags,
  deleteTag,
  getTagsByCategory
};
