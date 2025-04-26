/**
 * Booking Feature Types
 * 
 * This file contains TypeScript interfaces and types specific to the booking feature.
 */

import { Reservation, Guest, Room } from "@shared/schema";

/**
 * Status options for a booking/reservation
 */
export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'checked-in'
  | 'checked-out'
  | 'cancelled'
  | 'no-show';

/**
 * Payment method options
 */
export type PaymentMethod =
  | 'credit-card'
  | 'debit-card'
  | 'bank-transfer'
  | 'cash'
  | 'upi'
  | 'paypal'
  | 'other';

/**
 * Payment status options
 */
export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'partially-paid'
  | 'refunded'
  | 'failed';

/**
 * Extended booking interface with relationships
 * This extends the base Reservation type with additional fields and related data
 */
export interface BookingDetails extends Reservation {
  room?: Room;
  guests?: Guest[];
  totalNights?: number;
  priceBreakdown?: {
    baseRate: number;
    taxes: number;
    fees: number;
    discounts: number;
    total: number;
  };
}

/**
 * Booking search/filter parameters
 */
export interface BookingFilterParams {
  search?: string;
  status?: BookingStatus | 'all';
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  roomType?: string;
  guestId?: number;
  sortBy?: 'checkInDate' | 'checkOutDate' | 'createdAt' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Booking statistics/summary
 */
export interface BookingStats {
  total: number;
  upcoming: number;
  active: number;
  pastBookings: number;
  cancelled: number;
  noShow: number;
  averageStayLength: number;
  occupancyRate: number;
}

/**
 * Special request option
 */
export interface SpecialRequest {
  id: string;
  name: string;
  description?: string;
  additionalCharge?: number;
  available: boolean;
}

/**
 * Booking form data 
 */
export interface BookingFormData {
  guestId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  adults: string;
  children: string;
  paymentMethod: string;
  totalAmount: string;
  taxRate: string;
  amountPaid: string;
  bookingStatus: string;
  specialRequests?: string;
}

/**
 * Room availability check response
 */
export interface AvailabilityResponse {
  available: boolean;
  availableRooms: number;
  unavailableDates?: string[];
  alternativeRooms?: {
    id: number;
    number: string;
    category: string;
    baseRate: number;
  }[];
  message?: string;
}