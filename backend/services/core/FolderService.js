import Folder from '../../models/core/Folder.js';
import Bookmark from '../../models/student/Bookmark.js'; // Use existing for now
// import Note from '../../models/core/Note.js';
// import Task from '../../models/core/Task.js';

class FolderService {
  // Get all folders for a user
  static async getUserFolders(userId, options = {}) {
    try {
      const { includeItemCounts = false, parentFolderId = null } = options;

      console.log('FolderService.getUserFolders called with userId:', userId);

      const query = { 
        userId,
        parentFolderId: parentFolderId || { $in: [null, undefined] }
      };

      console.log('Folder query:', query);

      const folders = await Folder.find(query)
        .sort({ sortOrder: 1, name: 1 })
        .lean();

      console.log('Found folders:', folders.length, folders.map(f => f.name));

      if (includeItemCounts) {
        // Get item counts for each folder
        for (let folder of folders) {
          const [bookmarkCount] = await Promise.all([
            Bookmark.countDocuments({ student: userId, folder: folder.name }) // Use folder name for now
            // Note.countDocuments({ userId, folderId: folder._id }),
            // Task.countDocuments({ userId, folderId: folder._id })
          ]);

          folder.itemCounts = {
            bookmarks: bookmarkCount,
            notes: 0, // noteCount,
            tasks: 0, // taskCount,
            total: bookmarkCount // + noteCount + taskCount
          };
        }
      }

      return folders;
    } catch (error) {
      console.error('Error in getUserFolders:', error);
      throw new Error(`Failed to get user folders: ${error.message}`);
    }
  }

  // Get folder by ID
  static async getFolderById(userId, folderId) {
    try {
      const folder = await Folder.findOne({ _id: folderId, userId });
      if (!folder) {
        throw new Error('Folder not found');
      }
      return folder;
    } catch (error) {
      throw new Error(`Failed to get folder: ${error.message}`);
    }
  }

  // Create new folder
  static async createFolder(userId, folderData) {
    try {
      const { name, icon, color, description, parentFolderId } = folderData;

      // Check for duplicate names in the same parent folder
      const existingFolder = await Folder.findOne({
        userId,
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        parentFolderId: parentFolderId || { $in: [null, undefined] }
      });

      if (existingFolder) {
        throw new Error('A folder with this name already exists in this location');
      }

      // Validate parent folder if provided
      if (parentFolderId) {
        const parentFolder = await Folder.findOne({ _id: parentFolderId, userId });
        if (!parentFolder) {
          throw new Error('Parent folder not found');
        }
      }

      const folder = new Folder({
        userId,
        name,
        icon: icon || '📂',
        color: color || '#3B82F6',
        description,
        parentFolderId
      });

      await folder.save();
      return folder;
    } catch (error) {
      throw new Error(`Failed to create folder: ${error.message}`);
    }
  }

  // Update folder
  static async updateFolder(userId, folderId, updateData) {
    try {
      const { name, icon, color, description, parentFolderId } = updateData;

      // Check if folder exists and belongs to user
      const folder = await Folder.findOne({ _id: folderId, userId });
      if (!folder) {
        throw new Error('Folder not found');
      }

      // If updating name, check for duplicates
      if (name && name !== folder.name) {
        const existingFolder = await Folder.findOne({
          userId,
          name: { $regex: new RegExp(`^${name}$`, 'i') },
          parentFolderId: parentFolderId || folder.parentFolderId || { $in: [null, undefined] },
          _id: { $ne: folderId }
        });

        if (existingFolder) {
          throw new Error('A folder with this name already exists in this location');
        }
      }

      // Validate parent folder if provided
      if (parentFolderId && parentFolderId !== folder.parentFolderId) {
        const parentFolder = await Folder.findOne({ _id: parentFolderId, userId });
        if (!parentFolder) {
          throw new Error('Parent folder not found');
        }
        
        // Prevent moving folder into itself or its descendants
        if (parentFolderId === folderId) {
          throw new Error('Cannot move folder into itself');
        }
      }

      const updatedFolder = await Folder.findByIdAndUpdate(
        folderId,
        { 
          ...(name && { name }),
          ...(icon && { icon }),
          ...(color && { color }),
          ...(description !== undefined && { description }),
          ...(parentFolderId !== undefined && { parentFolderId })
        },
        { new: true, runValidators: true }
      );

      return updatedFolder;
    } catch (error) {
      throw new Error(`Failed to update folder: ${error.message}`);
    }
  }

  // Delete folder
  static async deleteFolder(userId, folderId) {
    try {
      const folder = await Folder.findOne({ _id: folderId, userId });
      if (!folder) {
        throw new Error('Folder not found');
      }

      // Check if folder has subfolders
      const subfolderCount = await Folder.countDocuments({ 
        userId, 
        parentFolderId: folderId 
      });

      if (subfolderCount > 0) {
        throw new Error('Cannot delete folder that contains subfolders');
      }

      // Get item counts - check both folder name and folder ID for bookmarks
      const [bookmarkCountByName, bookmarkCountById] = await Promise.all([
        Bookmark.countDocuments({ student: userId, folder: folder.name }),
        Bookmark.countDocuments({ student: userId, folderId: folderId })
      ]);

      const bookmarkCount = Math.max(bookmarkCountByName, bookmarkCountById);
      const totalItems = bookmarkCount; // + noteCount + taskCount when implemented

      if (totalItems > 0) {
        // Move items to "General" folder
        await Promise.all([
          Bookmark.updateMany(
            { student: userId, folder: folder.name },
            { folder: 'General', folderId: null }
          ),
          Bookmark.updateMany(
            { student: userId, folderId: folderId },
            { folder: 'General', folderId: null }
          )
        ]);
      }

      await Folder.findByIdAndDelete(folderId);

      return {
        message: 'Folder deleted successfully',
        itemsMoved: totalItems
      };
    } catch (error) {
      throw new Error(`Failed to delete folder: ${error.message}`);
    }
  }

  // Get folder contents
  static async getFolderContents(userId, folderId, options = {}) {
    try {
      const { 
        includeBookmarks = true, 
        includeNotes = true, 
        includeTasks = true,
        limit = 50,
        offset = 0
      } = options;

      const folder = await Folder.findOne({ _id: folderId, userId });
      if (!folder) {
        throw new Error('Folder not found');
      }

      const contents = {};

      if (includeBookmarks) {
        // Search by both folder name and folder ID to maintain compatibility
        const bookmarks = await Bookmark.find({ 
          student: userId, 
          $or: [
            { folder: folder.name },
            { folderId: folderId }
          ],
          isArchived: false
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);

        contents.bookmarks = bookmarks;
      }

      // Notes and tasks will be implemented when those models are ready
      if (includeNotes) {
        contents.notes = [];
      }

      if (includeTasks) {
        contents.tasks = [];
      }

      // Get total counts for pagination
      const totalCounts = {};
      if (includeBookmarks) {
        totalCounts.bookmarks = await Bookmark.countDocuments({ 
          student: userId, 
          $or: [
            { folder: folder.name },
            { folderId: folderId }
          ],
          isArchived: false
        });
      }

      return {
        folder,
        contents,
        totalCounts,
        pagination: {
          limit,
          offset,
          hasMore: {
            bookmarks: includeBookmarks ? totalCounts.bookmarks > (offset + limit) : false
          }
        }
      };
    } catch (error) {
      throw new Error(`Failed to get folder contents: ${error.message}`);
    }
  }

  // Initialize default folders for new user
  static async initializeDefaultFolders(userId) {
    try {
      // First check if user already has folders
      const existingFolders = await Folder.find({ userId });
      if (existingFolders.length > 0) {
        console.log('User already has folders, skipping initialization');
        return existingFolders;
      }

      const defaultFolders = [
        {
          name: 'General',
          icon: '📁',
          color: '#6B7280',
          description: 'General items and uncategorized content',
          isSystemFolder: true,
          sortOrder: 0
        },
        {
          name: 'Work',
          icon: '💼', 
          color: '#3B82F6',
          description: 'Work-related bookmarks, notes, and tasks',
          isSystemFolder: true,
          sortOrder: 1
        },
        {
          name: 'Personal',
          icon: '🏠',
          color: '#10B981',
          description: 'Personal projects and interests',
          isSystemFolder: true,
          sortOrder: 2
        },
        {
          name: 'Learning',
          icon: '📚',
          color: '#F59E0B',
          description: 'Educational resources and study materials',
          isSystemFolder: true,
          sortOrder: 3
        }
      ];

      const folders = [];
      for (const folderData of defaultFolders) {
        try {
          const folder = new Folder({ userId, ...folderData });
          await folder.save();
          folders.push(folder);
        } catch (error) {
          if (error.code === 11000) {
            // Duplicate key error, folder already exists
            console.log(`Folder '${folderData.name}' already exists, skipping`);
            const existingFolder = await Folder.findOne({ userId, name: folderData.name });
            if (existingFolder) {
              folders.push(existingFolder);
            }
          } else {
            throw error;
          }
        }
      }

      return folders;
    } catch (error) {
      throw new Error(`Failed to initialize default folders: ${error.message}`);
    }
  }
}

export default FolderService;
