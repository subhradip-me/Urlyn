// Application Constants
export const APP_CONFIG = {
  name: 'Urlyn 2.0',
  version: '2.0.0',
  description: 'Multi-Persona SaaS Platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
} as const;

// Persona Configuration
export const PERSONAS = {
  student: {
    id: 'student',
    name: 'Student',
    icon: '🎓',
    color: '#8b5cf6',
    description: 'Academic learning and study management',
    features: ['assignments', 'courses', 'study-sessions', 'notes', 'bookmarks']
  },
  creator: {
    id: 'creator',
    name: 'Creator',
    icon: '🎨',
    color: '#ec4899',
    description: 'Content creation and monetization',
    features: ['projects', 'calendar', 'partnerships', 'analytics', 'portfolio']
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    icon: '💼',
    color: '#0ea5e9',
    description: 'Career growth and networking',
    features: ['projects', 'contacts', 'skills', 'network', 'portfolio']
  },
  entrepreneur: {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    icon: '🚀',
    color: '#f59e0b',
    description: 'Business building and startup management',
    features: ['startups', 'investors', 'business-plans', 'funding', 'metrics']
  },
  researcher: {
    id: 'researcher',
    name: 'Researcher',
    icon: '🔬',
    color: '#10b981',
    description: 'Research and academic collaboration',
    features: ['projects', 'publications', 'collaborations', 'grants', 'literature']
  }
} as const;

export type PersonaId = keyof typeof PERSONAS;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
    personas: '/auth/personas',
    switchPersona: '/auth/personas/switch',
  },
  
  // Core Features (Persona-aware)
  core: {
    bookmarks: '/core/bookmarks',
    folders: '/core/folders',
    tags: '/core/tags',
    notes: '/core/notes',
    tasks: '/core/tasks',
  },
  
  // Persona-specific endpoints
  personas: {
    student: {
      base: '/personas/student',
      assignments: '/personas/student/assignments',
      courses: '/personas/student/courses',
      studySessions: '/personas/student/study-sessions',
    },
    creator: {
      base: '/personas/creator',
      projects: '/personas/creator/projects',
      calendar: '/personas/creator/calendar',
      partnerships: '/personas/creator/partnerships',
      analytics: '/personas/creator/analytics',
    },
    professional: {
      base: '/personas/professional',
      projects: '/personas/professional/projects',
      contacts: '/personas/professional/contacts',
      skills: '/personas/professional/skills',
      network: '/personas/professional/network',
    },
    entrepreneur: {
      base: '/personas/entrepreneur',
      startups: '/personas/entrepreneur/startups',
      investors: '/personas/entrepreneur/investors',
      businessPlans: '/personas/entrepreneur/business-plans',
      funding: '/personas/entrepreneur/funding',
    },
    researcher: {
      base: '/personas/researcher',
      projects: '/personas/researcher/projects',
      publications: '/personas/researcher/publications',
      collaborations: '/personas/researcher/collaborations',
      grants: '/personas/researcher/grants',
    },
  },
  
  // System
  health: '/health',
  stats: '/stats',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  auth: {
    token: 'urlyn_auth_token',
    refreshToken: 'urlyn_refresh_token',
    user: 'urlyn_user',
    currentPersona: 'urlyn_current_persona',
  },
  preferences: {
    theme: 'urlyn_theme',
    language: 'urlyn_language',
    sidebar: 'urlyn_sidebar_collapsed',
  },
  cache: {
    personas: 'urlyn_personas_cache',
    navigation: 'urlyn_navigation_cache',
  },
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  password: {
    minLength: 6,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/,
    message: 'Password must be at least 6 characters with uppercase, lowercase, and number',
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Name must be 2-50 characters, letters and spaces only',
  },
} as const;

// UI Constants
export const UI_CONFIG = {
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  sidebar: {
    width: {
      collapsed: '64px',
      expanded: '256px',
    },
  },
  modal: {
    zIndex: 1000,
    backdropOpacity: 0.5,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  forbidden: 'Access denied.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  server: 'Server error. Please try again later.',
  timeout: 'Request timed out. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  login: 'Welcome back!',
  register: 'Account created successfully!',
  personaAdded: 'Persona added successfully!',
  personaSwitched: 'Persona switched successfully!',
  profileUpdated: 'Profile updated successfully!',
  saved: 'Changes saved successfully!',
  deleted: 'Item deleted successfully!',
  copied: 'Copied to clipboard!',
} as const;

// Feature Flags (for gradual rollout)
export const FEATURE_FLAGS = {
  aiAssistant: process.env.NEXT_PUBLIC_FEATURE_AI === 'true',
  realTimeCollaboration: process.env.NEXT_PUBLIC_FEATURE_REALTIME === 'true',
  advancedAnalytics: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === 'true',
  socialFeatures: process.env.NEXT_PUBLIC_FEATURE_SOCIAL === 'true',
  mobileApp: process.env.NEXT_PUBLIC_FEATURE_MOBILE === 'true',
} as const;
