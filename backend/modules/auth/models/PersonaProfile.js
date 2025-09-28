import mongoose from 'mongoose';

const personaProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  persona: {
    type: String,
    enum: ['student', 'creator', 'professional', 'entrepreneur', 'researcher'],
    required: true
  },
  
  // Common profile fields for all personas
  bio: {
    type: String,
    maxlength: 500,
    trim: true
  },
  avatar: {
    type: String, // URL to persona-specific avatar
    default: null
  },
  displayName: {
    type: String, // Persona-specific display name (optional, defaults to user's full name)
    maxlength: 100,
    trim: true
  },
  
  // Persona-specific fields
  // Student Profile
  studentData: {
    institution: {
      type: String,
      maxlength: 200,
      trim: true
    },
    major: {
      type: String,
      maxlength: 100,
      trim: true
    },
    year: {
      type: Number,
      min: 1,
      max: 8
    },
    studentId: {
      type: String,
      maxlength: 50,
      trim: true
    },
    gpa: {
      type: Number,
      min: 0,
      max: 4
    },
    graduationYear: Number,
    interests: [String], // Academic interests
    goals: [String] // Learning goals
  },
  
  // Creator Profile
  creatorData: {
    niche: {
      type: String,
      maxlength: 100,
      trim: true
    },
    socialLinks: {
      youtube: String,
      twitter: String,
      instagram: String,
      tiktok: String,
      linkedin: String,
      website: String,
      podcast: String
    },
    contentCategories: [String],
    monetizationEnabled: {
      type: Boolean,
      default: false
    },
    platforms: [String], // Platforms they create on
    audience: {
      size: Number,
      demographics: String
    },
    contentSchedule: String,
    brandPartnershipEnabled: {
      type: Boolean,
      default: false
    }
  },
  
  // Professional Profile  
  professionalData: {
    company: {
      type: String,
      maxlength: 200,
      trim: true
    },
    position: {
      type: String,
      maxlength: 200,
      trim: true
    },
    industry: {
      type: String,
      maxlength: 100,
      trim: true
    },
    department: String,
    skills: [String],
    experience: {
      years: Number,
      level: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'executive', 'c-level']
      }
    },
    certifications: [{
      name: String,
      issuingOrganization: String,
      issueDate: Date,
      expirationDate: Date,
      credentialId: String
    }],
    achievements: [String],
    workLocation: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite']
    },
    availability: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'consulting']
    }
  },
  
  // Entrepreneur Profile
  entrepreneurData: {
    companyName: String,
    companyStage: {
      type: String,
      enum: ['idea', 'mvp', 'startup', 'growth', 'mature', 'exit']
    },
    industry: String,
    foundedDate: Date,
    employees: Number,
    funding: {
      stage: {
        type: String,
        enum: ['bootstrapped', 'pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'ipo']
      },
      amount: Number,
      currency: String
    },
    businessModel: String,
    markets: [String],
    mentors: [String],
    advisors: [String],
    lookingFor: [String], // What they're seeking (funding, partners, etc.)
    achievements: [String]
  },
  
  // Researcher Profile
  researcherData: {
    institution: String,
    department: String,
    position: {
      type: String,
      enum: ['undergraduate', 'graduate-student', 'phd-candidate', 'postdoc', 'assistant-professor', 'associate-professor', 'professor', 'research-scientist']
    },
    researchAreas: [String],
    publications: [{
      title: String,
      journal: String,
      year: Number,
      doi: String,
      citations: Number
    }],
    grants: [{
      title: String,
      agency: String,
      amount: Number,
      startDate: Date,
      endDate: Date
    }],
    collaborations: [String],
    labWebsite: String,
    orcidId: String,
    researchGateProfile: String,
    googleScholarProfile: String
  },
  
  // Persona-specific preferences and settings
  preferences: {
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'contacts-only', 'persona-specific'],
        default: 'public'
      },
      showEmail: {
        type: Boolean,
        default: false
      },
      allowMessages: {
        type: Boolean,
        default: true
      }
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      digest: {
        frequency: {
          type: String,
          enum: ['daily', 'weekly', 'monthly', 'never'],
          default: 'weekly'
        }
      }
    },
    features: {
      // Persona-specific feature toggles
      enableAIRecommendations: {
        type: Boolean,
        default: true
      },
      enableCollaboration: {
        type: Boolean,
        default: true
      },
      enablePublicProfile: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Profile completion and verification
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationBadges: [String], // e.g., ['email-verified', 'student-verified', 'professional-verified']
  
  // Activity tracking
  lastActiveAt: {
    type: Date,
    default: Date.now
  },
  profileViews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for efficient user-persona queries
personaProfileSchema.index({ userId: 1, persona: 1 }, { unique: true });
personaProfileSchema.index({ persona: 1, isVerified: 1 });
personaProfileSchema.index({ userId: 1, lastActiveAt: -1 });

// Middleware to calculate completion percentage
personaProfileSchema.pre('save', function(next) {
  this.completionPercentage = this.calculateCompletionPercentage();
  next();
});

// Method to calculate profile completion percentage
personaProfileSchema.methods.calculateCompletionPercentage = function() {
  let totalFields = 5; // bio, avatar, displayName + 2 persona-specific required fields
  let completedFields = 0;
  
  // Common fields
  if (this.bio && this.bio.trim()) completedFields++;
  if (this.avatar) completedFields++;
  if (this.displayName && this.displayName.trim()) completedFields++;
  
  // Persona-specific completion calculation
  switch (this.persona) {
    case 'student':
      if (this.studentData.institution) completedFields++;
      if (this.studentData.major) completedFields++;
      break;
    case 'creator':
      if (this.creatorData.niche) completedFields++;
      if (this.creatorData.contentCategories && this.creatorData.contentCategories.length > 0) completedFields++;
      break;
    case 'professional':
      if (this.professionalData.company) completedFields++;
      if (this.professionalData.position) completedFields++;
      break;
    case 'entrepreneur':
      if (this.entrepreneurData.companyName) completedFields++;
      if (this.entrepreneurData.industry) completedFields++;
      break;
    case 'researcher':
      if (this.researcherData.institution) completedFields++;
      if (this.researcherData.researchAreas && this.researcherData.researchAreas.length > 0) completedFields++;
      break;
  }
  
  return Math.round((completedFields / totalFields) * 100);
};

// Method to get persona-specific data
personaProfileSchema.methods.getPersonaData = function() {
  switch (this.persona) {
    case 'student':
      return this.studentData;
    case 'creator':
      return this.creatorData;
    case 'professional':
      return this.professionalData;
    case 'entrepreneur':
      return this.entrepreneurData;
    case 'researcher':
      return this.researcherData;
    default:
      return null;
  }
};

// Static method to find or create persona profile
personaProfileSchema.statics.findOrCreatePersonaProfile = async function(userId, persona) {
  let profile = await this.findOne({ userId, persona });
  
  if (!profile) {
    profile = await this.create({
      userId,
      persona,
      preferences: {
        privacy: { profileVisibility: 'public' },
        notifications: { email: true, push: true },
        features: { 
          enableAIRecommendations: true,
          enableCollaboration: true,
          enablePublicProfile: true 
        }
      }
    });
  }
  
  return profile;
};

// Remove sensitive data from JSON output
personaProfileSchema.methods.toJSON = function() {
  const profileObject = this.toObject();
  
  // Don't expose internal fields
  delete profileObject.__v;
  
  return profileObject;
};

const PersonaProfile = mongoose.model('PersonaProfile', personaProfileSchema);
export default PersonaProfile;
