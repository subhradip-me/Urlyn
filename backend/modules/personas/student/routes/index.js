import express from 'express';
import { protect, requireCurrentPersona } from '../../../shared/middleware/authMiddleware.js';

// Import student-specific routes
import assignmentRoutes from './assignmentRoutes.js';
import courseRoutes from './courseRoutes.js';
import studySessionRoutes from './studySessionRoutes.js';
import bookmarksRoutes from './bookmarksRoutes.js';
import foldersRoutes from './foldersRoutes.js';
import tagsRoutes from './tagsRoutes.js';
import notesRoutes from './notesRoutes.js';

const router = express.Router();

// Apply authentication and persona validation
router.use(protect);

// For development: skip persona validation
if (process.env.NODE_ENV !== 'development') {
  router.use(requireCurrentPersona('student'));
} else {
  // Development middleware to ensure student persona
  router.use(async (req, res, next) => {
    // If user doesn't exist or doesn't have student persona, set it
    if (!req.user) {
      req.user = {
        _id: '68d0e521d89923fb4cf80d54',
        email: 'test@example.com',
        personas: ['student', 'professional', 'creator', 'entrepreneur', 'researcher'],
        currentPersona: 'student'
      };
    } else if (req.user.currentPersona !== 'student') {
      // Override current persona for development
      req.user.currentPersona = 'student';
    }
    next();
  });
}

// Student-specific routes
router.use('/assignments', assignmentRoutes);
router.use('/courses', courseRoutes);
router.use('/study-sessions', studySessionRoutes);

// Core feature routes (student context)
router.use('/bookmarks', bookmarksRoutes);
router.use('/folders', foldersRoutes);
router.use('/tags', tagsRoutes);
router.use('/notes', notesRoutes);

// Student persona info
router.get('/info', (req, res) => {
  res.json({
    persona: 'student',
    features: [
      'assignments',
      'courses', 
      'study-sessions',
      'bookmarks',
      'folders',
      'notes',
      'tags'
    ],
    description: 'Student persona with academic-focused features'
  });
});

export default router;
