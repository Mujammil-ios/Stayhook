/**
 * Application Configuration
 * 
 * Central location for all application configuration including API endpoints,
 * feature flags, theme settings, and other configuration values.
 */

// Environment configurations
const environments = {
  development: {
    API_BASE_URL: '/api', // Uses proxy in development
    ENABLE_MOCKS: false,
    DEBUG_MODE: true,
    DEMO_MODE: true,
  },
  production: {
    API_BASE_URL: '/api',
    ENABLE_MOCKS: false,
    DEBUG_MODE: false,
    DEMO_MODE: false,
  },
  test: {
    API_BASE_URL: '/api',
    ENABLE_MOCKS: true,
    DEBUG_MODE: true,
    DEMO_MODE: false,
  },
};

// Determine current environment
const ENV = import.meta.env.MODE || 'development';
const currentEnv = environments[ENV as keyof typeof environments] || environments.development;

// API configuration
export const API_CONFIG = {
  API_BASE_URL: currentEnv.API_BASE_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  ENABLE_MOCKS: currentEnv.ENABLE_MOCKS,
  UPLOAD_MAX_SIZE: 5 * 1024 * 1024, // 5MB
};

// Feature flags
export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_FILE_UPLOADS: true,
  ENABLE_EXPORT: true,
  ENABLE_SOCIAL_LOGIN: false,
  ENABLE_LIVE_CHAT: false,
  ENABLE_MULTI_LANGUAGE: false,
};

// App settings
export const APP_CONFIG = {
  APP_NAME: 'Hotel Management System',
  APP_VERSION: '1.0.0',
  COPYRIGHT: `© ${new Date().getFullYear()} Hotel Management System`,
  COMPANY_NAME: 'Your Hotel Brand',
  CONTACT_EMAIL: 'support@yourhotelbrand.com',
  DEBUG_MODE: currentEnv.DEBUG_MODE,
  DEMO_MODE: currentEnv.DEMO_MODE,
  DEFAULT_LANGUAGE: 'en',
  DEFAULT_CURRENCY: 'USD',
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour
  ITEMS_PER_PAGE: 10,
  DATE_FORMAT: 'dd MMM yyyy',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'dd MMM yyyy HH:mm',
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PROFILE: 'userProfile',
  THEME: 'theme',
  LANGUAGE: 'language',
  LAST_ACTIVE: 'lastActive',
  NOTIFICATIONS: 'notifications',
  SELECTED_PROPERTY: 'selectedProperty',
};

// Currency options
export const CURRENCY_OPTIONS = {
  USD: {
    symbol: '$',
    name: 'US Dollar',
    symbolPosition: 'before',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  EUR: {
    symbol: '€',
    name: 'Euro',
    symbolPosition: 'before',
    decimalDigits: 2,
    decimalSeparator: ',',
    thousandsSeparator: '.',
  },
  GBP: {
    symbol: '£',
    name: 'British Pound',
    symbolPosition: 'before',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  INR: {
    symbol: '₹',
    name: 'Indian Rupee',
    symbolPosition: 'before',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
};

// Default property types
export const PROPERTY_TYPES = [
  'Hotel',
  'Motel',
  'Resort',
  'Vacation Rental',
  'Boutique Hotel',
  'Apartment Hotel',
  'Villa',
  'Guest House',
  'Bed & Breakfast',
  'Hostel',
];

// Default room categories
export const ROOM_CATEGORIES = [
  'Standard',
  'Deluxe',
  'Suite',
  'Executive',
  'Family',
  'Single',
  'Double',
  'Twin',
  'Queen',
  'King',
  'Studio',
  'Accessible',
  'Penthouse',
  'Villa',
  'Cottage',
];

// Default room amenities
export const ROOM_AMENITIES = [
  'Air Conditioning',
  'Balcony',
  'Bath Tub',
  'Beach View',
  'City View',
  'Coffee Maker',
  'Free WiFi',
  'Garden View',
  'Hair Dryer',
  'In-room Safe',
  'Iron & Ironing Board',
  'Kitchen',
  'Mini Bar',
  'Mountain View',
  'Ocean View',
  'Pool Access',
  'Private Pool',
  'Refrigerator',
  'Room Service',
  'Satellite TV',
  'Shower',
  'Sofa',
  'Telephone',
  'TV',
  'Washing Machine',
  'Wheelchair Access',
  'Work Desk',
];

// Default property amenities
export const PROPERTY_AMENITIES = [
  'Airport Shuttle',
  'Bar/Lounge',
  'Breakfast',
  'Business Center',
  'Car Rental',
  'Concierge',
  'Conference Room',
  'Fitness Center',
  'Free Parking',
  'Game Room',
  'Garden',
  'Indoor Pool',
  'Jacuzzi',
  'Kids Club',
  'Laundry Service',
  'Outdoor Pool',
  'Pets Allowed',
  'Restaurant',
  'Room Service',
  'Sauna',
  'Spa',
  'Tennis Court',
  'Terrace',
  'Valet Parking',
  'WiFi',
];

// Default booking statuses
export const BOOKING_STATUSES = [
  { value: 'confirmed', label: 'Confirmed', color: 'success' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'checked-in', label: 'Checked In', color: 'info' },
  { value: 'checked-out', label: 'Checked Out', color: 'secondary' },
  { value: 'cancelled', label: 'Cancelled', color: 'danger' },
  { value: 'no-show', label: 'No Show', color: 'dark' },
];

// Default room statuses
export const ROOM_STATUSES = [
  { value: 'available', label: 'Available', color: 'success' },
  { value: 'occupied', label: 'Occupied', color: 'danger' },
  { value: 'reserved', label: 'Reserved', color: 'warning' },
  { value: 'maintenance', label: 'Maintenance', color: 'info' },
  { value: 'cleaning', label: 'Cleaning', color: 'secondary' },
  { value: 'inspecting', label: 'Inspecting', color: 'primary' },
  { value: 'out-of-order', label: 'Out of Order', color: 'dark' },
];

// Staff roles
export const STAFF_ROLES = [
  { value: 'manager', label: 'Manager' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'housekeeper', label: 'Housekeeper' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'concierge', label: 'Concierge' },
  { value: 'chef', label: 'Chef' },
  { value: 'waiter', label: 'Waiter/Waitress' },
  { value: 'security', label: 'Security' },
  { value: 'admin', label: 'Administrator' },
];

// Default payment methods
export const PAYMENT_METHODS = [
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'debit-card', label: 'Debit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'booking-com', label: 'Booking.com' },
  { value: 'expedia', label: 'Expedia' },
];

// Default countries list for address forms
export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'SG', name: 'Singapore' },
];

// Document types for guest ID verification
export const DOCUMENT_TYPES = [
  { value: 'passport', label: 'Passport' },
  { value: 'national-id', label: 'National ID Card' },
  { value: 'drivers-license', label: 'Driver\'s License' },
  { value: 'residence-permit', label: 'Residence Permit' },
  { value: 'voter-id', label: 'Voter ID Card' },
];

// Export default configuration
export default {
  API: API_CONFIG,
  FEATURES,
  APP: APP_CONFIG,
  STORAGE: STORAGE_KEYS,
  CURRENCIES: CURRENCY_OPTIONS,
  PROPERTY_TYPES,
  ROOM_CATEGORIES,
  ROOM_AMENITIES,
  PROPERTY_AMENITIES,
  BOOKING_STATUSES,
  ROOM_STATUSES,
  STAFF_ROLES,
  PAYMENT_METHODS,
  COUNTRIES,
  DOCUMENT_TYPES,
};