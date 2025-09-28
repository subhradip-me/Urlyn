"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bookmark,
  BookmarkPlus,
  ExternalLink,
  Search,
  Filter,
  FolderOpen,
  Tag,
  Archive,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Plus,
} from "lucide-react";
import apiClient from "@/lib/api-client";

const BookmarksPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  // Debug: Log auth state changes
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user: !!user, authLoading });
  }, [isAuthenticated, user, authLoading]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [folders, setFolders] = useState([]);
  const [userFolders, setUserFolders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [isLoadingAITags, setIsLoadingAITags] = useState(false);
  const [metadataError, setMetadataError] = useState(null);
  const [aiTagsError, setAiTagsError] = useState(null);
  const [showQuickFolderCreate, setShowQuickFolderCreate] = useState(false);
  const [quickFolderName, setQuickFolderName] = useState("");
  const [isCreatingQuickFolder, setIsCreatingQuickFolder] = useState(false);
  const [newBookmark, setNewBookmark] = useState({
    url: "",
    title: "",
    description: "",
    category: "other",
    folder: "General",
    tags: [],
    isPublic: false,
    favicon: "",
    metadata: null,
    aiTags: [],
  });

  // Load data when user is authenticated
  useEffect(() => {
    console.log('Bookmarks page: useEffect triggered', { isAuthenticated, user: !!user, loading });
    if (isAuthenticated && user) {
      console.log('Bookmarks page: User authenticated, fetching data...');
      fetchBookmarks();
      fetchFolders();
      fetchUserFolders();
      fetchCategories();
      fetchStats();
    } else {
      console.log('Bookmarks page: User not authenticated yet', { isAuthenticated, user: !!user, loading });
    }
  }, [searchTerm, selectedCategory, selectedFolder, isAuthenticated, user]);

  // Debounce metadata and AI tags fetching when URL changes
  useEffect(() => {
    if (newBookmark.url && newBookmark.url.startsWith("http")) {
      const timeoutId = setTimeout(() => {
        fetchUrlMetadata(newBookmark.url);
        fetchAITags(newBookmark.url);
      }, 1000); // Wait 1 second after user stops typing

      return () => clearTimeout(timeoutId);
    }
  }, [newBookmark.url]);

  const fetchBookmarks = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        ...(selectedFolder !== "all" && { folder: selectedFolder }),
      });

      const response = await apiClient.get(`/student/bookmarks?${params}`);
      console.log("Bookmarks response:", response.data); // Debug log
      setBookmarks(
        response.data.data?.bookmarks || response.data.bookmarks || []
      );
      setPagination(
        response.data.data?.pagination || response.data.pagination || {}
      );
    } catch (error) {
      console.error("Error fetching bookmarks:", error);

      // If error is about persona, redirect to dashboard
      if (error.message.includes("persona") || error.message.includes("403")) {
        console.log("Redirecting to dashboard due to persona issue");
        window.location.href = "/dashboard";
        return;
      }

      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFolders = async (retryCount = 0) => {
    try {
      console.log('Bookmarks page: Calling fetchUserFolders, attempt:', retryCount + 1);
      const response = await apiClient.getStudentFolders();
      console.log('Bookmarks page: User folders response:', response); // Debug log
      
      // Handle the API response structure: { data: { folders: [...], total: ... } }
      let foldersData = response?.data?.folders || response?.folders || [];
      
      // Ensure we have an array
      if (!Array.isArray(foldersData)) {
        console.warn('Bookmarks page: Folders data is not an array:', foldersData);
        foldersData = [];
      }
      
      console.log('Bookmarks page: User folders data:', foldersData);
      setUserFolders(foldersData);
    } catch (error) {
      console.error('Bookmarks page: Error fetching user folders:', error);
      
      // Retry up to 3 times with delay
      if (retryCount < 2) {
        console.log('Retrying folder fetch in 2 seconds...');
        setTimeout(() => {
          fetchUserFolders(retryCount + 1);
        }, 2000);
        return;
      }
      
      if (error.message.includes('persona') || error.message.includes('403')) {
        console.log('User may not have student persona selected');
      }
      // Always set an empty array on error
      setUserFolders([]);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await apiClient.get("/student/bookmarks/folders/list");
      console.log("Folders response:", response.data); // Debug log
      setFolders(response.data.data?.folders || response.data.folders || []);
    } catch (error) {
      console.error("Error fetching folders:", error);
      if (error.message.includes("persona") || error.message.includes("403")) {
        window.location.href = "/dashboard";
        return;
      }
      setFolders([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get(
        "/student/bookmarks/categories/list"
      );
      console.log("Categories response:", response.data); // Debug log
      setCategories(
        response.data.data?.categories || response.data.categories || []
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error.message.includes("persona") || error.message.includes("403")) {
        window.location.href = "/dashboard";
        return;
      }
      setCategories([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get("/student/bookmarks/stats/summary");
      console.log("Stats response:", response.data); // Debug log
      setStats(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.message.includes("persona") || error.message.includes("403")) {
        window.location.href = "/dashboard";
        return;
      }
    }
  };

  const detectPlatform = (url) => {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      const platforms = {
        "youtube.com": "YouTube",
        "youtu.be": "YouTube",
        "linkedin.com": "LinkedIn",
        "twitter.com": "Twitter/X",
        "x.com": "Twitter/X",
        "facebook.com": "Facebook",
        "instagram.com": "Instagram",
        "tiktok.com": "TikTok",
        "github.com": "GitHub",
        "stackoverflow.com": "Stack Overflow",
        "medium.com": "Medium",
      };

      for (const [domain, platform] of Object.entries(platforms)) {
        if (hostname.includes(domain)) {
          return platform;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const fetchAITags = async (url) => {
    if (!url || !url.startsWith("http")) return;

    setIsLoadingAITags(true);
    setAiTagsError(null);

    try {
      const response = await apiClient.generateAITags(url);
      const aiData = response.data;

      // Auto-fill AI-generated tags
      setNewBookmark((prev) => ({
        ...prev,
        aiTags: aiData.tags || [],
        tags: [...new Set([...prev.tags, ...(aiData.tags || [])])], // Merge with existing tags, remove duplicates
      }));

      setAiTagsError(null);
    } catch (error) {
      console.error("Error fetching AI tags:", error);

      let errorMessage = "Unable to generate AI tags";
      if (
        error.message.includes("Access forbidden") ||
        error.message.includes("403")
      ) {
        errorMessage =
          "Website blocks AI analysis. Tags will need to be added manually.";
      } else if (
        error.message.includes("not found") ||
        error.message.includes("404")
      ) {
        errorMessage = "Website not found for AI analysis";
      } else if (error.message.includes("timeout")) {
        errorMessage = "AI analysis took too long";
      }

      setAiTagsError(errorMessage);

      // Clear AI tags but keep user-entered tags
      setNewBookmark((prev) => ({
        ...prev,
        aiTags: [],
      }));
    } finally {
      setIsLoadingAITags(false);
    }
  };

  const fetchUrlMetadata = async (url) => {
    if (!url || !url.startsWith("http")) return;

    setIsLoadingMetadata(true);
    setMetadataError(null);

    try {
      const response = await apiClient.getUrlMetadata(url);
      const metadata = response.data;

      // Auto-fill fields if they're empty
      setNewBookmark((prev) => ({
        ...prev,
        title: prev.title || metadata.title || "",
        description: prev.description || metadata.description || "",
        favicon: metadata.favicon || "",
        metadata: metadata,
      }));

      setMetadataError(null);
    } catch (error) {
      console.error("Error fetching metadata:", error);

      const platform = detectPlatform(url);
      let errorMessage = "Unable to fetch website information";

      if (
        error.message.includes("Access forbidden") ||
        error.message.includes("403")
      ) {
        if (platform) {
          errorMessage = `${platform} blocks automatic information gathering. Please enter details manually.`;
        } else {
          errorMessage = "This website blocks automatic information gathering";
        }
      } else if (
        error.message.includes("not found") ||
        error.message.includes("404")
      ) {
        errorMessage = "Website not found or page does not exist";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Website took too long to respond";
      } else if (error.message.includes("Connection refused")) {
        errorMessage = "Unable to connect to website";
      }

      setMetadataError(errorMessage);

      // Clear any existing metadata but keep user-entered data
      setNewBookmark((prev) => ({
        ...prev,
        favicon: "",
        metadata: null,
      }));
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const handleUrlChange = (url) => {
    setNewBookmark((prev) => ({ ...prev, url }));
    setMetadataError(null); // Clear any previous errors
    setAiTagsError(null); // Clear any previous AI tag errors
  };

  const handleAddBookmark = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newBookmark.url) {
      alert("Please enter a URL");
      return;
    }

    try {
      console.log("Adding bookmark:", newBookmark);

      // Prepare bookmark data with metadata
      const bookmarkData = {
        ...newBookmark,
        // Include metadata for better bookmark display
        ...(newBookmark.metadata && {
          favicon: newBookmark.metadata.favicon,
          siteName: newBookmark.metadata.siteName,
          type: newBookmark.metadata.type,
          domain: newBookmark.metadata.url
            ? new URL(newBookmark.metadata.url).hostname
            : undefined,
        }),
      };

      const response = await apiClient.post("/student/bookmarks", bookmarkData);
      console.log("Bookmark added successfully:", response.data);

      // Refresh the bookmarks list instead of just adding to local state
      await fetchBookmarks();
      await fetchUserFolders(); // Refresh folders to update bookmark counts
      setNewBookmark({
        url: "",
        title: "",
        description: "",
        category: "other",
        folder: "General",
        tags: [],
        isPublic: false,
        favicon: "",
        metadata: null,
        aiTags: [],
      });
      setMetadataError(null);
      setAiTagsError(null);
      setShowAddForm(false);
      fetchStats();
    } catch (error) {
      console.error("Error adding bookmark:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add bookmark";
      alert("Error adding bookmark: " + errorMessage);
    }
  };

  const handleQuickCreateFolder = async (e) => {
    e.preventDefault();
    if (!quickFolderName.trim()) return;

    setIsCreatingQuickFolder(true);
    try {
      const response = await apiClient.createStudentFolder({
        name: quickFolderName.trim(),
        color: "#3B82F6",
        icon: "📂"
      });

      if (response.success && response.data) {
        // Refresh the folders list to get updated data
        await fetchUserFolders();
        
        // Update newBookmark to use the new folder
        setNewBookmark(prev => ({ ...prev, folder: response.data.name }));
        
        // Reset and close modal
        setQuickFolderName("");
        setShowQuickFolderCreate(false);
        
        console.log('✅ Quick folder created successfully:', response.data.name);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating quick folder:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create folder';
      alert('Error creating folder: ' + errorMessage);
    } finally {
      setIsCreatingQuickFolder(false);
    }
  };

  const handleVisit = async (bookmarkId, url) => {
    try {
      await apiClient.post(`/student/bookmarks/${bookmarkId}/visit`);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error recording visit:", error);
    }
  };

  const handleDelete = async (bookmarkId) => {
    if (window.confirm("Are you sure you want to delete this bookmark?")) {
      try {
        await apiClient.delete(`/student/bookmarks/${bookmarkId}`);
        setBookmarks(bookmarks.filter((b) => b._id !== bookmarkId));
        fetchStats();
      } catch (error) {
        console.error("Error deleting bookmark:", error);
      }
    }
  };

  const handleArchive = async (bookmarkId) => {
    try {
      await apiClient.patch(`/student/bookmarks/${bookmarkId}/archive`);
      setBookmarks(bookmarks.filter((b) => b._id !== bookmarkId));
      fetchStats();
    } catch (error) {
      console.error("Error archiving bookmark:", error);
    }
  };

  const BookmarkCard = ({ bookmark }) => (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Content - Better aligned with larger favicon */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="w-full flex items-center gap-2 mb-1">
                  {/* Favicon - Larger and better positioned */}
                  <div className="flex-shrink-0 mt-0.5">
                    {bookmark.favicon ? (
                      <img
                        src={bookmark.favicon}
                        alt=""
                        className="w-6 h-6 rounded-lg border border-gray-200 bg-white p-1.5 shadow-sm"
                        onError={(e) => {
                          // First fallback: Try Google's favicon service
                          const domain =
                            bookmark.domain ||
                            (bookmark.url
                              ? new URL(bookmark.url).hostname
                              : "");
                          const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

                          if (e.target.src !== googleFaviconUrl) {
                            e.target.src = googleFaviconUrl;
                          } else {
                            // If Google service also fails, hide image and show default icon
                            e.target.style.display = "none";
                            if (e.target.nextElementSibling) {
                              e.target.nextElementSibling.style.display =
                                "flex";
                            }
                          }
                        }}
                      />
                    ) : // Try Google's favicon service if no favicon provided
                    bookmark.domain || bookmark.url ? (
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${
                          bookmark.domain || new URL(bookmark.url).hostname
                        }&sz=64`}
                        alt=""
                        className="w-10 h-10 rounded-sm border border-gray-200 bg-white p-1.5 shadow-sm"
                        onError={(e) => {
                          // If Google service fails, hide image and show default icon
                          e.target.style.display = "none";
                          if (e.target.nextElementSibling) {
                            e.target.nextElementSibling.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    {/* Default fallback icon */}
                    <div
                      className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center shadow-sm"
                      style={{
                        display:
                          !bookmark.favicon && !bookmark.domain && !bookmark.url
                            ? "flex"
                            : "none",
                      }}
                    >
                      <Bookmark className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                  <h2 className="font-semibold text-gray-900 truncate text-base leading-tight">
                    {bookmark.title}
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {bookmark.description}
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <span className="font-medium">
                    {bookmark.domain || bookmark.metadata?.domain}
                  </span>
                  <span>•</span>
                  <span>{bookmark.visitCount} visits</span>
                  <span>•</span>
                  <span>
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleVisit(bookmark._id, bookmark.url)}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleArchive(bookmark._id)}
                >
                  <Archive className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(bookmark._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tags and Category */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge variant="outline" className="text-xs border-blue-500 bg-blue-400/20">
                {bookmark.category}
              </Badge>
              {bookmark.folder && (
                <Badge variant="secondary" className="text-xs border-amber-500 bg-amber-300/20">
                  <FolderOpen className="w-3 h-3 mr-1" />
                  {bookmark.folder}
                </Badge>
              )}
              {bookmark.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs border-green-500 bg-green-400/20">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AddBookmarkForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookmarkPlus className="w-5 h-5" />
          Add New Bookmark
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddBookmark} className="space-y-4">
          <div>
            <div className="relative">
              <Input
                placeholder="Enter URL (https://example.com)"
                value={newBookmark.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {newBookmark.url && newBookmark.url.startsWith("http") && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => fetchUrlMetadata(newBookmark.url)}
                    disabled={isLoadingMetadata}
                    title="Refresh metadata"
                  >
                    <RefreshCw
                      className={`h-3 w-3 ${
                        isLoadingMetadata ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                )}
                {newBookmark.url && newBookmark.url.startsWith("http") && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => fetchAITags(newBookmark.url)}
                    disabled={isLoadingAITags}
                    title="Generate AI tags"
                  >
                    <Tag
                      className={`h-3 w-3 ${
                        isLoadingAITags ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                )}
                {(isLoadingMetadata || isLoadingAITags) && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                )}
              </div>
            </div>

            {/* AI Tags Error */}
            {aiTagsError && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="text-orange-600 mt-0.5">🤖</div>
                  <div>
                    <div className="text-sm font-medium text-orange-800">
                      AI tag generation failed
                    </div>
                    <div className="text-xs text-orange-700 mt-1">
                      {aiTagsError}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Error */}
            {metadataError && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="text-yellow-600 mt-0.5">⚠️</div>
                  <div>
                    <div className="text-sm font-medium text-yellow-800">
                      Could not auto-fill information
                    </div>
                    <div className="text-xs text-yellow-700 mt-1">
                      {metadataError}. You can still add the bookmark manually.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Tags Preview */}
            {newBookmark.aiTags && newBookmark.aiTags.length > 0 && (
              <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 border border-green-200 rounded flex items-center justify-center">
                      <Tag className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 mb-2">
                      🤖 AI-Generated Tags
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newBookmark.aiTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-white"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      These tags were automatically generated based on the
                      website content. They are already added to your tags
                      below.
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-xs text-green-600 font-medium">
                      ✓ Auto-generated
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Preview */}
            {newBookmark.metadata && (
              <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg shadow-sm">
                <div className="flex items-start gap-3">
                  {(newBookmark.favicon || newBookmark.url) && (
                    <div className="flex-shrink-0">
                      <img
                        src={
                          newBookmark.favicon ||
                          `https://www.google.com/s2/favicons?domain=${
                            new URL(newBookmark.url).hostname
                          }&sz=64`
                        }
                        alt="Site favicon"
                        className="w-8 h-8 rounded border border-gray-200 bg-white p-1"
                        onError={(e) => {
                          // Try Google favicon service if original fails
                          const domain = new URL(newBookmark.url).hostname;
                          const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

                          if (e.target.src !== googleFaviconUrl) {
                            e.target.src = googleFaviconUrl;
                          } else {
                            // Hide if both fail
                            e.target.style.display = "none";
                          }
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {newBookmark.metadata.title || "Untitled"}
                    </div>
                    {newBookmark.metadata.description && (
                      <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {newBookmark.metadata.description}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium">
                        {newBookmark.metadata.siteName ||
                          new URL(newBookmark.url).hostname}
                      </span>
                      {newBookmark.metadata.type !== "website" && (
                        <>
                          <span>•</span>
                          <span className="capitalize">
                            {newBookmark.metadata.type}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-xs text-green-600 font-medium">
                      ✓ Auto-filled
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Title (optional - will be auto-fetched)"
              value={newBookmark.title}
              onChange={(e) =>
                setNewBookmark((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Select
              value={newBookmark.category}
              onValueChange={(value) =>
                setNewBookmark((prev) => ({
                  ...prev,
                  category: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
                <SelectItem value="tutorials">Tutorials</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Folder
              </label>
              <Select
                value={newBookmark.folder}
                onValueChange={(value) =>
                  setNewBookmark((prev) => ({ ...prev, folder: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {userFolders && Array.isArray(userFolders) && userFolders.length > 0 ? (
                    userFolders.map((folder) => (
                      <SelectItem key={folder._id} value={folder.name}>
                        {folder.name} ({folder.itemCounts?.total || 0})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="General">General (loading...)</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Select a folder or use General as default
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuickFolderCreate(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Quick Create
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Tags (comma-separated)"
                value={newBookmark.tags.join(", ")}
                onChange={(e) =>
                  setNewBookmark((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  }))
                }
              />
              {newBookmark.aiTags.length > 0 && (
                <div className="text-xs text-gray-500">
                  ✨ AI-generated tags ({newBookmark.aiTags.length}) have been
                  automatically added
                </div>
              )}
            </div>
          </div>

          <Input
            placeholder="Description (optional - will be auto-fetched)"
            value={newBookmark.description}
            onChange={(e) =>
              setNewBookmark((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newBookmark.isPublic}
                onChange={(e) =>
                  setNewBookmark((prev) => ({
                    ...prev,
                    isPublic: e.target.checked,
                  }))
                }
              />
              Make public
            </label>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoadingMetadata || isLoadingAITags}
            >
              {isLoadingMetadata || isLoadingAITags
                ? "Loading..."
                : "Add Bookmark"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setMetadataError(null);
                setAiTagsError(null);
                setNewBookmark({
                  url: "",
                  title: "",
                  description: "",
                  category: "other",
                  folder: "General",
                  tags: [],
                  isPublic: false,
                  favicon: "",
                  metadata: null,
                  aiTags: [],
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
            <p className="text-gray-600">
              Save and organize your favorite links
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                console.log('Manual refresh clicked');
                fetchUserFolders();
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Folders
            </Button>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Add Bookmark
            </Button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.totalBookmarks}</div>
                <div className="text-sm text-gray-600">Total Bookmarks</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.totalVisits}</div>
                <div className="text-sm text-gray-600">Total Visits</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {stats.categories?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {userFolders.length}
                </div>
                <div className="text-sm text-gray-600">Folders</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Folders Overview Section */}
        {userFolders.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Your Folders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* General Folder */}
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedFolder === "General" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedFolder("General")}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-500 flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">General</div>
                      <div className="text-sm text-gray-500">Default folder</div>
                    </div>
                  </div>
                </div>

                {/* User Created Folders */}
                {userFolders && Array.isArray(userFolders) && userFolders.map((folder) => (
                  <div 
                    key={folder._id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedFolder === folder.name ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedFolder(folder.name)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: folder.color }}
                      >
                        <FolderOpen className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{folder.name}</div>
                        <div className="text-sm text-gray-500">
                          {folder.itemCounts?.total || 0} items
                        </div>
                      </div>
                    </div>
                    {folder.description && (
                      <div className="text-sm text-gray-600 mt-2">
                        {folder.description}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add New Folder Button */}
                <div 
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center"
                  onClick={() => window.location.href = '/student/folders'}
                >
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center mx-auto mb-2">
                      <FolderOpen className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-sm text-gray-600">Create New Folder</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Form */}
        {showAddForm && <AddBookmarkForm />}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search Bar with Filter Button */}
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search bookmarks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {(selectedCategory !== "all" || selectedFolder !== "all") && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {[
                        selectedCategory !== "all" ? 1 : 0,
                        selectedFolder !== "all" ? 1 : 0,
                      ].reduce((a, b) => a + b, 0)}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Filter Dropdowns - Conditionally Shown */}
              {showFilters && (
                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-200">
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          {cat.name} ({cat.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedFolder}
                    onValueChange={(value) => setSelectedFolder(value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Folders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Folders</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                      {userFolders && Array.isArray(userFolders) && userFolders.map((folder) => (
                        <SelectItem key={folder._id} value={folder.name}>
                          {folder.name} ({folder.itemCounts?.total || 0})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Clear Filters Button */}
                  {(selectedCategory !== "all" || selectedFolder !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedFolder("all");
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bookmarks Grid */}
        {loading ? (
          <div className="text-center py-8">Loading bookmarks...</div>
        ) : bookmarks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookmarks found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ||
                selectedCategory !== "all" ||
                selectedFolder !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "Start by adding your first bookmark."}
              </p>
              {!showAddForm && (
                <Button onClick={() => setShowAddForm(true)}>
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Add Your First Bookmark
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark, index) => (
              <BookmarkCard
                key={bookmark._id || `bookmark-${index}`}
                bookmark={bookmark}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={page === pagination.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => fetchBookmarks(page)}
                >
                  {page}
                </Button>
              )
            )}
          </div>
        )}
      </div>

      {/* Quick Folder Creation Modal */}
      {showQuickFolderCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Folder
            </h3>
            <form onSubmit={handleQuickCreateFolder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Name
                </label>
                <Input
                  placeholder="Enter folder name"
                  value={quickFolderName}
                  onChange={(e) => setQuickFolderName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={isCreatingQuickFolder || !quickFolderName.trim()}
                  className="flex-1"
                >
                  {isCreatingQuickFolder ? "Creating..." : "Create Folder"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowQuickFolderCreate(false);
                    setQuickFolderName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BookmarksPage;
