// Importing types from shared schema
import {
  Property as PropertySchema,
  InsertProperty as InsertPropertySchema,
  Room as RoomSchema,
  InsertRoom as InsertRoomSchema,
  Guest as GuestSchema,
  InsertGuest as InsertGuestSchema,
  Reservation as ReservationSchema,
  InsertReservation as InsertReservationSchema,
  Staff as StaffSchema,
  InsertStaff as InsertStaffSchema,
  User as UserSchema,
  InsertUser as InsertUserSchema,
  Finance as FinanceSchema,
  InsertFinance as InsertFinanceSchema,
} from '@/shared/schema';

// Re-export the types
export type Property = PropertySchema;
export type InsertProperty = InsertPropertySchema;

export type Room = RoomSchema;
export type InsertRoom = InsertRoomSchema;

export type Guest = GuestSchema;
export type InsertGuest = InsertGuestSchema;

export type Reservation = ReservationSchema;
export type InsertReservation = InsertReservationSchema;

export type Staff = StaffSchema;
export type InsertStaff = InsertStaffSchema;

export type User = UserSchema;
export type InsertUser = InsertUserSchema;

export type Finance = FinanceSchema;
export type InsertFinance = InsertFinanceSchema;

// Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  status?: number;
}

// Options for API requests
export interface ApiOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

// Booking-related types
export interface Booking {
  id: number;
  status: string;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  guestIds: unknown;
  specialRequests: unknown;
  paymentDetails: unknown;
  timeline: unknown;
  linkedBookings: unknown;
  createdAt: Date | null;
}

export interface BookingStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  checkedIn: number;
  noShows: number;
  revenue: {
    total: number;
    average: number;
    thisMonth: number;
    lastMonth: number;
  };
}

// Invoice-related types
export interface Invoice {
  id: number;
  reservationId: number;
  invoiceNumber: string;
  customerName: string;
  customerDetails: {
    email: string;
    phone: string;
    address?: string;
  };
  roomDetails: {
    roomNumber: string;
    roomType: string;
    rate: number;
  };
  checkInDate: Date;
  checkOutDate: Date;
  subTotal: number;
  taxDetails: {
    gst: number;
    serviceCharge?: number;
  };
  totalAmount: number;
  amountPaid: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentMethod?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertInvoice {
  reservationId: number;
  customerName: string;
  customerDetails: {
    email: string;
    phone: string;
    address?: string;
  };
  roomDetails: {
    roomNumber: string;
    roomType: string;
    rate: number;
  };
  checkInDate: Date;
  checkOutDate: Date;
  subTotal: number;
  taxDetails: {
    gst: number;
    serviceCharge?: number;
  };
  totalAmount: number;
  amountPaid: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentMethod?: string;
  notes?: string;
}

// Extended types for more detailed information
export interface DetailedRoom extends Room {
  currentGuests?: Guest[];
  occupancyHistory?: {
    date: string;
    isOccupied: boolean;
  }[];
  maintenanceHistory?: {
    date: string;
    description: string;
    cost: number;
  }[];
}

export interface DetailedReservation extends Reservation {
  guest?: Guest;
  room?: Room;
  invoices?: Invoice[];
}

export interface DetailedGuest extends Guest {
  reservations?: Reservation[];
  totalSpent?: number;
  stayCount?: number;
  lastStay?: Date;
}