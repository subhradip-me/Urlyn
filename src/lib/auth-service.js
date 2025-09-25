import apiClient from './api-client';

export const authService = {
  // Register a new user
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    if (response.success && response.data.token) {
      apiClient.setToken(response.data.token);
      this.setCurrentUser(response.data);
    }
    return response;
  },

  // Login user
  async login(credentials) {
    console.log('AuthService: Starting login request...');
    try {
      const response = await apiClient.post('/auth/login', credentials);
      console.log('AuthService: Login response received:', response);
      
      if (response.success && response.data.token) {
        console.log('AuthService: Setting token and user data');
        apiClient.setToken(response.data.token);
        this.setCurrentUser(response.data);
      }
      return response;
    } catch (error) {
      console.error('AuthService: Login error:', error);
      throw error;
    }
  },

  // Logout user
  logout() {
    apiClient.setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Set current user in localStorage
  setCurrentUser(userData) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  },

  // Get current user from localStorage
  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  // Get user profile
  async getProfile() {
    try {
      return await apiClient.get('/auth/profile');
    } catch (error) {
      console.error('Failed to get profile:', error.message);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    return apiClient.put('/auth/profile', profileData);
  },

  // Change password
  async changePassword(passwordData) {
    return apiClient.put('/auth/change-password', passwordData);
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiClient.getToken();
  },

  // Initialize auth (check for existing token and user)
  initializeAuth() {
    const token = apiClient.getToken();
    const user = this.getCurrentUser();
    return { token, user };
  }
};

export default authService;
