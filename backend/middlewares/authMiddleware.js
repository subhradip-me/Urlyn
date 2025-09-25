import jwt from 'jsonwebtoken';
import User from '../models/common/User.js';

const protect = async (req, res, next) => {
  console.log('🔐 Auth middleware called:', req.method, req.path);
  console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
  console.log('🛡️ BYPASS_AUTH:', process.env.BYPASS_AUTH);
  
  // Development bypass for testing
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    console.log('🚧 Using development bypass');
    // Find a real user from the database
    let user = await User.findOne();
    
    if (!user) {
      // If no users exist, find a user ID from tags
      const { default: Tag } = await import('../models/core/Tag.js');
      const sampleTag = await Tag.findOne();
      if (sampleTag && sampleTag.userId) {
        user = await User.findById(sampleTag.userId);
      }
    }
    
    if (user) {
      console.log('✅ Found real user:', user._id);
      req.user = user;
    } else {
      // Fallback mock user
      console.log('🤖 Using fallback mock user');
      req.user = {
        _id: '68d227cd15d549082906ce62',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        persona: 'student',
        personas: ['student'],
        currentPersona: 'student'
      };
    }
    console.log('👤 Set user:', req.user._id);
    return next();
  }

  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized, user not found' 
        });
      }

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token' 
    });
  }
};

// Middleware to check if user has specific persona
const requirePersona = (requiredPersona) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.user.personas.includes(requiredPersona)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${requiredPersona} persona required`
      });
    }

    next();
  };
};

// Middleware to check if user's current persona matches required persona
const requireCurrentPersona = (requiredPersona) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.currentPersona !== requiredPersona) {
      return res.status(403).json({
        success: false,
        message: `Please switch to ${requiredPersona} persona to access this resource`
      });
    }

    next();
  };
};

export { 
  protect, 
  requirePersona, 
  requireCurrentPersona 
};
