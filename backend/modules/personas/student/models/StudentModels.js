import mongoose from 'mongoose';

// Student-specific models
const assignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['student'],
    required: true,
    default: 'student'
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentCourse'
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['essay', 'project', 'exam', 'homework', 'presentation', 'research', 'other'],
    default: 'homework'
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'submitted', 'graded'],
    default: 'not-started'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    required: true
  },
  submittedAt: Date,
  gradedAt: Date,
  grade: {
    score: Number,
    maxScore: Number,
    letterGrade: String,
    feedback: String
  },
  resources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoreBookmark'
  }],
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  estimatedHours: Number,
  actualHours: Number,
  reminderSettings: {
    enabled: { type: Boolean, default: true },
    intervals: [Number] // Hours before due date
  }
}, {
  timestamps: true
});

const courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['student'],
    required: true,
    default: 'student'
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  code: {
    type: String,
    trim: true,
    maxlength: 20
  },
  instructor: {
    type: String,
    trim: true,
    maxlength: 100
  },
  credits: {
    type: Number,
    min: 0,
    max: 10
  },
  semester: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  schedule: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    startTime: String,
    endTime: String,
    location: String,
    type: {
      type: String,
      enum: ['lecture', 'lab', 'seminar', 'tutorial'],
      default: 'lecture'
    }
  }],
  syllabus: {
    url: String,
    uploadDate: Date
  },
  currentGrade: {
    score: Number,
    letterGrade: String,
    percentage: Number
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#3B82F6'
  }
}, {
  timestamps: true
});

const studySessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['student'],
    required: true,
    default: 'student'
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentCourse'
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentAssignment'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: String,
  duration: {
    planned: Number, // in minutes
    actual: Number
  },
  startTime: Date,
  endTime: Date,
  location: String,
  studyMethod: {
    type: String,
    enum: ['reading', 'note-taking', 'practice-problems', 'flashcards', 'group-study', 'online-course', 'other']
  },
  productivity: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: String,
  resources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoreBookmark'
  }],
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
assignmentSchema.index({ userId: 1, persona: 1, dueDate: 1 });
assignmentSchema.index({ userId: 1, persona: 1, status: 1 });
assignmentSchema.index({ userId: 1, persona: 1, priority: 1 });

courseSchema.index({ userId: 1, persona: 1, semester: 1, year: 1 });
courseSchema.index({ userId: 1, persona: 1, isArchived: 1 });

studySessionSchema.index({ userId: 1, persona: 1, startTime: -1 });
studySessionSchema.index({ userId: 1, persona: 1, isCompleted: 1 });

const StudentAssignment = mongoose.model('StudentAssignment', assignmentSchema);
const StudentCourse = mongoose.model('StudentCourse', courseSchema);
const StudentStudySession = mongoose.model('StudentStudySession', studySessionSchema);

export { StudentAssignment, StudentCourse, StudentStudySession };
