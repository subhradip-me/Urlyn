import { apiClient } from '../../shared/services/api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../shared/constants';
import type { 
  User, 
  PersonaType, 
  LoginCredentials, 
  RegisterData, 
  ApiResponse 
} from '../../shared/types';

export interface PersonaSetupData {
  persona: PersonaType;
  displayName?: string;
  bio?: string;
  preferences?: {
    privacy?: {
      profileVisibility?: 'public' | 'private' | 'connections';
      showActivity?: boolean;
      allowMessages?: boolean;
    };
    notifications?: {
      email?: boolean;
      push?: boolean;
      inApp?: boolean;
      frequency?: 'instant' | 'daily' | 'weekly';
    };
  };
}

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<ApiResponse<{
    user: User;
    token: string;
    refreshToken?: string;
  }>> {
    const response = await apiClient.post<{
      user: User;
      token: string;
      refreshToken?: string;
    }>(API_ENDPOINTS.auth.login, credentials);
    
    if (response.success && response.data) {
      // Store auth data
      apiClient.setAuth(response.data.token, response.data.refreshToken);
      this.setUser(response.data.user);
    }
    
    return response;
  }

  // Register new user
  async register(data: RegisterData): Promise<ApiResponse<{
    user: User;
    token: string;
    refreshToken?: string;
  }>> {
    const response = await apiClient.post<{
      user: User;
      token: string;
      refreshToken?: string;
    }>(API_ENDPOINTS.auth.register, data);
    
    if (response.success && response.data) {
      // Store auth data
      apiClient.setAuth(response.data.token, response.data.refreshToken);
      this.setUser(response.data.user);
    }
    
    return response;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      // Clear local auth data regardless of API response
      this.clearAuth();
    }
  }

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(API_ENDPOINTS.auth.me);
  }

  // Add persona to user
  async addPersona(personaData: PersonaSetupData): Promise<ApiResponse<User>> {
    const response = await apiClient.post<User>(API_ENDPOINTS.auth.personas, personaData);
    
    if (response.success && response.data) {
      this.setUser(response.data);
    }
    
    return response;
  }

  // Switch current persona
  async switchPersona(persona: PersonaType): Promise<ApiResponse<User>> {
    const response = await apiClient.put<User>(API_ENDPOINTS.auth.switchPersona, { persona });
    
    if (response.success && response.data) {
      this.setUser(response.data);
      this.setCurrentPersona(persona);
    }
    
    return response;
  }

  // Remove persona from user
  async removePersona(persona: PersonaType): Promise<ApiResponse<User>> {
    const response = await apiClient.delete<User>(`${API_ENDPOINTS.auth.personas}/${persona}`);
    
    if (response.success && response.data) {
      this.setUser(response.data);
    }
    
    return response;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Get stored auth token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.auth.token);
  }

  // Get stored user
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(STORAGE_KEYS.auth.user);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  // Get current persona
  getCurrentPersona(): PersonaType | null {
    if (typeof window === 'undefined') return null;
    
    // First check localStorage for override
    const storedPersona = localStorage.getItem(STORAGE_KEYS.auth.currentPersona) as PersonaType;
    if (storedPersona) return storedPersona;
    
    // Fall back to user's current persona
    const user = this.getStoredUser();
    return user?.currentPersona || null;
  }

  // Set user in storage
  private setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.auth.user, JSON.stringify(user));
    }
  }

  // Set current persona in storage
  private setCurrentPersona(persona: PersonaType): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.auth.currentPersona, persona);
    }
  }

  // Clear all auth data
  private clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.auth.token);
      localStorage.removeItem(STORAGE_KEYS.auth.refreshToken);
      localStorage.removeItem(STORAGE_KEYS.auth.user);
      localStorage.removeItem(STORAGE_KEYS.auth.currentPersona);
    }
    apiClient.clearAuth();
  }

  // Refresh token
  async refreshToken(): Promise<ApiResponse<{
    token: string;
    refreshToken?: string;
  }>> {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem(STORAGE_KEYS.auth.refreshToken)
      : null;
    
    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token available',
      };
    }

    const response = await apiClient.post<{
      token: string;
      refreshToken?: string;
    }>('/auth/refresh', { refreshToken });
    
    if (response.success && response.data) {
      apiClient.setAuth(response.data.token, response.data.refreshToken);
    }
    
    return response;
  }

  // Verify token validity
  async verifyToken(): Promise<boolean> {
    try {
      const response = await this.getCurrentUser();
      return response.success;
    } catch {
      return false;
    }
  }

  // Initialize auth state (for app startup)
  async initializeAuth(): Promise<{
    isAuthenticated: boolean;
    user: User | null;
    currentPersona: PersonaType | null;
  }> {
    const token = this.getToken();
    
    if (!token) {
      return {
        isAuthenticated: false,
        user: null,
        currentPersona: null,
      };
    }

    // Verify token is still valid
    const userResponse = await this.getCurrentUser();
    
    if (userResponse.success && userResponse.data) {
      this.setUser(userResponse.data);
      return {
        isAuthenticated: true,
        user: userResponse.data,
        currentPersona: this.getCurrentPersona(),
      };
    }

    // Token is invalid, clear auth data
    this.clearAuth();
    return {
      isAuthenticated: false,
      user: null,
      currentPersona: null,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export class for testing
export { AuthService };
