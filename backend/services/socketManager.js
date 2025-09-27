import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/common/User.js';
import Chat from '../models/chat/Chat.js';
import Message from '../models/chat/Message.js';

// Node.js atob polyfill
const atob = (str) => Buffer.from(str, 'base64').toString('binary');

class SocketManager {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.connectedUsers = new Map(); // userId -> socketId mapping
    this.userSockets = new Map(); // socketId -> user data mapping
    this.typingUsers = new Map(); // chatId -> Set of userIds typing

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        console.log('Socket auth: Checking authentication for socket', socket.id);
        
        const token = socket.handshake.auth.token || 
                     socket.handshake.headers.authorization?.split(' ')[1] ||
                     socket.handshake.query.token;
        
        console.log('Socket auth: Token provided:', !!token);
        
        if (!token) {
          console.log('Socket auth: No token provided');
          return next(new Error('Authentication error: No token provided'));
        }

        console.log('Socket auth: Token length:', token.length);
        console.log('Socket auth: Token starts with:', token.substring(0, 10) + '...');

        // Handle development mode special tokens
        if (process.env.NODE_ENV === 'development' && (token === 'dev-token-fallback' || process.env.BYPASS_AUTH === 'true')) {
          console.log('🔧 Development mode: Using fallback token or auth bypass');
          const mockUser = {
            _id: '68d0e521d89923fb4cf80d54',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            avatar: null,
            isOnline: true
          };
          socket.userId = mockUser._id.toString();
          socket.user = mockUser;
          return next();
        }

        // For development JWT tokens, check if it's our mock format
        if (process.env.NODE_ENV === 'development' && token.includes('.')) {
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              // Decode the payload from our development token
              const payload = JSON.parse(atob(parts[1]));
              console.log('🔧 Development JWT payload:', payload);
              
              if (payload.id && payload.email) {
                const mockUser = {
                  _id: payload.id,
                  firstName: 'Test',
                  lastName: 'User',
                  email: payload.email,
                  avatar: null,
                  isOnline: true
                };
                socket.userId = payload.id;
                socket.user = mockUser;
                return next();
              }
            }
          } catch (decodeError) {
            console.log('🔧 Development token decode failed, trying normal JWT verification');
          }
        }

        // If we're in development mode and have BYPASS_AUTH, allow any token
        if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
          console.log('🔧 Development mode: Auth bypass enabled, allowing connection');
          const mockUser = {
            _id: '68d0e521d89923fb4cf80d54',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            avatar: null,
            isOnline: true
          };
          socket.userId = mockUser._id.toString();
          socket.user = mockUser;
          return next();
        }

        // Try normal JWT verification
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Socket auth: Token decoded successfully, user ID:', decoded.id);
        
        const user = await User.findById(decoded.id).select('firstName lastName email avatar isOnline');
        
        if (!user) {
          console.log('Socket auth: User not found for ID:', decoded.id);
          return next(new Error('Authentication error: User not found'));
        }

        console.log('Socket auth: Authentication successful for user:', user.email);
        socket.userId = user._id.toString();
        socket.user = user;
        next();
      } catch (error) {
        console.error('Socket authentication error:', error.message);
        if (error.name === 'JsonWebTokenError') {
          next(new Error('Authentication error: Invalid token format'));
        } else if (error.name === 'TokenExpiredError') {
          next(new Error('Authentication error: Token expired'));
        } else {
          next(new Error('Authentication error: ' + error.message));
        }
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User ${socket.user.firstName} connected: ${socket.id}`);
      
      // Store user connection
      this.connectedUsers.set(socket.userId, socket.id);
      this.userSockets.set(socket.id, {
        userId: socket.userId,
        user: socket.user
      });

      // Update user online status
      this.updateUserOnlineStatus(socket.userId, true);

      // Join user to their personal room
      socket.join(`user_${socket.userId}`);

      // Send user's active chats
      this.sendUserChats(socket);

      // Event handlers
      socket.on('join_chat', (data) => this.handleJoinChat(socket, data));
      socket.on('leave_chat', (data) => this.handleLeaveChat(socket, data));
      socket.on('send_message', (data) => this.handleSendMessage(socket, data));
      socket.on('typing_start', (data) => this.handleTypingStart(socket, data));
      socket.on('typing_stop', (data) => this.handleTypingStop(socket, data));
      socket.on('read_message', (data) => this.handleReadMessage(socket, data));
      socket.on('edit_message', (data) => this.handleEditMessage(socket, data));
      socket.on('delete_message', (data) => this.handleDeleteMessage(socket, data));
      socket.on('react_to_message', (data) => this.handleReactToMessage(socket, data));
      socket.on('create_group_chat', (data) => this.handleCreateGroupChat(socket, data));
      socket.on('add_member', (data) => this.handleAddMember(socket, data));
      socket.on('remove_member', (data) => this.handleRemoveMember(socket, data));

      // Disconnect handler
      socket.on('disconnect', () => this.handleDisconnect(socket));
    });
  }

  async sendUserChats(socket) {
    try {
      const userChats = await Chat.find({
        'members.userId': socket.userId,
        isActive: true
      })
      .populate('members.userId', 'firstName lastName email avatar isOnline')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

      socket.emit('user_chats', userChats);
    } catch (error) {
      console.error('Error sending user chats:', error);
      socket.emit('error', { message: 'Failed to load chats' });
    }
  }

  async handleJoinChat(socket, { chatId }) {
    try {
      const chat = await Chat.findById(chatId);
      
      if (!chat) {
        return socket.emit('error', { message: 'Chat not found' });
      }

      // Check if user is member
      const isMember = chat.members.some(member => 
        member.userId.toString() === socket.userId
      );

      if (!isMember) {
        return socket.emit('error', { message: 'Access denied' });
      }

      socket.join(`chat_${chatId}`);
      
      // Load and send chat messages
      const messages = await Message.getChatMessages(chatId, 1, 50);
      socket.emit('chat_messages', { chatId, messages: messages.reverse() });
      
      // Notify other members that user joined
      socket.to(`chat_${chatId}`).emit('user_joined_chat', {
        chatId,
        user: socket.user
      });

    } catch (error) {
      console.error('Error joining chat:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  }

  handleLeaveChat(socket, { chatId }) {
    socket.leave(`chat_${chatId}`);
    socket.to(`chat_${chatId}`).emit('user_left_chat', {
      chatId,
      user: socket.user
    });
  }

  async handleSendMessage(socket, { chatId, message, attachments = [], replyTo = null }) {
    try {
      const chat = await Chat.findById(chatId);
      
      if (!chat) {
        return socket.emit('error', { message: 'Chat not found' });
      }

      // Check if user is member
      const isMember = chat.members.some(member => 
        member.userId.toString() === socket.userId
      );

      if (!isMember) {
        return socket.emit('error', { message: 'Access denied' });
      }

      // Create message
      const newMessage = new Message({
        chatId,
        senderId: socket.userId,
        message: message?.trim(),
        attachments,
        replyTo,
        messageType: attachments.length > 0 ? 'file' : 'text'
      });

      await newMessage.save();
      await newMessage.populate('senderId', 'firstName lastName email avatar');
      
      if (replyTo) {
        await newMessage.populate('replyTo', 'message senderId createdAt');
      }

      // Update chat last message time and increment message count
      chat.lastMessageAt = new Date();
      chat.messageCount += 1;
      await chat.save();

      // Stop typing for this user
      this.handleTypingStop(socket, { chatId });

      // Send message to all chat members
      this.io.to(`chat_${chatId}`).emit('new_message', {
        chatId,
        message: newMessage
      });

      // Send push notification to offline users (implement later)
      this.sendPushNotifications(chat, newMessage, socket.userId);

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  handleTypingStart(socket, { chatId }) {
    if (!this.typingUsers.has(chatId)) {
      this.typingUsers.set(chatId, new Set());
    }
    
    this.typingUsers.get(chatId).add(socket.userId);
    
    socket.to(`chat_${chatId}`).emit('user_typing', {
      chatId,
      userId: socket.userId,
      user: socket.user
    });
  }

  handleTypingStop(socket, { chatId }) {
    if (this.typingUsers.has(chatId)) {
      this.typingUsers.get(chatId).delete(socket.userId);
      
      if (this.typingUsers.get(chatId).size === 0) {
        this.typingUsers.delete(chatId);
      }
    }
    
    socket.to(`chat_${chatId}`).emit('user_stopped_typing', {
      chatId,
      userId: socket.userId
    });
  }

  async handleReadMessage(socket, { chatId, messageId }) {
    try {
      const message = await Message.findById(messageId);
      
      if (message && message.chatId.toString() === chatId) {
        await message.markAsRead(socket.userId);
        
        // Update user's last read time in chat
        const chat = await Chat.findById(chatId);
        const member = chat.members.find(m => m.userId.toString() === socket.userId);
        if (member) {
          member.lastReadAt = new Date();
          await chat.save();
        }

        // Notify sender about read receipt
        this.io.to(`chat_${chatId}`).emit('message_read', {
          chatId,
          messageId,
          readBy: socket.userId
        });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  async handleReactToMessage(socket, { messageId, reaction }) {
    try {
      const message = await Message.findById(messageId);
      
      if (!message) {
        return socket.emit('error', { message: 'Message not found' });
      }

      await message.addReaction(socket.userId, reaction);
      
      this.io.to(`chat_${message.chatId}`).emit('message_reaction', {
        messageId,
        userId: socket.userId,
        reaction,
        reactions: message.reactions
      });

    } catch (error) {
      console.error('Error adding reaction:', error);
      socket.emit('error', { message: 'Failed to add reaction' });
    }
  }

  async handleCreateGroupChat(socket, { name, description, members }) {
    try {
      const chat = new Chat({
        type: 'group',
        name,
        description,
        createdBy: socket.userId,
        members: [
          { userId: socket.userId, role: 'admin' },
          ...members.map(userId => ({ userId, role: 'member' }))
        ]
      });

      await chat.save();
      await chat.populate('members.userId', 'firstName lastName email avatar isOnline');

      // Join all members to the chat room
      const allMemberIds = [socket.userId, ...members];
      allMemberIds.forEach(memberId => {
        const memberSocket = this.connectedUsers.get(memberId);
        if (memberSocket) {
          this.io.sockets.sockets.get(memberSocket)?.join(`chat_${chat._id}`);
        }
      });

      // Notify all members about new chat
      this.io.to(`chat_${chat._id}`).emit('new_chat', chat);

    } catch (error) {
      console.error('Error creating group chat:', error);
      socket.emit('error', { message: 'Failed to create group chat' });
    }
  }

  async updateUserOnlineStatus(userId, isOnline) {
    try {
      await User.findByIdAndUpdate(userId, { 
        isOnline, 
        lastSeen: isOnline ? null : new Date() 
      });

      // Notify user's chats about status change
      const userChats = await Chat.find({ 'members.userId': userId });
      
      userChats.forEach(chat => {
        this.io.to(`chat_${chat._id}`).emit('user_status_change', {
          userId,
          isOnline,
          lastSeen: isOnline ? null : new Date()
        });
      });
    } catch (error) {
      console.error('Error updating user online status:', error);
    }
  }

  async sendPushNotifications(chat, message, senderId) {
    // Implementation for push notifications
    // This would integrate with services like Firebase, OneSignal, etc.
    console.log('Push notification would be sent here');
  }

  handleDisconnect(socket) {
    console.log(`User ${socket.user.firstName} disconnected: ${socket.id}`);
    
    // Clean up typing indicators
    this.typingUsers.forEach((typingSet, chatId) => {
      if (typingSet.has(socket.userId)) {
        typingSet.delete(socket.userId);
        socket.to(`chat_${chatId}`).emit('user_stopped_typing', {
          chatId,
          userId: socket.userId
        });
      }
    });

    // Remove user from connected users
    this.connectedUsers.delete(socket.userId);
    this.userSockets.delete(socket.id);

    // Update user online status
    this.updateUserOnlineStatus(socket.userId, false);
  }

  // Method to send message to specific user
  sendToUser(userId, event, data) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      return true;
    }
    return false;
  }

  // Method to get online users
  getOnlineUsers() {
    return Array.from(this.connectedUsers.keys());
  }
}

export default SocketManager;
