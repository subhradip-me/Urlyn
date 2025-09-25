import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: function() {
      return !this.attachments || this.attachments.length === 0;
    },
    maxlength: 2000
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'image', 'system'],
    default: 'text'
  },
  attachments: [{
    fileName: String,
    originalName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  edited: {
    isEdited: {
      type: Boolean,
      default: false
    },
    editedAt: Date,
    originalMessage: String
  },
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reaction: String, // emoji
    reactedAt: {
      type: Date,
      default: Date.now
    }
  }],
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  deliveredTo: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deliveredAt: {
      type: Date,
      default: Date.now
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ 'readBy.userId': 1 });

// Virtual for formatted timestamp
messageSchema.virtual('formattedTime').get(function() {
  const now = new Date();
  const messageDate = this.createdAt;
  const diffInMs = now - messageDate;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
  }
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return messageDate.toLocaleDateString();
});

// Method to mark as read by user
messageSchema.methods.markAsRead = function(userId) {
  const existingRead = this.readBy.find(read => read.userId.toString() === userId.toString());
  if (!existingRead) {
    this.readBy.push({ userId, readAt: new Date() });
  }
  return this.save();
};

// Method to add reaction
messageSchema.methods.addReaction = function(userId, reaction) {
  const existingReaction = this.reactions.find(r => r.userId.toString() === userId.toString());
  
  if (existingReaction) {
    if (existingReaction.reaction === reaction) {
      // Remove reaction if same
      this.reactions = this.reactions.filter(r => r.userId.toString() !== userId.toString());
    } else {
      // Update reaction
      existingReaction.reaction = reaction;
      existingReaction.reactedAt = new Date();
    }
  } else {
    // Add new reaction
    this.reactions.push({ userId, reaction, reactedAt: new Date() });
  }
  
  return this.save();
};

// Method to edit message
messageSchema.methods.editMessage = function(newMessage) {
  this.edited.originalMessage = this.message;
  this.message = newMessage;
  this.edited.isEdited = true;
  this.edited.editedAt = new Date();
  return this.save();
};

// Static method to get chat messages with pagination
messageSchema.statics.getChatMessages = async function(chatId, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  return await this.find({
    chatId,
    isDeleted: false
  })
  .populate('senderId', 'firstName lastName email avatar')
  .populate('replyTo', 'message senderId createdAt')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
};

// Static method to get unread messages count
messageSchema.statics.getUnreadCount = async function(chatId, userId, lastReadAt) {
  return await this.countDocuments({
    chatId,
    senderId: { $ne: userId },
    createdAt: { $gt: lastReadAt || new Date(0) },
    isDeleted: false
  });
};

export default mongoose.model('Message', messageSchema);
