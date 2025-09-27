import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
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
  tagIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [50000, 'Content cannot exceed 50,000 characters']
  },
  contentType: {
    type: String,
    enum: ['text', 'markdown', 'html'],
    default: 'text'
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  reminderDate: {
    type: Date,
    default: null
  },
  wordCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 0 // in minutes
  },
  type: {
    type: String,
    enum: ['regular', 'shared', 'ai-generated'],
    default: 'regular'
  },
  aiMetadata: {
    model: String,
    prompt: String,
    confidence: Number,
    generationType: {
      type: String,
      enum: ['explanation', 'solution', 'breakdown', 'analysis', 'summary']
    }
  },
  metadata: mongoose.Schema.Types.Mixed // For additional flexible metadata
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries (updated for persona-specific data)
noteSchema.index({ userId: 1, persona: 1, isArchived: 1, updatedAt: -1 });
noteSchema.index({ userId: 1, persona: 1, folderId: 1 });
noteSchema.index({ userId: 1, persona: 1, tagIds: 1 });
noteSchema.index({ userId: 1, persona: 1, priority: 1 });
noteSchema.index({ userId: 1, persona: 1, type: 1 }); // Index for note type filtering
noteSchema.index({ reminderDate: 1 });
noteSchema.index({ persona: 1, createdAt: -1 });

// Virtual for content preview
noteSchema.virtual('preview').get(function() {
  if (!this.content) return '';
  return this.content.substring(0, 150) + (this.content.length > 150 ? '...' : '');
});

// Pre-save middleware to calculate word count and reading time
noteSchema.pre('save', function(next) {
  if (this.content) {
    const words = this.content.trim().split(/\s+/).length;
    this.wordCount = words;
    this.readingTime = Math.ceil(words / 200); // Assuming 200 words per minute
  }
  next();
});

const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
export default Note;
