/**
 * Onboarding Types
 * 
 * Type definitions for the onboarding feature
 */

// Business basics types
export interface Address {
  street: string;
  secondary?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

export interface ContactInfo {
  phone: string;
  email: string;
  website?: string;
  fax?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface BusinessBasics {
  propertyName: string;
  propertyType: string;
  businessRegistration?: string;
  taxId?: string;
  gstNumber?: string;
  currency?: string;
  address: Address;
  contact: ContactInfo;
}

// Form data version of BusinessBasics (may have simpler structure for forms)
export interface BusinessBasicsFormData {
  propertyName: string;
  propertyType: string;
  businessRegistration?: string;
  taxId?: string;
  gstNumber?: string;
  currency?: string;
  
  // Address fields
  addressStreet: string;
  addressSecondary?: string;
  addressCity: string;
  addressState: string;
  addressCountry: string;
  addressPostalCode: string;
  
  // Contact fields
  contactPhone: string;
  contactEmail: string;
  contactWebsite?: string;
  contactFax?: string;
}

// Property configuration types
export interface RoomType {
  name: string;
  description: string;
  capacity: number;
  baseRate: number;
  amenities: string[];
  photos: File[];
}

export interface PropertyConfig {
  amenities: string[];
  photos: File[];
  roomTypes: RoomType[];
}

export interface PropertyConfigFormData {
  amenities: string[];
  photos: File[];
  roomTypes: RoomType[];
}

// Policy types
export interface PolicyRule {
  title: string;
  description: string;
}

export interface Policy {
  name: string;
  description: string;
  rules: PolicyRule[];
  isActive: boolean;
  applicableToAll?: boolean;
  effectiveDate?: Date;
  expirationDate?: Date;
  version?: string;
}

export interface PolicyFormData {
  id?: string;
  name: string;
  description: string;
  rules: {
    title: string;
    description: string;
  }[];
  isActive: boolean;
}

// Onboarding state
export enum OnboardingStep {
  BUSINESS_BASICS = 'business-basics',
  PROPERTY_CONFIG = 'property-config',
  POLICIES = 'policies',
  COMPLETED = 'completed'
}

export interface OnboardingFormState {
  businessBasics: BusinessBasicsFormData;
  propertyConfig: PropertyConfigFormData;
  policies: PolicyFormData[];
  currentStep: OnboardingStep;
  completed: boolean;
}

// API Response types
export interface OnboardingResponse {
  success: boolean;
  data?: any;
  message?: string;
}

// Helpers
export const convertBusinessBasicsFormToApiFormat = (formData: BusinessBasicsFormData): BusinessBasics => {
  return {
    propertyName: formData.propertyName,
    propertyType: formData.propertyType,
    businessRegistration: formData.businessRegistration,
    taxId: formData.taxId,
    gstNumber: formData.gstNumber,
    currency: formData.currency,
    address: {
      street: formData.addressStreet,
      secondary: formData.addressSecondary,
      city: formData.addressCity,
      state: formData.addressState,
      country: formData.addressCountry,
      postalCode: formData.addressPostalCode,
    },
    contact: {
      phone: formData.contactPhone,
      email: formData.contactEmail,
      website: formData.contactWebsite,
      fax: formData.contactFax,
    }
  };
};

export const convertApiToBusinessBasicsForm = (apiData: BusinessBasics): BusinessBasicsFormData => {
  return {
    propertyName: apiData.propertyName,
    propertyType: apiData.propertyType,
    businessRegistration: apiData.businessRegistration,
    taxId: apiData.taxId,
    gstNumber: apiData.gstNumber,
    currency: apiData.currency,
    
    // Address fields
    addressStreet: apiData.address.street,
    addressSecondary: apiData.address.secondary,
    addressCity: apiData.address.city,
    addressState: apiData.address.state,
    addressCountry: apiData.address.country,
    addressPostalCode: apiData.address.postalCode,
    
    // Contact fields
    contactPhone: apiData.contact.phone,
    contactEmail: apiData.contact.email,
    contactWebsite: apiData.contact.website,
    contactFax: apiData.contact.fax
  };
};

export const convertPolicyFormToApiFormat = (formData: PolicyFormData): Policy => {
  return {
    name: formData.name,
    description: formData.description,
    rules: formData.rules,
    isActive: formData.isActive
  };
};

export const EMPTY_BUSINESS_BASICS_FORM: BusinessBasicsFormData = {
  propertyName: '',
  propertyType: 'Hotel',
  businessRegistration: '',
  taxId: '',
  gstNumber: '',
  currency: 'USD',
  
  // Address fields
  addressStreet: '',
  addressSecondary: '',
  addressCity: '',
  addressState: '',
  addressCountry: '',
  addressPostalCode: '',
  
  // Contact fields
  contactPhone: '',
  contactEmail: '',
  contactWebsite: '',
  contactFax: ''
};

export const EMPTY_PROPERTY_CONFIG_FORM: PropertyConfigFormData = {
  amenities: [],
  photos: [],
  roomTypes: []
};

export const EMPTY_POLICY_FORM: PolicyFormData = {
  name: '',
  description: '',
  rules: [],
  isActive: true
};