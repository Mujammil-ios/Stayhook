/**
 * Property Service
 * 
 * Service for managing hotel properties.
 */

import { ApiResponse } from './api';
import apiClient from './api';
import { Property, InsertProperty } from '@shared/schema';

// API endpoints for properties
const ENDPOINTS = {
  ALL: '/properties',
  DETAIL: (id: number) => `/properties/${id}`,
  AMENITIES: '/properties/amenities',
  PHOTOS: (id: number) => `/properties/${id}/photos`,
  STATS: (id: number) => `/properties/${id}/stats`,
  SETTINGS: (id: number) => `/properties/${id}/settings`,
  POLICIES: (id: number) => `/properties/${id}/policies`,
  POLICY_DETAIL: (propertyId: number, policyId: number) => `/properties/${propertyId}/policies/${policyId}`,
};

class PropertyService {
  /**
   * Get all properties
   */
  async getAll(): Promise<ApiResponse<Property[]>> {
    try {
      const response = await apiClient.get<Property[]>(ENDPOINTS.ALL);
      return response;
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        message: error.message || 'Failed to fetch properties'
      };
    }
  }

  /**
   * Get a property by ID
   */
  async getById(id: number): Promise<ApiResponse<Property>> {
    try {
      const response = await apiClient.get<Property>(ENDPOINTS.DETAIL(id));
      return response;
    } catch (error: any) {
      return {
        data: {} as Property,
        status: error.status || 500,
        message: error.message || 'Failed to fetch property'
      };
    }
  }

  /**
   * Get all available amenities
   */
  async getAmenities(): Promise<ApiResponse<string[]>> {
    try {
      const response = await apiClient.get<string[]>(ENDPOINTS.AMENITIES);
      return response;
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        message: error.message || 'Failed to fetch amenities'
      };
    }
  }

  /**
   * Get property statistics
   */
  async getStats(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(ENDPOINTS.STATS(id));
      return response;
    } catch (error: any) {
      return {
        data: {},
        status: error.status || 500,
        message: error.message || 'Failed to fetch property statistics'
      };
    }
  }

  /**
   * Create a new property
   */
  async create(data: InsertProperty): Promise<ApiResponse<Property>> {
    try {
      const response = await apiClient.post<Property>(ENDPOINTS.ALL, data);
      return response;
    } catch (error: any) {
      return {
        data: {} as Property,
        status: error.status || 500,
        message: error.message || 'Failed to create property'
      };
    }
  }

  /**
   * Update a property
   */
  async update(id: number, data: Partial<Property>): Promise<ApiResponse<Property>> {
    try {
      const response = await apiClient.patch<Property>(ENDPOINTS.DETAIL(id), data);
      return response;
    } catch (error: any) {
      return {
        data: {} as Property,
        status: error.status || 500,
        message: error.message || 'Failed to update property'
      };
    }
  }

  /**
   * Delete a property
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(ENDPOINTS.DETAIL(id));
      return response;
    } catch (error: any) {
      return {
        data: undefined,
        status: error.status || 500,
        message: error.message || 'Failed to delete property'
      };
    }
  }

  /**
   * Upload property photos
   */
  async uploadPhotos(id: number, photos: File[]): Promise<ApiResponse<string[]>> {
    try {
      const formData = new FormData();
      
      photos.forEach(photo => {
        formData.append('photos', photo);
      });
      
      const response = await apiClient.upload<string[]>(ENDPOINTS.PHOTOS(id), formData);
      return response;
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        message: error.message || 'Failed to upload photos'
      };
    }
  }

  /**
   * Get property settings
   */
  async getSettings(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(ENDPOINTS.SETTINGS(id));
      return response;
    } catch (error: any) {
      return {
        data: {},
        status: error.status || 500,
        message: error.message || 'Failed to fetch property settings'
      };
    }
  }

  /**
   * Update property settings
   */
  async updateSettings(id: number, settings: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.patch(ENDPOINTS.SETTINGS(id), settings);
      return response;
    } catch (error: any) {
      return {
        data: {},
        status: error.status || 500,
        message: error.message || 'Failed to update property settings'
      };
    }
  }

  /**
   * Get property policies
   */
  async getPolicies(id: number): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiClient.get<any[]>(ENDPOINTS.POLICIES(id));
      return response;
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        message: error.message || 'Failed to fetch property policies'
      };
    }
  }

  /**
   * Get a specific policy
   */
  async getPolicy(propertyId: number, policyId: number): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(ENDPOINTS.POLICY_DETAIL(propertyId, policyId));
      return response;
    } catch (error: any) {
      return {
        data: {},
        status: error.status || 500,
        message: error.message || 'Failed to fetch policy'
      };
    }
  }

  /**
   * Create a new policy
   */
  async createPolicy(propertyId: number, policy: {
    name: string;
    description: string;
    type: string;
    rules: any[];
    isActive: boolean;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(ENDPOINTS.POLICIES(propertyId), policy);
      return response;
    } catch (error: any) {
      return {
        data: {},
        status: error.status || 500,
        message: error.message || 'Failed to create policy'
      };
    }
  }

  /**
   * Update a policy
   */
  async updatePolicy(propertyId: number, policyId: number, policy: Partial<{
    name: string;
    description: string;
    type: string;
    rules: any[];
    isActive: boolean;
  }>): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.patch(ENDPOINTS.POLICY_DETAIL(propertyId, policyId), policy);
      return response;
    } catch (error: any) {
      return {
        data: {},
        status: error.status || 500,
        message: error.message || 'Failed to update policy'
      };
    }
  }

  /**
   * Delete a policy
   */
  async deletePolicy(propertyId: number, policyId: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(ENDPOINTS.POLICY_DETAIL(propertyId, policyId));
      return response;
    } catch (error: any) {
      return {
        data: undefined,
        status: error.status || 500,
        message: error.message || 'Failed to delete policy'
      };
    }
  }
}

export const propertyService = new PropertyService();
export default propertyService;