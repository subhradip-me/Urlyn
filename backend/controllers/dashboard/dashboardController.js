import asyncHandler from 'express-async-handler';
import User from '../../models/common/User.js';
import Tag from '../../models/core/Tag.js';
import CoreBookmark from '../../models/core/Bookmark.js';
import Folder from '../../models/core/Folder.js';
import Note from '../../models/core/Note.js';
import BookmarkService from '../../services/core/BookmarkService.js';
import TagService from '../../services/core/TagService.js';
import FolderService from '../../services/core/FolderService.js';

// @desc    Get dashboard stats for current user's active persona
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const currentPersona = req.user.currentPersona || 'student';

  try {
    // Basic user info
    const user = await User.findById(userId);
    
    // Get persona-specific stats using the new core models
    const [bookmarkStats, tagStats, folderCount, noteCount] = await Promise.all([
      BookmarkService.getBookmarkStats(userId, currentPersona),
      TagService.getTagStats(userId, currentPersona),
      Folder.countDocuments({ userId, persona: currentPersona }),
      Note.countDocuments({ userId, persona: currentPersona })
    ]);
    
    // Common stats for current persona
    const personaStats = {
      bookmarks: bookmarkStats,
      tags: tagStats,
      folders: folderCount,
      notes: noteCount,
      recentActivity: await getRecentActivity(userId, currentPersona)
    };

    res.json({
      success: true,
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          personas: user.personas,
          currentPersona: user.currentPersona,
          createdAt: user.createdAt,
          memberSince: user.createdAt
        },
        stats: {
          totalPersonas: user.personas.length,
          currentPersona,
          ...personaStats
        }
      }
    });

  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500);
    throw new Error('Failed to get dashboard stats');
  }
});

// Helper function to get recent activity for a specific persona
const getRecentActivity = async (userId, persona) => {
  try {
    const [recentBookmarks, recentNotes, recentTags] = await Promise.all([
      CoreBookmark.find({ userId, persona })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title url createdAt')
        .lean(),
      Note.find({ userId, persona })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('title content createdAt updatedAt')
        .lean(),
      Tag.find({ userId, persona })
        .sort({ createdAt: -1 })
        .limit(3)
        .select('name color createdAt')
        .lean()
    ]);

    const activities = [
      ...recentBookmarks.map(CoreBookmark => ({
        type: 'CoreBookmark',
        action: 'created',
        item: CoreBookmark.title,
        url: CoreBookmark.url,
        timestamp: CoreBookmark.createdAt
      })),
      ...recentNotes.map(note => ({
        type: 'note',
        action: note.createdAt.getTime() === note.updatedAt.getTime() ? 'created' : 'updated',
        item: note.title,
        preview: note.content ? note.content.substring(0, 100) + '...' : '',
        timestamp: note.updatedAt
      })),
      ...recentTags.map(tag => ({
        type: 'tag',
        action: 'created',
        item: tag.name,
        color: tag.color,
        timestamp: tag.createdAt
      }))
    ];

    // Sort by timestamp and return latest 10
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

  } catch (error) {
    console.error('Error getting recent activity:', error);
    return [];
  }
};

// @desc    Get quick actions for current persona
// @route   GET /api/dashboard/quick-actions
// @access  Private
const getQuickActions = asyncHandler(async (req, res) => {
  const currentPersona = req.user.currentPersona || 'student';
  
  const quickActions = {
    student: [
      { 
        id: 'add-CoreBookmark', 
        title: 'Add CoreBookmark', 
        description: 'Save a new learning resource',
        icon: 'CoreBookmark',
        path: '/student/bookmarks',
        color: 'blue'
      },
      { 
        id: 'view-notes', 
        title: 'View Notes', 
        description: 'Access your study notes',
        icon: 'note',
        path: '/student/ai-notes',
        color: 'green'
      },
      { 
        id: 'browse-folders', 
        title: 'Browse Folders', 
        description: 'Organize your materials',
        icon: 'folder',
        path: '/student/folders',
        color: 'purple'
      }
    ],
    creator: [
      { 
        id: 'create-content', 
        title: 'Create Content', 
        description: 'Start a new piece of content',
        icon: 'create',
        path: '/creator/content-vault',
        color: 'purple'
      },
      { 
        id: 'add-inspiration', 
        title: 'Add Inspiration', 
        description: 'Save inspiring content',
        icon: 'CoreBookmark',
        path: '/creator/bookmarks',
        color: 'blue'
      },
      { 
        id: 'check-analytics', 
        title: 'View Analytics', 
        description: 'Check your performance',
        icon: 'chart',
        path: '/creator/analytics',
        color: 'green'
      }
    ],
    professional: [
      { 
        id: 'new-project', 
        title: 'New Project', 
        description: 'Start a new work project',
        icon: 'project',
        path: '/work/dashboard',
        color: 'green'
      },
      { 
        id: 'add-resource', 
        title: 'Add Resource', 
        description: 'Save professional resources',
        icon: 'CoreBookmark',
        path: '/work/bookmarks',
        color: 'blue'
      },
      { 
        id: 'team-workspace', 
        title: 'Team Workspace', 
        description: 'Collaborate with your team',
        icon: 'team',
        path: '/work/team-workspace',
        color: 'purple'
      }
    ]
  };

  res.json({
    success: true,
    data: {
      persona: currentPersona,
      actions: quickActions[currentPersona] || []
    }
  });
});

export {
  getDashboardStats,
  getQuickActions
};
