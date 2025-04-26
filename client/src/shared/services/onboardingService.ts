/**
 * Onboarding Service
 * 
 * Service for managing post-signup onboarding process.
 */

import { ApiResponse } from './api';
import apiClient from './api';
import { Property } from '@shared/schema';

// API endpoints for onboarding
const ENDPOINTS = {
  BUSINESS_BASICS: '/onboarding/business-basics',
  PROPERTY_CONFIG: '/onboarding/property-config',
  COMPLETE_ONBOARDING: '/onboarding/complete',
  ONBOARDING_STATUS: '/onboarding/status',
  UPLOAD_PHOTOS: '/onboarding/upload-photos',
};

export interface BusinessBasics {
  propertyName: string;
  contactNumber: string;
  propertyType: string;
  description: string;
  gstNumber?: string;
  address: {
    street: string;
    secondary?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  };
  currency: string;
}

export interface RoomType {
  name: string;
  capacity: number;
  customId: string;
  occupancy: {
    minAdults: number;
    maxAdults: number;
    minChildren: number;
    maxChildren: number;
    extraPersonFee: number;
  };
  amenities: string[];
  photos: File[];
}

export interface PropertyConfig {
  amenities: string[];
  photos: File[];
  roomTypes: RoomType[];
}

export interface Policy {
  name: string;
  description: string;
  rules: {
    title: string;
    content: string;
  }[];
  isActive: boolean;
}

class OnboardingService {
  /**
   * Save business basics information
   */
  async saveBusinessBasics(data: BusinessBasics): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(ENDPOINTS.BUSINESS_BASICS, data);
      return response;
    } catch (error: any) {
      return {
        data: {},
        status: error.status || 500,
        message: error.message || 'Failed to save business basics'
      };
    }
  }

  /**
   * Save property configuration
   */
  async savePropertyConfig(data: PropertyConfig): Promise<ApiResponse<any>> {
    try {
      // First save the basic property configuration (without photos)
      const basicConfig = {
        amenities: data.amenities,
        roomTypes: data.roomTypes.map(room => ({
          name: room.name,
          capacity: room.capacity,
          customId: room.customId,
          occupancy: room.occupancy,
          amenities: room.amenities,
        })),
      };
      
      const response = await apiClient.post(ENDPOINTS.PROPERTY_CONFIG, basicConfig);
      
      // Now handle photo uploads
      if (data.photos.length > 0) {
        await this.uploadPropertyPhotos(data.photos);
      }
      
      // Handle room type photos
      for (const roomType of data.roomTypes) {
        if (roomType.photos && roomType.photos.length > 0) {
          const roomId = response.data.roomTypes.find((r: any) => r.customId === roomType.customId)?.id;
          if (roomId) {
            await this.uploadRoomTypePhotos(roomId, roomType.photos);
          }
        }
      }
      
      return response;
    } catch (error: any) {
      return {
        data: {},
        status: error.status || 500,
        message: error.message || 'Failed to save property configuration'
      };
    }
  }

  /**
   * Upload property photos
   */
  private async uploadPropertyPhotos(photos: File[]): Promise<ApiResponse<string[]>> {
    try {
      const formData = new FormData();
      
      photos.forEach(photo => {
        formData.append('photos', photo);
      });
      
      const response = await apiClient.upload<string[]>(`${ENDPOINTS.UPLOAD_PHOTOS}/property`, formData);
      return response;
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        message: error.message || 'Failed to upload property photos'
      };
    }
  }

  /**
   * Upload room type photos
   */
  private async uploadRoomTypePhotos(roomTypeId: number, photos: File[]): Promise<ApiResponse<string[]>> {
    try {
      const formData = new FormData();
      
      photos.forEach(photo => {
        formData.append('photos', photo);
      });
      
      const response = await apiClient.upload<string[]>(`${ENDPOINTS.UPLOAD_PHOTOS}/room-type/${roomTypeId}`, formData);
      return response;
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        message: error.message || 'Failed to upload room type photos'
      };
    }
  }

  /**
   * Save policies and complete onboarding
   */
  async completeOnboarding(policies: Policy[]): Promise<ApiResponse<Property>> {
    try {
      const response = await apiClient.post<Property>(ENDPOINTS.COMPLETE_ONBOARDING, { policies });
      return response;
    } catch (error: any) {
      return {
        data: {} as Property,
        status: error.status || 500,
        message: error.message || 'Failed to complete onboarding'
      };
    }
  }

  /**
   * Get current onboarding status
   */
  async getOnboardingStatus(): Promise<ApiResponse<{
    completed: boolean;
    currentStep: 'business-basics' | 'property-config' | 'policies' | 'completed';
    businessBasics?: BusinessBasics;
    propertyConfig?: Omit<PropertyConfig, 'photos' | 'roomTypes'> & {
      photoUrls: string[];
      roomTypes: (Omit<RoomType, 'photos'> & { photoUrls: string[] })[];
    };
    policies?: Policy[];
  }>> {
    try {
      const response = await apiClient.get(ENDPOINTS.ONBOARDING_STATUS);
      return response;
    } catch (error: any) {
      return {
        data: {
          completed: false,
          currentStep: 'business-basics',
        },
        status: error.status || 500,
        message: error.message || 'Failed to fetch onboarding status'
      };
    }
  }
}

export const onboardingService = new OnboardingService();
export default onboardingService;