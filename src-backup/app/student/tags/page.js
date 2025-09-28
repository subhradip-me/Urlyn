"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Hash, 
  TrendingUp, 
  Clock, 
  Search, 
  Filter,
  ExternalLink,
  FileText,
  Bookmark,
  Eye,
  BarChart3,
  Tags as TagsIcon,
  Tag,
  Grid3X3,
  List,
  Star,
  Calendar,
  Activity,
  Target,
  Zap,
  MousePointer,
  Timer,
  BookOpen,
  Globe
} from "lucide-react";

export default function StudentTagsPage() {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedTagContent, setSelectedTagContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getStudentTags();
      
      if (result.success && result.data?.tags) {
        setTags(result.data.tags);
        // Auto-select the most used tag to show content
        if (result.data.tags.length > 0) {
          const mostUsedTag = result.data.tags
            .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))[0];
          handleTagClick(mostUsedTag);
        }
      }
      
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = async (tag) => {
    try {
      setSelectedTag(tag);
      setContentLoading(true);
      
      // Fetch content related to this tag
      const result = await apiClient.getContentByTag(tag.name);
      console.log('Raw API response:', result);
      
      // Handle double-nested response structure
      let data = result.data;
      if (data?.data) {
        data = data.data; // Unwrap double nesting
      }
      
      if (result.success && data) {
        console.log('Processed data:', data);
        setSelectedTagContent({
          tag: data.tag || tag,
          content: data.content || [],
          counts: data.counts || { bookmarks: 0, notes: 0, total: 0 }
        });
      } else {
        console.warn('Unexpected API response:', result);
        setSelectedTagContent({
          tag: tag,
          content: [],
          counts: { bookmarks: 0, notes: 0, total: 0 }
        });
      }
    } catch (error) {
      console.error('Error loading tag content:', error);
      setSelectedTagContent({
        tag: tag,
        content: [],
        counts: { bookmarks: 0, notes: 0, total: 0 }
      });
    } finally {
      setContentLoading(false);
    }
  };

  // Process tags data
  const recentTags = tags
    .filter(tag => tag.metadata?.lastUsed)
    .sort((a, b) => new Date(b.metadata.lastUsed) - new Date(a.metadata.lastUsed))
    .slice(0, 8);

  const mostUsedTags = tags
    .filter(tag => tag.usageCount > 0)
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, 12);

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tag.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(tags.map(tag => tag.category).filter(Boolean))];

  const formatTimeAgo = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const tagDate = new Date(date);
    const diffInHours = Math.floor((now - tagDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  const getTagIcon = (category) => {
    const icons = {
      'academic': '🎓',
      'technology': '💻',
      'research': '🔬',
      'personal': '👤',
      'work': '💼',
      'project': '📋',
      'reference': '📚',
      'idea': '💡',
      'important': '⭐',
      'bookmark': '🔖',
      'note': '📝'
    };
    return icons[category?.toLowerCase()] || '🏷️';
  };

  const getTagColor = (category, usageCount = 0) => {
    if (usageCount > 20) return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
    if (usageCount > 10) return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
    if (usageCount > 5) return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
    
    const colors = {
      'academic': 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
      'technology': 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200',
      'research': 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200',
      'personal': 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200',
      'work': 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
      'project': 'bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200'
    };
    return colors[category?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
  };

  if (loading) {
    return (
      <DashboardLayout persona="student">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <TagsIcon className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold">Content Tags</h1>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your tags...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout persona="student">
      <div className="p-6 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TagsIcon className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold">Content Tags</h1>
              <p className="text-muted-foreground">Organize and discover your content</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {tags.length} Tags Total
            </Badge>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          
          {/* Left Column - Tags */}
          <div className="flex flex-col min-h-0">
            
            {/* Single Tags Container */}
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-4 flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-purple-600" />
                  Your Tags
                  <Badge variant="outline" className="ml-auto text-sm">
                    {tags.length} Total
                  </Badge>
                </CardTitle>
                
                {/* Search and Filter Controls */}
                <div className="flex gap-3 mt-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Category Filter Dropdown */}
                  {categories.length > 0 && (
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[120px]"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                      <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto space-y-6">
                  
                  {/* Recent Tags Section */}
                  {recentTags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        Recently Used ({recentTags.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {recentTags.map((tag) => (
                          <Badge
                            key={tag._id}
                            variant="outline"
                            className={`cursor-pointer transition-all hover:shadow-sm text-xs border-blue-500 bg-blue-400/20 hover:bg-blue-400/30 ${
                              selectedTag?._id === tag._id ? 'ring-2 ring-purple-500 ring-offset-1' : ''
                            }`}
                            onClick={() => handleTagClick(tag)}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag.name}
                            <span className="ml-1 text-xs opacity-70">({tag.usageCount || 0})</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Most Used Tags Section */}
                  {mostUsedTags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        Most Used ({mostUsedTags.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {mostUsedTags.map((tag, index) => (
                          <Badge
                            key={tag._id}
                            variant="outline"
                            className={`cursor-pointer transition-all hover:shadow-sm text-xs border-green-500 bg-green-400/20 hover:bg-green-400/30 ${
                              selectedTag?._id === tag._id ? 'ring-2 ring-purple-500 ring-offset-1' : ''
                            }`}
                            onClick={() => handleTagClick(tag)}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag.name}
                            <span className="ml-1 text-xs opacity-70">({tag.usageCount || 0})</span>
                            {index < 3 && (
                              <span className="ml-1 text-xs bg-yellow-500/20 text-yellow-800 px-1 rounded">
                                #{index + 1}
                              </span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Tags Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      <List className="h-4 w-4 text-purple-600" />
                      All Tags ({filteredTags.length})
                    </h3>
                    {filteredTags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {filteredTags.map((tag) => (
                          <Badge
                            key={tag._id}
                            variant="outline"
                            className={`cursor-pointer transition-all hover:shadow-sm text-xs border-purple-500 bg-purple-400/20 hover:bg-purple-400/30 ${
                              selectedTag?._id === tag._id ? 'ring-2 ring-purple-500 ring-offset-1' : ''
                            }`}
                            onClick={() => handleTagClick(tag)}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag.name}
                            <span className="ml-1 text-xs opacity-70">({tag.usageCount || 0})</span>
                            {tag.category && (
                              <span className="ml-1 text-xs bg-gray-500/20 text-gray-700 px-1 rounded">
                                {tag.category}
                              </span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <TagsIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {searchTerm || selectedCategory !== "all" 
                            ? "No tags match your filters" 
                            : "No tags found"}
                        </p>
                      </div>
                    )}
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {selectedTag ? (
                      <>
                        <span>{getTagIcon(selectedTag.category)}</span>
                        Content for "{selectedTag.name}"
                      </>
                    ) : (
                      <>
                        <FileText className="h-5 w-5 text-blue-600" />
                        Related Content
                      </>
                    )}
                  </span>
                  {selectedTagContent && (
                    <Badge variant="outline" className="text-sm">
                      {selectedTagContent.counts.total} items
                    </Badge>
                  )}
                </CardTitle>
                
                {selectedTagContent && (
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <Bookmark className="h-3 w-3 mr-1" />
                      {selectedTagContent.counts.bookmarks} bookmarks
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      {selectedTagContent.counts.notes} notes
                    </Badge>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  {contentLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading content...</p>
                      </div>
                    </div>
                  ) : selectedTagContent ? (
                    <div className="space-y-4">
                      {selectedTagContent.content.length > 0 ? (
                        selectedTagContent.content.map((item) => (
                          <div
                            key={item.id}
                            className="group p-5 border border-gray-200 rounded-xl bg-white hover:shadow-lg hover:border-gray-300 transition-all duration-200 hover:scale-[1.01]"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="flex-shrink-0 mt-0.5">
                                  {item.type === 'bookmark' ? (
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                      <Bookmark className="h-4 w-4 text-blue-600" />
                                    </div>
                                  ) : (
                                    <div className="p-2 bg-green-100 rounded-lg">
                                      <FileText className="h-4 w-4 text-green-600" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                  </h3>
                                  {item.type === 'bookmark' && item.url && (
                                    <p className="text-xs text-gray-500 mb-2 truncate">
                                      {item.url}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {item.type === 'bookmark' && item.url && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:bg-blue-50 hover:text-blue-600"
                                  onClick={() => window.open(item.url, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            
                            {item.description && (
                              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                {item.description.length > 150 
                                  ? `${item.description.substring(0, 150)}...` 
                                  : item.description}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                {item.type === 'bookmark' && (
                                  <>
                                    {item.domain && (
                                      <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                        <Globe className="h-3 w-3" />
                                        {item.domain}
                                      </span>
                                    )}
                                    {item.clicks !== undefined && (
                                      <span className="flex items-center gap-1.5">
                                        <MousePointer className="h-3 w-3" />
                                        {item.clicks} clicks
                                      </span>
                                    )}
                                  </>
                                )}
                                
                                {item.type === 'note' && (
                                  <>
                                    {item.wordCount && (
                                      <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                        <BookOpen className="h-3 w-3" />
                                        {item.wordCount} words
                                      </span>
                                    )}
                                    {item.readingTime && (
                                      <span className="flex items-center gap-1.5">
                                        <Timer className="h-3 w-3" />
                                        {item.readingTime} min read
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                              
                              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                {new Date(item.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: new Date(item.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                })}
                              </span>
                            </div>
                            
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-gray-100">
                                {item.tags.slice(0, 4).map((tag, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="secondary" 
                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                                    onClick={() => handleTagClick({ name: typeof tag === 'string' ? tag : tag.name })}
                                  >
                                    <Hash className="h-2.5 w-2.5 mr-1" />
                                    {typeof tag === 'string' ? tag : tag.name}
                                  </Badge>
                                ))}
                                {item.tags.length > 4 && (
                                  <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
                                    <span className="text-gray-400">+{item.tags.length - 4}</span>
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">No Content Found</h3>
                          <p className="text-muted-foreground">
                            This tag doesn't have any associated bookmarks or notes yet.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <TagsIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Select a Tag</h3>
                      <p className="text-muted-foreground">
                        Choose a tag from the left to view its related content.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

