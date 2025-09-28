import express from 'express';
import { protect } from '../../shared/middleware/authMiddleware.js';

// Import core routes
import bookmarksRoutes from './bookmarksRoutes.js';
import foldersRoutes from './foldersRoutes.js';
import tagsRoutes from './tagsRoutes.js';
import notesRoutes from './notesRoutes.js';
import tasksRoutes from './tasksRoutes.js';

const router = express.Router();

// Apply authentication
router.use(protect);

// Core feature routes (persona-aware)
router.use('/bookmarks', bookmarksRoutes);
router.use('/folders', foldersRoutes);
router.use('/tags', tagsRoutes);
router.use('/notes', notesRoutes);
router.use('/tasks', tasksRoutes);

// Core features info
router.get('/info', (req, res) => {
  res.json({
    module: 'core',
    features: [
      'bookmarks',
      'folders',
      'tags',
      'notes',
      'tasks'
    ],
    description: 'Core features available across all personas',
    personaAware: true
  });
});

export default router;
