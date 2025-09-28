import jwt from 'jsonwebtoken';
import User from '../models/common/User.js';

const protect = async (req, res, next) => {
  // Development bypass for testing
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    console.log('🔓 Auth bypass enabled - using mock user');
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
      req.user = user;
    } else {
      // Fallback mock user
      req.user = {
        _id: '68d227cd15d549082906ce62',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        persona: 'student',
        personas: ['student', 'professional', 'creator', 'entrepreneur', 'researcher'],
        currentPersona: 'student'
      };
    }
    return next();
  }

  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('🔍 Received token:', token.substring(0, 15) + '...');

      // Handle development tokens
      if (process.env.NODE_ENV === 'development' && token.startsWith('dev-token-')) {
        console.log('🧪 Processing development token');
        const userId = token.replace('dev-token-', '');
        
        // Create or find a mock user
        let user = await User.findById(userId);
        
        if (!user) {
          // Create mock user for development
          console.log('👤 Creating mock user for development');
          req.user = {
            _id: userId,
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            personas: ['student', 'professional', 'creator', 'entrepreneur', 'researcher'],
            currentPersona: 'student'
          };
        } else {
          req.user = user;
        }
        
        return next();
      }

      // Handle fallback development token
      if (process.env.NODE_ENV === 'development' && token === 'dev-token-fallback') {
        console.log('🔄 Using fallback development token');
        req.user = {
          _id: '68d0e521d89923fb4cf80d54',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          personas: ['student', 'professional', 'creator', 'entrepreneur', 'researcher'],
          currentPersona: 'student'
        };
        return next();
      }

      // Verify token
      console.log('🔐 Verifying JWT token');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        console.log('❌ User not found for token');
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized, user not found' 
        });
      }

      console.log('✅ User authenticated:', req.user.email);
      next();
    } catch (error) {
      console.error('🚨 Token verification failed:', error.message);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    console.log('❌ No token provided');
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

// Middleware to add current persona to request
const addCurrentPersona = (req, res, next) => {
  if (req.user && req.user.currentPersona) {
    req.persona = req.user.currentPersona;
  } else {
    // Default to student persona if none set
    req.persona = 'student';
  }
  next();
};

export { 
  protect, 
  requirePersona, 
  requireCurrentPersona,
  addCurrentPersona
};
