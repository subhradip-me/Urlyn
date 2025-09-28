"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    // Return default values instead of throwing error to prevent crashes
    return {
      socket: null,
      isConnected: false,
      chats: [],
      activeChat: null,
      messages: {},
      unreadCounts: {},
      onlineUsers: new Set(),
      joinChat: () => {},
      leaveChat: () => {},
      sendMessage: () => {},
      startTyping: () => {},
      stopTyping: () => {},
      markMessageAsRead: () => {},
      reactToMessage: () => {},
      createDirectMessage: () => Promise.resolve(null),
      createGroupChat: () => {},
      getTotalUnreadCount: () => 0,
      getChatTypingUsers: () => [],
      isUserOnline: () => false
    };
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Initialize socket connection
  useEffect(() => {
    if (!user || !token) {
      console.log('Chat: Waiting for user authentication...');
      return;
    }

    // Debug token format
    console.log('Chat: Token available, length:', token.length);
    console.log('Chat: Token type:', typeof token);
    console.log('Chat: Initializing socket connection for user:', user.email);

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      forceNew: true,
      timeout: 10000
    });

    newSocket.on('connect', () => {
      console.log('Chat: Connected to chat server successfully');
      setIsConnected(true);
      setSocket(newSocket);
      reconnectAttempts.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Chat: Disconnected from chat server. Reason:', reason);
      setIsConnected(false);
      
      // Only attempt reconnection for non-authentication issues
      if (reason !== 'io server disconnect' && reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        console.log(`Chat: Reconnection attempt ${reconnectAttempts.current}`);
        setTimeout(() => {
          if (user && token && !reason.includes('Authentication')) {
            newSocket.connect();
          }
        }, 1000 * reconnectAttempts.current);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Chat: Socket connection error:', error.message);
      setIsConnected(false);
      
      // If authentication error, provide more context
      if (error.message.includes('Authentication') || error.message.includes('Invalid token')) {
        console.error('Chat: Authentication failed - check token validity');
        // Don't attempt reconnection for auth errors
        return;
      }
      if (error.message.includes('Authentication') || error.message.includes('Invalid token')) {
        console.error('Chat: Authentication failed - check token validity');
        return;
      }
      
      // For other errors, attempt reconnection
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        setTimeout(() => {
          if (user && token) {
            newSocket.connect();
          }
        }, 2000 * reconnectAttempts.current);
      }
    });

    // Socket event listeners
    newSocket.on('user_chats', (userChats) => {
      setChats(userChats);
      
      // Initialize unread counts
      const counts = {};
      userChats.forEach(chat => {
        counts[chat._id] = chat.unreadCount || 0;
      });
      setUnreadCounts(counts);
    });

    newSocket.on('chat_messages', ({ chatId, messages }) => {
      setMessages(prev => ({
        ...prev,
        [chatId]: messages
      }));
    });

    newSocket.on('new_message', ({ chatId, message }) => {
      // Add message to chat
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message]
      }));

      // Update chat last message and move to top
      setChats(prev => {
        const updatedChats = prev.map(chat => {
          if (chat._id === chatId) {
            return {
              ...chat,
              lastMessage: message,
              lastMessageAt: message.createdAt
            };
          }
          return chat;
        });
        
        // Sort by last message time
        return updatedChats.sort((a, b) => 
          new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
        );
      });

      // Update unread count if not active chat
      if (activeChat?._id !== chatId) {
        setUnreadCounts(prev => ({
          ...prev,
          [chatId]: (prev[chatId] || 0) + 1
        }));
      }

      // Play notification sound (optional)
      playNotificationSound();
    });

    newSocket.on('user_typing', ({ chatId, userId, user }) => {
      setTypingUsers(prev => ({
        ...prev,
        [chatId]: {
          ...prev[chatId],
          [userId]: user
        }
      }));
    });

    newSocket.on('user_stopped_typing', ({ chatId, userId }) => {
      setTypingUsers(prev => {
        const chatTyping = { ...prev[chatId] };
        delete chatTyping[userId];
        
        return {
          ...prev,
          [chatId]: chatTyping
        };
      });
    });

    newSocket.on('message_read', ({ chatId, messageId, readBy }) => {
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId]?.map(msg => {
          if (msg._id === messageId) {
            const existingRead = msg.readBy?.find(read => read.userId === readBy);
            if (!existingRead) {
              return {
                ...msg,
                readBy: [...(msg.readBy || []), { userId: readBy, readAt: new Date() }]
              };
            }
          }
          return msg;
        }) || []
      }));
    });

    newSocket.on('message_reaction', ({ messageId, userId, reaction, reactions }) => {
      // Update message reactions
      Object.keys(messages).forEach(chatId => {
        setMessages(prev => ({
          ...prev,
          [chatId]: prev[chatId]?.map(msg => 
            msg._id === messageId ? { ...msg, reactions } : msg
          ) || []
        }));
      });
    });

    newSocket.on('user_status_change', ({ userId, isOnline }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (isOnline) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    newSocket.on('new_chat', (chat) => {
      setChats(prev => [chat, ...prev]);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      newSocket.close();
    };
  }, [user, token]);

  // Chat management functions
  const joinChat = (chatId) => {
    if (socket && chatId) {
      socket.emit('join_chat', { chatId });
      
      // Find and set active chat
      const chat = chats.find(c => c._id === chatId);
      if (chat) {
        setActiveChat(chat);
        
        // Reset unread count for this chat
        setUnreadCounts(prev => ({
          ...prev,
          [chatId]: 0
        }));
      }
    }
  };

  const leaveChat = (chatId) => {
    if (socket && chatId) {
      socket.emit('leave_chat', { chatId });
      
      if (activeChat?._id === chatId) {
        setActiveChat(null);
      }
    }
  };

  const sendMessage = (chatId, message, attachments = [], replyTo = null) => {
    if (socket && chatId && (message?.trim() || attachments.length > 0)) {
      socket.emit('send_message', {
        chatId,
        message: message?.trim(),
        attachments,
        replyTo
      });
    }
  };

  const startTyping = (chatId) => {
    if (socket && chatId) {
      socket.emit('typing_start', { chatId });
    }
  };

  const stopTyping = (chatId) => {
    if (socket && chatId) {
      socket.emit('typing_stop', { chatId });
    }
  };

  const markMessageAsRead = (chatId, messageId) => {
    if (socket && chatId && messageId) {
      socket.emit('read_message', { chatId, messageId });
    }
  };

  const reactToMessage = (messageId, reaction) => {
    if (socket && messageId) {
      socket.emit('react_to_message', { messageId, reaction });
    }
  };

  const createDirectMessage = async (recipientId) => {
    try {
      const response = await fetch('/api/chats/dm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ recipientId })
      });

      if (response.ok) {
        const result = await response.json();
        const newChat = result.data;
        
        // Add to chats if not exists
        setChats(prev => {
          const exists = prev.find(c => c._id === newChat._id);
          if (!exists) {
            return [newChat, ...prev];
          }
          return prev;
        });

        return newChat;
      }
    } catch (error) {
      console.error('Error creating direct message:', error);
    }
    return null;
  };

  const createGroupChat = async (name, description, members) => {
    if (socket) {
      socket.emit('create_group_chat', {
        name,
        description,
        members
      });
    }
  };

  const playNotificationSound = () => {
    // Optional: Play notification sound
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Could not play notification sound'));
    } catch (error) {
      // Ignore audio errors
    }
  };

  const getTotalUnreadCount = () => {
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
  };

  const getChatTypingUsers = (chatId) => {
    return Object.values(typingUsers[chatId] || {});
  };

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const value = {
    // Connection state
    socket,
    isConnected,
    
    // Data
    chats,
    activeChat,
    messages,
    unreadCounts,
    onlineUsers,
    
    // Actions
    joinChat,
    leaveChat,
    sendMessage,
    startTyping,
    stopTyping,
    markMessageAsRead,
    reactToMessage,
    createDirectMessage,
    createGroupChat,
    
    // Helpers
    getTotalUnreadCount,
    getChatTypingUsers,
    isUserOnline
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
