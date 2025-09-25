const express = require('express');
const router = express.Router();

console.log('Loading authController...');
let authController;
try {
  authController = require('../../controllers/auth/authController');
  console.log('AuthController loaded:', Object.keys(authController));
} catch (error) {
  console.error('Error loading authController:', error);
  module.exports = {};
  return;
}

const {
  registerUser,
  loginUser,
  getCurrentUser,
  addPersona,
  switchPersona,
  updateProfile
} = authController;

console.log('Loading authMiddleware...');
let authMiddleware;
try {
  authMiddleware = require('../../middlewares/authMiddleware');
  console.log('AuthMiddleware loaded:', Object.keys(authMiddleware));
} catch (error) {
  console.error('Error loading authMiddleware:', error);
  module.exports = {};
  return;
}

const { protect } = authMiddleware;

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

console.log('Router created with', router.stack.length, 'routes');
module.exports = router;
