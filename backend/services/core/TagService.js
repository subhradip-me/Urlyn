import Tag from '../../models/core/Tag.js';
import CoreBookmark from '../../models/core/Bookmark.js';

class TagService {
  // Get all tags for a specific persona
  static async getUserTags(userId, persona, options = {}) {
    try {
      const { 
        sortBy = 'name',
        sortOrder = 'asc',
        search,
        limit,
        includeUsageCount = true
      } = options;

      // Build query
      const query = { userId, persona };
      
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      // Build sort options
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      let queryBuilder = Tag.find(query).sort(sortOptions);
      
      if (limit) {
        queryBuilder = queryBuilder.limit(parseInt(limit));
      }

      const tags = await queryBuilder.lean();

      return tags;
    } catch (error) {
      throw new Error(`Failed to get tags: ${error.message}`);
    }
  }

  // Get tag by ID for specific persona
  static async getTagById(userId, persona, tagId) {
    try {
      const tag = await Tag.findOne({ _id: tagId, userId, persona });
      
      if (!tag) {
        throw new Error('Tag not found');
      }

      return tag;
    } catch (error) {
      throw new Error(`Failed to get tag: ${error.message}`);
    }
  }

  // Create new tag for specific persona
  static async createTag(userId, persona, tagData) {
    try {
      const { name, color, description } = tagData;

      // Check for duplicate names in the same persona
      const existingTag = await Tag.findOne({
        userId,
        persona,
        name: { $regex: new RegExp(`^${name}$`, 'i') }
      });

      if (existingTag) {
        throw new Error('A tag with this name already exists for this persona');
      }

      const tag = new Tag({
        userId,
        persona,
        name: name.trim(),
        color: color || '#3B82F6',
        description
      });

      await tag.save();
      return tag;
    } catch (error) {
      throw new Error(`Failed to create tag: ${error.message}`);
    }
  }

  // Update tag for specific persona
  static async updateTag(userId, persona, tagId, updateData) {
    try {
      const { name, color, description } = updateData;

      // Check if tag exists and belongs to user and persona
      const existingTag = await Tag.findOne({ _id: tagId, userId, persona });
      if (!existingTag) {
        throw new Error('Tag not found');
      }

      // Check for duplicate names if name is being updated
      if (name && name.trim() !== existingTag.name) {
        const duplicateTag = await Tag.findOne({
          userId,
          persona,
          name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
          _id: { $ne: tagId }
        });

        if (duplicateTag) {
          throw new Error('A tag with this name already exists for this persona');
        }
      }

      const updatedTag = await Tag.findByIdAndUpdate(
        tagId,
        {
          ...(name && { name: name.trim() }),
          ...(color && { color }),
          ...(description !== undefined && { description })
        },
        { new: true }
      );

      return updatedTag;
    } catch (error) {
      throw new Error(`Failed to update tag: ${error.message}`);
    }
  }

  // Delete tag for specific persona
  static async deleteTag(userId, persona, tagId) {
    try {
      const tag = await Tag.findOne({ _id: tagId, userId, persona });
      if (!tag) {
        throw new Error('Tag not found');
      }

      // Remove tag from all bookmarks that use it
      await CoreBookmark.updateMany(
        { userId, persona, tagIds: tagId },
        { $pull: { tagIds: tagId } }
      );

      await Tag.findByIdAndDelete(tagId);
      
      return { message: 'Tag deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete tag: ${error.message}`);
    }
  }

  // Get popular tags for specific persona
  static async getPopularTags(userId, persona, limit = 10) {
    try {
      const tags = await Tag.find({ userId, persona })
        .sort({ usageCount: -1, name: 1 })
        .limit(limit)
        .lean();

      return tags;
    } catch (error) {
      throw new Error(`Failed to get popular tags: ${error.message}`);
    }
  }

  // Get tag statistics for specific persona
  static async getTagStats(userId, persona) {
    try {
      const [
        totalCount,
        usedCount,
        unusedCount,
        averageUsage
      ] = await Promise.all([
        Tag.countDocuments({ userId, persona }),
        Tag.countDocuments({ userId, persona, usageCount: { $gt: 0 } }),
        Tag.countDocuments({ userId, persona, usageCount: 0 }),
        Tag.aggregate([
          { $match: { userId, persona } },
          { $group: { _id: null, avgUsage: { $avg: '$usageCount' } } }
        ])
      ]);

      return {
        total: totalCount,
        used: usedCount,
        unused: unusedCount,
        averageUsage: averageUsage[0]?.avgUsage || 0
      };
    } catch (error) {
      throw new Error(`Failed to get tag statistics: ${error.message}`);
    }
  }

  // Search tags by name for specific persona
  static async searchTags(userId, persona, searchTerm, limit = 20) {
    try {
      const tags = await Tag.find({
        userId,
        persona,
        name: { $regex: searchTerm, $options: 'i' }
      })
      .sort({ usageCount: -1, name: 1 })
      .limit(limit)
      .select('name color usageCount')
      .lean();

      return tags;
    } catch (error) {
      throw new Error(`Failed to search tags: ${error.message}`);
    }
  }

  // Create multiple tags at once for specific persona
  static async createMultipleTags(userId, persona, tagNames) {
    try {
      const tags = [];
      const errors = [];

      for (const name of tagNames) {
        try {
          // Check if tag already exists
          const existingTag = await Tag.findOne({
            userId,
            persona,
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
          });

          if (existingTag) {
            tags.push(existingTag);
          } else {
            const newTag = new Tag({
              userId,
              persona,
              name: name.trim(),
              color: '#3B82F6'
            });
            await newTag.save();
            tags.push(newTag);
          }
        } catch (error) {
          errors.push({ name, error: error.message });
        }
      }

      return { tags, errors };
    } catch (error) {
      throw new Error(`Failed to create multiple tags: ${error.message}`);
    }
  }
}

export default TagService;
