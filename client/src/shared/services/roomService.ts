/**
 * Room Service
 * 
 * Handles all API communication related to rooms and room types
 */

import { Room, InsertRoom } from '@shared/schema';
import apiClient, { ApiResponse } from './api';
import { roomsData, getRoomById, getRoomsByCategory, getRoomsByStatus } from '@/lib/data';

// API endpoints
const ENDPOINTS = {
  ALL: '/rooms',
  DETAIL: (id: number | string) => `/rooms/${id}`,
  BY_STATUS: (status: string) => `/rooms/status/${status}`,
  BY_CATEGORY: (category: string) => `/rooms/category/${category}`,
  BY_FLOOR: (floor: number | string) => `/rooms/floor/${floor}`,
  MAINTENANCE: '/rooms/maintenance',
  OCCUPANCY: '/rooms/occupancy',
  ROOM_TYPES: '/room-types',
};

// Mocked room service utilizing current data imported from lib/data.ts
// These will be replaced with actual API calls when backend is ready
class RoomService {
  /**
   * Get all rooms
   */
  async getAll(): Promise<ApiResponse<Room[]>> {
    // This will be replaced with:
    // return apiClient.get<Room[]>(ENDPOINTS.ALL);
    
    return {
      data: roomsData,
      status: 200,
      success: true
    };
  }

  /**
   * Get a single room by ID
   */
  async getById(id: number): Promise<ApiResponse<Room>> {
    // This will be replaced with:
    // return apiClient.get<Room>(ENDPOINTS.DETAIL(id));
    
    const room = getRoomById(id);
    if (!room) {
      return {
        error: 'Room not found',
        status: 404,
        success: false
      };
    }
    
    return {
      data: room,
      status: 200,
      success: true
    };
  }

  /**
   * Get rooms by status (available, occupied, maintenance)
   */
  async getByStatus(status: string): Promise<ApiResponse<Room[]>> {
    // This will be replaced with:
    // return apiClient.get<Room[]>(ENDPOINTS.BY_STATUS(status));
    
    return {
      data: getRoomsByStatus(status),
      status: 200,
      success: true
    };
  }

  /**
   * Get rooms by category/type
   */
  async getByCategory(category: string): Promise<ApiResponse<Room[]>> {
    // This will be replaced with:
    // return apiClient.get<Room[]>(ENDPOINTS.BY_CATEGORY(category));
    
    return {
      data: getRoomsByCategory(category),
      status: 200,
      success: true
    };
  }

  /**
   * Get rooms by floor
   */
  async getByFloor(floor: number): Promise<ApiResponse<Room[]>> {
    // This will be replaced with:
    // return apiClient.get<Room[]>(ENDPOINTS.BY_FLOOR(floor));
    
    const filteredRooms = roomsData.filter(room => room.floor === floor);
    return {
      data: filteredRooms,
      status: 200,
      success: true
    };
  }

  /**
   * Get rooms in maintenance status
   */
  async getInMaintenance(): Promise<ApiResponse<Room[]>> {
    // This will be replaced with:
    // return apiClient.get<Room[]>(ENDPOINTS.MAINTENANCE);
    
    const filteredRooms = roomsData.filter(room => room.status === 'maintenance');
    return {
      data: filteredRooms,
      status: 200,
      success: true
    };
  }

  /**
   * Get room occupancy statistics
   */
  async getOccupancyStats(): Promise<ApiResponse<any>> {
    // This will be replaced with:
    // return apiClient.get(ENDPOINTS.OCCUPANCY);
    
    const totalRooms = roomsData.length;
    const occupiedRooms = roomsData.filter(room => room.status === 'occupied').length;
    const availableRooms = roomsData.filter(room => room.status === 'available').length;
    const maintenanceRooms = roomsData.filter(room => room.status === 'maintenance').length;
    
    return {
      data: {
        totalRooms,
        occupiedRooms,
        availableRooms,
        maintenanceRooms,
        occupancyRate: totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0,
      },
      status: 200,
      success: true
    };
  }

  /**
   * Get room types/categories with stats
   */
  async getRoomTypes(): Promise<ApiResponse<any[]>> {
    // This will be replaced with:
    // return apiClient.get<any[]>(ENDPOINTS.ROOM_TYPES);
    
    // Group rooms by category and calculate stats
    const categories = Array.from(new Set(roomsData.map(room => room.category)));
    const roomTypes = categories.map(category => {
      const roomsInCategory = roomsData.filter(room => room.category === category);
      const total = roomsInCategory.length;
      const occupied = roomsInCategory.filter(room => room.status === 'occupied').length;
      
      return {
        type: category,
        total,
        occupied,
        percentage: total > 0 ? Math.round((occupied / total) * 100) : 0,
        baseRate: roomsInCategory[0]?.baseRate || 0,
        amenities: roomsInCategory[0]?.amenities || [],
      };
    });
    
    return {
      data: roomTypes,
      status: 200,
      success: true
    };
  }

  /**
   * Create a new room
   */
  async create(room: InsertRoom): Promise<ApiResponse<Room>> {
    // This will be replaced with:
    // return apiClient.post<Room>(ENDPOINTS.ALL, room);
    
    // For now, simply return a mocked response with the data
    const newRoom: Room = {
      ...room,
      id: Math.max(...roomsData.map(r => r.id)) + 1,
    };
    
    return {
      data: newRoom,
      status: 201,
      success: true
    };
  }

  /**
   * Update an existing room
   */
  async update(id: number, data: Partial<Room>): Promise<ApiResponse<Room>> {
    // This will be replaced with:
    // return apiClient.patch<Room>(ENDPOINTS.DETAIL(id), data);
    
    const room = getRoomById(id);
    if (!room) {
      return {
        error: 'Room not found',
        status: 404,
        success: false
      };
    }
    
    const updated = { ...room, ...data };
    
    return {
      data: updated,
      status: 200,
      success: true
    };
  }

  /**
   * Delete a room
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    // This will be replaced with:
    // return apiClient.delete<void>(ENDPOINTS.DETAIL(id));
    
    const room = getRoomById(id);
    if (!room) {
      return {
        error: 'Room not found',
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
   * Set room status (available, occupied, maintenance)
   */
  async setStatus(id: number, status: string): Promise<ApiResponse<Room>> {
    // This will be replaced with:
    // return apiClient.patch<Room>(`${ENDPOINTS.DETAIL(id)}/status`, { status });
    
    const room = getRoomById(id);
    if (!room) {
      return {
        error: 'Room not found',
        status: 404,
        success: false
      };
    }
    
    const updated = { ...room, status };
    
    return {
      data: updated,
      status: 200,
      success: true
    };
  }

  /**
   * Add maintenance record to room
   */
  async addMaintenanceRecord(
    id: number, 
    record: { date: string; description: string; performed_by: string; resolved: boolean }
  ): Promise<ApiResponse<Room>> {
    // This will be replaced with:
    // return apiClient.post<Room>(`${ENDPOINTS.DETAIL(id)}/maintenance`, record);
    
    const room = getRoomById(id);
    if (!room) {
      return {
        error: 'Room not found',
        status: 404,
        success: false
      };
    }
    
    const updated = { 
      ...room, 
      maintenanceHistory: [...(room.maintenanceHistory || []), record] 
    };
    
    return {
      data: updated,
      status: 200,
      success: true
    };
  }
}

// Export a singleton instance
export const roomService = new RoomService();

// Default export
export default roomService;