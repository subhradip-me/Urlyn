"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
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
  const [selectedNote, setSelectedNote] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
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
      console.log('Loading AI notes...');
      const response = await apiClient.get('/student/notes/ai');
      
      if (response.success && response.data) {
        console.log('API Response:', response);
        const notes = response.data.notes || [];
        // Ensure notes is always an array and filter out any invalid notes
        setAiNotes(Array.isArray(notes) ? notes.filter(note => note && note.title) : []);
      } else {
        console.log('API failed, using mock data');
        // Use mock data if API fails
        setAiNotes(getMockAiNotes());
      }
    } catch (error) {
      console.error('Failed to load AI notes:', error);
      console.log('Using mock data as fallback');
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
      console.log('Generating AI note with:', generationForm);
      
      const response = await apiClient.post('/student/notes/ai/generate', generationForm);
      console.log('Generation response:', response);
      
      if (response.success && response.data && response.data.note) {
        const newNote = response.data.note;
        console.log('New AI note created:', newNote);
        setAiNotes([newNote, ...aiNotes]);
        setGenerationForm({ prompt: "", type: "explanation", length: "medium", subject: "" });
        setShowGenerator(false);
      } else {
        console.warn('Generation response was not successful:', response);
        throw new Error('Generation failed - invalid response');
      }
    } catch (error) {
      console.error('Failed to generate AI note:', error);
      console.log('Creating fallback mock note...');
      // Create a mock note for demo
      const mockNote = {
        _id: `ai_${Date.now()}`,
        title: `AI Generated: ${generationForm.prompt.substring(0, 50)}${generationForm.prompt.length > 50 ? '...' : ''}`,
        content: `This is a mock AI-generated response for: "${generationForm.prompt}". The actual implementation would connect to an AI service to provide a detailed ${generationForm.type} about ${generationForm.subject || 'the topic'}.`,
        type: 'ai-generated',
        subject: generationForm.subject || "General",
        createdAt: new Date().toISOString(),
        aiMetadata: {
          model: "GPT-4",
          generationType: generationForm.type,
          prompt: generationForm.prompt,
          confidence: 90,
          processingTime: "2.1s"
        },
        wordCount: 400,
        readingTime: 2
      };
      console.log('Using mock note:', mockNote);
      setAiNotes([mockNote, ...aiNotes]);
      setGenerationForm({ prompt: "", type: "explanation", length: "medium", subject: "" });
      setShowGenerator(false);
    } finally {
      setGenerating(false);
    }
  };

  const filteredNotes = (aiNotes || []).filter(note => {
    // Ensure note exists and has required properties
    if (!note || !note.title) return false;
    
    const matchesSearch = searchTerm === "" || 
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const noteType = note.aiMetadata?.generationType || note.type || 'explanation';
    const matchesType = selectedType === "all" || noteType === selectedType;
    
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

  const deleteNote = async (noteId) => {
    if (!noteId) return;
    
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await apiClient.delete(`/student/notes/${noteId}`);
        if (response.success) {
          setAiNotes(aiNotes.filter(note => note._id !== noteId));
        }
      } catch (error) {
        console.error('Failed to delete note:', error);
        // Remove from local state anyway for demo
        setAiNotes(aiNotes.filter(note => note._id !== noteId));
      }
    }
  };

  const openNoteDetail = (note) => {
    if (!note) return;
    setSelectedNote(note);
    setShowDetailModal(true);
  };

  const editNote = (note) => {
    if (!note) return;
    // For now, we'll just open the detail modal in edit mode
    setSelectedNote({...note, isEditing: true});
    setShowDetailModal(true);
  };

  const startConversation = (note) => {
    // Ensure note exists before accessing properties
    if (!note) return;
    
    // Create a conversation prompt based on the note
    const conversationPrompt = `I'd like to discuss this note: "${note.title || 'Untitled'}". The original request was: "${note.aiMetadata?.prompt || note.prompt || 'N/A'}". Can you help me understand it better or answer follow-up questions?`;
    
    // For now, we'll generate a new AI note as a follow-up
    setGenerationForm({
      prompt: conversationPrompt,
      type: "explanation",
      length: "medium",
      subject: note.subject || "General"
    });
    setShowGenerator(true);
    
    // Close the modal if open
    if (showDetailModal) {
      setShowDetailModal(false);
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
                        {getTypeIcon(note.aiMetadata?.generationType || note.type || 'explanation')}
                        {note.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        <span className="text-sm text-muted-foreground line-clamp-3 block">
                          {(note.content || '').replace(/[#*`]/g, '').substring(0, 150) + '...'}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className={getTypeColor(note.aiMetadata?.generationType || note.type || 'explanation')}>
                      {note.aiMetadata?.generationType || note.type || 'explanation'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {note.subject || 'General'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* AI Info */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {note.aiMetadata?.model || 'AI Model'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {note.aiMetadata?.confidence || note.confidence || 90}% confidence
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{note.wordCount || Math.floor(note.content?.length / 5) || 0} words</span>
                    <span>{note.readingTime || Math.ceil((note.content?.length || 0) / 1000) || 1} min read</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(note.createdAt || note.updatedAt)}
                    </span>
                  </div>

                  {/* Original Prompt */}
                  {(note.aiMetadata?.prompt || note.prompt) && (
                    <div className="text-xs bg-gray-50 p-2 rounded border-l-2 border-l-purple-300">
                      <span className="font-medium">Prompt:</span> {note.aiMetadata?.prompt || note.prompt}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => openNoteDetail(note)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => editNote(note)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => startConversation(note)}
                    >
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

      {/* Note Detail Modal */}
      {showDetailModal && selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getTypeIcon(selectedNote.aiMetadata?.generationType || selectedNote.type || 'explanation')}
                  <h2 className="text-2xl font-bold">{selectedNote.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowDetailModal(false)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getTypeColor(selectedNote.aiMetadata?.generationType || selectedNote.type || 'explanation')}>
                  {selectedNote.aiMetadata?.generationType || selectedNote.type || 'explanation'}
                </Badge>
                <Badge variant="outline">
                  {selectedNote.subject || 'General'}
                </Badge>
                <Badge variant="outline" className="text-purple-600">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {selectedNote.aiMetadata?.model || selectedNote.aiModel || 'AI Generated'}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(selectedNote.createdAt || selectedNote.updatedAt)}
                </span>
                <span>{selectedNote.wordCount || Math.floor(selectedNote.content?.length / 5) || 0} words</span>
                <span>{selectedNote.readingTime || Math.ceil((selectedNote.content?.length || 0) / 1000) || 1} min read</span>
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {selectedNote.aiMetadata?.confidence || selectedNote.confidence || 90}% confidence
                </span>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Original Prompt */}
              {(selectedNote.aiMetadata?.prompt || selectedNote.prompt) && (
                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="font-semibold text-sm text-purple-800 mb-2 flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Original Request
                  </h3>
                  <p className="text-sm text-purple-700">
                    {selectedNote.aiMetadata?.prompt || selectedNote.prompt}
                  </p>
                </div>
              )}

              {/* Content with proper markdown rendering */}
              <div className="markdown-content prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-8 border-b border-gray-200 pb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-semibold mb-3 text-gray-800 mt-6" {...props} />,
                    h4: ({node, ...props}) => <h4 className="text-lg font-medium mb-2 text-gray-700 mt-4" {...props} />,
                    h5: ({node, ...props}) => <h5 className="text-base font-medium mb-2 text-gray-700 mt-3" {...props} />,
                    h6: ({node, ...props}) => <h6 className="text-sm font-medium mb-2 text-gray-600 mt-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-700 text-base" {...props} />,
                    ul: ({node, ...props}) => <ul className="mb-4 pl-6 space-y-2 list-disc" {...props} />,
                    ol: ({node, ...props}) => <ol className="mb-4 pl-6 space-y-2 list-decimal" {...props} />,
                    li: ({node, ...props}) => <li className="text-gray-700 leading-relaxed" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-300 pl-4 my-4 italic text-gray-600 bg-gray-50 py-2" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline 
                        ? <code className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-mono" {...props} />
                        : <code className="block bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto border" {...props} />,
                    pre: ({node, ...props}) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4 border" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                    em: ({node, ...props}) => <em className="italic text-gray-700" {...props} />,
                    table: ({node, ...props}) => <table className="min-w-full divide-y divide-gray-200 my-4" {...props} />,
                    thead: ({node, ...props}) => <thead className="bg-gray-50" {...props} />,
                    tbody: ({node, ...props}) => <tbody className="bg-white divide-y divide-gray-200" {...props} />,
                    tr: ({node, ...props}) => <tr {...props} />,
                    th: ({node, ...props}) => <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />,
                    td: ({node, ...props}) => <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900" {...props} />,
                    hr: ({node, ...props}) => <hr className="my-6 border-gray-300" {...props} />,
                  }}
                >
                  {selectedNote.content}
                </ReactMarkdown>
              </div>

              {/* AI Metadata */}
              {selectedNote.aiMetadata && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Generation Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Model:</span>
                      <p className="font-medium">{selectedNote.aiMetadata.model}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium">{selectedNote.aiMetadata.generationType}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confidence:</span>
                      <p className="font-medium">{selectedNote.aiMetadata.confidence}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Processing Time:</span>
                      <p className="font-medium">{selectedNote.aiMetadata.processingTime || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-2">
              <Button 
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                onClick={() => startConversation(selectedNote)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask Follow-up Question
              </Button>
              <Button 
                variant="outline"
                onClick={() => editNote(selectedNote)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Note
              </Button>
              <Button 
                variant="outline" 
                className="text-red-600 hover:text-red-700"
                onClick={() => {
                  setShowDetailModal(false);
                  deleteNote(selectedNote._id);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
