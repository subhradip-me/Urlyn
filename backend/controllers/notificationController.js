const Notification = require('../models/common/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, persona, isRead, type, priority } = req.query;
    
    const filter = {
      recipient: req.user.id
    };

    // Filter by persona
    if (persona && persona !== 'all') {
      filter.$or = [
        { targetPersona: persona },
        { targetPersona: 'all' }
      ];
    }

    // Filter by read status
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    // Filter by type
    if (type) {
      filter.type = type;
    }

    // Filter by priority
    if (priority) {
      filter.priority = priority;
    }

    const notifications = await Notification.find(filter)
      .populate('sender', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(filter);

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const { persona } = req.query;
    
    const count = await Notification.getUnreadCount(req.user.id, persona);

    res.json({
      success: true,
      data: {
        unreadCount: count
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const { persona } = req.body;
    
    await Notification.markAllAsRead(req.user.id, persona);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get notification statistics
// @route   GET /api/notifications/stats
// @access  Private
const getNotificationStats = async (req, res) => {
  try {
    const { persona } = req.query;
    
    const filter = {
      recipient: req.user.id
    };

    if (persona && persona !== 'all') {
      filter.$or = [
        { targetPersona: persona },
        { targetPersona: 'all' }
      ];
    }

    const stats = await Notification.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
          byType: {
            $push: {
              type: '$type',
              isRead: '$isRead',
              priority: '$priority'
            }
          }
        }
      }
    ]);

    const result = stats[0] || { total: 0, unread: 0, byType: [] };

    // Group by type
    const typeStats = result.byType.reduce((acc, notif) => {
      if (!acc[notif.type]) {
        acc[notif.type] = { total: 0, unread: 0 };
      }
      acc[notif.type].total += 1;
      if (!notif.isRead) {
        acc[notif.type].unread += 1;
      }
      return acc;
    }, {});

    // Group by priority
    const priorityStats = result.byType.reduce((acc, notif) => {
      if (!acc[notif.priority]) {
        acc[notif.priority] = { total: 0, unread: 0 };
      }
      acc[notif.priority].total += 1;
      if (!notif.isRead) {
        acc[notif.priority].unread += 1;
      }
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        total: result.total,
        unread: result.unread,
        read: result.total - result.unread,
        byType: typeStats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationStats
};
