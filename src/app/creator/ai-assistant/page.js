'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { useState } from 'react';

export default function CreatorAIAssistantPage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your Creative AI Assistant. I can help you with content ideas, writing, scriptwriting, SEO optimization, and creative strategies. What would you like to work on today?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
  ]);

  const quickPrompts = [
    "Generate 10 YouTube video ideas for tech content",
    "Write a script for a 60-second TikTok about productivity",
    "Suggest trending hashtags for my content",
    "Help me optimize this blog post for SEO",
    "Create a content calendar for this month",
    "Write engaging social media captions",
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    // Simulate AI response
    const aiResponse = {
      role: 'assistant',
      content: "I'm processing your request! This is a demo response. In a real implementation, this would connect to an AI service to provide intelligent content assistance.",
      timestamp: new Date(Date.now() + 1000),
    };

    setChatHistory([...chatHistory, userMessage, aiResponse]);
    setMessage('');
  };

  return (
    <DashboardLayout persona="creator">
      <div className="h-[calc(100vh-200px)] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Creative Assistant</h1>
            <p className="text-gray-600">Your intelligent partner for content creation</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200">
              Templates
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              New Chat
            </button>
          </div>
        </div>

        <div className="flex-1 flex gap-6">
          {/* Quick Actions Sidebar */}
          <div className="w-80 bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(prompt)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-purple-50 rounded-lg text-sm text-gray-700 hover:text-purple-700 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">AI Capabilities</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-gray-600">Content Ideation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-gray-600">Script Writing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-gray-600">SEO Optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-gray-600">Trend Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-gray-600">Content Planning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-gray-600">Copy Writing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200">
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    } rounded-lg p-4`}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div className={`text-xs mt-2 ${
                        msg.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about content creation..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <button className="text-sm text-gray-500 hover:text-purple-600">
                  📎 Attach File
                </button>
                <button className="text-sm text-gray-500 hover:text-purple-600">
                  🎤 Voice Input
                </button>
                <button className="text-sm text-gray-500 hover:text-purple-600">
                  📷 Upload Image
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">147</div>
            <div className="text-sm text-gray-600">Ideas Generated</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">23</div>
            <div className="text-sm text-gray-600">Scripts Created</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">89</div>
            <div className="text-sm text-gray-600">SEO Optimizations</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">95%</div>
            <div className="text-sm text-gray-600">Content Quality Score</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
