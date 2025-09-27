import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
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
    required: [true, 'Folder name is required'],
    trim: true,
    maxlength: [100, 'Folder name cannot exceed 100 characters']
  },
  icon: {
    type: String,
    default: '📂',
    maxlength: [10, 'Icon cannot exceed 10 characters']
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
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  parentFolderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  isSystemFolder: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for user + persona + folder name uniqueness within same parent
folderSchema.index({ 
  userId: 1, 
  persona: 1,
  name: 1, 
  parentFolderId: 1 
}, { unique: true });

folderSchema.index({ userId: 1, persona: 1, parentFolderId: 1, sortOrder: 1 });
folderSchema.index({ userId: 1, persona: 1, createdAt: -1 });

// Virtual for getting item counts (will be calculated by services)
folderSchema.virtual('itemCounts').get(function() {
  return {
    bookmarks: 0,
    notes: 0,
    tasks: 0,
    total: 0
  };
});

// Virtual for subfolder check
folderSchema.virtual('hasSubfolders').get(function() {
  // This will be populated by services when needed
  return false;
});

const Folder = mongoose.model('Folder', folderSchema);
export default Folder;
