"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Calendar,
  MessageSquare,
  FileText,
  ShoppingCart,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  User,
  Home,
  Folder,
  TrendingUp,
  Target,
  BookMarked,
  Tag,
  UserPlus,
  Sparkles,
  GraduationCap,
  Briefcase,
  Camera,
  Plus,
  Book,
  Database,
  Lightbulb,
  PenTool,
  Share2,
  Building,
  Cpu,
  Heart,
  Play,
  FolderPlus,
  X
} from "lucide-react";

// Persona configurations
const personaConfigs = {
  student: {
    title: "Student Hub",
    subtitle: "Learning & Study",
    icon: GraduationCap,
    color: "bg-green-500",
    menuItems: [
      { title: "Home", icon: Home, href: "/student/home" },
      { title: "All Bookmarks", icon: BookMarked, href: "/student/bookmarks" },
      { 
        title: "My Folders", 
        icon: Folder, 
        href: "/student/folders", 
        isExpandable: true,
        subItems: [
          { title: "Math", icon: Book, href: "/student/folders/math" },
          { title: "AI", icon: Cpu, href: "/student/folders/ai" },
          { title: "Exam Prep", icon: FileText, href: "/student/folders/exam-prep" },
        ]
      },
      { title: "Tags", icon: Tag, href: "/student/tags" },
      { title: "Shared Notes", icon: UserPlus, href: "/student/shared-notes" },
      { title: "AI Notes", icon: Sparkles, href: "/student/ai-notes" },
    ]
  }
};

export function DashboardSidebar({ className, persona = "student", onPersonaChange }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [expandedItems, setExpandedItems] = useState({});
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [userFolders, setUserFolders] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const dropdownRef = useRef(null);

  const config = personaConfigs[persona] || personaConfigs.student;
  const PersonaIcon = config.icon;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPersonaDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch user folders when persona is student
  useEffect(() => {
    if (persona === 'student' && user) {
      fetchUserFolders();
    }
  }, [persona, user]);

  const fetchUserFolders = async () => {
    try {
      const response = await apiClient.getStudentFolders();
      console.log('Dashboard sidebar folders response:', response);
      
      // Handle the new response structure - response.data contains { folders, total, message }
      const folders = response.data?.folders || [];
      
      // Ensure folders is an array before filtering
      if (!Array.isArray(folders)) {
        console.warn('Folders is not an array:', folders);
        setUserFolders([]);
        return;
      }
      
      // Filter out any invalid folder objects
      const validFolders = folders.filter(folder => 
        folder && 
        typeof folder === 'object' && 
        folder._id && 
        folder.name && 
        typeof folder.name === 'string'
      );
      
      console.log('Valid folders for sidebar:', validFolders);
      setUserFolders(validFolders);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setUserFolders([]); // Ensure we always have an array
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      const response = await apiClient.createStudentFolder({
        name: newFolderName.trim(),
        description: newFolderDescription.trim(),
        color: '#3B82F6'
      });

      if (response.success && response.data) {
        const newFolder = response.data;
        console.log('Created folder:', newFolder);
        
        // Validate the new folder object before adding it
        if (newFolder && newFolder._id && newFolder.name) {
          setUserFolders(prev => [newFolder, ...prev]);
          setNewFolderName("");
          setNewFolderDescription("");
          setShowCreateFolder(false);
        } else {
          console.error('Invalid folder object received:', newFolder);
          // Refresh the folders list to get the latest data
          fetchUserFolders();
          setNewFolderName("");
          setNewFolderDescription("");
          setShowCreateFolder(false);
        }
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
    if (!confirm('Are you sure you want to delete this folder? All bookmarks will be moved to General folder.')) {
      return;
    }

    try {
      await apiClient.deleteStudentFolder(folderId);
      setUserFolders(prev => prev.filter(folder => folder._id !== folderId));
    } catch (error) {
      console.error('Error deleting folder:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete folder';
      alert('Error deleting folder: ' + errorMessage);
    }
  };
  // Persona options for dropdown
  const personaOptions = [
    { key: 'student', label: 'Student', subtitle: 'Learning & Study', icon: GraduationCap, color: 'bg-green-500' },
    { key: 'work', label: 'Work', subtitle: 'Professional Projects', icon: Briefcase, color: 'bg-blue-500' },
    { key: 'creator', label: 'Creator', subtitle: 'Content Creation', icon: Camera, color: 'bg-purple-500' }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (title) => {
    setActiveItem(title);
  };

  const toggleExpanded = (title) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handlePersonaChange = (newPersona) => {
    if (onPersonaChange) {
      onPersonaChange(newPersona);
    }
    setShowPersonaDropdown(false);
    // Reset expanded items when switching personas
    setExpandedItems({});
    // Set appropriate default active item based on persona
    if (newPersona === 'work') {
      setActiveItem('Dashboard');
    } else {
      setActiveItem('Home');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const renderMenuItem = (item, isSubItem = false) => {
    const Icon = item.icon;
    const isActive = activeItem === item.title;
    const isExpanded = expandedItems[item.title];

    // Handle My Folders with dynamic content
    if (item.title === "My Folders" && persona === 'student') {
      return (
        <div key={item.title}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 font-normal",
                  isCollapsed && "px-2",
                  isActive && "bg-secondary text-secondary-foreground font-medium"
                )}
                onClick={() => {
                  handleItemClick(item.title);
                  if (!isCollapsed) {
                    toggleExpanded(item.title);
                  }
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="truncate">{item.title}</span>
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 ml-auto transition-transform",
                        isExpanded && "rotate-180"
                      )} 
                    />
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                {item.title}
              </TooltipContent>
            )}
          </Tooltip>

          {/* Render dynamic folders if expanded */}
          {isExpanded && !isCollapsed && (
            <div className="mt-1 space-y-1">
              {/* User created folders */}
              {userFolders && Array.isArray(userFolders) && userFolders
                .filter(folder => folder && folder._id && folder.name && typeof folder.name === 'string')
                .map(folder => (
                <div key={folder._id} className="group relative">
                  <Link href={`/student/folders/${folder._id}`}>
                    <Button
                      variant="ghost"
                      className="w-[calc(100%-1.5rem)] ml-6 justify-start gap-3 font-normal hover:bg-secondary/50"
                      onClick={() => handleItemClick(folder.name)}
                    >
                      <Folder className="h-4 w-4 shrink-0" style={{ color: folder.color || '#3B82F6' }} />
                      <span className="truncate flex-1 text-left">{folder.name}</span>
                      <span className="text-xs text-muted-foreground">{folder.bookmarkCount || 0}</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteFolder(folder._id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {/* Create new folder section */}
              {showCreateFolder ? (
                <div className="ml-6 space-y-2 p-2 border rounded-lg bg-secondary/20">
                  <Input
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={newFolderDescription}
                    onChange={(e) => setNewFolderDescription(e.target.value)}
                    className="h-8 text-sm"
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={handleCreateFolder}
                      disabled={isCreatingFolder || !newFolderName.trim()}
                      className="h-7 px-2 text-xs"
                    >
                      {isCreatingFolder ? "Creating..." : "Create"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowCreateFolder(false);
                        setNewFolderName("");
                        setNewFolderDescription("");
                      }}
                      className="h-7 px-2 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-[calc(100%-1.5rem)] ml-6 justify-start gap-3 font-normal text-blue-600 hover:text-blue-700"
                  onClick={() => setShowCreateFolder(true)}
                >
                  <FolderPlus className="h-4 w-4 shrink-0" />
                  <span className="truncate">Create New Folder</span>
                </Button>
              )}
            </div>
          )}
        </div>
      );
    }

    // Regular menu item rendering
    return (
      <div key={item.title}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {item.href && !item.isExpandable ? (
              <Link href={item.href} className="block">
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 font-normal",
                    isCollapsed && "px-2",
                    isSubItem && "ml-6 w-[calc(100%-1.5rem)]",
                    isActive && "bg-secondary text-secondary-foreground font-medium"
                  )}
                  onClick={() => {
                    handleItemClick(item.title);
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badge === "New" ? "default" : "secondary"}
                          className="ml-auto text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            ) : (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 font-normal",
                  isCollapsed && "px-2",
                  isSubItem && "ml-6 w-[calc(100%-1.5rem)]",
                  isActive && "bg-secondary text-secondary-foreground font-medium"
                )}
                onClick={() => {
                  handleItemClick(item.title);
                  if (item.isExpandable && !isCollapsed) {
                    toggleExpanded(item.title);
                  }
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="truncate">{item.title}</span>
                    {item.isExpandable && (
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 ml-auto transition-transform",
                          isExpanded && "rotate-180"
                        )} 
                      />
                    )}
                    {item.badge && (
                      <Badge
                        variant={item.badge === "New" ? "default" : "secondary"}
                        className="ml-auto text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            )}
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="flex items-center gap-2">
              {item.title}
              {item.badge && (
                <Badge
                  variant={item.badge === "New" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </TooltipContent>
          )}
        </Tooltip>

        {/* Render sub-items if expanded (for non-folder items) */}
        {item.isExpandable && isExpanded && !isCollapsed && item.subItems && item.title !== "My Folders" && (
          <div className="mt-1 space-y-1">
            {item.subItems.map(subItem => renderMenuItem(subItem, true))}
            {/* Add New Item/Tag button */}
            <Button
              variant="ghost"
              className="w-[calc(100%-1.5rem)] ml-6 justify-start gap-3 font-normal text-blue-600 hover:text-blue-700"
              onClick={() => console.log(`Add new ${item.title.toLowerCase()}`)}
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="truncate">
                Add New {item.title === "Tags" ? "Tag" : "Item"}
              </span>
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-white relative",
                config.color
              )}>
                <PersonaIcon className="h-4 w-4" />
                {/* Online indicator */}
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{config.title}</span>
                <span className="text-xs text-muted-foreground">{config.subtitle}</span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Persona selector when expanded */}
        {!isCollapsed && (
          <div className="p-4 relative" ref={dropdownRef}>
            <div className="relative">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 bg-secondary/50 hover:bg-secondary/70"
                onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
              >
                <PersonaIcon className="h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{persona.charAt(0).toUpperCase() + persona.slice(1)}</span>
                  <span className="text-xs text-muted-foreground">{config.subtitle}</span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 ml-auto transition-transform",
                  showPersonaDropdown && "rotate-180"
                )} />
              </Button>
              
              {/* Persona Dropdown */}
              {showPersonaDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50">
                  {personaOptions
                    .filter(option => user?.personas?.includes(option.key))
                    .map((option) => {
                      const OptionIcon = option.icon;
                      const isSelected = option.key === persona;
                      
                      return (
                        <Button
                          key={option.key}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-3 h-12 rounded-none first:rounded-t-lg last:rounded-b-lg",
                            isSelected && "bg-secondary text-secondary-foreground"
                          )}
                          onClick={() => handlePersonaChange(option.key)}
                        >
                          <div className={cn(
                            "flex h-6 w-6 items-center justify-center rounded text-white text-xs",
                            option.color
                          )}>
                            <OptionIcon className="h-3 w-3" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">{option.label}</span>
                            <span className="text-xs text-muted-foreground">{option.subtitle}</span>
                          </div>
                          {isSelected && (
                            <div className="h-2 w-2 rounded-full bg-green-500 ml-auto" />
                          )}
                        </Button>
                      );
                    })}
                  
                  {/* Add Persona button if user doesn't have all personas */}
                  {user?.personas?.length < 3 && (
                    <>
                      <Separator className="my-1" />
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12 rounded-none rounded-b-lg text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          setShowPersonaDropdown(false);
                          router.push('/dashboard');
                        }}
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded border-2 border-dashed border-blue-300">
                          <Plus className="h-3 w-3" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">Add Persona</span>
                          <span className="text-xs text-muted-foreground">Expand your workspace</span>
                        </div>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-2">
            {config.menuItems.map(item => renderMenuItem(item))}
          </div>
        </ScrollArea>

        {/* Settings */}
        <div className="border-t p-3">
          <div className="space-y-1">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 font-normal",
                    isCollapsed && "px-2"
                  )}
                  onClick={() => handleItemClick("Settings")}
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">Settings</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">Settings</TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>

        {/* User Profile */}
        <div className="border-t p-4">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder-avatar.svg"} alt={getUserDisplayName()} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{getUserDisplayName()}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer" onClick={handleLogout}>
                    <AvatarImage src={user?.avatar || "/placeholder-avatar.svg"} alt={getUserDisplayName()} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="text-center">
                    <p className="font-medium">{getUserDisplayName()}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">Click to logout</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
