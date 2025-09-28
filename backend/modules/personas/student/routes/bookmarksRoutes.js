import express from 'express';
import {
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
} from '../../controllers/student/bookmarksController.js';

const router = express.Router();

// Note: Authentication is already applied at the parent router level
router.get('/public', getPublicBookmarks);

// Bookmark CRUD operations
router.route('/')
  .get(getBookmarks)
  .post(createBookmark);

router.route('/:id')
  .get(getBookmarkById)
  .put(updateBookmark)
  .delete(deleteBookmark);

// Bookmark management routes
router.get('/folders/list', getFolders);
router.get('/categories/list', getCategories);
router.get('/stats/summary', getBookmarkStats);

// Bookmark actions
router.post('/:id/visit', recordVisit);
router.patch('/:id/archive', toggleArchive);

// Bulk operations
router.post('/bulk/operations', bulkOperations);

export default router;
