"use client";

import React, { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import ChatWidget from './ChatWidget';

const ChatButton = ({ className = "" }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const chatContext = useChat();
  
  // Handle case where chat context might not be ready
  if (!chatContext) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={`relative ${className}`}
        disabled
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Chat
      </Button>
    );
  }

  const { getTotalUnreadCount, isConnected } = chatContext;
  const unreadCount = getTotalUnreadCount();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={`relative ${className}`}
        onClick={() => setChatOpen(true)}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Chat
        
        {/* Connection Status */}
        <div 
          className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} 
        />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      <ChatWidget 
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
};

export default ChatButton;
