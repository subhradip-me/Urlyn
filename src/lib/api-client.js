import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// API client class
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
    
    // Create axios instance
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 15000, // 15 second timeout
      headers: {
        'Content-Type': 'application/json',
        'x-development-mode': 'true',
      },
    });

    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('API request error:', {
          url: error.config?.url,
          errorName: error.name,
          errorMessage: error.message,
          status: error.response?.status
        });

        if (error.code === 'ECONNREFUSED' || error.message.includes('ERR_CONNECTION_REFUSED')) {
          throw new Error('Unable to connect to server. Please check if the backend is running on port 5001.');
        }
        
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. The server may be slow or unavailable.');
        }
        
        if (error.response) {
          // Server responded with error status
          const errorMessage = error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`;
          throw new Error(errorMessage);
        }
        
        if (error.request) {
          // Network error
          throw new Error('Network error: Unable to reach the server. Please check your connection.');
        }
        
        throw error;
      }
    );
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
    }
  }

  // Get authentication token
  getToken() {
    if (typeof window !== 'undefined') {
      return this.token || localStorage.getItem('authToken');
    }
    return this.token;
  }

  // GET request
  async get(endpoint, params = {}) {
    const response = await this.axiosInstance.get(endpoint, { params });
    return response.data;
  }

  // POST request
  async post(endpoint, data = {}) {
    const response = await this.axiosInstance.post(endpoint, data);
    return response.data;
  }

  // PUT request
  async put(endpoint, data = {}) {
    const response = await this.axiosInstance.put(endpoint, data);
    return response.data;
  }

  // DELETE request
  async delete(endpoint) {
    const response = await this.axiosInstance.delete(endpoint);
    return response.data;
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    const response = await this.axiosInstance.patch(endpoint, data);
    return response.data;
  }

  // Auth methods
  async login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  async register(firstName, lastName, email, password, persona = 'student') {
    return this.post('/auth/register', { firstName, lastName, email, password, persona });
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  async addPersona(persona) {
    return this.post('/auth/personas', { persona });
  }

  async switchPersona(persona) {
    return this.put('/auth/personas/switch', { persona });
  }

  async updateProfile(profileData) {
    return this.put('/auth/profile', profileData);
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.get('/dashboard/stats');
  }

  async getQuickActions() {
    return this.get('/dashboard/quick-actions');
  }

  // Student bookmark methods
  async getStudentBookmarks(params = {}) {
    return this.get('/student/bookmarks', params);
  }

  async getStudentBookmarkStats() {
    return this.get('/student/bookmarks/stats/summary');
  }

  async getStudentBookmarkFolders() {
    return this.get('/student/bookmarks/folders/list');
  }

  async getStudentBookmarkCategories() {
    return this.get('/student/bookmarks/categories/list');
  }

  async createStudentBookmark(bookmarkData) {
    return this.post('/student/bookmarks', bookmarkData);
  }

  // Folder management methods
  async getStudentFolders() {
    const result = await this.get('/student/folders');
    return result;
  }

  async getStudentFolder(folderId) {
    const result = await this.get(`/student/folders/${folderId}`);
    return result;
  }

  async createStudentFolder(folderData) {
    return this.post('/student/folders', folderData);
  }

  async updateStudentFolder(folderId, folderData) {
    return this.put(`/student/folders/${folderId}`, folderData);
  }

  async deleteStudentFolder(folderId) {
    return this.delete(`/student/folders/${folderId}`);
  }

  async getFolderContents(folderId, options = {}) {
    const params = new URLSearchParams(options);
    return this.get(`/student/folders/${folderId}/contents?${params}`);
  }

  async addBookmarkToFolder(folderId, bookmarkId) {
    return this.post(`/student/folders/${folderId}/add-bookmark`, { bookmarkId });
  }

  async initializeDefaultFolders() {
    return this.post('/student/folders/initialize');
  }

  // Metadata extraction methods
  async getUrlMetadata(url) {
    return this.post('/metadata', { url });
  }

  async getBatchUrlMetadata(urls) {
    return this.post('/metadata/batch', { urls });
  }

  // AI Tags generation methods
  async generateAITags(url) {
    return this.post('/ai-tags/generate', { url });
  }

  async generateBatchAITags(urls) {
    return this.post('/ai-tags/batch', { urls });
  }

  // Student tags methods
  async getStudentTags(params = {}) {
    return this.get('/student/tags', params);
  }

  async getStudentTagStats() {
    return this.get('/student/tags/stats');
  }

  async searchStudentTags(query, limit = 10) {
    return this.get('/student/tags/search', { q: query, limit });
  }

  async getContentByTag(tagName, params = {}) {
    return this.get(`/student/tags/${tagName}/content`, params);
  }

  async getTagsByCategory(category) {
    return this.get(`/student/tags/category/${category}`);
  }

  async deleteStudentTag(tagId) {
    return this.delete(`/student/tags/${tagId}`);
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export { apiClient };
export default apiClient;
