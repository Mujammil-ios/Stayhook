/**
 * Onboarding Hook
 * 
 * Custom hook for managing onboarding state and operations.
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onboardingService } from '@/shared/services';
import {
  OnboardingStep,
  OnboardingFormState,
  BusinessBasicsFormData,
  PropertyConfigFormData,
  Policy,
  RoomType,
  OnboardingContextType,
} from '../types';
import { useToast } from '@/hooks/use-toast';

// Default empty form state
const defaultFormState: OnboardingFormState = {
  businessBasics: {
    propertyName: '',
    contactNumber: '',
    propertyType: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    currency: 'USD',
  },
  propertyConfig: {
    amenities: [],
    photos: [],
    roomTypes: [],
  },
  policies: [],
};

// Create context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Provider component
export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('business-basics');
  const [formState, setFormState] = useState<OnboardingFormState>(defaultFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch onboarding status when component mounts
  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      setIsLoading(true);
      try {
        const response = await onboardingService.getOnboardingStatus();
        
        if (response.data) {
          // Update currentStep
          setCurrentStep(response.data.currentStep);
          
          // Update form state with any existing data
          const newFormState = { ...defaultFormState };
          
          if (response.data.businessBasics) {
            newFormState.businessBasics = response.data.businessBasics;
          }
          
          if (response.data.propertyConfig) {
            // Handle property photos and room type photos conversion
            const propertyConfig = {
              amenities: response.data.propertyConfig.amenities || [],
              photos: [], // We'll need to fetch the actual File objects elsewhere if needed
              roomTypes: response.data.propertyConfig.roomTypes.map(roomType => ({
                ...roomType,
                photos: [], // We'll need to fetch the actual File objects elsewhere if needed
              })),
            };
            
            newFormState.propertyConfig = propertyConfig;
          }
          
          if (response.data.policies) {
            newFormState.policies = response.data.policies;
          }
          
          setFormState(newFormState);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch onboarding status');
        toast({
          title: 'Error',
          description: err.message || 'Failed to fetch onboarding status',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOnboardingStatus();
  }, [toast]);

  // Update businessBasics in form state
  const updateBusinessBasics = (data: Partial<BusinessBasicsFormData>) => {
    setFormState(prev => ({
      ...prev,
      businessBasics: {
        ...prev.businessBasics,
        ...data,
      },
    }));
  };

  // Update propertyConfig in form state
  const updatePropertyConfig = (data: Partial<PropertyConfigFormData>) => {
    setFormState(prev => ({
      ...prev,
      propertyConfig: {
        ...prev.propertyConfig,
        ...data,
      },
    }));
  };

  // Add a new room type to propertyConfig
  const addRoomType = (roomType: RoomType) => {
    setFormState(prev => ({
      ...prev,
      propertyConfig: {
        ...prev.propertyConfig,
        roomTypes: [...prev.propertyConfig.roomTypes, roomType],
      },
    }));
  };

  // Update a room type in propertyConfig
  const updateRoomType = (index: number, roomType: Partial<RoomType>) => {
    setFormState(prev => {
      const newRoomTypes = [...prev.propertyConfig.roomTypes];
      newRoomTypes[index] = {
        ...newRoomTypes[index],
        ...roomType,
      };
      
      return {
        ...prev,
        propertyConfig: {
          ...prev.propertyConfig,
          roomTypes: newRoomTypes,
        },
      };
    });
  };

  // Remove a room type from propertyConfig
  const removeRoomType = (index: number) => {
    setFormState(prev => {
      const newRoomTypes = [...prev.propertyConfig.roomTypes];
      newRoomTypes.splice(index, 1);
      
      return {
        ...prev,
        propertyConfig: {
          ...prev.propertyConfig,
          roomTypes: newRoomTypes,
        },
      };
    });
  };

  // Add a new policy
  const addPolicy = (policy: Policy) => {
    setFormState(prev => ({
      ...prev,
      policies: [...prev.policies, policy],
    }));
  };

  // Update a policy
  const updatePolicy = (index: number, policy: Partial<Policy>) => {
    setFormState(prev => {
      const newPolicies = [...prev.policies];
      newPolicies[index] = {
        ...newPolicies[index],
        ...policy,
      };
      
      return {
        ...prev,
        policies: newPolicies,
      };
    });
  };

  // Remove a policy
  const removePolicy = (index: number) => {
    setFormState(prev => {
      const newPolicies = [...prev.policies];
      newPolicies.splice(index, 1);
      
      return {
        ...prev,
        policies: newPolicies,
      };
    });
  };

  // Save business basics to API
  const saveBusinessBasics = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await onboardingService.saveBusinessBasics(formState.businessBasics);
      
      if (response.status >= 200 && response.status < 300) {
        toast({
          title: 'Success',
          description: 'Business basics saved successfully',
        });
        setCurrentStep('property-config');
        return true;
      } else {
        throw new Error(response.message || 'Failed to save business basics');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save business basics');
      toast({
        title: 'Error',
        description: err.message || 'Failed to save business basics',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Save property configuration to API
  const savePropertyConfig = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await onboardingService.savePropertyConfig(formState.propertyConfig);
      
      if (response.status >= 200 && response.status < 300) {
        toast({
          title: 'Success',
          description: 'Property configuration saved successfully',
        });
        setCurrentStep('policies');
        return true;
      } else {
        throw new Error(response.message || 'Failed to save property configuration');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save property configuration');
      toast({
        title: 'Error',
        description: err.message || 'Failed to save property configuration',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete onboarding by saving policies and finalizing
  const completeOnboarding = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await onboardingService.completeOnboarding(formState.policies);
      
      if (response.status >= 200 && response.status < 300) {
        toast({
          title: 'Success',
          description: 'Onboarding completed successfully',
        });
        setCurrentStep('completed');
        return true;
      } else {
        throw new Error(response.message || 'Failed to complete onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding');
      toast({
        title: 'Error',
        description: err.message || 'Failed to complete onboarding',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form state
  const reset = () => {
    setFormState(defaultFormState);
    setCurrentStep('business-basics');
    setError(null);
  };

  // Context value
  const contextValue: OnboardingContextType = {
    currentStep,
    formState,
    isLoading,
    error,
    setCurrentStep,
    updateBusinessBasics,
    updatePropertyConfig,
    addRoomType,
    updateRoomType,
    removeRoomType,
    addPolicy,
    updatePolicy,
    removePolicy,
    saveBusinessBasics,
    savePropertyConfig,
    completeOnboarding,
    reset,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Custom hook to use the onboarding context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  
  return context;
};