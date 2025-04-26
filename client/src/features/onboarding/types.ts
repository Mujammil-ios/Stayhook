/**
 * Onboarding Types
 * 
 * Type definitions for onboarding feature.
 */

// Onboarding step types
export type OnboardingStep = 'business-basics' | 'property-config' | 'policies' | 'completed';

// Business Basics Form Data
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Contact {
  phone: string;
  email: string;
  website?: string;
}

export interface BusinessBasics {
  propertyName: string;
  propertyType: string;
  businessRegistration?: string;
  taxId?: string;
  address: Address;
  contact: Contact;
}

// Property Configuration Data
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

export interface PropertyConfigFormData {
  amenities: string[];
  photos: File[];
  roomTypes: RoomType[];
}

// Policy Data
export interface PolicyRule {
  title: string;
  content: string;
}

export interface Policy {
  name: string;
  description: string;
  rules: PolicyRule[];
  isActive: boolean;
}

// Form State
export interface OnboardingFormState {
  completed: boolean;
  currentStep: OnboardingStep;
  businessBasics: BusinessBasics;
  propertyConfig: PropertyConfigFormData;
  policies: Policy[];
}

// Context Type
export interface OnboardingContextType {
  currentStep: OnboardingStep;
  isLoading: boolean;
  error: string | null;
  formState: OnboardingFormState;
  updateBusinessBasics: (data: BusinessBasics) => void;
  saveBusinessBasics: () => Promise<boolean>;
  updatePropertyConfig: (data: PropertyConfigFormData) => void;
  savePropertyConfig: () => Promise<boolean>;
  updatePolicies: (policies: Policy[]) => void;
  completeOnboarding: () => Promise<boolean>;
  loadOnboardingState: () => Promise<boolean>;
}