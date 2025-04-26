/**
 * ApiClient - Core API service for making HTTP requests
 * This service handles all API communication with consistent error handling, 
 * authentication, and response formatting.
 */

import { queryClient } from '@/lib/queryClient';

// Get API base URL from environment variables or use a default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
  success: boolean;
};

export type ApiErrorResponse = {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
};

// API request options
export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  withAuth?: boolean;
  timeout?: number;
}

/**
 * ApiClient class for making HTTP requests to the API
 */
class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(baseUrl: string = API_BASE_URL, defaultTimeout: number = 30000) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * Build the full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Get auth token from localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Add authorization header if token exists
   */
  private addAuthHeader(headers: HeadersInit, withAuth: boolean): HeadersInit {
    if (!withAuth) return headers;
    
    const token = this.getAuthToken();
    if (!token) return headers;
    
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Handle API errors
   */
  private handleError(error: any, url: string): never {
    console.error(`API Error [${url}]:`, error);
    
    if (error instanceof Response) {
      throw {
        message: `HTTP Error: ${error.status} ${error.statusText}`,
        status: error.status,
      };
    }
    
    if (error instanceof Error) {
      throw {
        message: error.message || 'Unknown error occurred',
        status: 500,
      };
    }
    
    throw {
      message: 'Network error occurred',
      status: 0,
    };
  }

  /**
   * Execute API request with timeout and error handling
   */
  private async request<T>(
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { 
      params, 
      withAuth = true, 
      timeout = this.defaultTimeout,
      headers = {},
      ...fetchOptions 
    } = options;
    
    const fullUrl = this.buildUrl(url, params);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        headers: this.addAuthHeader({
          'Content-Type': 'application/json',
          ...headers,
        }, withAuth),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Handle 401 Unauthorized globally
      if (response.status === 401) {
        // If authenticated route and token expired/invalid
        if (withAuth && this.getAuthToken()) {
          // Clear token and redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          return { status: 401, success: false, error: 'Authentication required' };
        }
      }
      
      // Handle JSON parsing
      let data: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      // Return standardized response
      if (response.ok) {
        return { 
          data, 
          status: response.status, 
          success: true 
        };
      } else {
        return {
          error: data.message || 'An error occurred',
          status: response.status,
          success: false,
          data
        };
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        return {
          error: 'Request timeout',
          status: 408,
          success: false
        };
      }
      
      return this.handleError(error, fullUrl);
    }
  }
  
  /**
   * HTTP Methods
   */
  async get<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }
  
  async post<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  async put<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  async patch<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  async delete<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

/**
 * React hook for making API requests with better type support
 */
export function useApi() {
  return {
    get: apiClient.get.bind(apiClient),
    post: apiClient.post.bind(apiClient),
    put: apiClient.put.bind(apiClient),
    patch: apiClient.patch.bind(apiClient),
    delete: apiClient.delete.bind(apiClient),
  };
}

// Export default instance
export default apiClient;