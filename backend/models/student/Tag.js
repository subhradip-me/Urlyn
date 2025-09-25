import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  category: {
    type: String,
    enum: ['academic', 'study', 'personal', 'work', 'research', 'technology'],
    default: 'study'
  },
  color: {
    type: String,
    default: '#3B82F6' // Default blue color
  },
  emoji: {
    type: String,
    default: '🏷️'
  },
  description: {
    type: String,
    maxlength: 200
  },
  usageCount: {
    type: Number,
    default: 0
  },
  isSystemTag: {
    type: Boolean,
    default: false
  },
  metadata: {
    aiGenerated: {
      type: Boolean,
      default: false
    },
    lastUsed: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
tagSchema.index({ userId: 1, name: 1 }, { unique: true });
tagSchema.index({ userId: 1, category: 1 });
tagSchema.index({ userId: 1, usageCount: -1 });

// Pre-save middleware to normalize tag name
tagSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.name = this.name.toLowerCase().trim();
  }
  next();
});

// Instance method to increment usage count
tagSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.metadata.lastUsed = new Date();
  return this.save();
};

// Static method to get popular tags for a student
tagSchema.statics.getPopularTags = function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ usageCount: -1 })
    .limit(limit);
};

// Static method to get tags by category
tagSchema.statics.getTagsByCategory = function(userId, category) {
  return this.find({ userId, category })
    .sort({ usageCount: -1 });
};

// Static method to search tags
tagSchema.statics.searchTags = function(userId, searchTerm) {
  return this.find({
    userId,
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } }
    ]
  }).sort({ usageCount: -1 });
};

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;
