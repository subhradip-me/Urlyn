import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Core authentication and account information
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
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  
  // Multi-persona support - users can have multiple personas
  personas: [{
    type: String,
    enum: ['student', 'creator', 'professional', 'entrepreneur', 'researcher'],
    required: true
  }],
  currentPersona: {
    type: String,
    enum: ['student', 'creator', 'professional', 'entrepreneur', 'researcher'],
    default: null
  },
  
  // Account verification and security
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  
  // Global preferences (not persona-specific)
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Terms acceptance and privacy
  termsAcceptedAt: Date,
  privacyAcceptedAt: Date
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

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ personas: 1 });
userSchema.index({ currentPersona: 1 });
userSchema.index({ isActive: 1 });

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
    return true;
  }
  return false;
};

// Switch persona
userSchema.methods.switchPersona = function(persona) {
  if (this.personas.includes(persona)) {
    this.currentPersona = persona;
    return this.save();
  }
  throw new Error('User does not have access to this persona');
};

// Remove persona
userSchema.methods.removePersona = function(persona) {
  const index = this.personas.indexOf(persona);
  if (index > -1) {
    this.personas.splice(index, 1);
    // If removing current persona, switch to first available
    if (this.currentPersona === persona) {
      this.currentPersona = this.personas.length > 0 ? this.personas[0] : null;
    }
    return true;
  }
  return false;
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
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

// Ensure virtual fields are included
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);
export default User;
