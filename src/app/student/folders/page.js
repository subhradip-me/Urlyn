"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Folder,
  Plus,
  Search,
  BookMarked,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  FolderPlus
} from "lucide-react";
import apiClient from "@/lib/api-client";

const FoldersPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#3B82F6");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const folderColors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
    "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6B7280"
  ];

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFolders();
    }
  }, [isAuthenticated, user]);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      console.log('Fetching folders for user:', user?.email);
      const response = await apiClient.getStudentFolders();
      console.log('Full folders response:', response);
      
      // Handle the correct response structure - folders are in response.data.folders
      let foldersData = [];
      if (response.success && response.data) {
        // Extract folders from the nested structure
        foldersData = response.data.folders || response.data || [];
      }
      
      // Ensure foldersData is always an array
      if (!Array.isArray(foldersData)) {
        console.warn('Folders data is not an array:', foldersData);
        foldersData = [];
      }
      
      console.log('Processed folders:', foldersData.length, 'folders found');
      console.log('Folders received:', foldersData.map(f => ({ name: f?.name, id: f?._id })));
      setFolders(foldersData);
    } catch (error) {
      console.error('Error fetching folders:', error);
      if (error.message.includes('persona') || error.message.includes('403')) {
        router.push('/dashboard');
        return;
      }
      // Set empty array on error to prevent further issues
      setFolders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      const response = await apiClient.createStudentFolder({
        name: newFolderName.trim(),
        description: newFolderDescription.trim(),
        color: newFolderColor,
        icon: "📂" // Default icon
      });

      if (response.success && response.data) {
        setFolders(prev => [response.data, ...prev]);
        setNewFolderName("");
        setNewFolderDescription("");
        setNewFolderColor("#3B82F6");
        setShowCreateFolder(false);
        
        // Show success message
        console.log('✅ Folder created successfully:', response.data.name);
        
        // Optionally navigate to the new folder
        // router.push(`/student/folders/${response.data._id}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create folder';
      alert('Error creating folder: ' + errorMessage);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!confirm('Are you sure you want to delete this folder?')) {
      return;
    }

    try {
      const response = await apiClient.deleteStudentFolder(folderId);
      if (response.success) {
        setFolders(prev => prev.filter(folder => folder._id !== folderId));
        console.log('✅ Folder deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete folder');
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete folder';
      alert('Error deleting folder: ' + errorMessage);
    }
  };

  const filteredFolders = folders.filter(folder =>
    folder.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    folder.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Folders</h1>
            <p className="text-gray-600">Organize your bookmarks and files</p>
          </div>
          <Button onClick={() => setShowCreateFolder(true)}>
            <FolderPlus className="w-4 h-4 mr-2" />
            Create Folder
          </Button>
        </div>

        {/* Create Folder Form */}
        {showCreateFolder && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Folder</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateFolder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Folder Name *
                    </label>
                    <Input
                      placeholder="Enter folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <div className="flex gap-2">
                      {folderColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            newFolderColor === color ? 'border-gray-900' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewFolderColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <Input
                    placeholder="Enter folder description"
                    value={newFolderDescription}
                    onChange={(e) => setNewFolderDescription(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isCreatingFolder || !newFolderName.trim()}>
                    {isCreatingFolder ? "Creating..." : "Create Folder"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateFolder(false);
                      setNewFolderName("");
                      setNewFolderDescription("");
                      setNewFolderColor("#3B82F6");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Folders Grid */}
        {filteredFolders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No folders found' : 'No folders yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Create your first folder to organize your bookmarks and files'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateFolder(true)}>
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Create Your First Folder
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFolders.map(folder => (
              <FolderCard 
                key={folder._id} 
                folder={folder} 
                onDelete={handleDeleteFolder}
                onClick={() => router.push(`/student/folders/${folder._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// FolderCard component
const FolderCard = ({ folder, onDelete, onClick }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer relative">
      <CardContent className="p-6" onClick={onClick}>
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: folder.color + '20', border: `2px solid ${folder.color}` }}
          >
            <Folder className="w-6 h-6" style={{ color: folder.color }} />
          </div>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-10 min-w-32">
                <button
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    // Handle edit
                  }}
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDelete(folder._id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 truncate">
          {folder.name}
        </h3>
        
        {folder.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {folder.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <BookMarked className="w-3 h-3" />
              <span>{folder.bookmarkCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>{folder.fileCount || 0}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(folder.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Show folder ID for debugging */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <code className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
            ID: {folder._id}
          </code>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoldersPage;
