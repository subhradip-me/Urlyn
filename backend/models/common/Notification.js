import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for system notifications
  },
  type: {
    type: String,
    required: true,
    enum: [
      // System notifications
      'system_announcement',
      'account_update',
      
      // Student notifications
      'assignment_due',
      'course_update',
      'grade_posted',
      'study_reminder',
      
      // Creator notifications
      'content_published',
      'analytics_report',
      'payment_received',
      'subscriber_milestone',
      
      // Professional notifications
      'project_assigned',
      'task_deadline',
      'team_update',
      'collaboration_invite',
      
      // Cross-persona
      'persona_switched',
      'profile_update'
    ]
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'academic', 'content', 'work', 'system'],
    default: 'general'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  actionUrl: {
    type: String,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  },
  // Persona context - which persona was active when notification was created
  targetPersona: {
    type: String,
    enum: ['student', 'creator', 'professional', 'all'],
    default: 'all'
  }
}, {
  timestamps: true
});

// Indexes for better performance
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, targetPersona: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Mark notification as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  return await notification.save();
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = async function(userId, persona = null) {
  const filter = {
    recipient: userId,
    isRead: false
  };
  
  if (persona) {
    filter.$or = [
      { targetPersona: persona },
      { targetPersona: 'all' }
    ];
  }
  
  return await this.countDocuments(filter);
};

// Static method to mark all as read for user
notificationSchema.statics.markAllAsRead = async function(userId, persona = null) {
  const filter = {
    recipient: userId,
    isRead: false
  };
  
  if (persona) {
    filter.$or = [
      { targetPersona: persona },
      { targetPersona: 'all' }
    ];
  }
  
  return await this.updateMany(filter, {
    isRead: true,
    readAt: new Date()
  });
};

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
