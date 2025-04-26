/**
 * Guest Service
 * 
 * Service for guest-related API operations.
 */

import type { ApiResponse } from './api';
import { apiRequest } from './api';
import type { Guest, InsertGuest } from '../../types';

// API endpoints for guests
const ENDPOINTS = {
  BASE: '/api/guests',
  DETAIL: (id: number | string) => `/api/guests/${id}`,
  SEARCH: '/api/guests/search',
  LOYALTY: (id: number | string) => `/api/guests/${id}/loyalty`,
  STAYS: (id: number | string) => `/api/guests/${id}/stays`,
  PREFERENCES: (id: number | string) => `/api/guests/${id}/preferences`,
  DOCUMENTS: (id: number | string) => `/api/guests/${id}/documents`,
};

/**
 * Guest Service class for handling guest-related API operations
 */
class GuestService {
  /**
   * Get all guests
   */
  async getAll(): Promise<ApiResponse<Guest[]>> {
    // For demonstration, returning mock data
    return {
      success: true,
      data: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          address: '123 Main St, City, Country',
          idType: 'passport',
          idNumber: 'AB123456',
          nationality: 'USA',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+9876543210',
          address: '456 Oak St, Town, Country',
          idType: 'drivers_license',
          idNumber: 'DL987654',
          nationality: 'Canada',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    };
    
    // Real implementation would be:
    // return await apiRequest<Guest[]>({
    //   url: ENDPOINTS.BASE,
    //   method: 'GET',
    // });
  }

  /**
   * Get a guest by ID
   */
  async getById(id: number): Promise<ApiResponse<Guest>> {
    // Mock implementation
    const allGuests = await this.getAll();
    const guest = allGuests.data?.find(g => g.id === id);
    
    if (guest) {
      return {
        success: true,
        data: guest
      };
    }
    
    return {
      success: false,
      message: 'Guest not found'
    };
    
    // Real implementation would be:
    // return await apiRequest<Guest>({
    //   url: ENDPOINTS.DETAIL(id),
    //   method: 'GET',
    // });
  }

  /**
   * Search guests by criteria
   */
  async search(criteria: { [key: string]: string }): Promise<ApiResponse<Guest[]>> {
    // Mock implementation
    const allGuests = await this.getAll();
    const filteredGuests = allGuests.data?.filter(guest => {
      // Basic filtering logic for demonstration
      return Object.entries(criteria).every(([key, value]) => {
        // @ts-ignore: Allow dynamic property access for demo
        const guestValue = guest[key]?.toString().toLowerCase();
        return guestValue?.includes(value.toLowerCase());
      });
    }) || [];
    
    return {
      success: true,
      data: filteredGuests
    };
    
    // Real implementation would be:
    // return await apiRequest<Guest[]>({
    //   url: ENDPOINTS.SEARCH,
    //   method: 'GET',
    //   params: criteria,
    // });
  }

  /**
   * Create a new guest
   */
  async create(guest: InsertGuest): Promise<ApiResponse<Guest>> {
    // Real implementation would be:
    return await apiRequest<Guest>({
      url: ENDPOINTS.BASE,
      method: 'POST',
      data: guest,
    });
  }

  /**
   * Update a guest
   */
  async update(id: number, guest: Partial<Guest>): Promise<ApiResponse<Guest>> {
    // Real implementation would be:
    return await apiRequest<Guest>({
      url: ENDPOINTS.DETAIL(id),
      method: 'PATCH',
      data: guest,
    });
  }

  /**
   * Delete a guest
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    // Real implementation would be:
    return await apiRequest<void>({
      url: ENDPOINTS.DETAIL(id),
      method: 'DELETE',
    });
  }

  /**
   * Get guest loyalty information
   */
  async getLoyaltyInfo(id: number): Promise<ApiResponse<any>> {
    // Mock implementation
    const guest = await this.getById(id);
    
    if (!guest.success) {
      return {
        success: false,
        message: 'Guest not found',
      };
    }
    
    return {
      success: true,
      data: {
        tier: 'gold',
        points: 1250,
        memberSince: new Date(2020, 0, 15),
        nextTier: {
          name: 'platinum',
          pointsNeeded: 500,
        },
        benefits: [
          'Free breakfast',
          'Late checkout',
          'Room upgrades when available',
        ]
      }
    };
    
    // Real implementation would be:
    // return await apiRequest<any>({
    //   url: ENDPOINTS.LOYALTY(id),
    //   method: 'GET',
    // });
  }

  /**
   * Get guest stay history
   */
  async getStayHistory(id: number): Promise<ApiResponse<any[]>> {
    // Mock implementation
    const guest = await this.getById(id);
    
    if (!guest.success) {
      return {
        success: false,
        message: 'Guest not found',
      };
    }
    
    return {
      success: true,
      data: [
        {
          id: 101,
          roomId: 1,
          checkInDate: new Date(2022, 5, 10),
          checkOutDate: new Date(2022, 5, 15),
          totalNights: 5,
          roomType: 'Deluxe',
          totalAmount: 750,
          rating: 4.5,
          feedback: 'Great stay, very comfortable room.',
        },
        {
          id: 102,
          roomId: 3,
          checkInDate: new Date(2023, 2, 20),
          checkOutDate: new Date(2023, 2, 23),
          totalNights: 3,
          roomType: 'Suite',
          totalAmount: 750,
          rating: 5,
          feedback: 'Excellent service and amenities.',
        },
      ]
    };
    
    // Real implementation would be:
    // return await apiRequest<any[]>({
    //   url: ENDPOINTS.STAYS(id),
    //   method: 'GET',
    // });
  }

  /**
   * Get guest preferences
   */
  async getPreferences(id: number): Promise<ApiResponse<any>> {
    // Mock implementation
    const guest = await this.getById(id);
    
    if (!guest.success) {
      return {
        success: false,
        message: 'Guest not found',
      };
    }
    
    return {
      success: true,
      data: {
        roomPreferences: {
          floorLevel: 'high',
          bedType: 'king',
          pillowType: 'soft',
          roomTemperature: 68,
          specialRequests: 'Corner room with city view preferred',
        },
        diningPreferences: {
          dietaryRestrictions: ['vegetarian'],
          preferredCuisine: ['Italian', 'Japanese'],
          breakfastTime: '7:30 AM',
        },
        communicationPreferences: {
          contactMethod: 'email',
          newsletterSubscribed: true,
          specialOfferAlerts: true,
        },
      }
    };
    
    // Real implementation would be:
    // return await apiRequest<any>({
    //   url: ENDPOINTS.PREFERENCES(id),
    //   method: 'GET',
    // });
  }
  
  /**
   * Update guest preferences
   */
  async updatePreferences(id: number, preferences: any): Promise<ApiResponse<any>> {
    // Real implementation would be:
    return await apiRequest<any>({
      url: ENDPOINTS.PREFERENCES(id),
      method: 'PATCH',
      data: preferences,
    });
  }
}

// Export a singleton instance
export const guestService = new GuestService();