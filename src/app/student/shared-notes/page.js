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

export default function StudentSharedNotes() {
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

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

  return (
    <DashboardLayout persona="student">
      <div className="p-6 space-y-6">
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
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Share2 className="h-4 w-4 mr-2" />
            Share My Notes
          </Button>
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
                    <Button size="sm" variant="outline">
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

        {filteredNotes.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No shared notes found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedSubject !== "all" 
                ? "Try adjusting your search or filters" 
                : "Be the first to share your notes with classmates!"
              }
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
