import { APP_CONFIG, API_ENDPOINTS, STORAGE_KEYS } from '../constants';
import type { ApiResponse, PaginatedResponse } from '../types';

// API Client Configuration
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseUrl = APP_CONFIG.apiUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Get auth token from storage
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.auth.token);
  }

  // Create request headers with auth token
  private createHeaders(additionalHeaders?: HeadersInit): HeadersInit {
    const token = this.getAuthToken();
    const headers: Record<string, string> = { 
      ...this.defaultHeaders as Record<string, string>, 
      ...additionalHeaders as Record<string, string> 
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle API responses
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Request failed',
          data: undefined,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse response',
        data: undefined,
      };
    }
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: this.createHeaders(options.headers),
      };

      const response = await fetch(url, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        data: undefined,
      };
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload files
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
        data: undefined,
      };
    }
  }

  // Paginated requests
  async getPaginated<T>(
    endpoint: string,
    params?: {
      page?: number;
      limit?: number;
      sort?: string;
      filter?: Record<string, any>;
    }
  ): Promise<PaginatedResponse<T>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    const response = await this.request<any>(url);

    if (response.success) {
      return {
        success: true,
        data: response.data?.items || response.data || [],
        pagination: response.data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };
    }

    return {
      success: false,
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }

  // Clear auth token
  clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.auth.token);
      localStorage.removeItem(STORAGE_KEYS.auth.refreshToken);
      localStorage.removeItem(STORAGE_KEYS.auth.user);
    }
  }

  // Set auth token
  setAuth(token: string, refreshToken?: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.auth.token, token);
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.auth.refreshToken, refreshToken);
      }
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.get(API_ENDPOINTS.health);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing or custom instances
export { ApiClient };
