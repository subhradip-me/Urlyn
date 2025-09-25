import Tag from '../../models/core/Tag.js';
import Bookmark from '../../models/student/Bookmark.js';  // Use student bookmark model to match actual data
import Note from '../../models/core/Note.js';
import mongoose from 'mongoose';

class TagService {
  // Create or find tags and increment usage
  static async createOrUpdateTags(studentId, tagNames) {
    const results = [];
    
    for (const tagName of tagNames) {
      if (!tagName || typeof tagName !== 'string') continue;
      
      const normalizedName = tagName.toLowerCase().trim();
      if (!normalizedName) continue;
      
      let tag = await Tag.findOne({
        userId: new mongoose.Types.ObjectId(studentId),
        name: normalizedName
      });

      if (tag) {
        // Increment usage count
        await tag.incrementUsage();
      } else {
        // Create new tag
        tag = await Tag.create({
          userId: studentId,
          name: normalizedName,
          category: this.inferCategory(normalizedName),
          color: this.getRandomColor(),
          emoji: this.getEmojiForTag(normalizedName)
        });
      }
      
      results.push(tag);
    }
    
    return results;
  }

  // Get all tags with content counts for a student
  static async getTagsWithContent(studentId, options = {}) {
    const {
      category,
      search,
      sortBy = 'usageCount',
      sortOrder = 'desc',
      limit = 100
    } = options;

    let query = { userId: new mongoose.Types.ObjectId(studentId) };
    
    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit));

    // Get content count for each tag
    const tagsWithContent = await Promise.all(
      tags.map(async (tag) => {
        const contentCount = await Bookmark.countDocuments({
          student: studentId,
          tags: { $in: [tag.name] }
        });

        // Get recent content for this tag
        const recentContent = await Bookmark.find({
          student: studentId,
          tags: { $in: [tag.name] }
        })
        .sort({ createdAt: -1 })
        .limit(3)
        .select('title url type createdAt');

        return {
          ...tag.toObject(),
          contentCount,
          recentContent
        };
      })
    );

    return tagsWithContent;
  }

  // Get content filtered by tags
  static async getContentByTags(studentId, tagNames, options = {}) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const query = {
      student: studentId,
      tags: { $in: tagNames }
    };

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const content = await Bookmark.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('folder', 'name');

    const total = await Bookmark.countDocuments(query);

    return {
      content,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get content filtered by a single tag
  static async getContentByTag(studentId, tagName, options = {}) {
    const {
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    console.log(`🏷️  TagService.getContentByTag called for user ${studentId}, tag: ${tagName}`);

    try {
      const userId = new mongoose.Types.ObjectId(studentId);
      
      // First, find the tag by name
      const tag = await Tag.findOne({
        userId: userId,
        name: { $regex: new RegExp(`^${tagName.trim()}$`, 'i') }
      });

      console.log(`🏷️  Found tag: ${tag ? tag.name : 'null'} with ID: ${tag ? tag._id : 'null'}`);

      if (!tag) {
        console.log(`❌ No tag found with name: ${tagName}`);
        return {
          success: true,
          data: {
            tag: null,
            content: [],
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total: 0,
              pages: 0
            }
          }
        };
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const skip = (page - 1) * limit;
      const limitPerType = Math.ceil(limit / 2); // Split limit between content types

      // Get bookmarks with this tag - handle both string tags and ObjectId tags
      const bookmarks = await Bookmark.find({
        student: userId,  // Use 'student' field for student bookmarks
        $or: [
          { tags: { $in: [tag.name, tag.name.toLowerCase()] } }  // String tags only
        ],
        isArchived: { $ne: true }
      })
        .sort(sortOptions)
        .skip(skip)
        .limit(limitPerType)
        .populate('folderId', 'name color')  // Use singular folderId
        .select('title description url favicon metadata clicks lastVisited createdAt updatedAt tags category');

      console.log(`📖 Found ${bookmarks.length} bookmarks for tag: ${tagName}`);

      // Get notes with this tag - handle both string tags and ObjectId tags  
      const notes = await Note.find({
        userId: userId,
        $or: [
          { tagIds: tag._id },  // ObjectId reference
          { tags: { $in: [tag.name, tag.name.toLowerCase()] } }  // String tags
        ],
        isArchived: { $ne: true }
      })
        .sort(sortOptions)
        .skip(skip)
        .limit(limitPerType)
        .populate('folderId', 'name color')
        .populate('tagIds', 'name color')
        .select('title content contentType preview wordCount readingTime type aiMetadata createdAt updatedAt');

      console.log(`📝 Found ${notes.length} notes for tag: ${tagName}`);

      // Combine and format content
      const content = [];

      // Add bookmarks
      bookmarks.forEach(bookmark => {
        content.push({
          id: bookmark._id,
          type: 'bookmark',
          title: bookmark.title,
          description: bookmark.description,
          url: bookmark.url,
          favicon: bookmark.favicon,
          domain: bookmark.metadata?.domain,
          clicks: bookmark.clicks,
          lastVisited: bookmark.lastVisited,
          createdAt: bookmark.createdAt,
          updatedAt: bookmark.updatedAt,
          tags: bookmark.tags || [],  // Use tags array for student bookmarks
          folder: bookmark.folderId || null  // Use singular folderId
        });
      });

      // Add notes
      notes.forEach(note => {
        content.push({
          id: note._id,
          type: 'note',
          title: note.title,
          description: note.preview || note.content?.substring(0, 150),
          content: note.content,
          contentType: note.contentType || 'text',
          wordCount: note.wordCount,
          readingTime: note.readingTime,
          noteType: note.type,
          aiMetadata: note.aiMetadata,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
          tags: note.tagIds || [],  // Use tagIds for core notes
          folder: note.folderId || null
        });
      });

      // Sort combined content by creation date
      content.sort((a, b) => {
        const dateA = new Date(sortBy === 'updatedAt' ? a.updatedAt : a.createdAt);
        const dateB = new Date(sortBy === 'updatedAt' ? b.updatedAt : b.createdAt);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });

      // Get total counts for pagination
      const totalBookmarks = await Bookmark.countDocuments({
        student: userId,  // Use 'student' field for student bookmarks
        tags: { $in: [tag.name, tag.name.toLowerCase()] },  // String tags only
        isArchived: { $ne: true }
      });

      const totalNotes = await Note.countDocuments({
        userId: userId,
        $or: [
          { tagIds: tag._id },  // ObjectId reference
          { tags: { $in: [tag.name, tag.name.toLowerCase()] } }  // String tags
        ],
        isArchived: { $ne: true }
      });

      const total = totalBookmarks + totalNotes;

      console.log(`✅ Returning ${content.length} total items (${totalBookmarks} bookmarks, ${totalNotes} notes) for tag: ${tagName}`);

      return {
        success: true,
        data: {
          tag: {
            _id: tag._id,
            name: tag.name,
            color: tag.color,
            description: tag.description,
            usageCount: tag.usageCount,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt
          },
          content: content.slice(0, limit), // Ensure we don't exceed limit
          counts: {
            bookmarks: totalBookmarks,
            notes: totalNotes,
            total: total
          },
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      };

    } catch (error) {
      console.error('Error in getContentByTag:', error);
      return {
        success: false,
        error: 'Failed to fetch content for tag',
        data: {
          tag: null,
          content: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            pages: 0
          }
        }
      };
    }
  }

  // Save content with AI-generated or manual tags
  static async saveContentWithTags(studentId, contentData, tags) {
    // Create or update tags
    const tagObjects = await this.createOrUpdateTags(studentId, tags);
    
    // Create bookmark with tags
    const bookmark = await Bookmark.create({
      student: studentId,
      ...contentData,
      tags: tags.map(tag => tag.toLowerCase().trim())
    });

    return {
      bookmark,
      tags: tagObjects
    };
  }

  // Infer category based on tag name
  static inferCategory(tagName) {
    const academicKeywords = ['math', 'physics', 'chemistry', 'biology', 'science', 'research', 'paper', 'study'];
    const techKeywords = ['programming', 'code', 'software', 'tech', 'javascript', 'python', 'ai', 'ml'];
    const workKeywords = ['work', 'project', 'client', 'business', 'meeting', 'deadline'];
    
    const lowerTag = tagName.toLowerCase();
    
    if (academicKeywords.some(keyword => lowerTag.includes(keyword))) {
      return 'academic';
    }
    if (techKeywords.some(keyword => lowerTag.includes(keyword))) {
      return 'technology';
    }
    if (workKeywords.some(keyword => lowerTag.includes(keyword))) {
      return 'work';
    }
    
    return 'study';
  }

  // Get random color for new tags
  static getRandomColor() {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Get emoji based on tag name
  static getEmojiForTag(tagName) {
    const emojiMap = {
      'math': '📊',
      'physics': '🔬',
      'chemistry': '⚗️',
      'biology': '🧬',
      'programming': '💻',
      'javascript': '🟨',
      'python': '🐍',
      'ai': '🧠',
      'research': '🔍',
      'tutorial': '🎓',
      'video': '🎥',
      'article': '📄',
      'book': '📚',
      'notes': '📝',
      'project': '🚀',
      'work': '💼',
      'personal': '👤',
      'important': '⭐',
      'urgent': '🔥',
      'todo': '☑️'
    };

    const lowerTag = tagName.toLowerCase();
    for (const [keyword, emoji] of Object.entries(emojiMap)) {
      if (lowerTag.includes(keyword)) {
        return emoji;
      }
    }
    
    return '🏷️';
  }

  // Get tag analytics
  static async getAnalytics(studentId) {
    // Most used tags
    const topTags = await Tag.find({ student: studentId })
      .sort({ usageCount: -1 })
      .limit(10);

    // Tags by category
    const categoryStats = await Tag.aggregate([
      { $match: { student: studentId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalUsage: { $sum: '$usageCount' }
        }
      }
    ]);

    // Content distribution by tags
    const contentByTags = await Bookmark.aggregate([
      { $match: { student: studentId } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    // Recent activity
    const recentTags = await Tag.find({
      student: studentId,
      'metadata.lastUsed': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).sort({ 'metadata.lastUsed': -1 });

    return {
      topTags,
      categoryStats,
      contentByTags,
      recentTags
    };
  }

  // Get tag statistics for a student
  static async getTagStats(studentId) {
    try {
      const userId = new mongoose.Types.ObjectId(studentId);

      // Total tags count
      const totalTags = await Tag.countDocuments({ userId });

      // Total usage count
      const usageAggregation = await Tag.aggregate([
        { $match: { userId } },
        { $group: { _id: null, totalUsage: { $sum: '$usageCount' } } }
      ]);
      const totalUsage = usageAggregation[0]?.totalUsage || 0;

      // Category breakdown
      const categoryStats = await Tag.aggregate([
        { $match: { userId } },
        { 
          $group: { 
            _id: '$category', 
            count: { $sum: 1 },
            totalUsage: { $sum: '$usageCount' }
          } 
        },
        { $sort: { count: -1 } }
      ]);

      // Most used tags (top 10)
      const topTags = await Tag.find({ userId })
        .sort({ usageCount: -1 })
        .limit(10)
        .select('name usageCount category color emoji');

      // Recent activity (tags used in last 7 days)
      const recentActivity = await Tag.find({
        userId,
        lastUsed: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }).sort({ lastUsed: -1 }).limit(5);

      return {
        totalTags,
        totalUsage,
        categoryStats,
        topTags,
        recentActivity,
        averageUsagePerTag: totalTags > 0 ? Math.round(totalUsage / totalTags) : 0
      };
    } catch (error) {
      console.error('Error getting tag stats:', error);
      throw error;
    }
  }
}

export default TagService;
