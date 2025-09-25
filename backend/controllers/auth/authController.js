import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/common/User.js';
import Notification from '../../models/common/Notification.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, persona } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user (password will be hashed by pre-save hook)
  const user = await User.create({
    firstName,
    lastName,
    email,
    password, // Don't hash here - let the model handle it
    personas: persona ? [persona] : ['student'], // Default to student if no persona specified
    currentPersona: persona || 'student'
  });

  if (user) {
    // Create welcome notification
    await Notification.create({
      recipient: user._id,
      title: 'Welcome to Urlyn 2.0!',
      message: `Welcome ${firstName}! Your account has been created successfully. You can switch between different personas anytime.`,
      type: 'system_announcement',
      targetPersona: user.currentPersona
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      personas: user.personas,
      currentPersona: user.currentPersona,
      currentProfile: user.currentProfile,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      personas: user.personas,
      currentPersona: user.currentPersona,
      currentProfile: user.currentProfile,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    personas: req.user.personas,
    currentPersona: req.user.currentPersona,
    currentProfile: req.user.currentProfile,
  });
});

// @desc    Add new persona to user
// @route   POST /api/auth/personas
// @access  Private
const addPersona = asyncHandler(async (req, res) => {
  const { persona } = req.body;

  if (!persona || !['student', 'creator', 'professional'].includes(persona)) {
    res.status(400);
    throw new Error('Invalid persona type');
  }

  const user = await User.findById(req.user._id);

  if (user.personas.includes(persona)) {
    res.status(400);
    throw new Error('Persona already exists');
  }

  await user.addPersona(persona);

  // Create notification for new persona
  await Notification.create({
    userId: user._id,
    title: 'New Persona Added!',
    message: `You've successfully added the ${persona} persona. You can now switch between your personas anytime.`,
    type: 'system',
    targetPersona: persona
  });

  res.json({
    message: `${persona} persona added successfully`,
    personas: user.personas,
    currentPersona: user.currentPersona,
    currentProfile: user.currentProfile,
  });
});

// @desc    Switch user persona
// @route   PUT /api/auth/personas/switch
// @access  Private
const switchPersona = asyncHandler(async (req, res) => {
  const { persona } = req.body;

  if (!persona || !['student', 'creator', 'professional'].includes(persona)) {
    res.status(400);
    throw new Error('Invalid persona type');
  }

  const user = await User.findById(req.user._id);

  if (!user.personas.includes(persona)) {
    res.status(400);
    throw new Error('Persona not available. Please add this persona first.');
  }

  await user.switchPersona(persona);

  res.json({
    message: `Switched to ${persona} persona`,
    currentPersona: user.currentPersona,
    currentProfile: user.currentProfile,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;

    // Update persona-specific profile
    if (req.body.profile) {
      const currentPersona = user.currentPersona;
      user[`${currentPersona}Profile`] = {
        ...user[`${currentPersona}Profile`],
        ...req.body.profile
      };
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      personas: updatedUser.personas,
      currentPersona: updatedUser.currentPersona,
      currentProfile: updatedUser.currentProfile,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export {
  registerUser,
  loginUser,
  getCurrentUser,
  addPersona,
  switchPersona,
  updateProfile,
};
