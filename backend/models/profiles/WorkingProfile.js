const mongoose = require('mongoose');

const workingProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRole: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    default: 'entry'
  },
  skills: [{
    type: String,
    trim: true
  }],
  workingHours: {
    start: String, // "09:00"
    end: String,   // "17:00"
    timezone: String
  },
  preferences: {
    taskReminders: {
      type: Boolean,
      default: true
    },
    meetingNotifications: {
      type: Boolean,
      default: true
    },
    weeklyReports: {
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
workingProfileSchema.index({ userId: 1 });

module.exports = mongoose.model('WorkingProfile', workingProfileSchema);
