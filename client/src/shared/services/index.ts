/**
 * Services Index
 * 
 * This file exports all service modules for easier imports across the app.
 */

// Core API client
export { default as apiClient, ApiError } from './api';
export type { ApiResponse } from './api';

// Domain-specific services
export { default as analyticsService } from './analyticsService';
export { default as bookingService } from './bookingService';
export { default as guestService } from './guestService';
export { default as onboardingService } from './onboardingService';
export { default as propertyService } from './propertyService';
export { default as roomService } from './roomService';
export { default as staffService } from './staffService';

// Type exports for onboarding
export type { 
  BusinessBasics,
  PropertyConfig,
  RoomType,
  Policy
} from './onboardingService';

// For convenience, also export individual services directly
const services = {
  api: apiClient,
  analytics: analyticsService,
  booking: bookingService,
  guest: guestService,
  onboarding: onboardingService,
  property: propertyService,
  room: roomService,
  staff: staffService,
};

export default services;