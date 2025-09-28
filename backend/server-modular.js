import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';

// Import shared modules
import connectDB from './modules/shared/config/database.js';
import { errorHandler, notFound } from './modules/shared/middleware/errorMiddleware.js';
import SocketManager from './modules/shared/services/socketManager.js';

// Import modular routes
import authRoutes from './modules/auth/routes/authRoutes.js';
import coreRoutes from './modules/core/routes/index.js';

// Import persona-specific routes
import studentRoutes from './modules/personas/student/routes/index.js';
import creatorRoutes from './modules/personas/creator/routes/index.js';
import professionalRoutes from './modules/personas/professional/routes/index.js';
import entrepreneurRoutes from './modules/personas/entrepreneur/routes/index.js';
import researcherRoutes from './modules/personas/researcher/routes/index.js';

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
    message: 'Urlyn 2.0 API Server - Modular Architecture',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0',
    uptime: process.uptime(),
    modules: {
      auth: 'enabled',
      core: 'enabled',
      personas: {
        student: 'enabled',
        creator: 'enabled',
        professional: 'enabled',
        entrepreneur: 'enabled',
        researcher: 'enabled'
      }
    }
  });
});

// API Routes - Modular Structure
app.use('/api/auth', authRoutes);
app.use('/api/core', coreRoutes);

// Persona-specific routes
app.use('/api/personas/student', studentRoutes);
app.use('/api/personas/creator', creatorRoutes);
app.use('/api/personas/professional', professionalRoutes);
app.use('/api/personas/entrepreneur', entrepreneurRoutes);
app.use('/api/personas/researcher', researcherRoutes);

// Legacy routes (for backward compatibility)
app.use('/api/student', studentRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/professional', professionalRoutes);

// Welcome route
app.get('/api', (req, res) => {
  const response = {
    success: true,
    message: 'Welcome to Urlyn 2.0 API - Modular Persona Architecture',
    version: '2.0.0',
    status: 'operational',
    architecture: 'modular-persona-specific'
  };

  if (process.env.NODE_ENV !== 'production') {
    response.documentation = '/api/docs';
    response.modules = {
      auth: '/api/auth',
      core: '/api/core',
      personas: {
        student: '/api/personas/student',
        creator: '/api/personas/creator',
        professional: '/api/personas/professional',
        entrepreneur: '/api/personas/entrepreneur',
        researcher: '/api/personas/researcher'
      }
    };
    response.features = {
      multiPersona: true,
      authentication: 'JWT',
      notifications: 'Cross-persona support',
      personas: ['student', 'creator', 'professional', 'entrepreneur', 'researcher']
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

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  const env = process.env.NODE_ENV || 'development';
  const isDev = env === 'development';
  
  if (isDev) {
    console.log('\n🚀 Urlyn 2.0 - Modular Backend Server');
    console.log('=====================================');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`📊 Database: MongoDB`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`🏗️ Architecture: Modular Persona-Specific`);
    console.log(`🎭 Multi-Persona Support: Enabled`);
    console.log(`🔔 Cross-Persona Notifications: Active`);
    console.log(`💬 Socket.IO Chat: Enabled`);
    console.log('\n📦 Available Modules:');
    console.log('  🔐 Auth: /api/auth');
    console.log('  🎯 Core: /api/core');
    console.log('  🎓 Student: /api/personas/student');
    console.log('  🎨 Creator: /api/personas/creator');
    console.log('  💼 Professional: /api/personas/professional');
    console.log('  🚀 Entrepreneur: /api/personas/entrepreneur');
    console.log('  🔬 Researcher: /api/personas/researcher');
    console.log('\n✅ Server ready for connections');
  } else {
    console.log(`🚀 Urlyn 2.0 API server running on port ${PORT}`);
  }
});

export default app;
