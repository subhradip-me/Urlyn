import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  persona: {
    type: String,
    enum: ['student', 'creator', 'professional'],
    required: [true, 'Persona is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    trim: true,
    maxlength: [50, 'Tag name cannot exceed 50 characters']
  },
  color: {
    type: String,
    default: '#3B82F6',
    validate: {
      validator: function(v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Color must be a valid hex color code'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isSystemTag: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for user + persona + tag name uniqueness
tagSchema.index({ userId: 1, persona: 1, name: 1 }, { unique: true });
tagSchema.index({ userId: 1, persona: 1, usageCount: -1 });
tagSchema.index({ userId: 1, persona: 1, createdAt: -1 });

// Virtual for calculating popularity
tagSchema.virtual('popularity').get(function() {
  if (this.usageCount === 0) return 'new';
  if (this.usageCount < 5) return 'low';
  if (this.usageCount < 20) return 'medium';
  return 'high';
});

const Tag = mongoose.models.Tag || mongoose.model('Tag', tagSchema);
export default Tag;
