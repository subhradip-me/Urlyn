const mongoose = require('mongoose');

const plannerEntrySchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'profileType'
  },
  profileType: {
    type: String,
    required: true,
    enum: ['StudentProfile', 'CreatorProfile', 'WorkingProfile']
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    default: null
  },
  type: {
    type: String,
    required: true,
    enum: ['study', 'work', 'content', 'meeting', 'reminder', 'deadline']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  scheduledFor: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  location: {
    type: String,
    trim: true
  },
  attendees: [{
    email: String,
    name: String,
    status: {
      type: String,
      enum: ['invited', 'accepted', 'declined', 'tentative'],
      default: 'invited'
    }
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  reminderMinutes: {
    type: Number,
    default: 15
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: null
  },
  recurringEndDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
plannerEntrySchema.index({ profileId: 1, scheduledFor: 1 });
plannerEntrySchema.index({ profileId: 1, type: 1 });
plannerEntrySchema.index({ scheduledFor: 1, status: 1 });
plannerEntrySchema.index({ taskId: 1 });
plannerEntrySchema.index({ noteId: 1 });

// Virtual for end time
plannerEntrySchema.virtual('endTime').get(function() {
  if (!this.scheduledFor || !this.duration) return null;
  return new Date(this.scheduledFor.getTime() + (this.duration * 60 * 1000));
});

module.exports = mongoose.model('PlannerEntry', plannerEntrySchema);
