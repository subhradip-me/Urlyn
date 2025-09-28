"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  MessageSquare,
  Users,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search,
  X,
  Plus,
  Hash,
  User,
  Crown
} from 'lucide-react';

const ChatWidget = ({ isOpen, onClose, initialChatId = null }) => {
  const { user } = useAuth();
  const {
    chats,
    activeChat,
    messages,
    isConnected,
    joinChat,
    leaveChat,
    sendMessage,
    startTyping,
    stopTyping,
    getChatTypingUsers,
    isUserOnline,
    getTotalUnreadCount,
    unreadCounts
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    if (initialChatId && chats.length > 0) {
      const chat = chats.find(c => c._id === initialChatId);
      if (chat) {
        setSelectedChat(chat);
        joinChat(initialChatId);
      }
    }
  }, [initialChatId, chats]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChatSelect = (chat) => {
    if (selectedChat?._id !== chat._id) {
      if (selectedChat) {
        leaveChat(selectedChat._id);
      }
      setSelectedChat(chat);
      joinChat(chat._id);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (messageInput.trim() && selectedChat) {
      sendMessage(selectedChat._id, messageInput.trim());
      setMessageInput('');
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      stopTyping(selectedChat._id);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessageInput(value);

    if (selectedChat) {
      // Start typing indicator
      startTyping(selectedChat._id);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(selectedChat._id);
        typingTimeoutRef.current = null;
      }, 2000);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString();
  };

  const getChatDisplayName = (chat) => {
    if (chat.type === 'dm') {
      const otherMember = chat.members.find(m => m.userId._id !== user.id);
      return `${otherMember?.userId.firstName} ${otherMember?.userId.lastName}`;
    } else if (chat.type === 'group') {
      return chat.name;
    } else if (chat.type === 'item') {
      return `${chat.itemId?.title || 'Shared Item'}`;
    }
    return 'Unknown Chat';
  };

  const getChatIcon = (chat) => {
    switch (chat.type) {
      case 'dm':
        return <User className="h-4 w-4" />;
      case 'group':
        return <Users className="h-4 w-4" />;
      case 'item':
        return <Hash className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getLastMessagePreview = (chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const message = chat.lastMessage;
    const senderName = message.senderId._id === user.id ? 'You' : message.senderId.firstName;
    const content = message.messageType === 'file' ? '📎 Attachment' : message.message;
    
    return `${senderName}: ${content?.substring(0, 30)}${content?.length > 30 ? '...' : ''}`;
  };

  const filteredChats = chats.filter(chat => 
    getChatDisplayName(chat).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentChatMessages = selectedChat ? messages[selectedChat._id] || [] : [];
  const typingUsers = selectedChat ? getChatTypingUsers(selectedChat._id) : [];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[32rem] bg-background border rounded-lg shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">Chat</span>
          {getTotalUnreadCount() > 0 && (
            <Badge variant="destructive" className="text-xs">
              {getTotalUnreadCount()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <div className="w-40 border-r flex flex-col">
          {/* Search */}
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-8 text-xs"
              />
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1">
            <div className="p-1 space-y-1">
              {filteredChats.map(chat => (
                <button
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  className={`w-full p-2 rounded text-left transition-colors ${
                    selectedChat?._id === chat._id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getChatIcon(chat)}
                    <span className="text-xs font-medium truncate flex-1">
                      {getChatDisplayName(chat)}
                    </span>
                    {unreadCounts[chat._id] > 0 && (
                      <Badge variant="destructive" className="text-[10px] h-4 w-4 p-0 flex items-center justify-center">
                        {unreadCounts[chat._id]}
                      </Badge>
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {getLastMessagePreview(chat)}
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-1">
                    {formatTime(chat.lastMessageAt)}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getChatIcon(selectedChat)}
                    <div>
                      <div className="font-medium text-sm">
                        {getChatDisplayName(selectedChat)}
                      </div>
                      {selectedChat.type === 'dm' && (
                        <div className="text-xs text-muted-foreground">
                          {(() => {
                            const otherMember = selectedChat.members.find(m => m.userId._id !== user.id);
                            const isOnline = otherMember ? isUserOnline(otherMember.userId._id) : false;
                            return isOnline ? 'Online' : 'Offline';
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Phone className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Video className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-2">
                <div className="space-y-2">
                  {currentChatMessages.map((message, index) => {
                    const isOwnMessage = message.senderId._id === user.id;
                    const showAvatar = index === 0 || 
                      currentChatMessages[index - 1].senderId._id !== message.senderId._id;

                    return (
                      <div
                        key={message._id}
                        className={`flex gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isOwnMessage && showAvatar && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={message.senderId.avatar} />
                            <AvatarFallback className="text-[10px]">
                              {message.senderId.firstName?.charAt(0)}
                              {message.senderId.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {!isOwnMessage && !showAvatar && (
                          <div className="w-6" />
                        )}
                        
                        <div className={`max-w-[70%] ${isOwnMessage ? 'order-first' : ''}`}>
                          {!isOwnMessage && showAvatar && (
                            <div className="text-[10px] text-muted-foreground mb-1">
                              {message.senderId.firstName} {message.senderId.lastName}
                            </div>
                          )}
                          <div
                            className={`p-2 rounded-lg text-xs ${
                              isOwnMessage
                                ? 'bg-primary text-primary-foreground ml-auto'
                                : 'bg-secondary'
                            }`}
                          >
                            {message.message}
                          </div>
                          <div className={`text-[9px] text-muted-foreground mt-1 ${
                            isOwnMessage ? 'text-right' : 'text-left'
                          }`}>
                            {formatTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex gap-2 items-center">
                      <div className="w-6" />
                      <div className="bg-secondary p-2 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-2 border-t">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    ref={messageInputRef}
                    value={messageInput}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 h-8 text-xs"
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    type="submit"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    disabled={!messageInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-4">
              <div>
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Select a chat to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
