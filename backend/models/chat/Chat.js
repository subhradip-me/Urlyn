import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['item', 'dm', 'group'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note', // Can be Note, Bookmark, Folder, etc.
    required: function() {
      return this.type === 'item';
    }
  },
  itemType: {
    type: String,
    enum: ['note', 'bookmark', 'folder', 'project'],
    required: function() {
      return this.type === 'item';
    }
  },
  name: {
    type: String,
    required: function() {
      return this.type === 'group';
    }
  },
  description: {
    type: String,
    default: ''
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastReadAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowFileSharing: {
      type: Boolean,
      default: true
    },
    maxFileSize: {
      type: Number,
      default: 10 * 1024 * 1024 // 10MB
    },
    allowedFileTypes: [{
      type: String,
      default: ['image', 'document', 'pdf']
    }]
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  messageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for performance
chatSchema.index({ type: 1, isActive: 1 });
chatSchema.index({ 'members.userId': 1 });
chatSchema.index({ itemId: 1, itemType: 1 });
chatSchema.index({ lastMessageAt: -1 });

// Virtual for chat display name
chatSchema.virtual('displayName').get(function() {
  if (this.type === 'group') {
    return this.name;
  } else if (this.type === 'dm') {
    // For DM, name would be constructed from member names
    return 'Direct Message';
  } else if (this.type === 'item') {
    return `Discussion: ${this.itemId?.title || 'Shared Item'}`;
  }
  return 'Chat';
});

// Method to get unread count for a user
chatSchema.methods.getUnreadCount = function(userId) {
  const member = this.members.find(m => m.userId.toString() === userId.toString());
  if (!member) return 0;
  
  return this.messageCount - (member.readCount || 0);
};

// Method to add member
chatSchema.methods.addMember = function(userId, role = 'member') {
  const existingMember = this.members.find(m => m.userId.toString() === userId.toString());
  if (existingMember) return false;
  
  this.members.push({ userId, role, joinedAt: new Date() });
  return true;
};

// Method to remove member
chatSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(m => m.userId.toString() !== userId.toString());
  return true;
};

// Static method to create item chat
chatSchema.statics.createItemChat = async function(itemId, itemType, createdBy, members = []) {
  const chat = new this({
    type: 'item',
    itemId,
    itemType,
    createdBy,
    members: [
      { userId: createdBy, role: 'admin' },
      ...members.map(userId => ({ userId, role: 'member' }))
    ]
  });
  
  return await chat.save();
};

// Static method to create DM chat
chatSchema.statics.createDMChat = async function(user1Id, user2Id) {
  // Check if DM already exists
  const existingChat = await this.findOne({
    type: 'dm',
    'members.userId': { $all: [user1Id, user2Id] }
  });
  
  if (existingChat) return existingChat;
  
  const chat = new this({
    type: 'dm',
    createdBy: user1Id,
    members: [
      { userId: user1Id, role: 'member' },
      { userId: user2Id, role: 'member' }
    ]
  });
  
  return await chat.save();
};

export default mongoose.model('Chat', chatSchema);
