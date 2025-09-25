"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  Brain, 
  FileText, 
  Lightbulb, 
  Search, 
  Plus, 
  Zap, 
  MessageSquare,
  Wand2,
  Target,
  Clock,
  CheckCircle,
  Edit,
  Trash2
} from "lucide-react";
import apiClient from "@/lib/api-client";

export default function StudentAINotes() {
  const [aiNotes, setAiNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  
  // AI Note Generation Form
  const [generationForm, setGenerationForm] = useState({
    prompt: "",
    type: "explanation",
    length: "medium",
    subject: ""
  });

  useEffect(() => {
    loadAiNotes();
  }, []);

  const loadAiNotes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/student/notes/ai');
      
      if (response.success) {
        setAiNotes(response.data.notes || []);
      } else {
        // Use mock data if API fails
        setAiNotes(getMockAiNotes());
      }
    } catch (error) {
      console.error('Failed to load AI notes:', error);
      // Use mock data as fallback
      setAiNotes(getMockAiNotes());
    } finally {
      setLoading(false);
    }
  };

  const getMockAiNotes = () => [
    {
      _id: "ai1",
      title: "Calculus Derivatives Explained",
      content: "A comprehensive explanation of how derivatives work in calculus, including the power rule, product rule, and chain rule with examples.",
      type: "explanation",
      subject: "Mathematics",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      confidence: 95,
      length: "medium",
      wordCount: 450,
      readingTime: 2,
      aiModel: "GPT-4",
      prompt: "Explain calculus derivatives with examples"
    },
    {
      _id: "ai2", 
      title: "Physics Momentum Problem Solution",
      content: "Step-by-step solution for a complex momentum conservation problem involving two objects in collision.",
      type: "solution",
      subject: "Physics",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      confidence: 88,
      length: "long",
      wordCount: 850,
      readingTime: 4,
      aiModel: "GPT-4",
      prompt: "Solve this momentum conservation problem"
    },
    {
      _id: "ai3",
      title: "Organic Chemistry Reaction Mechanisms",
      content: "Detailed breakdown of SN1 and SN2 reaction mechanisms with electron movement diagrams.",
      type: "breakdown",
      subject: "Chemistry",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      confidence: 92,
      length: "short",
      wordCount: 320,
      readingTime: 1,
      aiModel: "Claude",
      prompt: "Break down SN1 vs SN2 reactions"
    },
    {
      _id: "ai4",
      title: "JavaScript Algorithm Analysis",
      content: "Analysis of time and space complexity for common sorting algorithms with implementation examples.",
      type: "analysis",
      subject: "Computer Science",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      confidence: 97,
      length: "medium",
      wordCount: 680,
      readingTime: 3,
      aiModel: "GPT-4",
      prompt: "Analyze sorting algorithm complexity"
    },
    {
      _id: "ai5",
      title: "World War I Timeline Summary",
      content: "Chronological summary of major events in World War I with key dates, battles, and political changes.",
      type: "summary",
      subject: "History",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      confidence: 85,
      length: "long",
      wordCount: 1200,
      readingTime: 6,
      aiModel: "Claude",
      prompt: "Summarize WWI timeline and key events"
    }
  ];

  const generateAiNote = async () => {
    if (!generationForm.prompt.trim()) return;
    
    try {
      setGenerating(true);
      const response = await apiClient.post('/student/notes/ai/generate', generationForm);
      
      if (response.success) {
        setAiNotes([response.data.note, ...aiNotes]);
        setGenerationForm({ prompt: "", type: "explanation", length: "medium", subject: "" });
        setShowGenerator(false);
      } else {
        throw new Error('Generation failed');
      }
    } catch (error) {
      console.error('Failed to generate AI note:', error);
      // Create a mock note for demo
      const mockNote = {
        _id: `ai_${Date.now()}`,
        title: `AI Generated: ${generationForm.prompt.substring(0, 50)}...`,
        content: `This is a mock AI-generated response for: "${generationForm.prompt}". The actual implementation would connect to an AI service.`,
        type: generationForm.type,
        subject: generationForm.subject || "General",
        createdAt: new Date().toISOString(),
        confidence: 90,
        length: generationForm.length,
        wordCount: 400,
        readingTime: 2,
        aiModel: "GPT-4",
        prompt: generationForm.prompt
      };
      setAiNotes([mockNote, ...aiNotes]);
      setGenerationForm({ prompt: "", type: "explanation", length: "medium", subject: "" });
      setShowGenerator(false);
    } finally {
      setGenerating(false);
    }
  };

  const filteredNotes = aiNotes.filter(note => {
    const matchesSearch = searchTerm === "" || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || note.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const noteTypes = ["all", "explanation", "solution", "breakdown", "analysis", "summary"];

  const getTypeIcon = (type) => {
    switch(type) {
      case "explanation": return <Lightbulb className="h-4 w-4" />;
      case "solution": return <CheckCircle className="h-4 w-4" />;
      case "breakdown": return <Target className="h-4 w-4" />;
      case "analysis": return <Brain className="h-4 w-4" />;
      case "summary": return <FileText className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case "explanation": return "bg-blue-100 text-blue-800";
      case "solution": return "bg-green-100 text-green-800";
      case "breakdown": return "bg-purple-100 text-purple-800";
      case "analysis": return "bg-orange-100 text-orange-800";
      case "summary": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
              <Brain className="h-8 w-8 text-purple-600" />
              AI Notes
              <Badge variant="outline" className="text-sm font-normal">
                {filteredNotes.length} generated
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-powered explanations, solutions, and analysis
            </p>
          </div>
          <Button 
            onClick={() => setShowGenerator(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Generate AI Note
          </Button>
        </div>

        {/* AI Note Generator */}
        {showGenerator && (
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Note Generator
              </CardTitle>
              <CardDescription>
                Describe what you'd like the AI to explain, solve, or analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Request</label>
                <Textarea
                  placeholder="e.g., Explain quantum mechanics, Solve this calculus problem, Analyze this code..."
                  value={generationForm.prompt}
                  onChange={(e) => setGenerationForm({...generationForm, prompt: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <select
                    value={generationForm.type}
                    onChange={(e) => setGenerationForm({...generationForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="explanation">Explanation</option>
                    <option value="solution">Solution</option>
                    <option value="breakdown">Breakdown</option>
                    <option value="analysis">Analysis</option>
                    <option value="summary">Summary</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Length</label>
                  <select
                    value={generationForm.length}
                    onChange={(e) => setGenerationForm({...generationForm, length: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject (optional)</label>
                  <Input
                    placeholder="e.g., Mathematics, Physics..."
                    value={generationForm.subject}
                    onChange={(e) => setGenerationForm({...generationForm, subject: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={generateAiNote}
                  disabled={generating || !generationForm.prompt.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {generating ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowGenerator(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search AI notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {noteTypes.map(type => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
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
              <Card key={note._id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                        {getTypeIcon(note.type)}
                        {note.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {note.content.substring(0, 100)}...
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className={getTypeColor(note.type)}>
                      {note.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {note.subject}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* AI Info */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {note.aiModel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {note.confidence}% confidence
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{note.wordCount} words</span>
                    <span>{note.readingTime} min read</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(note.createdAt)}
                    </span>
                  </div>

                  {/* Original Prompt */}
                  {note.prompt && (
                    <div className="text-xs bg-gray-50 p-2 rounded border-l-2 border-l-purple-300">
                      <span className="font-medium">Prompt:</span> {note.prompt}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <FileText className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredNotes.length === 0 && !loading && (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No AI notes found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedType !== "all" 
                ? "Try adjusting your search or filters" 
                : "Generate your first AI-powered note to get started!"
              }
            </p>
            {!searchTerm && selectedType === "all" && (
              <Button onClick={() => setShowGenerator(true)} className="bg-purple-600 hover:bg-purple-700">
                <Wand2 className="h-4 w-4 mr-2" />
                Generate AI Note
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
