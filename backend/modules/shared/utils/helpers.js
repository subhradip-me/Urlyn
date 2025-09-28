import Logger from './logger.js';

/**
 * Higher-order function to wrap async route handlers
 * Automatically catches errors and passes them to error middleware
 */
export const asyncHandler = (fn) => (req, res, next) => {
  const startTime = Date.now();
  
  Promise.resolve(fn(req, res, next))
    .then(() => {
      const duration = Date.now() - startTime;
      Logger.performance(`${req.method} ${req.originalUrl}`, duration, {
        status: res.statusCode
      });
    })
    .catch((error) => {
      const duration = Date.now() - startTime;
      Logger.error('Async handler error', {
        method: req.method,
        url: req.originalUrl,
        error: error.message,
        duration
      });
      next(error);
    });
};

/**
 * Utility to safely execute database operations
 */
export const safeDbOperation = async (operation, context = '') => {
  const startTime = Date.now();
  
  try {
    const result = await operation();
    const duration = Date.now() - startTime;
    Logger.database('SUCCESS', context, { duration });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    Logger.error('Database operation failed', {
      context,
      error: error.message,
      duration
    });
    throw error;
  }
};

/**
 * Utility for validating required fields
 */
export const validateRequired = (data, requiredFields) => {
  const missing = requiredFields.filter(field => !data[field]);
  
  if (missing.length > 0) {
    const error = new Error(`Missing required fields: ${missing.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
};

/**
 * Utility for sanitizing user input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially harmful characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Utility for pagination
 */
export const getPaginationParams = (req, defaultLimit = 20, maxLimit = 100) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit) || defaultLimit));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

/**
 * Utility for standardized API responses
 */
export const sendResponse = (res, data, message = 'Success', statusCode = 200) => {
  const response = {
    success: statusCode < 400,
    message,
    data,
    timestamp: new Date().toISOString()
  };
  
  Logger.debug('Sending response', { statusCode, message });
  res.status(statusCode).json(response);
};

/**
 * Utility for error responses
 */
export const sendError = (res, message, statusCode = 500, details = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (details && process.env.NODE_ENV === 'development') {
    response.details = details;
  }
  
  Logger.error('Sending error response', { statusCode, message });
  res.status(statusCode).json(response);
};

/**
 * Utility for rate limiting by user
 */
export const createUserRateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  const userRequests = new Map();
  
  return (req, res, next) => {
    const userId = req.user?.id || req.ip;
    const now = Date.now();
    const userKey = `${userId}:${Math.floor(now / windowMs)}`;
    
    const currentRequests = userRequests.get(userKey) || 0;
    
    if (currentRequests >= maxRequests) {
      return sendError(res, 'Too many requests, please try again later', 429);
    }
    
    userRequests.set(userKey, currentRequests + 1);
    
    // Clean up old entries every 10 minutes
    if (Math.random() < 0.01) {
      const cutoff = Math.floor((now - windowMs * 2) / windowMs);
      for (const key of userRequests.keys()) {
        const keyTime = parseInt(key.split(':')[1]);
        if (keyTime < cutoff) {
          userRequests.delete(key);
        }
      }
    }
    
    next();
  };
};

export default {
  asyncHandler,
  safeDbOperation,
  validateRequired,
  sanitizeInput,
  getPaginationParams,
  sendResponse,
  sendError,
  createUserRateLimit
};
