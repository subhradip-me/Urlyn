import StudentBookmarkService from '../../services/student/bookmarkService.js';
import Bookmark from '../../models/student/Bookmark.js';
import { handleAsync, sendSuccess } from '../../utils/responseHelpers.js';

// @desc    Get student bookmarks
// @route   GET /api/student/bookmarks
// @access  Private (Student only)
const getBookmarks = handleAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    folder,
    tags,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    isArchived = false
  } = req.query;

  const options = {
    page,
    limit,
    category,
    folder,
    tags: tags ? tags.split(',') : undefined,
    search,
    sortBy,
    sortOrder,
    isArchived: isArchived === 'true'
  };

  const result = await StudentBookmarkService.getBookmarks(req.user._id, options);
  sendSuccess(res, result);
});

// @desc    Create new bookmark
// @route   POST /api/student/bookmarks
// @access  Private (Student only)
const createBookmark = handleAsync(async (req, res) => {
  const bookmark = await StudentBookmarkService.createBookmark(req.user._id, req.body);
  sendSuccess(res, bookmark, 'Bookmark created successfully', 201);
});

// @desc    Update bookmark
// @route   PUT /api/student/bookmarks/:id
// @access  Private (Student only)
const updateBookmark = handleAsync(async (req, res) => {
  const { id } = req.params;
  const bookmark = await StudentBookmarkService.updateBookmark(req.user._id, id, req.body);
  sendSuccess(res, bookmark, 'Bookmark updated successfully');
});

// @desc    Delete bookmark
// @route   DELETE /api/student/bookmarks/:id
// @access  Private (Student only)
const deleteBookmark = handleAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentBookmarkService.deleteBookmark(req.user._id, id);
  sendSuccess(res, result);
});

// @desc    Get bookmark by ID
// @route   GET /api/student/bookmarks/:id
// @access  Private (Student only)
const getBookmarkById = handleAsync(async (req, res) => {
  const { id } = req.params;
  const bookmark = await Bookmark.findOne({ _id: id, student: req.user._id })
    .populate('course', 'title');
  
  if (!bookmark) {
    return res.status(404).json({
      success: false,
      message: 'Bookmark not found'
    });
  }

  sendSuccess(res, bookmark);
});

// @desc    Get bookmark folders (redirects to new folder API)
// @route   GET /api/student/bookmarks/folders/list
// @access  Private (Student only)
const getFolders = handleAsync(async (req, res) => {
  // Simply return folder names for backward compatibility
  const folderNames = ['General', 'AI', 'Math', 'Exam Prep'];
  sendSuccess(res, { folders: folderNames });
});

// @desc    Get bookmark categories
// @route   GET /api/student/bookmarks/categories
// @access  Private (Student only)
const getCategories = handleAsync(async (req, res) => {
  const categories = await StudentBookmarkService.getCategories(req.user._id);
  sendSuccess(res, { categories });
});

// @desc    Get bookmark statistics
// @route   GET /api/student/bookmarks/stats
// @access  Private (Student only)
const getBookmarkStats = handleAsync(async (req, res) => {
  const stats = await StudentBookmarkService.getBookmarkStats(req.user._id);
  sendSuccess(res, stats);
});

// @desc    Record bookmark visit
// @route   POST /api/student/bookmarks/:id/visit
// @access  Private (Student only)
const recordVisit = handleAsync(async (req, res) => {
  const { id } = req.params;
  const bookmark = await StudentBookmarkService.recordVisit(req.user._id, id);
  sendSuccess(res, { visitCount: bookmark.visitCount, lastVisited: bookmark.lastVisited });
});

// @desc    Toggle bookmark archive status
// @route   PATCH /api/student/bookmarks/:id/archive
// @access  Private (Student only)
const toggleArchive = handleAsync(async (req, res) => {
  const { id } = req.params;
  const bookmark = await StudentBookmarkService.toggleArchive(req.user._id, id);
  sendSuccess(res, { 
    isArchived: bookmark.isArchived,
    message: bookmark.isArchived ? 'Bookmark archived' : 'Bookmark unarchived'
  });
});

// @desc    Get public bookmarks
// @route   GET /api/student/bookmarks/public
// @access  Public
const getPublicBookmarks = handleAsync(async (req, res) => {
  const { page = 1, limit = 20, category, tags, search } = req.query;
  
  const options = {
    page,
    limit,
    category,
    tags: tags ? tags.split(',') : undefined,
    search
  };

  const result = await StudentBookmarkService.getPublicBookmarks(options);
  sendSuccess(res, result);
});

// @desc    Bulk operations on bookmarks
// @route   POST /api/student/bookmarks/bulk
// @access  Private (Student only)
const bulkOperations = handleAsync(async (req, res) => {
  const { action, bookmarkIds, folder, category, isArchived } = req.body;

  if (!action || !bookmarkIds || !Array.isArray(bookmarkIds)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid bulk operation data'
    });
  }

  const results = [];

  for (const bookmarkId of bookmarkIds) {
    try {
      switch (action) {
        case 'move_folder':
          if (!folder) throw new Error('Folder is required for move operation');
          await StudentBookmarkService.updateBookmark(req.user._id, bookmarkId, { folder });
          break;
        
        case 'change_category':
          if (!category) throw new Error('Category is required for category change');
          await StudentBookmarkService.updateBookmark(req.user._id, bookmarkId, { category });
          break;
        
        case 'archive':
          await StudentBookmarkService.updateBookmark(req.user._id, bookmarkId, { isArchived: true });
          break;
        
        case 'unarchive':
          await StudentBookmarkService.updateBookmark(req.user._id, bookmarkId, { isArchived: false });
          break;
        
        case 'delete':
          await StudentBookmarkService.deleteBookmark(req.user._id, bookmarkId);
          break;
        
        default:
          throw new Error('Invalid action');
      }
      
      results.push({ bookmarkId, success: true });
    } catch (error) {
      results.push({ bookmarkId, success: false, error: error.message });
    }
  }

  sendSuccess(res, { results, message: 'Bulk operation completed' });
});

export {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  getBookmarkById,
  getFolders,
  getCategories,
  getBookmarkStats,
  recordVisit,
  toggleArchive,
  getPublicBookmarks,
  bulkOperations
};

export default {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  getBookmarkById,
  getFolders,
  getCategories,
  getBookmarkStats,
  recordVisit,
  toggleArchive,
  getPublicBookmarks,
  bulkOperations
};
