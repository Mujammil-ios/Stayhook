/**
 * Booking Service
 * 
 * Handles all API communication related to bookings and reservations
 */

import { Reservation, InsertReservation } from '@shared/schema';
import apiClient, { ApiResponse } from './api';
import { getRecentReservations, reservationsData } from '@/lib/data';

// API endpoints
const ENDPOINTS = {
  ALL: '/reservations',
  RECENT: '/reservations/recent',
  DETAIL: (id: number | string) => `/reservations/${id}`,
  STATUS: (status: string) => `/reservations/status/${status}`,
  BY_GUEST: (guestId: number | string) => `/guests/${guestId}/reservations`,
  BY_ROOM: (roomId: number | string) => `/rooms/${roomId}/reservations`,
  AVAILABILITY: '/reservations/availability',
};

// Mocked reservation service utilizing current data imported from lib/data.ts
// These will be replaced with actual API calls when backend is ready
class BookingService {
  /**
   * Get all reservations
   */
  async getAll(): Promise<ApiResponse<Reservation[]>> {
    // This will be replaced with:
    // return apiClient.get<Reservation[]>(ENDPOINTS.ALL);
    
    return {
      data: reservationsData,
      status: 200,
      success: true
    };
  }

  /**
   * Get a single reservation by ID
   */
  async getById(id: number): Promise<ApiResponse<Reservation>> {
    // This will be replaced with:
    // return apiClient.get<Reservation>(ENDPOINTS.DETAIL(id));
    
    const reservation = reservationsData.find(r => r.id === id);
    if (!reservation) {
      return {
        error: 'Reservation not found',
        status: 404,
        success: false
      };
    }
    
    return {
      data: reservation,
      status: 200,
      success: true
    };
  }

  /**
   * Get recent reservations with optional limit
   */
  async getRecent(limit: number = 5): Promise<ApiResponse<Reservation[]>> {
    // This will be replaced with:
    // return apiClient.get<Reservation[]>(ENDPOINTS.RECENT, { params: { limit } });
    
    return {
      data: getRecentReservations(limit),
      status: 200,
      success: true
    };
  }

  /**
   * Get reservations by status
   */
  async getByStatus(status: string): Promise<ApiResponse<Reservation[]>> {
    // This will be replaced with:
    // return apiClient.get<Reservation[]>(ENDPOINTS.STATUS(status));
    
    const filtered = reservationsData.filter(r => r.status === status);
    return {
      data: filtered,
      status: 200,
      success: true
    };
  }

  /**
   * Get reservations for a specific guest
   */
  async getByGuest(guestId: number): Promise<ApiResponse<Reservation[]>> {
    // This will be replaced with:
    // return apiClient.get<Reservation[]>(ENDPOINTS.BY_GUEST(guestId));
    
    const filtered = reservationsData.filter(r => r.guestIds.includes(guestId));
    return {
      data: filtered,
      status: 200,
      success: true
    };
  }

  /**
   * Get reservations for a specific room
   */
  async getByRoom(roomId: number): Promise<ApiResponse<Reservation[]>> {
    // This will be replaced with:
    // return apiClient.get<Reservation[]>(ENDPOINTS.BY_ROOM(roomId));
    
    const filtered = reservationsData.filter(r => r.roomId === roomId);
    return {
      data: filtered,
      status: 200,
      success: true
    };
  }

  /**
   * Create a new reservation
   */
  async create(reservation: InsertReservation): Promise<ApiResponse<Reservation>> {
    // This will be replaced with:
    // return apiClient.post<Reservation>(ENDPOINTS.ALL, reservation);
    
    // For now, simply return a mocked response with the data
    const newReservation: Reservation = {
      ...reservation,
      id: Math.max(...reservationsData.map(r => r.id)) + 1,
      createdAt: new Date(),
    };
    
    return {
      data: newReservation,
      status: 201,
      success: true
    };
  }

  /**
   * Update an existing reservation
   */
  async update(id: number, data: Partial<Reservation>): Promise<ApiResponse<Reservation>> {
    // This will be replaced with:
    // return apiClient.patch<Reservation>(ENDPOINTS.DETAIL(id), data);
    
    const reservation = reservationsData.find(r => r.id === id);
    if (!reservation) {
      return {
        error: 'Reservation not found',
        status: 404,
        success: false
      };
    }
    
    const updated = { ...reservation, ...data };
    
    return {
      data: updated,
      status: 200,
      success: true
    };
  }

  /**
   * Delete a reservation
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    // This will be replaced with:
    // return apiClient.delete<void>(ENDPOINTS.DETAIL(id));
    
    const reservation = reservationsData.find(r => r.id === id);
    if (!reservation) {
      return {
        error: 'Reservation not found',
        status: 404,
        success: false
      };
    }
    
    return {
      status: 204,
      success: true
    };
  }

  /**
   * Check room availability for a date range
   */
  async checkAvailability(params: {
    startDate: Date | string;
    endDate: Date | string;
    roomType?: string;
    guestCount?: number;
  }): Promise<ApiResponse<any>> {
    // This will be replaced with:
    // return apiClient.get(ENDPOINTS.AVAILABILITY, { params });
    
    return {
      data: {
        available: true,
        availableRooms: 5,
        roomOptions: [
          { id: 1, number: '101', type: 'Standard Room', baseRate: 99 },
          { id: 2, number: '102', type: 'Standard Room', baseRate: 99 },
          // etc...
        ]
      },
      status: 200,
      success: true
    };
  }
}

// Export a singleton instance
export const bookingService = new BookingService();

// Default export
export default bookingService;