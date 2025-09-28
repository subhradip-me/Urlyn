import express from 'express';
import { protect, requireCurrentPersona } from '../../../shared/middleware/authMiddleware.js';

// Import professional-specific routes
import projectRoutes from './projectRoutes.js';
import contactRoutes from './contactRoutes.js';
import skillRoutes from './skillRoutes.js';
import networkRoutes from './networkRoutes.js';
import bookmarksRoutes from './bookmarksRoutes.js';
import foldersRoutes from './foldersRoutes.js';
import tagsRoutes from './tagsRoutes.js';
import notesRoutes from './notesRoutes.js';

const router = express.Router();

// Apply authentication and persona validation
router.use(protect);
router.use(requireCurrentPersona('professional'));

// Professional-specific routes
router.use('/projects', projectRoutes);
router.use('/contacts', contactRoutes);
router.use('/skills', skillRoutes);
router.use('/network', networkRoutes);

// Core feature routes (professional context)
router.use('/bookmarks', bookmarksRoutes);
router.use('/folders', foldersRoutes);
router.use('/tags', tagsRoutes);
router.use('/notes', notesRoutes);

// Professional persona info
router.get('/info', (req, res) => {
  res.json({
    persona: 'professional',
    features: [
      'client-projects',
      'network-contacts', 
      'skill-development',
      'professional-network',
      'bookmarks',
      'folders',
      'notes',
      'tags'
    ],
    description: 'Professional persona with career and business networking features'
  });
});

export default router;
