/**
 * Convert page and limit to a range of records
 * 
 * @param page - Page number (1-based)
 * @param limit - Number of items per page
 * @returns Object with from and to indices for range queries
 */
export function paginationToRange(page: number, limit: number): { from: number; to: number } {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to };
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /** Current page number */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a previous page */
  hasPrevPage: boolean;
  /** Whether there is a next page */
  hasNextPage: boolean;
}

/**
 * Calculate pagination metadata
 * 
 * @param page - Current page number
 * @param limit - Number of items per page
 * @param total - Total number of items
 * @returns Pagination metadata
 */
export function calculatePaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  
  return {
    currentPage: page,
    pageSize: limit,
    totalItems: total,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages
  };
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  data: T[];
  /** Pagination metadata */
  pagination: PaginationMeta;
}

/**
 * Create a paginated response
 * 
 * @param data - Array of items for the current page
 * @param page - Current page number
 * @param limit - Number of items per page
 * @param total - Total number of items
 * @returns Paginated response object
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: calculatePaginationMeta(page, limit, total)
  };
}

/**
 * Extract pagination parameters from request query params
 * 
 * @param query - Request query parameters
 * @param defaultLimit - Default limit if not specified
 * @param maxLimit - Maximum allowed limit
 * @returns Object with page and limit values
 */
export function extractPaginationParams(
  query: Record<string, any>,
  defaultLimit: number = 20,
  maxLimit: number = 100
): { page: number; limit: number } {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  let limit = parseInt(query.limit as string, 10) || defaultLimit;
  limit = Math.min(maxLimit, Math.max(1, limit));
  
  return { page, limit };
}

/**
 * Generate pagination links for API responses
 * 
 * @param baseUrl - Base URL for the API endpoint
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @param queryParams - Additional query parameters
 * @returns Object with pagination links
 */
export function generatePaginationLinks(
  baseUrl: string,
  page: number,
  limit: number,
  total: number,
  queryParams: Record<string, any> = {}
): { first: string; last: string; prev: string | null; next: string | null } {
  const totalPages = Math.ceil(total / limit);
  
  // Build query string from additional params
  const otherParams = Object.entries(queryParams)
    .filter(([key]) => key !== 'page' && key !== 'limit')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  const queryString = otherParams ? `&${otherParams}` : '';
  
  // Generate links
  const first = `${baseUrl}?page=1&limit=${limit}${queryString}`;
  const last = `${baseUrl}?page=${totalPages}&limit=${limit}${queryString}`;
  const prev = page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}${queryString}` : null;
  const next = page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}${queryString}` : null;
  
  return { first, last, prev, next };
}