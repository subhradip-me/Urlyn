import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../../auth/models/User.js';

class SocketManager {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  setupMiddleware() {
    // Authentication middleware for socket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
          return next(new Error('Authentication error: User not found'));
        }

        socket.userId = user._id.toString();
        socket.userEmail = user.email;
        socket.currentPersona = user.currentPersona;
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.userEmail} (${socket.userId})`);
      
      // Store connected user
      this.connectedUsers.set(socket.userId, {
        socketId: socket.id,
        email: socket.userEmail,
        persona: socket.currentPersona,
        connectedAt: new Date()
      });

      // Handle persona switching
      socket.on('persona:switch', (data) => {
        const { newPersona } = data;
        socket.currentPersona = newPersona;
        
        // Update stored user info
        const userInfo = this.connectedUsers.get(socket.userId);
        if (userInfo) {
          userInfo.persona = newPersona;
          this.connectedUsers.set(socket.userId, userInfo);
        }

        socket.emit('persona:switched', { 
          persona: newPersona,
          message: `Switched to ${newPersona} persona`
        });
      });

      // Handle chat messages (if chat feature is enabled)
      socket.on('chat:message', (data) => {
        // Broadcast message to relevant users
        socket.broadcast.emit('chat:message', {
          ...data,
          userId: socket.userId,
          userEmail: socket.userEmail,
          persona: socket.currentPersona,
          timestamp: new Date()
        });
      });

      // Handle real-time notifications
      socket.on('notification:send', (data) => {
        const { targetUserId, message, type } = data;
        
        // Send notification to specific user if they're connected
        const targetUser = this.connectedUsers.get(targetUserId);
        if (targetUser) {
          this.io.to(targetUser.socketId).emit('notification:received', {
            message,
            type,
            from: socket.userEmail,
            persona: socket.currentPersona,
            timestamp: new Date()
          });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userEmail} (${socket.userId})`);
        this.connectedUsers.delete(socket.userId);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`Socket error for user ${socket.userEmail}:`, error);
      });
    });
  }

  // Utility methods
  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }

  getConnectedUserCount() {
    return this.connectedUsers.size;
  }

  isUserConnected(userId) {
    return this.connectedUsers.has(userId);
  }

  sendToUser(userId, event, data) {
    const user = this.connectedUsers.get(userId);
    if (user && this.io) {
      this.io.to(user.socketId).emit(event, data);
      return true;
    }
    return false;
  }

  sendToAllUsers(event, data) {
    if (this.io) {
      this.io.emit(event, data);
      return true;
    }
    return false;
  }

  // Send notification to all users with a specific persona
  sendToPersona(persona, event, data) {
    if (this.io) {
      for (const [userId, userInfo] of this.connectedUsers) {
        if (userInfo.persona === persona) {
          this.io.to(userInfo.socketId).emit(event, data);
        }
      }
      return true;
    }
    return false;
  }
}

// Create singleton instance
const socketManager = new SocketManager();

export default socketManager;
