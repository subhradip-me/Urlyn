import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
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
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  favicon: {
    type: String,
    trim: true,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    enum: ['academic', 'research', 'tools', 'tutorials', 'reference', 'news', 'entertainment', 'other'],
    default: 'other'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null
  },
  folder: {
    type: String,
    trim: true,
    default: 'General'
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  visitCount: {
    type: Number,
    default: 0
  },
  lastVisited: {
    type: Date,
    default: null
  },
  metadata: {
    domain: String,
    image: String,
    author: String,
    publishedDate: Date,
    readingTime: Number,
    contentType: String
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
bookmarkSchema.index({ student: 1, isArchived: 1 });
bookmarkSchema.index({ student: 1, category: 1 });
bookmarkSchema.index({ student: 1, folder: 1 });
bookmarkSchema.index({ student: 1, folderId: 1 });
bookmarkSchema.index({ student: 1, tags: 1 });
bookmarkSchema.index({ url: 1, student: 1 }, { unique: true });

// Virtual for domain extraction
bookmarkSchema.virtual('domain').get(function() {
  try {
    return new URL(this.url).hostname;
  } catch (error) {
    return null;
  }
});

// Method to increment visit count
bookmarkSchema.methods.recordVisit = function() {
  this.visitCount += 1;
  this.lastVisited = new Date();
  return this.save();
};

// Static method to get bookmark statistics
bookmarkSchema.statics.getStudentStats = async function(studentId) {
  const stats = await this.aggregate([
    { $match: { student: mongoose.Types.ObjectId(studentId), isArchived: false } },
    {
      $group: {
        _id: null,
        totalBookmarks: { $sum: 1 },
        totalVisits: { $sum: '$visitCount' },
        categories: { $addToSet: '$category' },
        folders: { $addToSet: '$folder' },
        avgVisitsPerBookmark: { $avg: '$visitCount' }
      }
    }
  ]);
  
  return stats[0] || {
    totalBookmarks: 0,
    totalVisits: 0,
    categories: [],
    folders: [],
    avgVisitsPerBookmark: 0
  };
};

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;
