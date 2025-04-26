/**
 * Guest Service
 * 
 * Service for managing hotel guests.
 */

import { ApiResponse } from './api';
import apiClient from './api';
import { Guest, InsertGuest } from '@shared/schema';

// API endpoints for guests
const ENDPOINTS = {
  ALL: '/guests',
  DETAIL: (id: number) => `/guests/${id}`,
  SEARCH: '/guests/search',
  BY_EMAIL: (email: string) => `/guests/email/${email}`,
  LOYALTY: '/guests/loyalty',
  DOCUMENTS: (id: number) => `/guests/${id}/documents`,
  PREFERENCES: (id: number) => `/guests/${id}/preferences`,
  HISTORY: (id: number) => `/guests/${id}/history`,
};

class GuestService {
  /**
   * Get all guests
   */
  async getAll(): Promise<ApiResponse<Guest[]>> {
    try {
      const response = await apiClient.get<Guest[]>(ENDPOINTS.ALL);
      return response;
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        message: error.message || 'Failed to fetch guests'
      };
    }
  }

  /**
   * Get a guest by ID
   */
  async getById(id: number): Promise<ApiResponse<Guest>> {
    try {
      const response = await apiClient.get<Guest>(ENDPOINTS.DETAIL(id));
      return response;
    } catch (error: any) {
      return {
        data: {} as Guest,
        status: error.status || 500,
        message: error.message || 'Failed to fetch guest'
      };
    }
  }

  /**
   * Search guests by name, email, or phone
   */
  async search(query: string): Promise<ApiResponse<Guest[]>> {
    try {
      const response = await apiClient.get<Guest[]>(ENDPOINTS.SEARCH, { query });
      return response;
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        message: error.message || 'Failed to search guests'
      };
    }
  }

  /**
   * Get a guest by email
   */
  async getByEmail(email: string): Promise<ApiResponse<Guest>> {
    try {
      const response = await apiClient.get<Guest>(ENDPOINTS.BY_EMAIL(email));
      return response;
    } catch (error: any) {
      return {
        data: {} as Guest,
        status: error.status || 500,
        message: error.message || 'Failed to fetch guest by email'
      };
    }
  }

  /**
   * Get loyalty information for a guest
   */
  async getLoyaltyInfo(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(`${ENDPOINTS.LOYALTY}/${id}`);
      
      // Format loyalty tier information
      const data = response.data || {};
      const loyaltyData = {
        tier: data.tier || 'Standard',
        points: data.points || 0,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        benefits: data.benefits || [],
        history: data.history || [],
      };
      
      return {
        ...response,
        data: loyaltyData
      };
    } catch (error: any) {
      return {
        data: {
          tier: 'Standard',
          points: 0,
          expiryDate: null,
          benefits: [],
          history: [],
        },
        status: error.status || 500,
        message: error.message || 'Failed to fetch loyalty information'
      };
    }
  }

  /**
   * Create a new guest
   */
  async create(data: InsertGuest): Promise<ApiResponse<Guest>> {
    try {
      const response = await apiClient.post<Guest>(ENDPOINTS.ALL, data);
      return response;
    } catch (error: any) {
      return {
        data: {} as Guest,
        status: error.status || 500,
        message: error.message || 'Failed to create guest'
      };
    }
  }

  /**
   * Update a guest
   */
  async update(id: number, data: Partial<Guest>): Promise<ApiResponse<Guest>> {
    try {
      const response = await apiClient.patch<Guest>(ENDPOINTS.DETAIL(id), data);
      return response;
    } catch (error: any) {
      return {
        data: {} as Guest,
        status: error.status || 500,
        message: error.message || 'Failed to update guest'
      };
    }
  }

  /**
   * Delete a guest
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(ENDPOINTS.DETAIL(id));
      return response;
    } catch (error: any) {
      return {
        data: undefined,
        status: error.status || 500,
        message: error.message || 'Failed to delete guest'
      };
    }
  }

  /**
   * Upload guest ID document or proof
   */
  async uploadDocument(id: number, file: File, documentType: string): Promise<ApiResponse<string>> {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);
      
      const response = await apiClient.upload<string>(ENDPOINTS.DOCUMENTS(id), formData);
      return response;
    } catch (error: any) {
      return {
        data: '',
        status: error.status || 500,
        message: error.message || 'Failed to upload document'
      };
    }
  }

  /**
   * Update guest preferences
   */
  async updatePreferences(id: number, preferences: {
    roomPreferences?: string[];
    dietaryRestrictions?: string[];
    specialRequests?: string[];
    communicationPreferences?: {
      email?: boolean;
      sms?: boolean;
      phone?: boolean;
    };
  }): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.patch(ENDPOINTS.PREFERENCES(id), preferences);
      return response;
    } catch (error: any) {
      return {
        data: {},
        status: error.status || 500,
        message: error.message || 'Failed to update preferences'
      };
    }
  }

  /**
   * Get guest stay history
   */
  async getStayHistory(id: number): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiClient.get<any[]>(ENDPOINTS.HISTORY(id));
      return response;
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        message: error.message || 'Failed to fetch stay history'
      };
    }
  }
}

export const guestService = new GuestService();
export default guestService;