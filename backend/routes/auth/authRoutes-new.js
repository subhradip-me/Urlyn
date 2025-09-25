const express = require('express');
const router = express.Router();

// Import auth controller functions
const authController = require('../../controllers/auth/authController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Extract functions
const {
  registerUser,
  loginUser,
  getCurrentUser,
  addPersona,
  switchPersona,
  updateProfile
} = authController;

const { protect } = authMiddleware;

// Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.post('/personas', protect, addPersona);
router.put('/personas/switch', protect, switchPersona);
router.put('/profile', protect, updateProfile);

module.exports = router;
