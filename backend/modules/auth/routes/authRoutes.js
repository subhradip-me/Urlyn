import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  getCurrentUser,
  addPersona,
  switchPersona,
  updateProfile
} from '../../controllers/auth/authController.js';
import { protect } from '../../middlewares/authMiddleware.js';

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   GET /api/auth/me
router.get('/me', protect, getCurrentUser);

// @route   POST /api/auth/personas
router.post('/personas', protect, addPersona);

// @route   PUT /api/auth/personas/switch
router.put('/personas/switch', protect, switchPersona);

// @route   PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

export default router;
