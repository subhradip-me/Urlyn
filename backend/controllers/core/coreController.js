import { handleAsync, sendSuccess } from '../../utils/responseHelpers.js';
import BookmarkService from '../../services/core/BookmarkService.js';
import FolderService from '../../services/core/FolderService.js';
import TagService from '../../services/core/TagService.js';

// BOOKMARK CONTROLLERS

// @desc    Get bookmarks for current persona
// @route   GET /api/core/bookmarks
// @access  Private
const getBookmarks = handleAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    folderIds,
    tagIds,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    isArchived = false,
    isPublic,
    priority
  } = req.query;

  const options = {
    page,
    limit,
    folderIds: folderIds ? folderIds.split(',') : undefined,
    tagIds: tagIds ? tagIds.split(',') : undefined,
    search,
    sortBy,
    sortOrder,
    isArchived: isArchived === 'true',
    isPublic: isPublic !== undefined ? isPublic === 'true' : undefined,
    priority
  };

  const result = await BookmarkService.getBookmarks(req.user._id, req.persona, options);
  sendSuccess(res, result);
});

// @desc    Get bookmark by ID
// @route   GET /api/core/bookmarks/:id
// @access  Private
const getBookmarkById = handleAsync(async (req, res) => {
  const bookmark = await BookmarkService.getBookmarkById(req.user._id, req.persona, req.params.id);
  sendSuccess(res, bookmark);
});

// @desc    Create new bookmark
// @route   POST /api/core/bookmarks
// @access  Private
const createBookmark = handleAsync(async (req, res) => {
  const bookmark = await BookmarkService.createBookmark(req.user._id, req.persona, req.body);
  sendSuccess(res, bookmark, 'Bookmark created successfully', 201);
});

// @desc    Update bookmark
// @route   PUT /api/core/bookmarks/:id
// @access  Private
const updateBookmark = handleAsync(async (req, res) => {
  const bookmark = await BookmarkService.updateBookmark(req.user._id, req.persona, req.params.id, req.body);
  sendSuccess(res, bookmark, 'Bookmark updated successfully');
});

// @desc    Delete bookmark
// @route   DELETE /api/core/bookmarks/:id
// @access  Private
const deleteBookmark = handleAsync(async (req, res) => {
  const result = await BookmarkService.deleteBookmark(req.user._id, req.persona, req.params.id);
  sendSuccess(res, result, 'Bookmark deleted successfully');
});

// @desc    Get bookmark statistics
// @route   GET /api/core/bookmarks/stats
// @access  Private
const getBookmarkStats = handleAsync(async (req, res) => {
  const stats = await BookmarkService.getBookmarkStats(req.user._id, req.persona);
  sendSuccess(res, stats);
});

// FOLDER CONTROLLERS

// @desc    Get folders for current persona
// @route   GET /api/core/folders
// @access  Private
const getFolders = handleAsync(async (req, res) => {
  const { includeItemCounts = false, parentFolderId } = req.query;
  
  const options = {
    includeItemCounts: includeItemCounts === 'true',
    parentFolderId: parentFolderId || null
  };

  const folders = await FolderService.getUserFolders(req.user._id, req.persona, options);
  sendSuccess(res, folders);
});

// @desc    Get folder by ID
// @route   GET /api/core/folders/:id
// @access  Private
const getFolderById = handleAsync(async (req, res) => {
  const folder = await FolderService.getFolderById(req.user._id, req.persona, req.params.id);
  sendSuccess(res, folder);
});

// @desc    Create new folder
// @route   POST /api/core/folders
// @access  Private
const createFolder = handleAsync(async (req, res) => {
  const folder = await FolderService.createFolder(req.user._id, req.persona, req.body);
  sendSuccess(res, folder, 'Folder created successfully', 201);
});

// @desc    Update folder
// @route   PUT /api/core/folders/:id
// @access  Private
const updateFolder = handleAsync(async (req, res) => {
  const folder = await FolderService.updateFolder(req.user._id, req.persona, req.params.id, req.body);
  sendSuccess(res, folder, 'Folder updated successfully');
});

// @desc    Delete folder
// @route   DELETE /api/core/folders/:id
// @access  Private
const deleteFolder = handleAsync(async (req, res) => {
  const result = await FolderService.deleteFolder(req.user._id, req.persona, req.params.id);
  sendSuccess(res, result, 'Folder deleted successfully');
});

// TAG CONTROLLERS

// @desc    Get tags for current persona
// @route   GET /api/core/tags
// @access  Private
const getTags = handleAsync(async (req, res) => {
  const {
    sortBy = 'name',
    sortOrder = 'asc',
    search,
    limit,
    includeUsageCount = true
  } = req.query;

  const options = {
    sortBy,
    sortOrder,
    search,
    limit: limit ? parseInt(limit) : undefined,
    includeUsageCount: includeUsageCount === 'true'
  };

  const tags = await TagService.getUserTags(req.user._id, req.persona, options);
  sendSuccess(res, tags);
});

// @desc    Get tag by ID
// @route   GET /api/core/tags/:id
// @access  Private
const getTagById = handleAsync(async (req, res) => {
  const tag = await TagService.getTagById(req.user._id, req.persona, req.params.id);
  sendSuccess(res, tag);
});

// @desc    Create new tag
// @route   POST /api/core/tags
// @access  Private
const createTag = handleAsync(async (req, res) => {
  const tag = await TagService.createTag(req.user._id, req.persona, req.body);
  sendSuccess(res, tag, 'Tag created successfully', 201);
});

// @desc    Update tag
// @route   PUT /api/core/tags/:id
// @access  Private
const updateTag = handleAsync(async (req, res) => {
  const tag = await TagService.updateTag(req.user._id, req.persona, req.params.id, req.body);
  sendSuccess(res, tag, 'Tag updated successfully');
});

// @desc    Delete tag
// @route   DELETE /api/core/tags/:id
// @access  Private
const deleteTag = handleAsync(async (req, res) => {
  const result = await TagService.deleteTag(req.user._id, req.persona, req.params.id);
  sendSuccess(res, result, 'Tag deleted successfully');
});

// @desc    Get popular tags
// @route   GET /api/core/tags/popular
// @access  Private
const getPopularTags = handleAsync(async (req, res) => {
  const { limit = 10 } = req.query;
  const tags = await TagService.getPopularTags(req.user._id, req.persona, parseInt(limit));
  sendSuccess(res, tags);
});

// @desc    Search tags
// @route   GET /api/core/tags/search
// @access  Private
const searchTags = handleAsync(async (req, res) => {
  const { q, limit = 20 } = req.query;
  
  if (!q) {
    return sendSuccess(res, []);
  }

  const tags = await TagService.searchTags(req.user._id, req.persona, q, parseInt(limit));
  sendSuccess(res, tags);
});

// @desc    Get tag statistics
// @route   GET /api/core/tags/stats
// @access  Private
const getTagStats = handleAsync(async (req, res) => {
  const stats = await TagService.getTagStats(req.user._id, req.persona);
  sendSuccess(res, stats);
});

export {
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
};
