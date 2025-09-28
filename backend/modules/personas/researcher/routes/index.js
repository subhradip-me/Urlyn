import express from 'express';
import { protect, requireCurrentPersona } from '../../../shared/middleware/authMiddleware.js';

// Import researcher-specific routes
import projectRoutes from './projectRoutes.js';
import publicationRoutes from './publicationRoutes.js';
import collaborationRoutes from './collaborationRoutes.js';
import grantRoutes from './grantRoutes.js';
import bookmarksRoutes from './bookmarksRoutes.js';
import foldersRoutes from './foldersRoutes.js';
import tagsRoutes from './tagsRoutes.js';
import notesRoutes from './notesRoutes.js';

const router = express.Router();

// Apply authentication and persona validation
router.use(protect);
router.use(requireCurrentPersona('researcher'));

// Researcher-specific routes
router.use('/projects', projectRoutes);
router.use('/publications', publicationRoutes);
router.use('/collaborations', collaborationRoutes);
router.use('/grants', grantRoutes);

// Core feature routes (researcher context)
router.use('/bookmarks', bookmarksRoutes);
router.use('/folders', foldersRoutes);
router.use('/tags', tagsRoutes);
router.use('/notes', notesRoutes);

// Researcher persona info
router.get('/info', (req, res) => {
  res.json({
    persona: 'researcher',
    features: [
      'research-projects',
      'publications', 
      'collaborations',
      'grant-management',
      'bookmarks',
      'folders',
      'notes',
      'tags'
    ],
    description: 'Researcher persona with academic research and publication features'
  });
});

export default router;
