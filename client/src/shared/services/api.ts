import { ApiOptions, ApiResponse } from '@/types';

/**
 * Base API service for making HTTP requests
 */
const api = {
  /**
   * Make a HTTP request with the provided options
   * @param options The request options
   * @returns A Promise resolving to the API response
   */
  async request<T>({
    url,
    method,
    data,
    params,
    headers,
  }: ApiOptions): Promise<ApiResponse<T>> {
    try {
      // Build request options
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      // Add body if data is provided and method is not GET
      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      // Add query params if provided
      let fullUrl = url;
      if (params) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          queryParams.append(key, value);
        });
        fullUrl = `${url}?${queryParams.toString()}`;
      }

      // Make the request
      const response = await fetch(fullUrl, options);
      
      // Parse response as JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (error) {
        // Handle case where response is not JSON
        responseData = { message: 'Invalid response format' };
      }

      // Check if the request was successful
      if (response.ok) {
        return {
          success: true,
          data: responseData as T,
          status: response.status,
          message: responseData.message || 'Success',
        };
      } else {
        // Handle error response
        return {
          success: false,
          data: null as unknown as T,
          status: response.status,
          message: responseData.message || `Error: ${response.status} ${response.statusText}`,
        };
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('API request failed:', error);
      return {
        success: false,
        data: null as unknown as T,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  // Convenience methods for different HTTP verbs
  async get<T>(url: string, params?: Record<string, string>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      headers,
    });
  },

  async post<T>(url: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      headers,
    });
  },

  async put<T>(url: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      headers,
    });
  },

  async patch<T>(url: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PATCH',
      data,
      headers,
    });
  },

  async delete<T>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      headers,
    });
  },

  // Utility method for form data uploads
  async uploadFormData<T>(url: string, formData: FormData, method: 'POST' | 'PUT' | 'PATCH' = 'POST'): Promise<ApiResponse<T>> {
    try {
      const options: RequestInit = {
        method,
        body: formData,
      };

      const response = await fetch(url, options);
      
      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = { message: 'Invalid response format' };
      }

      if (response.ok) {
        return {
          success: true,
          data: responseData as T,
          status: response.status,
          message: responseData.message || 'Success',
        };
      } else {
        return {
          success: false,
          data: null as unknown as T,
          status: response.status,
          message: responseData.message || `Error: ${response.status} ${response.statusText}`,
        };
      }
    } catch (error) {
      console.error('API upload failed:', error);
      return {
        success: false,
        data: null as unknown as T,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
};

export default api;