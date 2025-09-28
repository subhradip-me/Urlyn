import mongoose from 'mongoose';

// Professional-specific models
const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['professional'],
    required: true,
    default: 'professional'
  },
  name: {
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
  client: {
    name: String,
    company: String,
    email: String,
    phone: String
  },
  type: {
    type: String,
    enum: ['client-work', 'internal', 'personal-development', 'side-project', 'research', 'other'],
    default: 'client-work'
  },
  status: {
    type: String,
    enum: ['proposal', 'active', 'on-hold', 'completed', 'cancelled'],
    default: 'proposal'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  budget: {
    amount: Number,
    currency: String,
    spent: { type: Number, default: 0 }
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    estimatedHours: Number,
    actualHours: { type: Number, default: 0 }
  },
  milestones: [{
    name: String,
    description: String,
    dueDate: Date,
    completed: { type: Boolean, default: false },
    completedDate: Date
  }],
  team: [{
    name: String,
    role: String,
    email: String
  }],
  skills: [String],
  technologies: [String],
  resources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoreBookmark'
  }],
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],
  invoicing: {
    rateType: {
      type: String,
      enum: ['hourly', 'fixed', 'milestone-based']
    },
    rate: Number,
    invoicesSent: Number,
    totalBilled: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

const networkContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['professional'],
    required: true,
    default: 'professional'
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  industry: String,
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: String,
  linkedin: String,
  twitter: String,
  website: String,
  location: {
    city: String,
    country: String
  },
  relationship: {
    type: String,
    enum: ['colleague', 'client', 'vendor', 'partner', 'mentor', 'mentee', 'peer', 'other'],
    default: 'peer'
  },
  connectionStrength: {
    type: String,
    enum: ['weak', 'medium', 'strong'],
    default: 'weak'
  },
  tags: [String],
  notes: String,
  lastInteraction: {
    date: Date,
    type: String,
    notes: String
  },
  interactions: [{
    date: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['email', 'phone', 'meeting', 'coffee', 'event', 'linkedin', 'other']
    },
    notes: String
  }],
  reminderSettings: {
    enabled: { type: Boolean, default: false },
    frequency: Number, // days
    nextReminder: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const skillDevelopmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['professional'],
    required: true,
    default: 'professional'
  },
  skillName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['technical', 'soft-skill', 'leadership', 'communication', 'management', 'other']
  },
  currentLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  targetLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  learningPlan: {
    resources: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CoreBookmark'
    }],
    courses: [String],
    books: [String],
    practiceProjects: [String],
    mentors: [String]
  },
  progress: [{
    date: { type: Date, default: Date.now },
    activity: String,
    notes: String,
    hoursSpent: Number
  }],
  milestones: [{
    description: String,
    targetDate: Date,
    completed: { type: Boolean, default: false },
    completedDate: Date
  }],
  certifications: [{
    name: String,
    provider: String,
    earnedDate: Date,
    url: String
  }],
  totalHoursSpent: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
projectSchema.index({ userId: 1, persona: 1, status: 1 });
projectSchema.index({ userId: 1, persona: 1, 'timeline.endDate': 1 });

networkContactSchema.index({ userId: 1, persona: 1, relationship: 1 });
networkContactSchema.index({ userId: 1, persona: 1, company: 1 });
networkContactSchema.index({ userId: 1, persona: 1, 'lastInteraction.date': -1 });

skillDevelopmentSchema.index({ userId: 1, persona: 1, isActive: 1 });
skillDevelopmentSchema.index({ userId: 1, persona: 1, priority: 1 });

const ProfessionalProject = mongoose.model('ProfessionalProject', projectSchema);
const ProfessionalContact = mongoose.model('ProfessionalContact', networkContactSchema);
const ProfessionalSkill = mongoose.model('ProfessionalSkill', skillDevelopmentSchema);

export { ProfessionalProject, ProfessionalContact, ProfessionalSkill };
