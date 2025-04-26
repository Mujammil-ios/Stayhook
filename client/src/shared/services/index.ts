/**
 * Services Index
 * 
 * Export all services for easier imports
 */

// Core API client
export { default as apiClient, useApi } from './api';
export type { ApiResponse, ApiErrorResponse, ApiRequestOptions } from './api';

// Feature-specific services
export { default as roomService } from './roomService';
export { default as bookingService } from './bookingService';
export { default as guestService } from './guestService';
export { default as staffService } from './staffService';

// Centralized export of all services for easier access
const services = {
  api: apiClient,
  room: roomService,
  booking: bookingService,
  guest: guestService,
  staff: staffService,
};

export default services;