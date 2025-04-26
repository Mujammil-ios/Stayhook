/**
 * Room Service
 * 
 * Service for room-related API operations.
 */

import type { ApiResponse } from './api';
import { apiRequest } from './api';
import type { Room, InsertRoom } from '../../types'; // Use our types directly

// API endpoints for rooms
const ENDPOINTS = {
  BASE: '/api/rooms',
  DETAIL: (id: number | string) => `/api/rooms/${id}`,
  AVAILABILITY: '/api/rooms/availability',
  CATEGORIES: '/api/rooms/categories',
  TYPES: '/api/rooms/types',
  STATUS: '/api/rooms/status',
};

/**
 * Room Service class for handling room-related API operations
 */
class RoomService {
  /**
   * Get all rooms
   */
  async getAll(): Promise<ApiResponse<Room[]>> {
    // For now, this returns mock data since the API is not implemented
    return {
      success: true,
      data: [
        {
          id: 1,
          number: '101',
          name: 'Deluxe Room',
          floor: 1,
          status: 'available',
          roomType: 'deluxe',
          capacity: 2,
          pricePerNight: 150,
          description: 'A spacious deluxe room with a king-sized bed and city view.',
          amenities: ['wifi', 'tv', 'minibar', 'air_conditioning'],
          images: ['room-101.jpg'],
          propertyId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          number: '102',
          name: 'Standard Room',
          floor: 1,
          status: 'occupied',
          roomType: 'standard',
          capacity: 2,
          pricePerNight: 100,
          description: 'A comfortable standard room with twin beds.',
          amenities: ['wifi', 'tv', 'air_conditioning'],
          images: ['room-102.jpg'],
          propertyId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          number: '201',
          name: 'Suite',
          floor: 2,
          status: 'available',
          roomType: 'suite',
          capacity: 4,
          pricePerNight: 250,
          description: 'A luxurious suite with separate living area and panoramic views.',
          amenities: ['wifi', 'tv', 'minibar', 'air_conditioning', 'balcony', 'jacuzzi'],
          images: ['room-201.jpg'],
          propertyId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    };
    
    // Real implementation would be:
    // return await apiRequest<Room[]>({
    //   url: ENDPOINTS.BASE,
    //   method: 'GET',
    // });
  }

  /**
   * Get a room by ID
   */
  async getById(id: number): Promise<ApiResponse<Room>> {
    // Mock implementation
    const allRooms = await this.getAll();
    const room = allRooms.data?.find(r => r.id === id);
    
    if (room) {
      return {
        success: true,
        data: room
      };
    }
    
    return {
      success: false,
      message: 'Room not found'
    };
    
    // Real implementation would be:
    // return await apiRequest<Room>({
    //   url: ENDPOINTS.DETAIL(id),
    //   method: 'GET',
    // });
  }

  /**
   * Create a new room
   */
  async create(room: InsertRoom): Promise<ApiResponse<Room>> {
    // Real implementation would be:
    return await apiRequest<Room>({
      url: ENDPOINTS.BASE,
      method: 'POST',
      data: room,
    });
  }

  /**
   * Update a room
   */
  async update(id: number, room: Partial<Room>): Promise<ApiResponse<Room>> {
    // Real implementation would be:
    return await apiRequest<Room>({
      url: ENDPOINTS.DETAIL(id),
      method: 'PATCH',
      data: room,
    });
  }

  /**
   * Delete a room
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    // Real implementation would be:
    return await apiRequest<void>({
      url: ENDPOINTS.DETAIL(id),
      method: 'DELETE',
    });
  }

  /**
   * Get room availability for a date range
   */
  async getAvailability(
    startDate: Date,
    endDate: Date,
    capacity?: number,
    roomType?: string
  ): Promise<ApiResponse<Room[]>> {
    // Convert dates to ISO strings
    const startDateString = startDate.toISOString();
    const endDateString = endDate.toISOString();
    
    // Build params object
    const params: Record<string, string> = {
      startDate: startDateString,
      endDate: endDateString,
    };
    
    // Add optional params if provided
    if (capacity !== undefined) {
      params.capacity = capacity.toString();
    }
    
    if (roomType) {
      params.roomType = roomType;
    }
    
    // Mock implementation for now
    const allRooms = await this.getAll();
    const availableRooms = allRooms.data?.filter(room => room.status === 'available') || [];
    
    return {
      success: true,
      data: availableRooms
    };
    
    // Real implementation would be:
    // return await apiRequest<Room[]>({
    //   url: ENDPOINTS.AVAILABILITY,
    //   method: 'GET',
    //   params,
    // });
  }

  /**
   * Get all room types
   */
  async getRoomTypes(): Promise<ApiResponse<string[]>> {
    // Mock implementation
    return {
      success: true,
      data: ['standard', 'deluxe', 'suite', 'family', 'presidential']
    };
    
    // Real implementation would be:
    // return await apiRequest<string[]>({
    //   url: ENDPOINTS.TYPES,
    //   method: 'GET',
    // });
  }

  /**
   * Get all room statuses
   */
  async getRoomStatuses(): Promise<ApiResponse<string[]>> {
    // Mock implementation
    return {
      success: true,
      data: ['available', 'occupied', 'maintenance', 'cleaning', 'reserved']
    };
    
    // Real implementation would be:
    // return await apiRequest<string[]>({
    //   url: ENDPOINTS.STATUS,
    //   method: 'GET',
    // });
  }
}

// Export a singleton instance
export const roomService = new RoomService();