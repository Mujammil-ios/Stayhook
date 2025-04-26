/**
 * Booking Feature Index
 * 
 * Export public API for the booking feature module
 * This makes it easier to import booking-related components, hooks, and types
 */

// Export components
export { default as BookingForm } from './components/BookingForm';
export { default as BookingModal } from './components/BookingModal';
export { default as BookingList } from './components/BookingList';

// Export hooks
export { useBookings } from './hooks/useBookings';

// Export types
export type {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
  BookingDetails,
  BookingFilterParams,
  BookingStats,
  SpecialRequest,
  BookingFormData,
  AvailabilityResponse
} from './types';