/**
 * Application Configuration
 * 
 * Centralizes all configuration values and environment variables
 * to make it easier to update and maintain application settings.
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT as string, 10) || 30000,
  RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS as string, 10) || 3,
};

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'authToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  TOKEN_EXPIRY_KEY: 'tokenExpiry',
  SESSION_TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT as string, 10) || 3600000, // 1 hour
};

// Feature Flags
export const FEATURES = {
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
  ENABLE_CHAT_SUPPORT: import.meta.env.VITE_ENABLE_CHAT_SUPPORT === 'true',
  MAINTENANCE_MODE: import.meta.env.VITE_MAINTENANCE_MODE === 'true',
};

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 300, // ms
  TOAST_DURATION: 5000, // ms
  ITEMS_PER_PAGE: 10,
  DEBOUNCE_DELAY: 300, // ms for search/filter operations
  DATE_FORMAT: 'MMM dd, yyyy', // Default date format
  CURRENCY: {
    SYMBOL: '₹',
    CODE: 'INR',
    POSITION: 'prefix', // 'prefix' or 'suffix'
  },
};

// Routes Configuration
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  ROOMS: '/rooms',
  ROOM_TYPES: '/room-types',
  BOOKINGS: '/bookings',
  RESERVATIONS: '/reservations',
  RECENT_BOOKINGS: '/recent-bookings',
  STAFF: '/staff',
  PROPERTY: '/property',
  SETTINGS: '/settings',
  HELP: '/help',
  ANALYTICS: '/analytics',
  CUSTOMER_SUPPORT: '/customer-support',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_AND_CONDITIONS: '/terms-and-conditions',
};

// Export default config object with all settings
export default {
  API: API_CONFIG,
  AUTH: AUTH_CONFIG,
  FEATURES,
  UI: UI_CONFIG,
  ROUTES,
};