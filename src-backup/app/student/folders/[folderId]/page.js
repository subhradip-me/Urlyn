"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Folder,
  BookMarked,
  Upload,
  FileText,
  File,
  Download,
  Eye,
  Trash2,
  Edit,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Calendar,
  User,
  ExternalLink,
  FolderOpen,
  Tag,
  Archive,
  Grid,
  List,
} from "lucide-react";
import apiClient from "@/lib/api-client";

const FolderDetailPage = () => {
  const { folderId } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [folder, setFolder] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableFolders, setAvailableFolders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("bookmarks");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [showUpload, setShowUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  // Filter bookmarks and files based on search term
  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFiles = files.filter(file =>
    file.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isAuthenticated && user && folderId) {
      fetchFolderDetails();
    }
  }, [isAuthenticated, user, folderId]);

  const fetchFolderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching folder details for folderId:', folderId);

      // First, let's get the user's available folders to help with debugging
      try {
        const foldersResponse = await apiClient.getStudentFolders();
        console.log('Raw folders response:', foldersResponse);
        
        // Handle the API response structure: { data: { folders: [...], total: ... } }
        let folders = foldersResponse?.data?.folders || foldersResponse?.folders || [];
        
        // Ensure we have an array
        if (!Array.isArray(folders)) {
          console.warn('Folders data is not an array:', folders);
          folders = [];
        }
        
        setAvailableFolders(folders);
        console.log('Available folders:', folders.map(f => ({ name: f.name, id: f._id })));
        
        // Check if the requested folder exists in the user's folders
        const folderExists = folders.some(f => f._id === folderId);
        console.log('Requested folder exists:', folderExists);
        
        if (!folderExists && folders.length > 0) {
          setError({
            type: 'not_found',
            message: 'Folder not found',
            availableFolders: folders
          });
          setLoading(false);
          return;
        } else if (folders.length === 0) {
          setError({
            type: 'no_folders',
            message: 'No folders available',
            availableFolders: []
          });
          setLoading(false);
          return;
        }
      } catch (foldersError) {
        console.error('Error fetching available folders:', foldersError);
        // Continue with the original request even if we can't get the folders list
      }

      // Get folder info and contents
      const [folderResponse, contentsResponse] = await Promise.all([
        apiClient.getStudentFolder(folderId),
        apiClient.getFolderContents(folderId, {
          includeBookmarks: 'true',
          includeNotes: 'true',
          includeTasks: 'true',
          limit: '50',
          offset: '0'
        })
      ]);

      console.log('Folder response:', folderResponse);
      console.log('Contents response:', contentsResponse);
      
      const folderData = folderResponse.data || folderResponse;
      const contentsData = contentsResponse.data || contentsResponse;

      setFolder(folderData);
      setBookmarks(contentsData.contents?.bookmarks || []);
      setFiles(contentsData.contents?.files || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching folder details:", error);
      
      setError({
        type: 'fetch_error',
        message: error.message,
        details: {
          folderId,
          user: user?._id,
          userEmail: user?.email,
          isAuthenticated
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (uploadedFiles) => {
    const formData = new FormData();

    Array.from(uploadedFiles).forEach((file) => {
      formData.append("files", file);
    });

    formData.append("folderId", folderId);

    try {
      setUploadProgress(0);

      const response = await fetch("/api/student/folders/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFiles((prev) => [...prev, ...data.data.files]);
        setShowUpload(false);
        setUploadProgress(0);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files: " + error.message);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await apiClient.delete(`/student/folders/files/${fileId}`);
        setFiles(files.filter((file) => file._id !== fileId));
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Error deleting file");
      }
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await fetch(
        `/api/student/folders/files/${fileId}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file");
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf"))
      return <FileText className="w-5 h-5 text-red-500" />;
    if (fileType.includes("image"))
      return <File className="w-5 h-5 text-blue-500" />;
    if (fileType.includes("document") || fileType.includes("word"))
      return <FileText className="w-5 h-5 text-blue-600" />;
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return <File className="w-5 h-5 text-green-600" />;
    if (fileType.includes("presentation") || fileType.includes("powerpoint"))
      return <File className="w-5 h-5 text-orange-600" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!folder && !loading) {
    if (error?.type === 'no_folders') {
      return (
        <DashboardLayout>
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No folders yet</h1>
            <p className="text-gray-600 mb-6">
              You haven't created any folders yet. Create your first folder to get started.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => router.push("/student/folders")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Folder
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/student/bookmarks")}
              >
                View Bookmarks Instead
              </Button>
            </div>
          </div>
        </DashboardLayout>
      );
    }

    if (error?.type === 'not_found') {
      return (
        <DashboardLayout>
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Folder not found</h1>
            <p className="text-gray-600 mb-4">
              The folder you're looking for doesn't exist or you don't have access to it.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Requested Folder ID:</strong> <code className="bg-white px-2 py-1 rounded border text-xs">{folderId}</code>
              </p>
              {user && (
                <p className="text-sm text-gray-700">
                  <strong>Current User:</strong> {user.email}
                </p>
              )}
            </div>
            
            {availableFolders.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Your available folders:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
                  {availableFolders.map((folder) => (
                    <Card 
                      key={folder._id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/student/folders/${folder._id}`)}
                    >
                      <CardContent className="p-4 text-center">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                          style={{
                            backgroundColor: folder.color + "20",
                            border: `2px solid ${folder.color}`,
                          }}
                        >
                          <Folder className="w-4 h-4" style={{ color: folder.color }} />
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm">{folder.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {folder.bookmarkCount || 0} bookmarks
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => router.push("/student/folders")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Folders
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </DashboardLayout>
      );
    }

    // Generic error fallback
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-4">
            {error?.message || "Unable to load folder details"}
          </p>
          {error?.details && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Folder ID:</strong> <code className="bg-white px-2 py-1 rounded border text-xs">{error.details.folderId}</code>
              </p>
              {error.details.userEmail && (
                <p className="text-sm text-gray-700 mb-2">
                  <strong>User:</strong> {error.details.userEmail}
                </p>
              )}
              <p className="text-sm text-gray-700">
                <strong>Authenticated:</strong> {error.details.isAuthenticated ? "Yes" : "No"}
              </p>
            </div>
          )}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => router.push("/student/folders")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Folders
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/student/folders")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: folder.color + "20",
                  border: `2px solid ${folder.color}`,
                }}
              >
                <Folder className="w-5 h-5" style={{ color: folder.color }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {folder.name}
                </h1>
                {folder.description && (
                  <p className="text-gray-600">{folder.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUpload(!showUpload)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Bookmark
            </Button>
          </div>
        </div>

        {/* Upload Area */}
        {showUpload && (
          <Card>
            <CardContent className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Files
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop files here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button as="span" className="cursor-pointer">
                    Select Files
                  </Button>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Supported: PDF, DOC, XLS, PPT, TXT, Images (max 10MB each)
                </p>

                {uploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {uploadProgress}% uploaded
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "bookmarks"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("bookmarks")}
              >
                <BookMarked className="w-4 h-4 mr-2 inline" />
                Bookmarks ({bookmarks.length})
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "files"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("files")}
              >
                <FileText className="w-4 h-4 mr-2 inline" />
                Files ({files.length})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === "bookmarks" ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            }
          >
            {filteredBookmarks.length === 0 ? (
              <div className={viewMode === "grid" ? "col-span-full" : ""}>
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookMarked className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "No bookmarks found" : "No bookmarks yet"}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Add your first bookmark to this folder"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark._id}
                  bookmark={bookmark}
                  viewMode={viewMode}
                />
              ))
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-4"
            }
          >
            {filteredFiles.length === 0 ? (
              <div className={viewMode === "grid" ? "col-span-full" : ""}>
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "No files found" : "No files yet"}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Upload your first files to this folder"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredFiles.map((file) => (
                <FileCard
                  key={file._id}
                  file={file}
                  onDelete={handleDeleteFile}
                  onDownload={handleDownloadFile}
                  getFileIcon={getFileIcon}
                  formatFileSize={formatFileSize}
                  viewMode={viewMode}
                />
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// BookmarkCard component
const BookmarkCard = ({ bookmark, viewMode = "grid" }) => {
  if (viewMode === "list") {
    return (
      <Card className="group hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 justify-start items-center">
                    {/* Favicon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {bookmark.favicon ? (
                        <img
                          src={bookmark.favicon}
                          alt=""
                          className="w-10 h-10 rounded-lg border border-gray-200 bg-white p-1.5 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                          <BookMarked className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate text-base leading-tight">
                      {bookmark.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {bookmark.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <span className="font-medium">{bookmark.domain}</span>
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
                    onClick={() => window.open(bookmark.url, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-xs border-blue-500 bg-blue-400/20"
                >
                  {bookmark.category}
                </Badge>
                {bookmark.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-green-500 bg-green-400/20"
                  >
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
  }

  // Grid view (default)
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start gap-3 flex-1">
          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div className="flex gap-3 flex-1 min-w-0 mb-2">
                {/* Favicon */}
                <div className="flex-shrink-0 mt-0.5">
                  {bookmark.favicon ? (
                    <img
                      src={bookmark.favicon}
                      alt=""
                      className="w-10 h-10 rounded-lg border border-gray-200 bg-white p-1.5 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                      <BookMarked className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3
                  className="font-semibold text-gray-900 text-sm leading-tight flex-1 min-w-0"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: "1.25rem",
                    height: "2.5rem",
                  }}
                >
                  {bookmark.title}
                </h3>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => window.open(bookmark.url, "_blank")}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-1">
              {bookmark.description}
            </p>

            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
              <span className="font-medium truncate">{bookmark.domain}</span>
              <span>•</span>
              <span>{bookmark.visitCount} visits</span>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap mt-auto">
              <Badge variant="outline" className="text-xs">
                {bookmark.category}
              </Badge>
              {bookmark.tags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {bookmark.tags?.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{bookmark.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// FileCard component
const FileCard = ({
  file,
  onDelete,
  onDownload,
  getFileIcon,
  formatFileSize,
  viewMode = "grid",
}) => {
  if (viewMode === "list") {
    return (
      <Card className="group hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* File Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                {getFileIcon(file.type)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-base leading-tight">
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span className="font-medium">{file.type}</span>
                    <span>•</span>
                    <span>
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDownload(file._id, file.name)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(file.url, "_blank")}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(file._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* File Type Badge */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-xs border-purple-500 bg-purple-400/20"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs border-gray-500 bg-gray-400/20"
                >
                  {formatFileSize(file.size)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start gap-3 flex-1">
          {/* File Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
              {getFileIcon(file.type)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 flex-1 mr-2">
                {file.name}
              </h3>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => onDownload(file._id, file.name)}
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => window.open(file.url, "_blank")}
                >
                  <Eye className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => onDelete(file._id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span className="truncate">{file.type}</span>
            </div>

            <div className="text-xs text-gray-500 mt-1">
              {new Date(file.uploadedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderDetailPage;
