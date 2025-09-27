import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  // Multi-persona support - users can access all personas
  personas: [{
    type: String,
    enum: ['student', 'creator', 'professional', 'entrepreneur', 'researcher']
  }],
  currentPersona: {
    type: String,
    enum: ['student', 'creator', 'professional', 'entrepreneur', 'researcher'],
    default: null
  },
  profilePicture: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  // Persona-specific profiles
  studentProfile: {
    institution: String,
    major: String,
    year: Number,
    studentId: String,
    bookmarks: [{
      id: String,
      title: String,
      url: String,
      description: String,
      category: String,
      folder: String,
      tags: [String],
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }],
    folders: [{
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      name: { type: String, required: true },
      description: { type: String, default: '' },
      color: { type: String, default: '#3B82F6' },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }],
    notes: [{
      id: String,
      title: String,
      content: String,
      subject: String,
      tags: [String],
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }]
  },
  creatorProfile: {
    bio: String,
    socialLinks: {
      youtube: String,
      twitter: String,
      instagram: String,
      website: String
    },
    contentCategories: [String],
    monetizationEnabled: { type: Boolean, default: false }
  },
  professionalProfile: {
    company: String,
    position: String,
    industry: String,
    skills: [String],
    experience: Number
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'contacts'],
        default: 'public'
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ personas: 1 });
userSchema.index({ currentPersona: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add persona to user
userSchema.methods.addPersona = function(persona) {
  if (!this.personas.includes(persona)) {
    this.personas.push(persona);
    if (!this.currentPersona) {
      this.currentPersona = persona;
    }
  }
  return this.save();
};

// Switch persona
userSchema.methods.switchPersona = function(persona) {
  if (this.personas.includes(persona)) {
    this.currentPersona = persona;
    return this.save();
  }
  throw new Error('User does not have access to this persona');
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Get current persona profile
userSchema.virtual('currentProfile').get(function() {
  if (!this.currentPersona) return null;
  
  switch (this.currentPersona) {
    case 'student':
      return this.studentProfile;
    case 'creator':
      return this.creatorProfile;
    case 'professional':
      return this.professionalProfile;
    default:
      return null;
  }
});

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  return userObject;
};

const User = mongoose.model('User', userSchema);
export default User;
