import express from 'express';
const router = express.Router();
import FolderService from '../../services/core/FolderService.js';
import { handleAsync, sendSuccess, sendError } from '../../utils/responseHelpers.js';

// GET /api/student/folders - Get all folders for the user
const getFolders = handleAsync(async (req, res) => {
  const userId = req.user._id;
  const { includeItemCounts = 'true', parentFolderId } = req.query;
  
  console.log('GET /api/student/folders called for user:', userId);
  console.log('User object:', req.user);
  
  const folders = await FolderService.getUserFolders(userId, {
    includeItemCounts: includeItemCounts === 'true',
    parentFolderId: parentFolderId || null
  });

  console.log('Returning folders:', folders.length);

  sendSuccess(res, {
    folders,
    total: folders.length,
    message: 'Folders retrieved successfully'
  });
});

router.get('/', getFolders);

// GET /api/student/folders/:id - Get specific folder
const getFolderById = handleAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  
  const folder = await FolderService.getFolderById(userId, id);
  sendSuccess(res, folder, 'Folder retrieved successfully');
});

router.get('/:id', getFolderById);

// GET /api/student/folders/:id/contents - Get folder contents
const getFolderContents = handleAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { 
    includeBookmarks = 'true', 
    includeNotes = 'true', 
    includeTasks = 'true',
    limit = '50',
    offset = '0'
  } = req.query;
  
  const result = await FolderService.getFolderContents(userId, id, {
    includeBookmarks: includeBookmarks === 'true',
    includeNotes: includeNotes === 'true', 
    includeTasks: includeTasks === 'true',
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  sendSuccess(res, result, 'Folder contents retrieved successfully');
});

router.get('/:id/contents', getFolderContents);

// POST /api/student/folders/:id/add-bookmark - Add bookmark to folder
const addBookmarkToFolder = handleAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { bookmarkId } = req.body;
  
  // Get the folder to get its name
  const folder = await FolderService.getFolderById(userId, id);
  
  // Update the bookmark to use this folder
  const { default: Bookmark } = await import('../../models/student/Bookmark.js');
  await Bookmark.findByIdAndUpdate(bookmarkId, {
    folder: folder.name,
    folderId: id
  });
  
  sendSuccess(res, { message: 'Bookmark added to folder successfully' });
});

router.post('/:id/add-bookmark', addBookmarkToFolder);

// POST /api/student/folders - Create new folder
const createFolder = handleAsync(async (req, res) => {
  const userId = req.user._id;
  const folderData = req.body;
  
  const folder = await FolderService.createFolder(userId, folderData);
  sendSuccess(res, folder, 'Folder created successfully', 201);
});

router.post('/', createFolder);

// PUT /api/student/folders/:id - Update folder
const updateFolder = handleAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const updateData = req.body;
  
  const folder = await FolderService.updateFolder(userId, id, updateData);
  sendSuccess(res, folder, 'Folder updated successfully');
});

router.put('/:id', updateFolder);

// DELETE /api/student/folders/:id - Delete folder
const deleteFolder = handleAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  
  const result = await FolderService.deleteFolder(userId, id);
  sendSuccess(res, result);
});

router.delete('/:id', deleteFolder);

// POST /api/student/folders/initialize - Initialize default folders for new user
const initializeDefaultFolders = handleAsync(async (req, res) => {
  const userId = req.user._id;
  
  const folders = await FolderService.initializeDefaultFolders(userId);
  sendSuccess(res, { folders, count: folders.length }, 'Default folders initialized successfully', 201);
});

router.post('/initialize', initializeDefaultFolders);

export default router;
