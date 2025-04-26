/**
 * API Client
 * 
 * Core API client for making HTTP requests to the backend.
 * Wraps fetch with type safety, error handling, and consistent response format.
 */

import { QueryClient } from '@tanstack/react-query';
import { API_CONFIG } from '../config';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private queryClient: QueryClient | null = null;

  constructor(baseUrl: string = API_CONFIG.API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Set the query client for cache invalidation
   */
  setQueryClient(client: QueryClient) {
    this.queryClient = client;
  }

  /**
   * Parse API response
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    
    let data: any;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
      try {
        data = JSON.parse(data);
      } catch (e) {
        // leave as text if not valid JSON
      }
    }
    
    if (!response.ok) {
      const message = data?.message || data?.error || response.statusText || 'Unknown error';
      throw new ApiError(message, response.status, data);
    }
    
    return {
      data,
      status: response.status,
      message: data?.message,
    };
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    headers?: HeadersInit,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    const requestOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      ...options,
    };
    
    // If we have a body and it's not FormData, stringify it
    if (body && !(body instanceof FormData)) {
      requestOptions.body = JSON.stringify(body);
    } else if (body instanceof FormData) {
      // If it's FormData, remove default Content-Type header so browser can set the proper boundary
      delete (requestOptions.headers as any)['Content-Type'];
      requestOptions.body = body;
    }
    
    // Add credentials to include cookies
    requestOptions.credentials = 'include';
    
    // Add JWT token if available (e.g. from localStorage)
    const token = localStorage.getItem('authToken');
    if (token) {
      (requestOptions.headers as any).Authorization = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, requestOptions);
      return await this.parseResponse<T>(response);
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network errors, etc.
      throw new ApiError(
        error.message || 'Network error',
        0,
        { originalError: error }
      );
    }
  }

  /**
   * Make GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>, headers?: HeadersInit): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params as any)}` : endpoint;
    return this.request<T>(url, 'GET', undefined, headers);
  }

  /**
   * Make POST request
   */
  async post<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', data, headers);
  }

  /**
   * Make PUT request
   */
  async put<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', data, headers);
  }

  /**
   * Make PATCH request
   */
  async patch<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', data, headers);
  }

  /**
   * Make DELETE request
   */
  async delete<T = void>(endpoint: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, headers);
  }

  /**
   * Upload files
   */
  async upload<T>(endpoint: string, formData: FormData, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', formData, headers);
  }

  /**
   * Invalidate query cache
   */
  invalidateQueries(queryKey: string | any[]) {
    if (this.queryClient) {
      this.queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
    }
  }

  /**
   * Set a global header
   */
  setHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  /**
   * Remove a global header
   */
  removeHeader(key: string) {
    delete this.defaultHeaders[key];
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Create React Query client
export const createQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });
  
  // Global error handler for all queries
  queryClient.getQueryCache().subscribe(event => {
    if (event.type === 'error' && event.error instanceof ApiError) {
      if (event.error.status === 401) {
        // Redirect to login if unauthorized
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
  });
  
  // Set query client for the API client
  apiClient.setQueryClient(queryClient);
  
  return queryClient;
};

export default apiClient;