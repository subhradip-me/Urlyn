import express from 'express';
import { protect, requireCurrentPersona } from '../../middlewares/authMiddleware.js';
import User from '../../models/common/User.js';

// Import sub-routes
import bookmarksRoutes from './bookmarksRoutes.js';
import tagsRoutes from './tagsRoutes.js';
import foldersRoutes from './foldersRoutes.js';
import notesRoutes from './notesRoutes.js';

const router = express.Router();

// Apply authentication middleware to all routes
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

// Sub-routes - all student functionality is now modular
router.use('/bookmarks', bookmarksRoutes);
router.use('/tags', tagsRoutes);
router.use('/folders', foldersRoutes);
router.use('/notes', notesRoutes);

export default router;
