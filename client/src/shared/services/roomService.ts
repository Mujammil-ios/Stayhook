/**
 * Room Service
 * 
 * Service for managing hotel rooms.
 */

import { ApiResponse } from './api';
import apiClient from './api';
import { Room, InsertRoom } from '@shared/schema';

// API endpoints for rooms
const ENDPOINTS = {
  ALL: '/rooms',
  DETAIL: (id: number) => `/rooms/${id}`,
  BY_STATUS: (status: string) => `/rooms/status/${status}`,
  BY_CATEGORY: (category: string) => `/rooms/category/${category}`,
  BY_PROPERTY: (propertyId: number) => `/rooms/property/${propertyId}`,
  TYPES: '/rooms/types',
  AMENITIES: '/rooms/amenities',
  AVAILABILITY: '/rooms/availability',
  MAINTENANCE: (id: number) => `/rooms/${id}/maintenance`,
  PHOTOS: (id: number) => `/rooms/${id}/photos`,
};

class RoomService {
  /**
   * Get all rooms
   */
  async getAll(): Promise<ApiResponse<Room[]>> {
    try {
      const response = await apiClient.get<Room[]>(ENDPOINTS.ALL);
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        error: error.message || 'Failed to fetch rooms',
      };
    }
  }

  /**
   * Get a room by ID
   */
  async getById(id: number): Promise<ApiResponse<Room>> {
    try {
      const response = await apiClient.get<Room>(ENDPOINTS.DETAIL(id));
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: {} as Room,
        status: error.status || 500,
        error: error.message || 'Failed to fetch room',
      };
    }
  }

  /**
   * Get rooms by status
   */
  async getByStatus(status: string): Promise<ApiResponse<Room[]>> {
    try {
      const response = await apiClient.get<Room[]>(ENDPOINTS.BY_STATUS(status));
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        error: error.message || 'Failed to fetch rooms by status',
      };
    }
  }

  /**
   * Get rooms by category
   */
  async getByCategory(category: string): Promise<ApiResponse<Room[]>> {
    try {
      const response = await apiClient.get<Room[]>(ENDPOINTS.BY_CATEGORY(category));
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        error: error.message || 'Failed to fetch rooms by category',
      };
    }
  }

  /**
   * Get rooms by property ID
   */
  async getByProperty(propertyId: number): Promise<ApiResponse<Room[]>> {
    try {
      const response = await apiClient.get<Room[]>(ENDPOINTS.BY_PROPERTY(propertyId));
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        error: error.message || 'Failed to fetch property rooms',
      };
    }
  }

  /**
   * Get all room types
   */
  async getRoomTypes(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(ENDPOINTS.TYPES);
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        error: error.message || 'Failed to fetch room types',
      };
    }
  }

  /**
   * Get all available amenities
   */
  async getAmenities(): Promise<ApiResponse<string[]>> {
    try {
      const response = await apiClient.get<string[]>(ENDPOINTS.AMENITIES);
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        error: error.message || 'Failed to fetch amenities',
      };
    }
  }

  /**
   * Create a new room
   */
  async create(data: InsertRoom): Promise<ApiResponse<Room>> {
    try {
      const response = await apiClient.post<Room>(ENDPOINTS.ALL, data);
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: {} as Room,
        status: error.status || 500,
        error: error.message || 'Failed to create room',
      };
    }
  }

  /**
   * Update a room
   */
  async update(id: number, data: Partial<Room>): Promise<ApiResponse<Room>> {
    try {
      const response = await apiClient.patch<Room>(ENDPOINTS.DETAIL(id), data);
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: {} as Room,
        status: error.status || 500,
        error: error.message || 'Failed to update room',
      };
    }
  }

  /**
   * Delete a room
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
        error: error.message || 'Failed to delete room',
      };
    }
  }

  /**
   * Add maintenance record to a room
   */
  async addMaintenance(id: number, data: {
    date: Date;
    type: string;
    description: string;
    cost?: number;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  }): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(ENDPOINTS.MAINTENANCE(id), data);
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: {},
        status: error.status || 500,
        error: error.message || 'Failed to add maintenance record',
      };
    }
  }

  /**
   * Upload room photos
   */
  async uploadPhotos(id: number, photos: File[]): Promise<ApiResponse<string[]>> {
    try {
      const formData = new FormData();
      
      photos.forEach(photo => {
        formData.append('photos', photo);
      });
      
      const response = await apiClient.upload<string[]>(ENDPOINTS.PHOTOS(id), formData);
      
      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        error: error.message || 'Failed to upload photos',
      };
    }
  }
}

export const roomService = new RoomService();
export default roomService;