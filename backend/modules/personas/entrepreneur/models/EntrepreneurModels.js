import mongoose from 'mongoose';

// Entrepreneur-specific models

const startupProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['entrepreneur'],
    required: true,
    default: 'entrepreneur'
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
  stage: {
    type: String,
    enum: ['idea', 'validation', 'mvp', 'launch', 'growth', 'scale', 'exit'],
    default: 'idea'
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  businessModel: {
    type: String,
    enum: ['b2b', 'b2c', 'b2b2c', 'marketplace', 'saas', 'subscription', 'freemium', 'other'],
    required: true
  },
  targetMarket: {
    size: String,
    demographics: String,
    geography: [String],
    painPoints: [String]
  },
  valueProposition: {
    type: String,
    maxlength: 500,
    trim: true
  },
  competitiveAdvantage: {
    type: String,
    maxlength: 500,
    trim: true
  },
  founders: [{
    name: String,
    role: String,
    equity: Number,
    linkedin: String
  }],
  team: [{
    name: String,
    role: String,
    department: String,
    equity: Number,
    salary: Number,
    joinDate: Date
  }],
  funding: {
    stage: {
      type: String,
      enum: ['bootstrapped', 'pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'ipo']
    },
    totalRaised: { type: Number, default: 0 },
    currentRound: {
      amount: Number,
      currency: String,
      investors: [String],
      valuation: Number,
      closingDate: Date
    },
    investors: [{
      name: String,
      type: {
        type: String,
        enum: ['angel', 'vc', 'corporate', 'government', 'crowdfunding']
      },
      amount: Number,
      investmentDate: Date,
      equity: Number
    }],
    burnRate: Number, // Monthly burn
    runway: Number // Months
  },
  metrics: {
    revenue: {
      monthly: Number,
      annual: Number,
      growth: Number // Percentage
    },
    users: {
      total: Number,
      active: Number,
      growth: Number
    },
    other: [{
      name: String,
      value: Number,
      unit: String
    }]
  },
  milestones: [{
    title: String,
    description: String,
    targetDate: Date,
    completed: { type: Boolean, default: false },
    completedDate: Date,
    impact: String
  }],
  resources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoreBookmark'
  }],
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const investorRelationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['entrepreneur'],
    required: true,
    default: 'entrepreneur'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  firm: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['angel', 'vc', 'corporate-vc', 'family-office', 'government', 'accelerator'],
    required: true
  },
  focusAreas: [String],
  stagePreference: [String],
  checkSize: {
    min: Number,
    max: Number,
    currency: String
  },
  contact: {
    email: String,
    phone: String,
    linkedin: String,
    twitter: String
  },
  relationship: {
    type: String,
    enum: ['prospect', 'introduced', 'pitched', 'due-diligence', 'invested', 'passed'],
    default: 'prospect'
  },
  interactions: [{
    date: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['email', 'call', 'meeting', 'pitch', 'due-diligence', 'other']
    },
    notes: String,
    outcome: String
  }],
  pitchHistory: [{
    date: Date,
    stage: String,
    feedback: String,
    nextSteps: String,
    documents: [String]
  }],
  investment: {
    amount: Number,
    currency: String,
    equity: Number,
    valuation: Number,
    investmentDate: Date,
    boardSeat: Boolean
  },
  notes: String,
  tags: [String],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

const businessPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['entrepreneur'],
    required: true,
    default: 'entrepreneur'
  },
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EntrepreneurStartup'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  sections: {
    executiveSummary: String,
    companyDescription: String,
    marketAnalysis: String,
    organization: String,
    serviceOffering: String,
    marketingStrategy: String,
    fundingRequest: String,
    financialProjections: String,
    appendix: String
  },
  financials: {
    projections: [{
      year: Number,
      revenue: Number,
      expenses: Number,
      profit: Number
    }],
    assumptions: [String],
    fundingNeeds: {
      amount: Number,
      purpose: String,
      timeline: String
    }
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'final', 'archived'],
    default: 'draft'
  },
  sharedWith: [{
    email: String,
    permissions: {
      type: String,
      enum: ['read', 'comment', 'edit'],
      default: 'read'
    },
    sharedDate: Date
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: Date
  }]
}, {
  timestamps: true
});

// Indexes
startupProjectSchema.index({ userId: 1, persona: 1, stage: 1 });
startupProjectSchema.index({ userId: 1, persona: 1, isActive: 1 });

investorRelationSchema.index({ userId: 1, persona: 1, relationship: 1 });
investorRelationSchema.index({ userId: 1, persona: 1, type: 1 });

businessPlanSchema.index({ userId: 1, persona: 1, status: 1 });
businessPlanSchema.index({ userId: 1, persona: 1, startupId: 1 });

const EntrepreneurStartup = mongoose.model('EntrepreneurStartup', startupProjectSchema);
const EntrepreneurInvestor = mongoose.model('EntrepreneurInvestor', investorRelationSchema);
const EntrepreneurBusinessPlan = mongoose.model('EntrepreneurBusinessPlan', businessPlanSchema);

export { EntrepreneurStartup, EntrepreneurInvestor, EntrepreneurBusinessPlan };
