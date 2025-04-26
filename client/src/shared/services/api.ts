/**
 * API Service
 * 
 * Core service for handling API communication.
 */

import { queryClient } from '@/lib/queryClient';

interface ApiOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  params?: Record<string, string>;
  headers?: HeadersInit;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}

// Function to handle API requests
const apiRequest = async <T>({
  url,
  method,
  data,
  params,
  headers = {},
}: ApiOptions): Promise<ApiResponse<T>> => {
  try {
    // Build request URL with query parameters
    const queryParams = params
      ? `?${new URLSearchParams(params).toString()}`
      : '';
    
    const fullUrl = `${url}${queryParams}`;
    
    // Default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    // Prepare request options
    const options: RequestInit = {
      method,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
    };
    
    // Add body if it's not a GET request
    if (method !== 'GET' && data) {
      options.body = JSON.stringify(data);
    }
    
    // Make the request
    const response = await fetch(fullUrl, options);
    
    // Parse response
    let responseData: any;
    
    try {
      responseData = await response.json();
    } catch (error) {
      responseData = {};
    }
    
    // Handle response
    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }
    
    // Return successful response
    return {
      success: true,
      data: responseData,
      status: response.status,
    };
  } catch (error: any) {
    // Log error
    console.error(`API error for ${method} ${url}:`, error);
    
    // Return error response
    return {
      success: false,
      message: error.message || 'An error occurred',
    };
  }
};

// Re-export the apiRequest function
export { apiRequest };

// Also create and export an API object with the apiRequest method
const api = { request: apiRequest };
export default api;