/**
 * Onboarding Service
 * 
 * Manages onboarding API requests and data transformation
 */

import type { ApiResponse } from "./api";
import api from "./api";
import { 
  BusinessBasics, 
  Policy, 
  PropertyConfigFormData, 
  OnboardingResponse 
} from '@/features/onboarding/types/index';

// Mock data for initial load (This would typically come from the server)
const mockOnboardingData = {
  completed: false,
  currentStep: 'business-basics',
  businessBasics: {
    propertyName: '',
    propertyType: 'Hotel',
    businessRegistration: '',
    taxId: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    }
  },
  propertyConfig: {
    amenities: [],
    roomCount: 0
  },
  policies: []
};

/**
 * Get the current onboarding state for the user
 */
async function getOnboardingState(): Promise<OnboardingResponse> {
  try {
    // In a real implementation, this would fetch from an API
    // const response = await api.get('/api/onboarding');
    // return response.data;
    
    // For the purpose of this prototype, we'll return mock data
    return {
      success: true,
      data: mockOnboardingData
    };
  } catch (error: any) {
    console.error('Error fetching onboarding state:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch onboarding state'
    };
  }
}

/**
 * Save business basics information
 */
async function saveBusinessBasics(data: BusinessBasics): Promise<OnboardingResponse> {
  try {
    // In a real implementation, this would save to an API
    // const response = await api.post('/api/onboarding/business-basics', data);
    // return response.data;
    
    // For the purpose of this prototype, we'll mock a successful response
    return {
      success: true,
      data: {
        message: 'Business basics saved successfully'
      }
    };
  } catch (error: any) {
    console.error('Error saving business basics:', error);
    return {
      success: false,
      message: error.message || 'Failed to save business basics'
    };
  }
}

/**
 * Save property configuration
 */
async function savePropertyConfig(data: PropertyConfigFormData): Promise<OnboardingResponse> {
  try {
    // In a real implementation, this would save to an API
    // const response = await api.post('/api/onboarding/property-config', data);
    // return response.data;
    
    // For uploads, we would handle FormData here
    
    // For the purpose of this prototype, we'll mock a successful response
    return {
      success: true,
      data: {
        message: 'Property configuration saved successfully'
      }
    };
  } catch (error: any) {
    console.error('Error saving property configuration:', error);
    return {
      success: false,
      message: error.message || 'Failed to save property configuration'
    };
  }
}

/**
 * Save policies
 */
async function savePolicies(policies: Policy[]): Promise<OnboardingResponse> {
  try {
    // In a real implementation, this would save to an API
    // const response = await api.post('/api/onboarding/policies', { policies });
    // return response.data;
    
    // For the purpose of this prototype, we'll mock a successful response
    return {
      success: true,
      data: {
        message: 'Policies saved successfully'
      }
    };
  } catch (error: any) {
    console.error('Error saving policies:', error);
    return {
      success: false,
      message: error.message || 'Failed to save policies'
    };
  }
}

/**
 * Complete the onboarding process
 */
async function completeOnboarding(): Promise<OnboardingResponse> {
  try {
    // In a real implementation, this would send a request to the API
    // const response = await api.post('/api/onboarding/complete');
    // return response.data;
    
    // For the purpose of this prototype, we'll mock a successful response
    return {
      success: true,
      data: {
        message: 'Onboarding completed successfully'
      }
    };
  } catch (error: any) {
    console.error('Error completing onboarding:', error);
    return {
      success: false,
      message: error.message || 'Failed to complete onboarding'
    };
  }
}

export const onboardingService = {
  getOnboardingState,
  saveBusinessBasics,
  savePropertyConfig,
  savePolicies,
  completeOnboarding
};