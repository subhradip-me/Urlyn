import apiClient from './api-client';

export const studentService = {
  // Get student dashboard
  async getDashboard() {
    return apiClient.get('/student/dashboard');
  },

  // Get available courses
  async getCourses(params = {}) {
    return apiClient.get('/student/courses', params);
  },

  // Enroll in a course
  async enrollInCourse(courseId) {
    return apiClient.post(`/student/courses/${courseId}/enroll`);
  },

  // Get student notes
  async getNotes(params = {}) {
    return apiClient.get('/student/notes', params);
  },

  // Create a new note
  async createNote(noteData) {
    return apiClient.post('/student/notes', noteData);
  },

  // Get assignments
  async getAssignments(params = {}) {
    return apiClient.get('/student/assignments', params);
  }
};

export const creatorService = {
  // Get creator dashboard
  async getDashboard() {
    return apiClient.get('/creator/dashboard');
  },

  // Get creator's courses
  async getCourses(params = {}) {
    return apiClient.get('/creator/courses', params);
  },

  // Create a new course
  async createCourse(courseData) {
    return apiClient.post('/creator/courses', courseData);
  },

  // Update a course
  async updateCourse(courseId, courseData) {
    return apiClient.put(`/creator/courses/${courseId}`, courseData);
  },

  // Delete a course
  async deleteCourse(courseId) {
    return apiClient.delete(`/creator/courses/${courseId}`);
  },

  // Get content
  async getContent(params = {}) {
    return apiClient.get('/creator/content', params);
  },

  // Create content
  async createContent(contentData) {
    return apiClient.post('/creator/content', contentData);
  },

  // Get course assignments
  async getCourseAssignments(courseId) {
    return apiClient.get(`/creator/courses/${courseId}/assignments`);
  },

  // Create assignment
  async createAssignment(courseId, assignmentData) {
    return apiClient.post(`/creator/courses/${courseId}/assignments`, assignmentData);
  },

  // Get analytics
  async getAnalytics(params = {}) {
    return apiClient.get('/creator/analytics', params);
  }
};

export const professionalService = {
  // Get professional dashboard
  async getDashboard() {
    return apiClient.get('/professional/dashboard');
  },

  // Get projects
  async getProjects(params = {}) {
    return apiClient.get('/professional/projects', params);
  },

  // Create a new project
  async createProject(projectData) {
    return apiClient.post('/professional/projects', projectData);
  },

  // Update a project
  async updateProject(projectId, projectData) {
    return apiClient.put(`/professional/projects/${projectId}`, projectData);
  },

  // Get project tasks
  async getProjectTasks(projectId, params = {}) {
    return apiClient.get(`/professional/projects/${projectId}/tasks`, params);
  },

  // Create a task
  async createTask(projectId, taskData) {
    return apiClient.post(`/professional/projects/${projectId}/tasks`, taskData);
  },

  // Get user's tasks
  async getTasks(params = {}) {
    return apiClient.get('/professional/tasks', params);
  },

  // Update task status
  async updateTaskStatus(taskId, statusData) {
    return apiClient.put(`/professional/tasks/${taskId}/status`, statusData);
  },

  // Get team members
  async getTeamMembers(params = {}) {
    return apiClient.get('/professional/team', params);
  }
};

export const notificationService = {
  // Get notifications
  async getNotifications(params = {}) {
    return apiClient.get('/notifications', params);
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    return apiClient.put(`/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  async markAllAsRead() {
    return apiClient.put('/notifications/read-all');
  },

  // Delete notification
  async deleteNotification(notificationId) {
    return apiClient.delete(`/notifications/${notificationId}`);
  },

  // Get notification settings
  async getSettings() {
    return apiClient.get('/notifications/settings');
  },

  // Update notification settings
  async updateSettings(settings) {
    return apiClient.put('/notifications/settings', settings);
  }
};

export default {
  student: studentService,
  creator: creatorService,
  professional: professionalService,
  notifications: notificationService
};
