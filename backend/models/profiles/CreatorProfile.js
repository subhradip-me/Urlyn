const mongoose = require('mongoose');

const creatorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projects: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'completed', 'on-hold'],
      default: 'planning'
    },
    startDate: Date,
    endDate: Date
  }],
  contentTypes: [{
    type: String,
    enum: ['blog', 'video', 'podcast', 'social', 'newsletter', 'course'],
    default: 'blog'
  }],
  platforms: [{
    name: String,
    url: String,
    followers: Number
  }],
  preferences: {
    contentReminders: {
      type: Boolean,
      default: true
    },
    analyticsTracking: {
      type: Boolean,
      default: true
    },
    collaborationMode: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
creatorProfileSchema.index({ userId: 1 });

module.exports = mongoose.model('CreatorProfile', creatorProfileSchema);
