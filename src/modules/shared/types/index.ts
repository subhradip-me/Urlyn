// Core application types
export interface User {
  id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  personas: PersonaType[];
  currentPersona: PersonaType | null;
  preferences: UserPreferences;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PersonaProfile {
  id: string;
  userId: string;
  persona: PersonaType;
  bio?: string;
  avatar?: string;
  displayName?: string;
  preferences: PersonaPreferences;
  isCompleted: boolean;
  // Persona-specific data will be handled by individual persona modules
}

export type PersonaType = 
  | 'student' 
  | 'creator' 
  | 'professional' 
  | 'entrepreneur' 
  | 'researcher';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

export interface PersonaPreferences {
  privacy: {
    profileVisibility: 'public' | 'private' | 'connections';
    showActivity: boolean;
    allowMessages: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
  };
  features: {
    aiAssistant: boolean;
    analytics: boolean;
    collaboration: boolean;
  };
}

// Core feature types (persona-specific)
export interface BookmarkBase {
  id: string;
  userId: string;
  persona: PersonaType;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  folderId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FolderBase {
  id: string;
  userId: string;
  persona: PersonaType;
  name: string;
  description?: string;
  color?: string;
  parentId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteBase {
  id: string;
  userId: string;
  persona: PersonaType;
  title: string;
  content: string;
  tags: string[];
  folderId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskBase {
  id: string;
  userId: string;
  persona: PersonaType;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TagBase {
  id: string;
  userId: string;
  persona: PersonaType;
  name: string;
  color?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  initialPersona: PersonaType;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// UI Component types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Form types
export interface FormFieldProps extends ComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType;
  badge?: string | number;
  children?: NavItem[];
  personas?: PersonaType[];
}

// Persona-specific feature interfaces will be extended in individual modules
