import type { BookmarkBase, NoteBase, TaskBase, TagBase, FolderBase } from '../../../shared/types';

// Student-specific extensions
export interface StudentBookmark extends BookmarkBase {
  course?: string;
  subject?: string;
  isForAssignment?: boolean;
  assignmentId?: string;
}

export interface StudentNote extends NoteBase {
  course?: string;
  subject?: string;
  noteType: 'lecture' | 'reading' | 'research' | 'assignment' | 'personal';
  isShared?: boolean;
  attachments?: string[];
}

export interface StudentTask extends TaskBase {
  course?: string;
  subject?: string;
  taskType: 'assignment' | 'study' | 'project' | 'exam' | 'personal';
  estimatedHours?: number;
  actualHours?: number;
}

export interface StudentFolder extends FolderBase {
  course?: string;
  subject?: string;
  semester?: string;
  year?: number;
}

export interface StudentTag extends TagBase {
  category?: 'course' | 'subject' | 'assignment' | 'exam' | 'general';
}

// Student-specific features
export interface StudentAssignment {
  id: string;
  userId: string;
  persona: 'student';
  title: string;
  description?: string;
  course: string;
  subject?: string;
  dueDate: string;
  submissionDate?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'submitted' | 'graded';
  grade?: {
    score?: number;
    maxScore?: number;
    letterGrade?: string;
    feedback?: string;
  };
  priority: 'low' | 'medium' | 'high';
  estimatedHours?: number;
  actualHours?: number;
  attachments: string[];
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentCourse {
  id: string;
  userId: string;
  persona: 'student';
  name: string;
  code?: string;
  description?: string;
  instructor?: string;
  credits?: number;
  semester: string;
  year: number;
  status: 'enrolled' | 'completed' | 'dropped' | 'audit';
  grade?: {
    current?: number;
    final?: number;
    letterGrade?: string;
    gpa?: number;
  };
  schedule?: {
    days: string[];
    startTime: string;
    endTime: string;
    location?: string;
  };
  syllabus?: string;
  resources: string[];
  color?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentStudySession {
  id: string;
  userId: string;
  persona: 'student';
  title: string;
  description?: string;
  subject?: string;
  course?: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  sessionType: 'study' | 'review' | 'practice' | 'research' | 'project';
  productivity: 'low' | 'medium' | 'high';
  mood: 'stressed' | 'neutral' | 'focused' | 'motivated';
  techniques: string[]; // e.g., ['pomodoro', 'active-recall', 'spaced-repetition']
  topics: string[];
  notes?: string;
  achievements: string[];
  distractions: string[];
  location?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentDashboard {
  upcomingAssignments: StudentAssignment[];
  recentStudySessions: StudentStudySession[];
  currentCourses: StudentCourse[];
  weeklyProgress: {
    studyHours: number;
    assignmentsCompleted: number;
    averageProductivity: number;
    streakDays: number;
  };
  academicStats: {
    currentGPA: number;
    completedCredits: number;
    totalCredits: number;
    semesterProgress: number;
  };
  quickActions: string[];
}

// Student preferences
export interface StudentPreferences {
  studyReminders: {
    enabled: boolean;
    beforeDeadline: number; // hours
    dailyStudyTime?: string;
  };
  gradeTracking: {
    showGPA: boolean;
    targetGPA?: number;
    gradeNotifications: boolean;
  };
  calendar: {
    showCourses: boolean;
    showAssignments: boolean;
    showStudySessions: boolean;
    defaultView: 'week' | 'month';
  };
  productivity: {
    defaultSessionLength: number; // minutes
    breakLength: number; // minutes
    focusTechniques: string[];
  };
  privacy: {
    shareProgress: boolean;
    shareNotes: boolean;
    studyBuddy: boolean;
  };
}
