import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  persona: {
    type: String,
    enum: ['student', 'creator', 'professional', 'entrepreneur', 'researcher'],
    required: [true, 'Persona is required'],
    index: true
  },
  folderIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder'
  }],
  tagIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\//.test(v);
      },
      message: 'Please provide a valid URL starting with http:// or https://'
    }
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  shortUrl: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  clicks: {
    type: Number,
    default: 0,
    min: 0
  },
  favicon: {
    type: String,
    trim: true
  },
  metadata: {
    domain: String,
    image: String,
    author: String,
    publishedDate: Date,
    readingTime: Number,
    contentType: String,
    language: String
  },
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
  lastVisited: {
    type: Date,
    default: null
  },
  visitCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries (updated for persona-specific data)
bookmarkSchema.index({ userId: 1, persona: 1, isArchived: 1, createdAt: -1 });
bookmarkSchema.index({ userId: 1, persona: 1, folderIds: 1 });
bookmarkSchema.index({ userId: 1, persona: 1, tagIds: 1 });
bookmarkSchema.index({ url: 1, userId: 1, persona: 1 }, { unique: true });
bookmarkSchema.index({ shortUrl: 1 }, { sparse: true });
bookmarkSchema.index({ clicks: -1 });
bookmarkSchema.index({ persona: 1, createdAt: -1 });

// Virtual for domain extraction
bookmarkSchema.virtual('domain').get(function() {
  try {
    return new URL(this.url).hostname;
  } catch {
    return '';
  }
});

// Virtual for folder names (populated by services)
bookmarkSchema.virtual('folderNames').get(function() {
  return [];
});

// Virtual for tag names (populated by services)
bookmarkSchema.virtual('tagNames').get(function() {
  return [];
});

const CoreBookmark = mongoose.models.CoreBookmark || mongoose.model('CoreBookmark', bookmarkSchema);
export default CoreBookmark;
