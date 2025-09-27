import express from 'express';
import { protect, addCurrentPersona } from '../../middlewares/authMiddleware.js';
import {
  // Bookmark controllers
  getBookmarks,
  getBookmarkById,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  getBookmarkStats,
  
  // Folder controllers
  getFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
  
  // Tag controllers
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  getPopularTags,
  searchTags,
  getTagStats
} from '../../controllers/core/coreController.js';

const router = express.Router();

// Apply authentication and persona middleware to all routes
router.use(protect);
router.use(addCurrentPersona);

// BOOKMARK ROUTES
router.route('/bookmarks')
  .get(getBookmarks)
  .post(createBookmark);

router.route('/bookmarks/stats')
  .get(getBookmarkStats);

router.route('/bookmarks/:id')
  .get(getBookmarkById)
  .put(updateBookmark)
  .delete(deleteBookmark);

// FOLDER ROUTES
router.route('/folders')
  .get(getFolders)
  .post(createFolder);

router.route('/folders/:id')
  .get(getFolderById)
  .put(updateFolder)
  .delete(deleteFolder);

// TAG ROUTES
router.route('/tags')
  .get(getTags)
  .post(createTag);

router.route('/tags/popular')
  .get(getPopularTags);

router.route('/tags/search')
  .get(searchTags);

router.route('/tags/stats')
  .get(getTagStats);

router.route('/tags/:id')
  .get(getTagById)
  .put(updateTag)
  .delete(deleteTag);

export default router;
