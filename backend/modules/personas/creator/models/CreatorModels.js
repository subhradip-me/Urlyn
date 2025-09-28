import mongoose from 'mongoose';

// Creator-specific models
const contentProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['creator'],
    required: true,
    default: 'creator'
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
  type: {
    type: String,
    enum: ['video', 'blog-post', 'podcast', 'social-media', 'course', 'ebook', 'newsletter', 'other'],
    required: true
  },
  platform: {
    type: String,
    enum: ['youtube', 'instagram', 'tiktok', 'twitter', 'linkedin', 'medium', 'substack', 'own-website', 'other']
  },
  status: {
    type: String,
    enum: ['idea', 'planning', 'in-progress', 'review', 'published', 'archived'],
    default: 'idea'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  targetAudience: {
    type: String,
    trim: true
  },
  keywords: [String],
  plannedPublishDate: Date,
  actualPublishDate: Date,
  contentUrl: String,
  analytics: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    lastUpdated: Date
  },
  resources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoreBookmark'
  }],
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  collaborators: [{
    name: String,
    role: String,
    contact: String
  }],
  monetization: {
    revenue: Number,
    sponsorships: [{
      company: String,
      amount: Number,
      currency: String,
      startDate: Date,
      endDate: Date
    }]
  }
}, {
  timestamps: true
});

const contentCalendarSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['creator'],
    required: true,
    default: 'creator'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CreatorProject'
  },
  platform: String,
  contentType: String,
  scheduledDate: {
    type: Date,
    required: true
  },
  actualPublishDate: Date,
  status: {
    type: String,
    enum: ['scheduled', 'published', 'cancelled', 'postponed'],
    default: 'scheduled'
  },
  notes: String,
  hashtags: [String],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    interval: Number,
    endDate: Date
  }
}, {
  timestamps: true
});

const brandPartnershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['creator'],
    required: true,
    default: 'creator'
  },
  brandName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    name: String,
    email: String,
    phone: String
  },
  campaignName: String,
  type: {
    type: String,
    enum: ['sponsored-post', 'product-review', 'affiliate', 'ambassador', 'collaboration', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['inquiry', 'negotiating', 'agreed', 'in-progress', 'completed', 'cancelled'],
    default: 'inquiry'
  },
  compensation: {
    type: {
      type: String,
      enum: ['monetary', 'product', 'service', 'both']
    },
    amount: Number,
    currency: String,
    products: [String]
  },
  deliverables: [{
    description: String,
    deadline: Date,
    completed: { type: Boolean, default: false }
  }],
  contract: {
    signed: { type: Boolean, default: false },
    signedDate: Date,
    documentUrl: String
  },
  startDate: Date,
  endDate: Date,
  notes: String,
  contentCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CreatorProject'
  }]
}, {
  timestamps: true
});

// Indexes
contentProjectSchema.index({ userId: 1, persona: 1, status: 1 });
contentProjectSchema.index({ userId: 1, persona: 1, plannedPublishDate: 1 });
contentProjectSchema.index({ userId: 1, persona: 1, platform: 1 });

contentCalendarSchema.index({ userId: 1, persona: 1, scheduledDate: 1 });
contentCalendarSchema.index({ userId: 1, persona: 1, status: 1 });

brandPartnershipSchema.index({ userId: 1, persona: 1, status: 1 });
brandPartnershipSchema.index({ userId: 1, persona: 1, startDate: 1 });

const CreatorProject = mongoose.model('CreatorProject', contentProjectSchema);
const CreatorCalendar = mongoose.model('CreatorCalendar', contentCalendarSchema);
const CreatorPartnership = mongoose.model('CreatorPartnership', brandPartnershipSchema);

export { CreatorProject, CreatorCalendar, CreatorPartnership };
