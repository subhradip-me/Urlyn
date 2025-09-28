import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use default local MongoDB if no URI provided
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/urlyn';
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s
      maxPoolSize: process.env.NODE_ENV === 'production' ? 10 : 5,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    return conn;

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 Database connection is required in production');
      process.exit(1);
    } else {
      console.log('⚠️  Server will start without database connection');
      console.log('💡 API endpoints are available but database operations will fail');
    }
  }
};

// Graceful database shutdown
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed gracefully');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
};

export default connectDB;
