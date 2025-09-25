"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { UserPlus, Users, Share2, MessageSquare, FileText, Search, Eye, ExternalLink, Filter } from "lucide-react";
import apiClient from "@/lib/api-client";
import { ChatProvider } from "@/contexts/ChatContext";
import ChatWidget from "@/components/chat/ChatWidget";
import ChatButton from "@/components/chat/ChatButton";

export default function StudentSharedNotes() {
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedNoteForChat, setSelectedNoteForChat] = useState(null);

  useEffect(() => {
    loadSharedNotes();
  }, []);

  const loadSharedNotes = async () => {
    try {
      setLoading(true);
      console.log('Loading shared notes...');
      const response = await apiClient.get('/student/notes/shared/all');
      
      if (response.success) {
        console.log('API Response:', response);
        setSharedNotes(response.data.notes || []);
      } else {
        console.log('API failed, using mock data');
        // Use mock data if API fails
        setSharedNotes(getMockSharedNotes());
      }
    } catch (error) {
      console.error('Failed to load shared notes:', error);
      console.log('Using mock data as fallback');
      // Use mock data as fallback
      setSharedNotes(getMockSharedNotes());
    } finally {
      setLoading(false);
    }
  };

  const getMockSharedNotes = () => [
    {
      _id: "1",
      title: "Calculus Study Group Notes",
      content: "Comprehensive notes on derivatives and integrals from our study group.",
      userId: { 
        firstName: "Sarah", 
        lastName: "Chen", 
        email: "sarah.chen@example.com" 
      },
      tagIds: [
        { name: "mathematics", color: "#3B82F6", emoji: "📐" },
        { name: "calculus", color: "#10B981", emoji: "∫" }
      ],
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      wordCount: 850,
      readingTime: 4,
      priority: "high"
    },
    {
      _id: "2", 
      title: "Physics Lab Report Template",
      content: "A comprehensive template for writing physics lab reports with proper formatting.",
      userId: { 
        firstName: "Mike", 
        lastName: "Johnson", 
        email: "mike.johnson@example.com" 
      },
      tagIds: [
        { name: "physics", color: "#F59E0B", emoji: "⚡" },
        { name: "template", color: "#8B5CF6", emoji: "📝" }
      ],
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      wordCount: 650,
      readingTime: 3,
      priority: "medium"
    },
    {
      _id: "3",
      title: "Computer Science Assignment Solutions",
      content: "Solutions and explanations for common CS algorithms and data structures.",
      userId: { 
        firstName: "Alex", 
        lastName: "Wong", 
        email: "alex.wong@example.com" 
      },
      tagIds: [
        { name: "computer-science", color: "#06B6D4", emoji: "💻" },
        { name: "algorithms", color: "#84CC16", emoji: "🧮" }
      ],
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      wordCount: 1200,
      readingTime: 6,
      priority: "high"
    },
    {
      _id: "4",
      title: "History Essay Research",
      content: "Research notes and sources for World War I essay assignment.",
      userId: { 
        firstName: "Emma", 
        lastName: "Davis", 
        email: "emma.davis@example.com" 
      },
      tagIds: [
        { name: "history", color: "#EF4444", emoji: "📚" },
        { name: "research", color: "#EC4899", emoji: "🔍" }
      ],
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      wordCount: 950,
      readingTime: 5,
      priority: "low"
    }
  ];

  const filteredNotes = sharedNotes.filter(note => {
    const matchesSearch = searchTerm === "" || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === "all" || 
      note.tagIds.some(tag => tag.name.toLowerCase().includes(selectedSubject.toLowerCase()));
    
    return matchesSearch && matchesSubject;
  });

  const subjects = ["all", "mathematics", "physics", "computer-science", "history", "chemistry"];

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const handleStartChat = (noteId) => {
    setSelectedNoteForChat(noteId);
    setChatOpen(true);
  };

  return (
    <ChatProvider>
      <DashboardLayout persona="student">
        <div className="flex h-full bg-gray-50">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Shared Notes</h2>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Share2 className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search task, messages,employee etc."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">All Status</span>
              </div>
              <div className="space-y-1">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedSubject === subject 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {subject === "all" ? "All Subjects" : subject.charAt(0).toUpperCase() + subject.slice(1).replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="space-y-2 p-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="animate-pulse p-3 border-b border-gray-100">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-0">
                  {filteredNotes.map((note, index) => (
                    <div 
                      key={note._id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        index === 0 ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 mt-1">
                          <AvatarFallback className="text-sm bg-blue-100 text-blue-700">
                            {getInitials(note.userId.firstName, note.userId.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate text-sm">
                              {note.userId.firstName} {note.userId.lastName}
                            </h3>
                            <span className="text-xs text-gray-500 ml-2">
                              {formatTimeAgo(note.updatedAt)}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-800 mt-1 truncate">
                            {note.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {note.content.substring(0, 80)}...
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {note.tagIds.slice(0, 2).map(tag => (
                              <Badge key={tag.name} variant="outline" className="text-xs px-1.5 py-0.5">
                                {tag.emoji}
                              </Badge>
                            ))}
                            {note.tagIds.length > 2 && (
                              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                +{note.tagIds.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Status indicator */}
                        {note.priority === 'high' && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Main Content Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {filteredNotes.length > 0 ? getInitials(filteredNotes[0].userId.firstName, filteredNotes[0].userId.lastName) : 'SN'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {filteredNotes.length > 0 ? filteredNotes[0].title : 'Select a note to view'}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {filteredNotes.length > 0 ? `Applied ${formatTimeAgo(filteredNotes[0].updatedAt)}` : 'Choose from the sidebar'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content Body */}
            <div className="flex-1 p-6 bg-white overflow-y-auto">
              {filteredNotes.length > 0 ? (
                <div className="space-y-6">
                  {/* Note Content */}
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {filteredNotes[0].content}
                    </p>
                  </div>

                  {/* Applied Jobs Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Applied Jobs</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-medium">
                            S
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Senior Product Designer</h4>
                            <p className="text-sm text-gray-500">Full Time • Thorington • 6 days</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-gray-500">Status</div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-700">Screening</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 text-gray-400">📧</div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm text-gray-900">{filteredNotes[0].userId.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 text-gray-400">📞</div>
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="text-sm text-gray-900">(229) 555-0109</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 text-gray-400">📍</div>
                        <span className="text-sm text-gray-600">Address:</span>
                        <span className="text-sm text-gray-900">1901 Thornridge Cir, Shiloh, Hawaii 81063</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 text-gray-400">🔗</div>
                        <span className="text-sm text-gray-600">Skype:</span>
                        <span className="text-sm text-blue-600">royalparvej</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 italic">Was something...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No note selected</h3>
                    <p className="text-gray-400">Select a note from the sidebar to view its details</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Contact Info */}
          {filteredNotes.length > 0 && (
            <div className="w-80 bg-white border-l border-gray-200 p-6">
              <div className="text-center mb-6">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                    {getInitials(filteredNotes[0].userId.firstName, filteredNotes[0].userId.lastName)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-gray-900">
                  {filteredNotes[0].userId.firstName} {filteredNotes[0].userId.lastName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Applied a week ago</p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">{filteredNotes[0].wordCount}</div>
                    <div className="text-sm text-blue-600">Words</div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{filteredNotes[0].readingTime}</div>
                    <div className="text-sm text-green-600">Min Read</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {filteredNotes[0].tagIds.map(tag => (
                    <Badge key={tag.name} variant="outline" className="text-xs">
                      {tag.emoji} {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleStartChat(filteredNotes[0]._id)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Now
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Note
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Chat Widget */}
        <ChatWidget 
          isOpen={chatOpen} 
          onClose={() => setChatOpen(false)}
          initialChatId={selectedNoteForChat}
        />
      </DashboardLayout>
    </ChatProvider>
  );
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              Shared Notes
              <Badge variant="outline" className="text-sm font-normal">
                {filteredNotes.length} available
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover and access notes shared by your classmates
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Share2 className="h-4 w-4 mr-2" />
              Share My Notes
            </Button>
            <ChatButton className="ml-2" />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === "all" ? "All Subjects" : subject.charAt(0).toUpperCase() + subject.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <Card key={note._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {note.content.substring(0, 100)}...
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={note.priority === 'high' ? 'default' : note.priority === 'medium' ? 'secondary' : 'outline'}
                      className="ml-2"
                    >
                      {note.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(note.userId.firstName, note.userId.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {note.userId.firstName} {note.userId.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(note.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {note.tagIds.slice(0, 3).map(tag => (
                      <Badge key={tag.name} variant="outline" className="text-xs">
                        {tag.emoji} {tag.name}
                      </Badge>
                    ))}
                    {note.tagIds.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{note.tagIds.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{note.wordCount} words</span>
                    <span>{note.readingTime} min read</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStartChat(note._id)}
                    >
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

}
