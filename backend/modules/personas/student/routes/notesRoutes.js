import express from 'express';
const router = express.Router();
import * as notesController from '../../controllers/student/notesController.js';
import { protect } from '../../middlewares/authMiddleware.js';

// Apply auth middleware to all routes
router.use(protect);

// Specific routes first (before parameterized routes)
// Note sharing and collaboration  
router.get('/shared/all', notesController.getSharedNotes);

// AI-powered note features
router.get('/ai', notesController.getAINotes);
router.post('/ai/generate', notesController.generateAINote);
router.post('/:id/ai/enhance', notesController.enhanceWithAI);
router.post('/:id/ai/summarize', notesController.summarizeNote);

// Note CRUD operations (parameterized routes last)
router.get('/', notesController.getNotes);
router.post('/', notesController.createNote);
router.get('/:id', notesController.getNoteById);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

// More specific sharing routes
router.post('/:id/share', notesController.shareNote);
router.post('/:id/collaborate', notesController.addCollaborator);
router.delete('/:id/collaborate/:userId', notesController.removeCollaborator);

// Note organization
router.post('/:id/archive', notesController.archiveNote);
router.post('/:id/unarchive', notesController.unarchiveNote);
router.post('/:id/reminder', notesController.setReminder);

export default router;
