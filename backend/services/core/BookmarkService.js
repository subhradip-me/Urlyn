import CoreBookmark from '../../models/core/Bookmark.js';
import Folder from '../../models/core/Folder.js';
import Tag from '../../models/core/Tag.js';
import User from '../../models/common/User.js';

class BookmarkService {
  // Get bookmarks for a specific persona with filtering and pagination
  static async getBookmarks(userId, persona, options = {}) {
    try {
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
      } = options;

      // Build query
      const query = {
        userId,
        persona,
        isArchived
      };

      // Add filters
      if (folderIds && folderIds.length > 0) {
        query.folderIds = { $in: folderIds };
      }

      if (tagIds && tagIds.length > 0) {
        query.tagIds = { $in: tagIds };
      }

      if (isPublic !== undefined) {
        query.isPublic = isPublic;
      }

      if (priority) {
        query.priority = priority;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { url: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort options
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Calculate skip for pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get bookmarks with population
      const bookmarks = await CoreBookmark.find(query)
        .populate('folderIds', 'name icon color')
        .populate('tagIds', 'name color')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      // Get total count for pagination
      const total = await CoreBookmark.countDocuments(query);

      return {
        bookmarks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNext: skip + parseInt(limit) < total,
          hasPrev: parseInt(page) > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to get bookmarks: ${error.message}`);
    }
  }

  // Get CoreBookmark by ID for specific persona
  static async getBookmarkById(userId, persona, bookmarkId) {
    try {
      const CoreBookmark = await CoreBookmark.findOne({ 
        _id: bookmarkId, 
        userId, 
        persona 
      })
      .populate('folderIds', 'name icon color')
      .populate('tagIds', 'name color');

      if (!CoreBookmark) {
        throw new Error('CoreBookmark not found');
      }

      return CoreBookmark;
    } catch (error) {
      throw new Error(`Failed to get CoreBookmark: ${error.message}`);
    }
  }

  // Create new CoreBookmark for specific persona
  static async createBookmark(userId, persona, bookmarkData) {
    try {
      const {
        url,
        title,
        description,
        folderIds = [],
        tagIds = [],
        isPublic = false,
        priority = 'medium'
      } = bookmarkData;

      // Check for duplicate URLs in the same persona
      const existingBookmark = await CoreBookmark.findOne({
        userId,
        persona,
        url
      });

      if (existingBookmark) {
        throw new Error('A CoreBookmark with this URL already exists for this persona');
      }

      // Validate folders belong to user and persona
      if (folderIds.length > 0) {
        const folders = await Folder.find({
          _id: { $in: folderIds },
          userId,
          persona
        });
        if (folders.length !== folderIds.length) {
          throw new Error('One or more folders not found or do not belong to this persona');
        }
      }

      // Validate tags belong to user and persona
      if (tagIds.length > 0) {
        const tags = await Tag.find({
          _id: { $in: tagIds },
          userId,
          persona
        });
        if (tags.length !== tagIds.length) {
          throw new Error('One or more tags not found or do not belong to this persona');
        }
      }

      const bookmark = new CoreBookmark({
        userId,
        persona,
        url,
        title,
        description,
        folderIds,
        tagIds,
        isPublic,
        priority
      });

      await bookmark.save();
      
      // Update tag usage counts
      if (tagIds.length > 0) {
        await Tag.updateMany(
          { _id: { $in: tagIds } },
          { $inc: { usageCount: 1 } }
        );
      }

      return await bookmark.populate([
        { path: 'folderIds', select: 'name icon color' },
        { path: 'tagIds', select: 'name color' }
      ]);
    } catch (error) {
      throw new Error(`Failed to create CoreBookmark: ${error.message}`);
    }
  }

  // Update CoreBookmark for specific persona
  static async updateBookmark(userId, persona, bookmarkId, updateData) {
    try {
      // Check if CoreBookmark exists and belongs to user and persona
      const existingBookmark = await CoreBookmark.findOne({
        _id: bookmarkId,
        userId,
        persona
      });

      if (!existingBookmark) {
        throw new Error('CoreBookmark not found');
      }

      const {
        url,
        title,
        description,
        folderIds,
        tagIds,
        isPublic,
        priority,
        isArchived
      } = updateData;

      // Check for duplicate URLs if URL is being updated
      if (url && url !== existingBookmark.url) {
        const duplicateBookmark = await CoreBookmark.findOne({
          userId,
          persona,
          url,
          _id: { $ne: bookmarkId }
        });

        if (duplicateBookmark) {
          throw new Error('A CoreBookmark with this URL already exists for this persona');
        }
      }

      // Validate folders if provided
      if (folderIds && folderIds.length > 0) {
        const folders = await Folder.find({
          _id: { $in: folderIds },
          userId,
          persona
        });
        if (folders.length !== folderIds.length) {
          throw new Error('One or more folders not found or do not belong to this persona');
        }
      }

      // Validate tags if provided
      if (tagIds && tagIds.length > 0) {
        const tags = await Tag.find({
          _id: { $in: tagIds },
          userId,
          persona
        });
        if (tags.length !== tagIds.length) {
          throw new Error('One or more tags not found or do not belong to this persona');
        }
      }

      // Update tag usage counts
      const oldTagIds = existingBookmark.tagIds || [];
      const newTagIds = tagIds || oldTagIds;
      
      // Decrease count for removed tags
      const removedTagIds = oldTagIds.filter(id => !newTagIds.includes(id));
      if (removedTagIds.length > 0) {
        await Tag.updateMany(
          { _id: { $in: removedTagIds } },
          { $inc: { usageCount: -1 } }
        );
      }
      
      // Increase count for added tags
      const addedTagIds = newTagIds.filter(id => !oldTagIds.includes(id));
      if (addedTagIds.length > 0) {
        await Tag.updateMany(
          { _id: { $in: addedTagIds } },
          { $inc: { usageCount: 1 } }
        );
      }

      const updatedBookmark = await CoreBookmark.findByIdAndUpdate(
        bookmarkId,
        {
          ...(url && { url }),
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(folderIds !== undefined && { folderIds }),
          ...(tagIds !== undefined && { tagIds }),
          ...(isPublic !== undefined && { isPublic }),
          ...(priority && { priority }),
          ...(isArchived !== undefined && { isArchived })
        },
        { new: true }
      )
      .populate('folderIds', 'name icon color')
      .populate('tagIds', 'name color');

      return updatedBookmark;
    } catch (error) {
      throw new Error(`Failed to update CoreBookmark: ${error.message}`);
    }
  }

  // Delete CoreBookmark for specific persona
  static async deleteBookmark(userId, persona, bookmarkId) {
    try {
      const CoreBookmark = await CoreBookmark.findOne({
        _id: bookmarkId,
        userId,
        persona
      });

      if (!CoreBookmark) {
        throw new Error('CoreBookmark not found');
      }

      // Update tag usage counts
      if (CoreBookmark.tagIds && CoreBookmark.tagIds.length > 0) {
        await Tag.updateMany(
          { _id: { $in: CoreBookmark.tagIds } },
          { $inc: { usageCount: -1 } }
        );
      }

      await CoreBookmark.findByIdAndDelete(bookmarkId);
      
      return { message: 'CoreBookmark deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete CoreBookmark: ${error.message}`);
    }
  }

  // Get CoreBookmark statistics for a specific persona
  static async getBookmarkStats(userId, persona) {
    try {
      const [
        totalCount,
        archivedCount,
        publicCount,
        priorityCounts,
        recentCount
      ] = await Promise.all([
        CoreBookmark.countDocuments({ userId, persona }),
        CoreBookmark.countDocuments({ userId, persona, isArchived: true }),
        CoreBookmark.countDocuments({ userId, persona, isPublic: true }),
        CoreBookmark.aggregate([
          { $match: { userId, persona } },
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]),
        CoreBookmark.countDocuments({
          userId,
          persona,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
      ]);

      return {
        total: totalCount,
        archived: archivedCount,
        public: publicCount,
        recent: recentCount,
        priorities: priorityCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, { low: 0, medium: 0, high: 0 })
      };
    } catch (error) {
      throw new Error(`Failed to get CoreBookmark statistics: ${error.message}`);
    }
  }
}

export default BookmarkService;
