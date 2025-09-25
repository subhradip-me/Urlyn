import asyncHandler from 'express-async-handler';
import User from '../../models/common/User.js';
import Tag from '../../models/student/Tag.js';
import Bookmark from '../../models/student/Bookmark.js';
// Note: Some models may not exist yet, so we'll handle those gracefully

// @desc    Get dashboard stats for current user
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const currentPersona = req.user.currentPersona;

  try {
    // Basic user info
    const user = await User.findById(userId);
    
    // Common stats across all personas
    const totalBookmarks = await Bookmark.countDocuments({ userId });
    const totalTags = await Tag.countDocuments({ userId });
    
    // Persona-specific stats
    let personaStats = {};
    
    switch (currentPersona) {
      case 'student':
        personaStats = {
          totalBookmarks: await Bookmark.countDocuments({ userId, category: { $in: ['education', 'research', 'other'] } }),
          totalNotes: 0, // Notes model doesn't exist yet
          totalCourses: 0, // Course model doesn't exist yet
          recentActivity: await getRecentStudentActivity(userId)
        };
        break;
        
      case 'creator':
        personaStats = {
          totalContent: 0, // Content model doesn't exist yet
          totalBookmarks: await Bookmark.countDocuments({ userId, category: { $in: ['inspiration', 'tools', 'other'] } }),
          publishedContent: 0, // Content model doesn't exist yet
          recentActivity: await getRecentCreatorActivity(userId)
        };
        break;
        
      case 'professional':
        personaStats = {
          totalProjects: 0, // Project model doesn't exist yet
          totalBookmarks: await Bookmark.countDocuments({ userId, category: { $in: ['business', 'tools', 'other'] } }),
          activeProjects: 0, // Project model doesn't exist yet
          recentActivity: await getRecentProfessionalActivity(userId)
        };
        break;
        
      default:
        personaStats = {
          totalBookmarks,
          totalTags,
          recentActivity: []
        };
    }

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
          currentSession: user.currentPersona ? 1 : 0,
          totalBookmarks,
          totalTags,
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

// Helper function to get recent student activity
const getRecentStudentActivity = async (userId) => {
  try {
    const recentBookmarks = await Bookmark.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title url createdAt');
    
    return recentBookmarks.map(bookmark => ({
      type: 'bookmark',
      title: bookmark.title || 'Untitled Bookmark',
      date: bookmark.createdAt,
      data: { url: bookmark.url }
    }));
  } catch (error) {
    console.error('Error getting recent student activity:', error);
    return [];
  }
};

// Helper function to get recent creator activity
const getRecentCreatorActivity = async (userId) => {
  try {
    // For now, return bookmarks as activity
    const recentBookmarks = await Bookmark.find({ userId, category: { $in: ['inspiration', 'tools', 'other'] } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title url createdAt');
    
    return recentBookmarks.map(bookmark => ({
      type: 'bookmark',
      title: bookmark.title || 'Untitled Bookmark',
      date: bookmark.createdAt,
      data: { url: bookmark.url }
    }));
  } catch (error) {
    console.error('Error getting recent creator activity:', error);
    return [];
  }
};

// Helper function to get recent professional activity
const getRecentProfessionalActivity = async (userId) => {
  try {
    // For now, return bookmarks as activity
    const recentBookmarks = await Bookmark.find({ userId, category: { $in: ['business', 'tools', 'other'] } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title url createdAt');
    
    return recentBookmarks.map(bookmark => ({
      type: 'bookmark',
      title: bookmark.title || 'Untitled Bookmark',
      date: bookmark.createdAt,
      data: { url: bookmark.url }
    }));
  } catch (error) {
    console.error('Error getting recent professional activity:', error);
    return [];
  }
};

// @desc    Get quick actions for current persona
// @route   GET /api/dashboard/quick-actions
// @access  Private
const getQuickActions = asyncHandler(async (req, res) => {
  const currentPersona = req.user.currentPersona;
  
  const quickActions = {
    student: [
      { 
        id: 'add-bookmark', 
        title: 'Add Bookmark', 
        description: 'Save a new learning resource',
        icon: 'bookmark',
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
        icon: 'bookmark',
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
        icon: 'bookmark',
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
