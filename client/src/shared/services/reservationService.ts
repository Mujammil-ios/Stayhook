import api from './api';
import { Reservation, InsertReservation, DetailedReservation, ApiResponse } from '@/types';

/**
 * Service for handling reservation-related API calls
 */
const reservationService = {
  /**
   * Get all reservations
   * @returns Promise with array of reservations
   */
  async getAll(): Promise<ApiResponse<Reservation[]>> {
    try {
      return await api.get<Reservation[]>('/api/reservations');
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : 'Failed to fetch reservations',
      };
    }
  },

  /**
   * Get a specific reservation by ID
   * @param id The reservation ID
   * @returns Promise with the reservation data
   */
  async getById(id: number): Promise<ApiResponse<Reservation>> {
    try {
      return await api.get<Reservation>(`/api/reservations/${id}`);
    } catch (error) {
      console.error(`Error fetching reservation ${id}:`, error);
      return {
        success: false,
        data: {} as Reservation,
        message: error instanceof Error ? error.message : `Failed to fetch reservation ${id}`,
      };
    }
  },

  /**
   * Get detailed reservation information including related data
   * @param id The reservation ID
   * @returns Promise with detailed reservation info
   */
  async getDetailedById(id: number): Promise<ApiResponse<DetailedReservation>> {
    try {
      return await api.get<DetailedReservation>(`/api/reservations/${id}/detailed`);
    } catch (error) {
      console.error(`Error fetching detailed reservation ${id}:`, error);
      return {
        success: false,
        data: {} as DetailedReservation,
        message: error instanceof Error ? error.message : `Failed to fetch detailed reservation ${id}`,
      };
    }
  },

  /**
   * Get reservations for a specific room
   * @param roomId The room ID
   * @returns Promise with array of reservations
   */
  async getByRoomId(roomId: number): Promise<ApiResponse<Reservation[]>> {
    try {
      return await api.get<Reservation[]>(`/api/reservations/room/${roomId}`);
    } catch (error) {
      console.error(`Error fetching reservations for room ${roomId}:`, error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : `Failed to fetch reservations for room ${roomId}`,
      };
    }
  },

  /**
   * Get reservations for a specific guest
   * @param guestId The guest ID
   * @returns Promise with array of reservations
   */
  async getByGuestId(guestId: number): Promise<ApiResponse<Reservation[]>> {
    try {
      return await api.get<Reservation[]>(`/api/reservations/guest/${guestId}`);
    } catch (error) {
      console.error(`Error fetching reservations for guest ${guestId}:`, error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : `Failed to fetch reservations for guest ${guestId}`,
      };
    }
  },

  /**
   * Get reservations by status (confirmed, pending, cancelled, etc.)
   * @param status The reservation status
   * @returns Promise with array of reservations
   */
  async getByStatus(status: string): Promise<ApiResponse<Reservation[]>> {
    try {
      return await api.get<Reservation[]>(`/api/reservations/status/${status}`);
    } catch (error) {
      console.error(`Error fetching ${status} reservations:`, error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : `Failed to fetch ${status} reservations`,
      };
    }
  },

  /**
   * Get reservations for a date range
   * @param startDate The start date
   * @param endDate The end date
   * @returns Promise with array of reservations
   */
  async getByDateRange(startDate: string, endDate: string): Promise<ApiResponse<Reservation[]>> {
    try {
      return await api.get<Reservation[]>('/api/reservations/date-range', {
        startDate,
        endDate,
      });
    } catch (error) {
      console.error('Error fetching reservations by date range:', error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : 'Failed to fetch reservations by date range',
      };
    }
  },

  /**
   * Create a new reservation
   * @param data The reservation data
   * @returns Promise with the created reservation
   */
  async create(data: InsertReservation): Promise<ApiResponse<Reservation>> {
    try {
      // For development, mock API call with data
      // This would be replaced with the actual API call in production
      
      // Simulate API call
      console.log('Creating reservation:', data);
      
      // Mock a successful response
      const mockResponse: Reservation = {
        id: Math.floor(Math.random() * 10000) + 1,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      return {
        success: true,
        data: mockResponse,
        message: 'Reservation created successfully',
      };
      
      // Uncomment for actual API implementation:
      // return await api.post<Reservation>('/api/reservations', data);
    } catch (error) {
      console.error('Error creating reservation:', error);
      return {
        success: false,
        data: {} as Reservation,
        message: error instanceof Error ? error.message : 'Failed to create reservation',
      };
    }
  },

  /**
   * Update a reservation
   * @param id The reservation ID
   * @param data The updated reservation data
   * @returns Promise with the updated reservation
   */
  async update(id: number, data: Partial<InsertReservation>): Promise<ApiResponse<Reservation>> {
    try {
      return await api.patch<Reservation>(`/api/reservations/${id}`, data);
    } catch (error) {
      console.error(`Error updating reservation ${id}:`, error);
      return {
        success: false,
        data: {} as Reservation,
        message: error instanceof Error ? error.message : `Failed to update reservation ${id}`,
      };
    }
  },

  /**
   * Delete a reservation
   * @param id The reservation ID
   * @returns Promise with success/failure status
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      return await api.delete<void>(`/api/reservations/${id}`);
    } catch (error) {
      console.error(`Error deleting reservation ${id}:`, error);
      return {
        success: false,
        data: undefined as unknown as void,
        message: error instanceof Error ? error.message : `Failed to delete reservation ${id}`,
      };
    }
  },

  /**
   * Update reservation status
   * @param id The reservation ID
   * @param status The new status
   * @returns Promise with the updated reservation
   */
  async updateStatus(id: number, status: string): Promise<ApiResponse<Reservation>> {
    try {
      return await api.patch<Reservation>(`/api/reservations/${id}/status`, { status });
    } catch (error) {
      console.error(`Error updating reservation ${id} status:`, error);
      return {
        success: false,
        data: {} as Reservation,
        message: error instanceof Error ? error.message : `Failed to update reservation ${id} status`,
      };
    }
  },

  /**
   * Get reservation statistics
   * @returns Promise with reservation stats
   */
  async getStats(): Promise<ApiResponse<any>> {
    try {
      return await api.get<any>('/api/reservations/stats');
    } catch (error) {
      console.error('Error fetching reservation stats:', error);
      return {
        success: false,
        data: {},
        message: error instanceof Error ? error.message : 'Failed to fetch reservation stats',
      };
    }
  },
};

export default reservationService;