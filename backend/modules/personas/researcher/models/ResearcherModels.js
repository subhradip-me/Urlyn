import mongoose from 'mongoose';

// Researcher-specific models

const researchProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['researcher'],
    required: true,
    default: 'researcher'
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  abstract: {
    type: String,
    trim: true,
    maxlength: 3000
  },
  type: {
    type: String,
    enum: ['basic-research', 'applied-research', 'experimental', 'theoretical', 'review', 'meta-analysis', 'case-study'],
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'data-collection', 'analysis', 'writing', 'review', 'published', 'archived'],
    default: 'planning'
  },
  researchAreas: [String],
  keywords: [String],
  methodology: {
    type: String,
    enum: ['qualitative', 'quantitative', 'mixed-methods', 'experimental', 'observational', 'survey', 'other']
  },
  institution: {
    name: String,
    department: String,
    lab: String
  },
  funding: {
    grants: [{
      agency: String,
      title: String,
      amount: Number,
      currency: String,
      startDate: Date,
      endDate: Date,
      grantNumber: String,
      role: {
        type: String,
        enum: ['pi', 'co-pi', 'researcher', 'student']
      }
    }],
    totalFunding: { type: Number, default: 0 }
  },
  team: {
    principalInvestigator: {
      name: String,
      email: String,
      orcid: String
    },
    coInvestigators: [{
      name: String,
      email: String,
      institution: String,
      role: String,
      orcid: String
    }],
    students: [{
      name: String,
      level: {
        type: String,
        enum: ['undergraduate', 'masters', 'phd', 'postdoc']
      },
      role: String
    }]
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    milestones: [{
      title: String,
      description: String,
      dueDate: Date,
      completed: { type: Boolean, default: false },
      completedDate: Date
    }]
  },
  literature: [{
    title: String,
    authors: [String],
    journal: String,
    year: Number,
    doi: String,
    url: String,
    notes: String,
    relevance: {
      type: String,
      enum: ['high', 'medium', 'low']
    }
  }],
  data: {
    sources: [String],
    collections: [{
      name: String,
      type: String,
      size: String,
      location: String,
      accessLevel: {
        type: String,
        enum: ['public', 'restricted', 'private']
      }
    }],
    analysisTools: [String]
  },
  publications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResearcherPublication'
  }],
  collaborations: [{
    institution: String,
    researchers: [String],
    type: {
      type: String,
      enum: ['formal', 'informal', 'data-sharing', 'joint-funding']
    },
    description: String
  }],
  ethics: {
    approved: Boolean,
    approvalNumber: String,
    approvalDate: Date,
    expiryDate: Date,
    institution: String
  },
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

const publicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['researcher'],
    required: true,
    default: 'researcher'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResearcherProject'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  abstract: {
    type: String,
    trim: true,
    maxlength: 5000
  },
  authors: [{
    name: String,
    affiliation: String,
    email: String,
    orcid: String,
    isCorresponding: { type: Boolean, default: false },
    order: Number
  }],
  type: {
    type: String,
    enum: ['journal-article', 'conference-paper', 'book-chapter', 'book', 'patent', 'preprint', 'thesis', 'report'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under-review', 'accepted', 'published', 'rejected'],
    default: 'draft'
  },
  venue: {
    name: String, // Journal name or conference name
    type: {
      type: String,
      enum: ['journal', 'conference', 'workshop', 'symposium', 'book', 'other']
    },
    issn: String,
    isbn: String,
    impactFactor: Number,
    ranking: String
  },
  submission: {
    submittedDate: Date,
    manuscriptId: String,
    editorAssigned: Date,
    reviewerAssigned: Date,
    revisionRequested: Date,
    revisionSubmitted: Date,
    acceptedDate: Date,
    publishedDate: Date
  },
  publication: {
    volume: String,
    issue: String,
    pages: String,
    doi: String,
    url: String,
    pdfUrl: String,
    openAccess: Boolean
  },
  keywords: [String],
  subjects: [String],
  citations: {
    count: { type: Number, default: 0 },
    sources: [{
      title: String,
      authors: [String],
      year: Number,
      doi: String
    }],
    lastUpdated: Date
  },
  metrics: {
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    altmetricScore: Number,
    socialMediaMentions: Number
  },
  files: [{
    name: String,
    type: {
      type: String,
      enum: ['manuscript', 'supplementary', 'data', 'code', 'figures']
    },
    url: String,
    size: Number,
    uploadedAt: Date
  }],
  notes: String,
  tags: [String]
}, {
  timestamps: true
});

const collaborationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['researcher'],
    required: true,
    default: 'researcher'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['research-project', 'data-sharing', 'joint-publication', 'conference-organization', 'grant-application', 'peer-review'],
    required: true
  },
  status: {
    type: String,
    enum: ['proposed', 'negotiating', 'active', 'completed', 'cancelled'],
    default: 'proposed'
  },
  collaborators: [{
    name: String,
    email: String,
    institution: String,
    department: String,
    role: String,
    expertise: [String],
    orcid: String,
    contributions: String
  }],
  institutions: [{
    name: String,
    country: String,
    department: String,
    contactPerson: String
  }],
  scope: {
    researchAreas: [String],
    objectives: [String],
    deliverables: [String],
    timeline: String
  },
  agreements: {
    mou: {
      signed: Boolean,
      signedDate: Date,
      documentUrl: String
    },
    dataSharing: {
      agreement: Boolean,
      restrictions: String
    },
    ipRights: String,
    publications: String
  },
  communication: [{
    date: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['email', 'video-call', 'meeting', 'conference', 'workshop']
    },
    participants: [String],
    notes: String,
    actionItems: [String]
  }],
  resources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoreBookmark'
  }],
  outcomes: [{
    type: {
      type: String,
      enum: ['publication', 'dataset', 'software', 'patent', 'presentation', 'grant']
    },
    title: String,
    description: String,
    url: String,
    date: Date
  }]
}, {
  timestamps: true
});

// Indexes
researchProjectSchema.index({ userId: 1, persona: 1, status: 1 });
researchProjectSchema.index({ userId: 1, persona: 1, researchAreas: 1 });
researchProjectSchema.index({ userId: 1, persona: 1, 'timeline.endDate': 1 });

publicationSchema.index({ userId: 1, persona: 1, status: 1 });
publicationSchema.index({ userId: 1, persona: 1, type: 1 });
publicationSchema.index({ userId: 1, persona: 1, 'submission.publishedDate': -1 });

collaborationSchema.index({ userId: 1, persona: 1, status: 1 });
collaborationSchema.index({ userId: 1, persona: 1, type: 1 });

const ResearcherProject = mongoose.model('ResearcherProject', researchProjectSchema);
const ResearcherPublication = mongoose.model('ResearcherPublication', publicationSchema);
const ResearcherCollaboration = mongoose.model('ResearcherCollaboration', collaborationSchema);

export { ResearcherProject, ResearcherPublication, ResearcherCollaboration };
