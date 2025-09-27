import Folder from '../../models/core/Folder.js';
import CoreBookmark from '../../models/core/Bookmark.js';
import Note from '../../models/core/Note.js';
import Task from '../../models/core/Task.js';

class FolderService {
  // Get all folders for a user's specific persona
  static async getUserFolders(userId, persona, options = {}) {
    try {
      const { includeItemCounts = false, parentFolderId = null } = options;

      console.log('FolderService.getUserFolders called with userId:', userId, 'persona:', persona);

      const query = { 
        userId,
        persona,
        parentFolderId: parentFolderId || { $in: [null, undefined] }
      };

      console.log('Folder query:', query);

      const folders = await Folder.find(query)
        .sort({ sortOrder: 1, name: 1 })
        .lean();

      console.log('Found folders:', folders.length, folders.map(f => f.name));

      if (includeItemCounts) {
        // Get item counts for each folder using persona-aware core models
        for (let folder of folders) {
          const [bookmarkCount, noteCount, taskCount] = await Promise.all([
            CoreBookmark.countDocuments({ userId, persona, folderIds: folder._id }),
            Note.countDocuments({ userId, persona, folderId: folder._id }),
            Task.countDocuments({ userId, persona, folderId: folder._id })
          ]);

          folder.itemCounts = {
            bookmarks: bookmarkCount,
            notes: noteCount,
            tasks: taskCount,
            total: bookmarkCount + noteCount + taskCount
          };
        }
      }

      return folders;
    } catch (error) {
      console.error('Error in getUserFolders:', error);
      throw new Error(`Failed to get user folders: ${error.message}`);
    }
  }

  // Get folder by ID for specific persona
  static async getFolderById(userId, persona, folderId) {
    try {
      const folder = await Folder.findOne({ _id: folderId, userId, persona });
      if (!folder) {
        throw new Error('Folder not found');
      }
      return folder;
    } catch (error) {
      throw new Error(`Failed to get folder: ${error.message}`);
    }
  }

  // Create new folder for specific persona
  static async createFolder(userId, persona, folderData) {
    try {
      const { name, icon, color, description, parentFolderId } = folderData;

      // Check for duplicate names in the same parent folder for the same persona
      const existingFolder = await Folder.findOne({
        userId,
        persona,
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        parentFolderId: parentFolderId || { $in: [null, undefined] }
      });

      if (existingFolder) {
        throw new Error('A folder with this name already exists in this location for this persona');
      }

      // Validate parent folder if provided
      if (parentFolderId) {
        const parentFolder = await Folder.findOne({ _id: parentFolderId, userId, persona });
        if (!parentFolder) {
          throw new Error('Parent folder not found');
        }
      }

      const folder = new Folder({
        userId,
        persona,
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

  // Update folder for specific persona
  static async updateFolder(userId, persona, folderId, updateData) {
    try {
      const { name, icon, color, description, parentFolderId } = updateData;

      // Check if folder exists and belongs to user and persona
      const folder = await Folder.findOne({ _id: folderId, userId, persona });
      if (!folder) {
        throw new Error('Folder not found');
      }

      // If updating name, check for duplicates in the same persona
      if (name && name !== folder.name) {
        const existingFolder = await Folder.findOne({
          userId,
          persona,
          name: { $regex: new RegExp(`^${name}$`, 'i') },
          parentFolderId: parentFolderId || folder.parentFolderId || { $in: [null, undefined] },
          _id: { $ne: folderId }
        });

        if (existingFolder) {
          throw new Error('A folder with this name already exists in this location for this persona');
        }
      }

      // Validate parent folder if provided
      if (parentFolderId && parentFolderId !== folder.parentFolderId) {
        const parentFolder = await Folder.findOne({ _id: parentFolderId, userId, persona });
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

  // Delete folder for specific persona
  static async deleteFolder(userId, persona, folderId) {
    try {
      const folder = await Folder.findOne({ _id: folderId, userId, persona });
      if (!folder) {
        throw new Error('Folder not found');
      }

      // Check if folder has subfolders
      const subfolders = await Folder.find({ parentFolderId: folderId, userId, persona });
      if (subfolders.length > 0) {
        throw new Error('Cannot delete folder with subfolders. Please delete subfolders first.');
      }

      // Check if folder contains items
      const [bookmarkCount, noteCount, taskCount] = await Promise.all([
        CoreBookmark.countDocuments({ userId, persona, folderIds: folderId }),
        Note.countDocuments({ userId, persona, folderId }),
        Task.countDocuments({ userId, persona, folderId })
      ]);

      const totalItems = bookmarkCount + noteCount + taskCount;
      if (totalItems > 0) {
        // Move items to "General" folder instead of preventing deletion
        await Promise.all([
          CoreBookmark.updateMany(
            { userId, persona, folderIds: folderId },
            { $pull: { folderIds: folderId } }
          ),
          Note.updateMany(
            { userId, persona, folderId },
            { folderId: null }
          ),
          Task.updateMany(
            { userId, persona, folderId },
            { folderId: null }
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
  static async getFolderContents(userId, persona, folderId, options = {}) {
    try {
      const { 
        includeBookmarks = true, 
        includeNotes = true, 
        includeTasks = true,
        limit = 50,
        offset = 0
      } = options;

      const folder = await Folder.findOne({ _id: folderId, userId, persona });
      if (!folder) {
        throw new Error('Folder not found');
      }

      const contents = {};

      if (includeBookmarks) {
        const bookmarks = await CoreBookmark.find({ 
          userId, 
          persona,
          folderIds: folderId
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);

        contents.bookmarks = bookmarks;
      }

      if (includeNotes) {
        const notes = await Note.find({
          userId,
          persona, 
          folderId
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);

        contents.notes = notes;
      }

      if (includeTasks) {
        const tasks = await Task.find({
          userId,
          persona,
          folderId
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);

        contents.tasks = tasks;
      }

      // Get total counts for pagination
      const totalCounts = {};
      if (includeBookmarks) {
        totalCounts.bookmarks = await CoreBookmark.countDocuments({ 
          userId, 
          persona,
          folderIds: folderId
        });
      }

      if (includeNotes) {
        totalCounts.notes = await Note.countDocuments({
          userId,
          persona,
          folderId
        });
      }

      if (includeTasks) {
        totalCounts.tasks = await Task.countDocuments({
          userId,
          persona,
          folderId
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
            bookmarks: includeBookmarks ? totalCounts.bookmarks > (offset + limit) : false,
            notes: includeNotes ? totalCounts.notes > (offset + limit) : false,
            tasks: includeTasks ? totalCounts.tasks > (offset + limit) : false
          }
        }
      };
    } catch (error) {
      throw new Error(`Failed to get folder contents: ${error.message}`);
    }
  }

  // Initialize default folders for new user
  static async initializeDefaultFolders(userId, persona) {
    try {
      // First check if user already has folders for this persona
      const existingFolders = await Folder.find({ userId, persona });
      if (existingFolders.length > 0) {
        console.log('User already has folders for this persona, skipping initialization');
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
          const folder = new Folder({ userId, persona, ...folderData });
          await folder.save();
          folders.push(folder);
        } catch (error) {
          if (error.code === 11000) {
            // Duplicate key error, folder already exists
            console.log(`Folder '${folderData.name}' already exists for persona ${persona}, skipping`);
            const existingFolder = await Folder.findOne({ userId, persona, name: folderData.name });
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
