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
// For development: temporarily bypass authentication
if (process.env.NODE_ENV !== 'development') {
  router.use(protect);
  router.use(requireCurrentPersona('student'));
} else {
  // Development middleware to create a fake user
  router.use(async (req, res, next) => {
    // Try to find any student user for development
    const student = await User.findOne({ currentPersona: 'student' }) || 
                   await User.findOne({ accountType: 'student' });
    
    if (student) {
      req.user = student;
    } else {
      // Create a minimal user object for development using actual user ID
      req.user = {
        _id: '68d0e521d89923fb4cf80d54', // Actual user ID from database
        email: 'john@test.com',
        currentPersona: 'student'
      };
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
