import express from 'express';
import { protect, requireCurrentPersona } from '../../../shared/middleware/authMiddleware.js';

// Import entrepreneur-specific routes
import startupRoutes from './startupRoutes.js';
import investorRoutes from './investorRoutes.js';
import businessPlanRoutes from './businessPlanRoutes.js';
import fundingRoutes from './fundingRoutes.js';
import bookmarksRoutes from './bookmarksRoutes.js';
import foldersRoutes from './foldersRoutes.js';
import tagsRoutes from './tagsRoutes.js';
import notesRoutes from './notesRoutes.js';

const router = express.Router();

// Apply authentication and persona validation
router.use(protect);
router.use(requireCurrentPersona('entrepreneur'));

// Entrepreneur-specific routes
router.use('/startups', startupRoutes);
router.use('/investors', investorRoutes);
router.use('/business-plans', businessPlanRoutes);
router.use('/funding', fundingRoutes);

// Core feature routes (entrepreneur context)
router.use('/bookmarks', bookmarksRoutes);
router.use('/folders', foldersRoutes);
router.use('/tags', tagsRoutes);
router.use('/notes', notesRoutes);

// Entrepreneur persona info
router.get('/info', (req, res) => {
  res.json({
    persona: 'entrepreneur',
    features: [
      'startup-projects',
      'investor-relations', 
      'business-plans',
      'funding-tracker',
      'bookmarks',
      'folders',
      'notes',
      'tags'
    ],
    description: 'Entrepreneur persona with startup and investment management features'
  });
});

export default router;
