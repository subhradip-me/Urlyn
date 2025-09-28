import config from '../config/environment.js';

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const getCurrentLogLevel = () => {
  const level = config.LOG_LEVEL.toUpperCase();
  return LOG_LEVELS[level] || LOG_LEVELS.INFO;
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  
  if (config.isProduction) {
    // Structured logging for production
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
      service: 'urlyn-backend',
      version: '2.0.0'
    });
  } else {
    // Colored logging for development
    const levelColors = {
      ERROR: colors.red,
      WARN: colors.yellow,
      INFO: colors.green,
      DEBUG: colors.blue
    };
    
    const color = levelColors[level] || colors.reset;
    return `${color}[${timestamp}] ${level}:${colors.reset} ${message}${metaStr}`;
  }
};

class Logger {
  static error(message, meta = {}) {
    if (getCurrentLogLevel() >= LOG_LEVELS.ERROR) {
      console.error(formatMessage('ERROR', message, meta));
    }
  }
  
  static warn(message, meta = {}) {
    if (getCurrentLogLevel() >= LOG_LEVELS.WARN) {
      console.warn(formatMessage('WARN', message, meta));
    }
  }
  
  static info(message, meta = {}) {
    if (getCurrentLogLevel() >= LOG_LEVELS.INFO) {
      console.log(formatMessage('INFO', message, meta));
    }
  }
  
  static debug(message, meta = {}) {
    if (getCurrentLogLevel() >= LOG_LEVELS.DEBUG) {
      console.log(formatMessage('DEBUG', message, meta));
    }
  }
  
  // HTTP request logging
  static request(req, res, responseTime) {
    const meta = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    if (res.statusCode >= 400) {
      this.warn(`HTTP ${res.statusCode} ${req.method} ${req.originalUrl}`, meta);
    } else {
      this.info(`HTTP ${res.statusCode} ${req.method} ${req.originalUrl}`, meta);
    }
  }
  
  // Database operation logging
  static database(operation, collection, meta = {}) {
    this.debug(`Database ${operation} on ${collection}`, meta);
  }
  
  // Authentication logging
  static auth(action, userId, meta = {}) {
    this.info(`Auth: ${action}`, { userId, ...meta });
  }
  
  // Performance logging
  static performance(operation, duration, meta = {}) {
    this.debug(`Performance: ${operation} took ${duration}ms`, meta);
  }
}

export default Logger;
