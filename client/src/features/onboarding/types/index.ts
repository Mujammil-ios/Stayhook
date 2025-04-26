/**
 * Onboarding Types
 */

// Re-exporting from services for consistency
import {
  BusinessBasics,
  PropertyConfig,
  RoomType,
  Policy
} from '@/shared/services/onboardingService';

export { BusinessBasics, PropertyConfig, RoomType, Policy };

export type OnboardingStep = 'business-basics' | 'property-config' | 'policies' | 'completed';

export interface OnboardingStatus {
  completed: boolean;
  currentStep: OnboardingStep;
  businessBasics?: BusinessBasics;
  propertyConfig?: Omit<PropertyConfig, 'photos' | 'roomTypes'> & {
    photoUrls: string[];
    roomTypes: (Omit<RoomType, 'photos'> & { photoUrls: string[] })[];
  };
  policies?: Policy[];
}

export interface BusinessBasicsFormData extends BusinessBasics {}

export interface PropertyConfigFormData extends PropertyConfig {}

export interface PolicyFormData extends Policy {}

export interface OnboardingFormState {
  businessBasics: BusinessBasicsFormData;
  propertyConfig: PropertyConfigFormData;
  policies: PolicyFormData[];
}

export interface OnboardingContextType {
  currentStep: OnboardingStep;
  formState: OnboardingFormState;
  isLoading: boolean;
  error: string | null;
  setCurrentStep: (step: OnboardingStep) => void;
  updateBusinessBasics: (data: Partial<BusinessBasicsFormData>) => void;
  updatePropertyConfig: (data: Partial<PropertyConfigFormData>) => void;
  addRoomType: (roomType: RoomType) => void;
  updateRoomType: (index: number, roomType: Partial<RoomType>) => void;
  removeRoomType: (index: number) => void;
  addPolicy: (policy: Policy) => void;
  updatePolicy: (index: number, policy: Partial<Policy>) => void;
  removePolicy: (index: number) => void;
  saveBusinessBasics: () => Promise<boolean>;
  savePropertyConfig: () => Promise<boolean>;
  completeOnboarding: () => Promise<boolean>;
  reset: () => void;
}