import Bookmark from '../../models/student/Bookmark.js';
import User from '../../models/common/User.js';
import TagService from '../common/tagService.js';

class StudentBookmarkService {
  // Get bookmarks with filtering and pagination
  static async getBookmarks(studentId, options = {}) {
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
    } = options;

    // Build query
    const query = {
      student: studentId,
      isArchived
    };

    // Add filters
    if (category && category !== 'all') {
      query.category = category;
    }

    if (folder && folder !== 'all') {
      query.folder = folder;
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    try {
      // Get bookmarks with pagination
      const bookmarks = await Bookmark.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('folder', 'name');

      // Get total count for pagination
      const total = await Bookmark.countDocuments(query);

      return {
        bookmarks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch bookmarks: ${error.message}`);
    }
  }

  // Create a new bookmark
  static async createBookmark(studentId, bookmarkData) {
    try {
      // Check if bookmark with same URL already exists for this user
      const existingBookmark = await Bookmark.findOne({
        student: studentId,
        url: bookmarkData.url
      });

      if (existingBookmark) {
        // If bookmark exists, update it instead of creating new one
        return await this.updateBookmark(studentId, existingBookmark._id, bookmarkData);
      }

      // Handle folder assignment - resolve folder name to ID if needed
      if (bookmarkData.folder && bookmarkData.folder !== 'General') {
        try {
          const { default: FolderService } = await import('../core/FolderService.js');
          const folders = await FolderService.getUserFolders(studentId);
          const matchingFolder = folders.find(f => f.name === bookmarkData.folder);
          if (matchingFolder) {
            bookmarkData.folderId = matchingFolder._id;
          }
        } catch (error) {
          console.warn('Could not resolve folder ID:', error.message);
          // Continue without folder ID
        }
      }

      // Handle tags if they exist
      if (bookmarkData.tags && bookmarkData.tags.length > 0) {
        // Create or update tags in the Tag collection
        await TagService.createOrUpdateTags(studentId, bookmarkData.tags);
      }

      const bookmark = new Bookmark({
        student: studentId,
        ...bookmarkData
      });

      await bookmark.save();
      return bookmark;
    } catch (error) {
      throw new Error(`Failed to create bookmark: ${error.message}`);
    }
  }

  // Update bookmark
  static async updateBookmark(studentId, bookmarkId, updateData) {
    try {
      // Handle folder assignment - resolve folder name to ID if needed
      if (updateData.folder && updateData.folder !== 'General') {
        try {
          const { default: FolderService } = await import('../core/FolderService.js');
          const folders = await FolderService.getUserFolders(studentId);
          const matchingFolder = folders.find(f => f.name === updateData.folder);
          if (matchingFolder) {
            updateData.folderId = matchingFolder._id;
          }
        } catch (error) {
          console.warn('Could not resolve folder ID:', error.message);
          // Continue without folder ID
        }
      } else if (updateData.folder === 'General') {
        // Clear folder ID for General folder
        updateData.folderId = null;
      }

      // Handle tags if they are being updated
      if (updateData.tags && updateData.tags.length > 0) {
        // Create or update tags in the Tag collection
        await TagService.createOrUpdateTags(studentId, updateData.tags);
      }

      const bookmark = await Bookmark.findOneAndUpdate(
        { _id: bookmarkId, student: studentId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!bookmark) {
        throw new Error('Bookmark not found');
      }

      return bookmark;
    } catch (error) {
      throw new Error(`Failed to update bookmark: ${error.message}`);
    }
  }

  // Delete bookmark
  static async deleteBookmark(studentId, bookmarkId) {
    try {
      const bookmark = await Bookmark.findOneAndDelete({
        _id: bookmarkId,
        student: studentId
      });

      if (!bookmark) {
        throw new Error('Bookmark not found');
      }

      return bookmark;
    } catch (error) {
      throw new Error(`Failed to delete bookmark: ${error.message}`);
    }
  }

  // Get bookmark by ID
  static async getBookmarkById(studentId, bookmarkId) {
    try {
      const bookmark = await Bookmark.findOne({
        _id: bookmarkId,
        student: studentId
      });

      if (!bookmark) {
        throw new Error('Bookmark not found');
      }

      return bookmark;
    } catch (error) {
      throw new Error(`Failed to fetch bookmark: ${error.message}`);
    }
  }

  // Get folders
  static async getFolders(studentId) {
    try {
      const folders = await Bookmark.distinct('folder', { student: studentId });
      return folders.filter(folder => folder && folder.trim());
    } catch (error) {
      throw new Error(`Failed to fetch folders: ${error.message}`);
    }
  }

  // Get categories
  static async getCategories(studentId) {
    try {
      const categories = await Bookmark.distinct('category', { student: studentId });
      return categories.filter(category => category && category.trim());
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  }

  // Get bookmark statistics
  static async getBookmarkStats(studentId) {
    try {
      const [
        totalBookmarks,
        categoriesCount,
        foldersCount,
        totalVisits,
        recentBookmarks,
        topCategories,
        topFolders
      ] = await Promise.all([
        // Total bookmarks
        Bookmark.countDocuments({ student: studentId, isArchived: false }),
        
        // Categories count
        Bookmark.distinct('category', { student: studentId }).then(cats => cats.length),
        
        // Folders count
        Bookmark.distinct('folder', { student: studentId }).then(folders => folders.length),
        
        // Total visits
        Bookmark.aggregate([
          { $match: { student: studentId } },
          { $group: { _id: null, totalVisits: { $sum: '$visitCount' } } }
        ]).then(result => result[0]?.totalVisits || 0),
        
        // Recent bookmarks (last 7 days)
        Bookmark.countDocuments({
          student: studentId,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }),
        
        // Top categories
        Bookmark.aggregate([
          { $match: { student: studentId } },
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ]),
        
        // Top folders
        Bookmark.aggregate([
          { $match: { student: studentId } },
          { $group: { _id: '$folder', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ])
      ]);

      return {
        totalBookmarks,
        categoriesCount,
        foldersCount,
        totalVisits,
        recentBookmarks,
        topCategories,
        topFolders
      };
    } catch (error) {
      throw new Error(`Failed to fetch bookmark stats: ${error.message}`);
    }
  }

  // Record bookmark visit
  static async recordVisit(studentId, bookmarkId) {
    try {
      const bookmark = await Bookmark.findOneAndUpdate(
        { _id: bookmarkId, student: studentId },
        { 
          $inc: { visitCount: 1 },
          $set: { lastVisited: new Date() }
        },
        { new: true }
      );

      if (!bookmark) {
        throw new Error('Bookmark not found');
      }

      return bookmark;
    } catch (error) {
      throw new Error(`Failed to record visit: ${error.message}`);
    }
  }

  // Toggle archive status
  static async toggleArchive(studentId, bookmarkId) {
    try {
      const bookmark = await Bookmark.findOne({
        _id: bookmarkId,
        student: studentId
      });

      if (!bookmark) {
        throw new Error('Bookmark not found');
      }

      bookmark.isArchived = !bookmark.isArchived;
      await bookmark.save();

      return bookmark;
    } catch (error) {
      throw new Error(`Failed to toggle archive: ${error.message}`);
    }
  }

  // Get public bookmarks
  static async getPublicBookmarks(options = {}) {
    const {
      page = 1,
      limit = 20,
      category,
      tags,
      search
    } = options;

    const query = {
      isPublic: true,
      isArchived: false
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    try {
      const bookmarks = await Bookmark.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('student', 'name')
        .select('-student.email');

      const total = await Bookmark.countDocuments(query);

      return {
        bookmarks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch public bookmarks: ${error.message}`);
    }
  }

  // Bulk operations
  static async bulkOperations(studentId, options) {
    const { action, bookmarkIds, folder, category, isArchived } = options;

    try {
      let result;
      const query = {
        _id: { $in: bookmarkIds },
        student: studentId
      };

      switch (action) {
        case 'move_folder':
          result = await Bookmark.updateMany(query, { folder });
          break;
        case 'change_category':
          result = await Bookmark.updateMany(query, { category });
          break;
        case 'archive':
          result = await Bookmark.updateMany(query, { isArchived: true });
          break;
        case 'unarchive':
          result = await Bookmark.updateMany(query, { isArchived: false });
          break;
        case 'delete':
          result = await Bookmark.deleteMany(query);
          break;
        default:
          throw new Error('Invalid bulk action');
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to perform bulk operation: ${error.message}`);
    }
  }
}

export default StudentBookmarkService;