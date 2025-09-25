import Note from '../../models/core/Note.js';
import Tag from '../../models/core/Tag.js';
import User from '../../models/core/User.js';
import { sendSuccess, sendError } from '../../utils/responseHelpers.js';

// Get all notes for the user
const getNotes = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      tagId, 
      folderId, 
      priority, 
      isArchived = false,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = req.query;

    const userId = req.user.id;
    const query = { userId, isArchived: isArchived === 'true' };

    // Add filters
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (tagId) {
      query.tagIds = tagId;
    }

    if (folderId) {
      query.folderId = folderId;
    }

    if (priority) {
      query.priority = priority;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const notes = await Note.find(query)
      .populate('tagIds', 'name color emoji')
      .populate('folderId', 'name color')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Note.countDocuments(query);

    return sendSuccess(res, {
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Notes retrieved successfully');

  } catch (error) {
    console.error('Get notes error:', error);
    return sendError(res, 'Failed to retrieve notes', 500, error.message);
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, contentType = 'text', tagIds = [], folderId, priority = 'medium', isPublic = false } = req.body;

    if (!title || !content) {
      return sendError(res, 'Title and content are required', 400);
    }

    const note = new Note({
      userId,
      title,
      content,
      contentType,
      tagIds,
      folderId,
      priority,
      isPublic
    });

    await note.save();

    const populatedNote = await Note.findById(note._id)
      .populate('tagIds', 'name color emoji')
      .populate('folderId', 'name color');

    return sendSuccess(res, populatedNote, 'Note created successfully', 201);

  } catch (error) {
    console.error('Create note error:', error);
    return sendError(res, 'Failed to create note', 500, error.message);
  }
};

// Get a specific note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findOne({ _id: id, userId })
      .populate('tagIds', 'name color emoji')
      .populate('folderId', 'name color');

    if (!note) {
      return sendError(res, 'Note not found', 404);
    }

    return sendSuccess(res, note, 'Note retrieved successfully');

  } catch (error) {
    console.error('Get note by ID error:', error);
    return sendError(res, 'Failed to retrieve note', 500, error.message);
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    )
      .populate('tagIds', 'name color emoji')
      .populate('folderId', 'name color');

    if (!note) {
      return sendError(res, 'Note not found', 404);
    }

    return sendSuccess(res, note, 'Note updated successfully');

  } catch (error) {
    console.error('Update note error:', error);
    return sendError(res, 'Failed to update note', 500, error.message);
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findOneAndDelete({ _id: id, userId });

    if (!note) {
      return sendError(res, 'Note not found', 404);
    }

    return sendSuccess(res, { id }, 'Note deleted successfully');

  } catch (error) {
    console.error('Delete note error:', error);
    return sendError(res, 'Failed to delete note', 500, error.message);
  }
};

// Share a note (make it public or add collaborators)
const shareNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { isPublic = true, collaboratorEmails = [] } = req.body;

    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      return sendError(res, 'Note not found', 404);
    }

    note.isPublic = isPublic;

    // Add collaborators logic would go here
    // For now, just update the public status
    await note.save();

    return sendSuccess(res, note, 'Note sharing updated successfully');

  } catch (error) {
    console.error('Share note error:', error);
    return sendError(res, 'Failed to update note sharing', 500, error.message);
  }
};

// Get shared notes (public notes from other users)
const getSharedNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, search } = req.query;

    const query = { 
      isPublic: true, 
      userId: { $ne: userId }, // Exclude user's own notes
      isArchived: false 
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('tagIds', 'name color emoji')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Note.countDocuments(query);

    return sendSuccess(res, {
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Shared notes retrieved successfully');

  } catch (error) {
    console.error('Get shared notes error:', error);
    return sendError(res, 'Failed to retrieve shared notes', 500, error.message);
  }
};

// Add collaborator (placeholder for future implementation)
const addCollaborator = async (req, res) => {
  try {
    return sendSuccess(res, {}, 'Collaboration feature coming soon');
  } catch (error) {
    return sendError(res, 'Failed to add collaborator', 500, error.message);
  }
};

// Remove collaborator (placeholder for future implementation)
const removeCollaborator = async (req, res) => {
  try {
    return sendSuccess(res, {}, 'Collaboration feature coming soon');
  } catch (error) {
    return sendError(res, 'Failed to remove collaborator', 500, error.message);
  }
};

// Generate AI note using AI Helper
const generateAINote = async (req, res) => {
  try {
    const { prompt, type, subject, length } = req.body;
    if (!prompt || !type) return sendError(res, "Prompt and type are required", 400);

    const userId = req.user.id;
    const { generateAIContent } = await import('../../utils/AI-Helper/aiHelper.js');
    const { content, metadata } = await generateAIContent(type, prompt, subject, length);

    const newNote = new Note({
      userId,
      title: `AI ${type} on ${prompt}`,
      content,
      type: 'ai-generated',
      subject: subject || 'General',
      contentType: 'markdown',
      tagIds: [],
      priority: 'medium',
      isPublic: false,
      aiMetadata: metadata,
    });

    await newNote.save();

    const populatedNote = await Note.findById(newNote._id)
      .populate('tagIds', 'name color emoji')
      .populate('folderId', 'name color');

    return sendSuccess(res, { note: populatedNote }, "AI note generated successfully", 201);
  } catch (error) {
    console.error("Generate AI note error:", error);
    return sendError(res, "Failed to generate AI note", 500, error.message);
  }
};

// Enhance note with AI (placeholder)
const enhanceWithAI = async (req, res) => {
  try {
    return sendSuccess(res, {}, 'AI enhancement feature coming soon');
  } catch (error) {
    return sendError(res, 'Failed to enhance note with AI', 500, error.message);
  }
};

// Summarize note with AI
const summarizeNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findOne({ _id: id, userId });
    if (!note) return sendError(res, "Note not found", 404);

    const { generateAIContent } = await import('../../utils/AI-Helper/aiHelper.js');
    const { content, metadata } = await generateAIContent(
      "summary",
      note.content,
      "Note Content",
      "short"
    );

    return sendSuccess(res, { summary: content, metadata }, "Note summarized successfully");
  } catch (error) {
    console.error("Summarize note error:", error);
    return sendError(res, "Failed to summarize note", 500, error.message);
  }
};

// Get AI-generated notes
const getAINotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    // Query for notes with AI-generated type
    const query = { 
      userId, 
      isArchived: false,
      type: 'ai-generated'  // Look for AI-generated notes specifically
    };

    const notes = await Note.find(query)
      .populate('tagIds', 'name color emoji')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Note.countDocuments(query);

    return sendSuccess(res, {
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'AI notes retrieved successfully');

  } catch (error) {
    console.error('Get AI notes error:', error);
    return sendError(res, 'Failed to retrieve AI notes', 500, error.message);
  }
};

// Archive a note
const archiveNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      { isArchived: true },
      { new: true }
    );

    if (!note) {
      return sendError(res, 'Note not found', 404);
    }

    return sendSuccess(res, note, 'Note archived successfully');

  } catch (error) {
    console.error('Archive note error:', error);
    return sendError(res, 'Failed to archive note', 500, error.message);
  }
};

// Unarchive a note
const unarchiveNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      { isArchived: false },
      { new: true }
    );

    if (!note) {
      return sendError(res, 'Note not found', 404);
    }

    return sendSuccess(res, note, 'Note unarchived successfully');

  } catch (error) {
    console.error('Unarchive note error:', error);
    return sendError(res, 'Failed to unarchive note', 500, error.message);
  }
};

// Set reminder for a note
const setReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reminderDate } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      { reminderDate: reminderDate ? new Date(reminderDate) : null },
      { new: true }
    );

    if (!note) {
      return sendError(res, 'Note not found', 404);
    }

    return sendSuccess(res, note, reminderDate ? 'Reminder set successfully' : 'Reminder removed successfully');

  } catch (error) {
    console.error('Set reminder error:', error);
    return sendError(res, 'Failed to set reminder', 500, error.message);
  }
};

export {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  shareNote,
  getSharedNotes,
  addCollaborator,
  removeCollaborator,
  generateAINote,
  enhanceWithAI,
  summarizeNote,
  getAINotes,
  archiveNote,
  unarchiveNote,
  setReminder
};
