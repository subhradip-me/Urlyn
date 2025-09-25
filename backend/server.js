import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';

import connectDB from './config/database.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import SocketManager from './services/socketManager.js';

// Import routes
import authRoutes from './routes/auth/authRoutes.js';
import dashboardRoutes from './routes/dashboard/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import studentRoutes from './routes/student/studentRoutes.js';
import metadataRoutes from './routes/common/metadataRoutes.js';
import aiTagsRoutes from './routes/common/aiTagsRoutes.js';
import chatRoutes from './routes/chat/chatRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const socketManager = new SocketManager(server);

// Trust proxy
app.set('trust proxy', 1);

// Production middleware
if (process.env.NODE_ENV === 'production') {
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Compression
  app.use(compression());

  // Logging
  app.use(morgan('combined'));
} else {
  // Development logging
  app.use(morgan('dev'));
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ 
  limit: process.env.NODE_ENV === 'production' ? '1mb' : '10mb'
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.NODE_ENV === 'production' ? '1mb' : '10mb'
}));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0',
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/metadata', metadataRoutes);
app.use('/api/ai-tags', aiTagsRoutes);
app.use('/api/chats', chatRoutes);

// Persona-specific routes
app.use('/api/student', studentRoutes);
// app.use('/api/creator', creatorRoutes);
// app.use('/api/professional', professionalRoutes);

// Test routes (development only) - removed for production

// Welcome route - only show detailed info in development
app.get('/api', (req, res) => {
  const response = {
    success: true,
    message: 'Welcome to Urlyn 2.0 API',
    version: '2.0.0',
    status: 'operational'
  };

  if (process.env.NODE_ENV !== 'production') {
    response.documentation = '/api/docs';
    response.endpoints = {
      auth: '/api/auth',
      notifications: '/api/notifications',
      metadata: '/api/metadata',
      student: '/api/student',
      dashboard: '/api/dashboard'
    };
    response.features = {
      multiPersona: true,
      authentication: 'JWT',
      notifications: 'Cross-persona support',
      personas: ['student', 'creator', 'professional']
    };
  }

  res.status(200).json(response);
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      console.error('Error during server shutdown:', err);
      process.exit(1);
    }
    
    console.log('Server closed successfully');
    // Close database connection
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown after 30 seconds');
    process.exit(1);
  }, 30000);
};

// Start server
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  const env = process.env.NODE_ENV || 'development';
  const isDev = env === 'development';
  
  if (isDev) {
    console.log(`
🚀 Server running in ${env} mode
📍 Port: ${PORT}
🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
📊 Database: MongoDB
🔗 API Base: http://localhost:${PORT}/api
🎭 Multi-Persona Support: Enabled
🔔 Cross-Persona Notifications: Active
💬 Socket.IO Chat: Enabled
    `);
  } else {
    console.log(`Server started on ${HOST}:${PORT} in ${env} mode`);
  }
});

// Error handling
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  gracefulShutdown('UNHANDLED_REJECTION');
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
