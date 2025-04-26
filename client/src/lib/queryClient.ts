/**
 * TanStack Query Client Configuration
 */

import { QueryClient } from '@tanstack/react-query';

// Basic error handling for failed API requests
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorText: string;

    try {
      const data = await res.json();
      errorText = data.message || data.error || `HTTP Error ${res.status}`;
    } catch (e) {
      errorText = `HTTP Error ${res.status}`;
    }

    throw new Error(errorText);
  }
}

// Shared API request function for use with TanStack Query
export async function apiRequest({
  url,
  method,
  data,
  headers = {},
}: {
  url: string;
  method: string;
  data?: any;
  headers?: Record<string, string>;
}) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(url, options);
  await throwIfResNotOk(res);
  
  try {
    return await res.json();
  } catch (e) {
    // Some endpoints don't return JSON
    return {};
  }
}

// Default behavior for unauthorized requests
type UnauthorizedBehavior = "returnNull" | "throw";

// Query function factory that handles common patterns
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (context: { queryKey: string[] }) => Promise<T> = (options) => {
  return async (context) => {
    const [url] = context.queryKey;

    try {
      const data = await apiRequest({
        url,
        method: 'GET',
      });
      return data as T;
    } catch (e: any) {
      if (e.message.includes('401') && options.on401 === 'returnNull') {
        return null as any;
      }
      throw e;
    }
  };
};

// Create and export QueryClient with default configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});