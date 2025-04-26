/**
 * Guest Service
 * 
 * Handles all API communication related to guests and customer data
 */

import { Guest, InsertGuest } from '@shared/schema';
import apiClient, { ApiResponse } from './api';
import { guestsData, getGuestById } from '@/lib/data';

// API endpoints
const ENDPOINTS = {
  ALL: '/guests',
  DETAIL: (id: number | string) => `/guests/${id}`,
  SEARCH: '/guests/search',
  LOYALTY: '/guests/loyalty',
  HISTORY: (id: number | string) => `/guests/${id}/history`,
};

// Mocked guest service utilizing current data imported from lib/data.ts
// These will be replaced with actual API calls when backend is ready
class GuestService {
  /**
   * Get all guests
   */
  async getAll(): Promise<ApiResponse<Guest[]>> {
    // This will be replaced with:
    // return apiClient.get<Guest[]>(ENDPOINTS.ALL);
    
    return {
      data: guestsData,
      status: 200,
      success: true
    };
  }

  /**
   * Get a single guest by ID
   */
  async getById(id: number): Promise<ApiResponse<Guest>> {
    // This will be replaced with:
    // return apiClient.get<Guest>(ENDPOINTS.DETAIL(id));
    
    const guest = getGuestById(id);
    if (!guest) {
      return {
        error: 'Guest not found',
        status: 404,
        success: false
      };
    }
    
    return {
      data: guest,
      status: 200,
      success: true
    };
  }

  /**
   * Search for guests by name, email, phone, etc.
   */
  async search(query: string): Promise<ApiResponse<Guest[]>> {
    // This will be replaced with:
    // return apiClient.get<Guest[]>(ENDPOINTS.SEARCH, { params: { query } });
    
    // Basic search implementation
    const normalizedQuery = query.toLowerCase();
    const results = guestsData.filter(guest => 
      guest.firstName.toLowerCase().includes(normalizedQuery) ||
      guest.lastName.toLowerCase().includes(normalizedQuery) ||
      guest.email.toLowerCase().includes(normalizedQuery) ||
      guest.phone.includes(normalizedQuery)
    );
    
    return {
      data: results,
      status: 200,
      success: true
    };
  }

  /**
   * Get guests with loyalty program details
   */
  async getLoyaltyMembers(): Promise<ApiResponse<Guest[]>> {
    // This will be replaced with:
    // return apiClient.get<Guest[]>(ENDPOINTS.LOYALTY);
    
    // Filter guests who are in loyalty program
    const loyaltyMembers = guestsData.filter(guest => guest.loyaltyInfo && guest.loyaltyInfo.tier);
    
    return {
      data: loyaltyMembers,
      status: 200,
      success: true
    };
  }

  /**
   * Get a guest's stay history
   */
  async getStayHistory(id: number): Promise<ApiResponse<any[]>> {
    // This will be replaced with:
    // return apiClient.get<any[]>(ENDPOINTS.HISTORY(id));
    
    const guest = getGuestById(id);
    if (!guest) {
      return {
        error: 'Guest not found',
        status: 404,
        success: false
      };
    }
    
    return {
      data: guest.stayHistory || [],
      status: 200,
      success: true
    };
  }

  /**
   * Create a new guest
   */
  async create(guest: InsertGuest): Promise<ApiResponse<Guest>> {
    // This will be replaced with:
    // return apiClient.post<Guest>(ENDPOINTS.ALL, guest);
    
    // For now, simply return a mocked response with the data
    const newGuest: Guest = {
      ...guest,
      id: Math.max(...guestsData.map(g => g.id)) + 1,
    };
    
    return {
      data: newGuest,
      status: 201,
      success: true
    };
  }

  /**
   * Update an existing guest
   */
  async update(id: number, data: Partial<Guest>): Promise<ApiResponse<Guest>> {
    // This will be replaced with:
    // return apiClient.patch<Guest>(ENDPOINTS.DETAIL(id), data);
    
    const guest = getGuestById(id);
    if (!guest) {
      return {
        error: 'Guest not found',
        status: 404,
        success: false
      };
    }
    
    const updated = { ...guest, ...data };
    
    return {
      data: updated,
      status: 200,
      success: true
    };
  }

  /**
   * Delete a guest
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    // This will be replaced with:
    // return apiClient.delete<void>(ENDPOINTS.DETAIL(id));
    
    const guest = getGuestById(id);
    if (!guest) {
      return {
        error: 'Guest not found',
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
   * Update guest loyalty information
   */
  async updateLoyalty(
    id: number, 
    loyaltyInfo: { tier: string; points: number; memberSince?: string }
  ): Promise<ApiResponse<Guest>> {
    // This will be replaced with:
    // return apiClient.patch<Guest>(`${ENDPOINTS.DETAIL(id)}/loyalty`, loyaltyInfo);
    
    const guest = getGuestById(id);
    if (!guest) {
      return {
        error: 'Guest not found',
        status: 404,
        success: false
      };
    }
    
    const updated = { 
      ...guest, 
      loyaltyInfo: { ...(guest.loyaltyInfo || {}), ...loyaltyInfo }
    };
    
    return {
      data: updated,
      status: 200,
      success: true
    };
  }

  /**
   * Add stay record to guest history
   */
  async addStayRecord(
    id: number, 
    stayRecord: { 
      reservationId: number; 
      checkIn: string; 
      checkOut: string;
      roomNumber: string;
      totalSpent: number;
    }
  ): Promise<ApiResponse<Guest>> {
    // This will be replaced with:
    // return apiClient.post<Guest>(`${ENDPOINTS.DETAIL(id)}/history`, stayRecord);
    
    const guest = getGuestById(id);
    if (!guest) {
      return {
        error: 'Guest not found',
        status: 404,
        success: false
      };
    }
    
    const updated = { 
      ...guest, 
      stayHistory: [...(guest.stayHistory || []), stayRecord]
    };
    
    return {
      data: updated,
      status: 200,
      success: true
    };
  }
}

// Export a singleton instance
export const guestService = new GuestService();

// Default export
export default guestService;