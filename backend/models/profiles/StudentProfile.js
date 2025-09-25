const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courses: [{
    type: String,
    trim: true,
    maxlength: [100, 'Course name cannot exceed 100 characters']
  }],
  academicYear: {
    type: String,
    trim: true
  },
  institution: {
    type: String,
    trim: true
  },
  major: {
    type: String,
    trim: true
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4
  },
  preferences: {
    studyReminders: {
      type: Boolean,
      default: true
    },
    dailyGoals: {
      type: Boolean,
      default: true
    },
    weeklyReview: {
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
studentProfileSchema.index({ userId: 1 });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
