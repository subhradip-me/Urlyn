import express from 'express';
import { protect, requireCurrentPersona } from '../../../shared/middleware/authMiddleware.js';

// Import creator-specific routes
import projectRoutes from './projectRoutes.js';
import calendarRoutes from './calendarRoutes.js';
import partnershipRoutes from './partnershipRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import bookmarksRoutes from './bookmarksRoutes.js';
import foldersRoutes from './foldersRoutes.js';
import tagsRoutes from './tagsRoutes.js';
import notesRoutes from './notesRoutes.js';

const router = express.Router();

// Apply authentication and persona validation
router.use(protect);
router.use(requireCurrentPersona('creator'));

// Creator-specific routes
router.use('/projects', projectRoutes);
router.use('/calendar', calendarRoutes);
router.use('/partnerships', partnershipRoutes);
router.use('/analytics', analyticsRoutes);

// Core feature routes (creator context)
router.use('/bookmarks', bookmarksRoutes);
router.use('/folders', foldersRoutes);
router.use('/tags', tagsRoutes);
router.use('/notes', notesRoutes);

// Creator persona info
router.get('/info', (req, res) => {
  res.json({
    persona: 'creator',
    features: [
      'content-projects',
      'content-calendar', 
      'brand-partnerships',
      'analytics',
      'bookmarks',
      'folders',
      'notes',
      'tags'
    ],
    description: 'Creator persona with content creation and monetization features'
  });
});

export default router;
