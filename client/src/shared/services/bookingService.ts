/**
 * Booking Service
 * 
 * Service for managing bookings and reservations.
 */

import { ApiResponse } from './api';
import apiClient from './api';
import { Reservation, InsertReservation } from '@shared/schema';
import { BookingStats } from '@/features/booking/types';
import { API_CONFIG } from '../config';

// API endpoints for bookings
const ENDPOINTS = {
  ALL: '/reservations',
  DETAIL: (id: number) => `/reservations/${id}`,
  RECENT: (limit: number = 5) => `/reservations/recent?limit=${limit}`,
  BY_STATUS: (status: string) => `/reservations/status/${status}`,
  BY_GUEST: (guestId: number) => `/reservations/guest/${guestId}`,
  BY_ROOM: (roomId: number) => `/reservations/room/${roomId}`,
  STATS: '/reservations/stats',
  AVAILABILITY: '/reservations/availability',
};

class BookingService {
  /**
   * Get all bookings
   */
  async getAll(): Promise<ApiResponse<Reservation[]>> {
    try {
      const response = await apiClient.get<Reservation[]>(ENDPOINTS.ALL);
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        error: error.message || 'Failed to fetch bookings',
      };
    }
  }

  /**
   * Get a booking by ID
   */
  async getById(id: number): Promise<ApiResponse<Reservation>> {
    try {
      const response = await apiClient.get<Reservation>(ENDPOINTS.DETAIL(id));
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: {} as Reservation,
        status: error.status || 500,
        error: error.message || 'Failed to fetch booking',
      };
    }
  }

  /**
   * Get recent bookings with limit
   */
  async getRecent(limit: number = 5): Promise<ApiResponse<Reservation[]>> {
    try {
      const response = await apiClient.get<Reservation[]>(ENDPOINTS.RECENT(limit));
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        error: error.message || 'Failed to fetch recent bookings',
      };
    }
  }

  /**
   * Get bookings by status
   */
  async getByStatus(status: string): Promise<ApiResponse<Reservation[]>> {
    try {
      const response = await apiClient.get<Reservation[]>(ENDPOINTS.BY_STATUS(status));
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        error: error.message || 'Failed to fetch bookings by status',
      };
    }
  }

  /**
   * Get bookings for a guest
   */
  async getByGuest(guestId: number): Promise<ApiResponse<Reservation[]>> {
    try {
      const response = await apiClient.get<Reservation[]>(ENDPOINTS.BY_GUEST(guestId));
      const bookings = response.data.map(r => ({
        ...r,
        guestIds: Array.isArray(r.guestIds) ? r.guestIds : [r.guestIds]
      }));
      return {
        ...response,
        data: bookings,
        success: true,
      };
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        error: error.message || 'Failed to fetch guest bookings',
      };
    }
  }

  /**
   * Get bookings for a room
   */
  async getByRoom(roomId: number): Promise<ApiResponse<Reservation[]>> {
    try {
      const response = await apiClient.get<Reservation[]>(ENDPOINTS.BY_ROOM(roomId));
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        error: error.message || 'Failed to fetch room bookings',
      };
    }
  }

  /**
   * Create a new booking
   */
  async create(data: InsertReservation): Promise<ApiResponse<Reservation>> {
    try {
      // Convert string dates to Date objects
      const createdAt = new Date();
      
      const payload = {
        ...data,
        createdAt
      };
      
      const response = await apiClient.post<Reservation>(ENDPOINTS.ALL, payload);
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: {} as Reservation,
        status: error.status || 500,
        error: error.message || 'Failed to create booking',
      };
    }
  }

  /**
   * Update a booking
   */
  async update(id: number, data: Partial<Reservation>): Promise<ApiResponse<Reservation>> {
    try {
      const response = await apiClient.patch<Reservation>(ENDPOINTS.DETAIL(id), data);
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: {} as Reservation,
        status: error.status || 500,
        error: error.message || 'Failed to update booking',
      };
    }
  }

  /**
   * Delete a booking
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(ENDPOINTS.DETAIL(id));
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: undefined,
        status: error.status || 500,
        error: error.message || 'Failed to delete booking',
      };
    }
  }

  /**
   * Get booking statistics
   */
  async getStats(): Promise<ApiResponse<BookingStats>> {
    try {
      const response = await apiClient.get<BookingStats>(ENDPOINTS.STATS);
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: {} as BookingStats,
        status: error.status || 500,
        error: error.message || 'Failed to fetch booking stats',
      };
    }
  }

  /**
   * Check room availability for given dates
   */
  async checkAvailability(params: {
    startDate: Date | string;
    endDate: Date | string;
    roomType?: string;
    guestCount?: number;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(ENDPOINTS.AVAILABILITY, params);
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: { available: false },
        status: error.status || 500,
        error: error.message || 'Failed to check availability',
      };
    }
  }
}

export const bookingService = new BookingService();
export default bookingService;