/**
 * Onboarding Context and Hook
 * 
 * Provides state management and context for the onboarding process
 */

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { 
  BusinessBasicsFormData, 
  OnboardingFormState, 
  OnboardingStep,
  PolicyFormData,
  PropertyConfigFormData,
  EMPTY_BUSINESS_BASICS_FORM,
  EMPTY_PROPERTY_CONFIG_FORM,
  EMPTY_POLICY_FORM,
  convertBusinessBasicsFormToApiFormat,
  convertPolicyFormToApiFormat
} from '../types/index';
import { onboardingService } from '@/shared/services';
import { useToast } from '@/hooks/use-toast';

// Context type
interface OnboardingContextType {
  formState: OnboardingFormState;
  loading: boolean;
  updateBusinessBasics: (data: BusinessBasicsFormData) => void;
  updatePropertyConfig: (data: PropertyConfigFormData) => void;
  updatePolicy: (policyIndex: number, data: PolicyFormData) => void;
  addPolicy: () => void;
  removePolicy: (policyIndex: number) => void;
  saveBusinessBasics: () => Promise<boolean>;
  savePropertyConfig: () => Promise<boolean>;
  savePolicies: () => Promise<boolean>;
  completeOnboarding: () => Promise<boolean>;
  goToStep: (step: OnboardingStep) => void;
  isStepValid: (step: OnboardingStep) => boolean;
}

// Initial context state
const initialState: OnboardingFormState = {
  businessBasics: EMPTY_BUSINESS_BASICS_FORM,
  propertyConfig: EMPTY_PROPERTY_CONFIG_FORM,
  policies: [{ ...EMPTY_POLICY_FORM }],
  currentStep: OnboardingStep.BUSINESS_BASICS,
  completed: false
};

// Create the context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Context provider component
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [formState, setFormState] = useState<OnboardingFormState>(initialState);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch initial onboarding state on mount
  useEffect(() => {
    async function fetchOnboardingState() {
      setLoading(true);
      try {
        const response = await onboardingService.getOnboardingState();
        
        if (response.success && response.data) {
          // Convert API data to form state
          setFormState({
            businessBasics: response.data.businessBasics || EMPTY_BUSINESS_BASICS_FORM,
            propertyConfig: {
              amenities: response.data.propertyConfig?.amenities || [],
              photos: [],
              roomTypes: []
            },
            policies: response.data.policies?.length > 0 
              ? response.data.policies
              : [{ ...EMPTY_POLICY_FORM }],
            currentStep: response.data.currentStep as OnboardingStep || OnboardingStep.BUSINESS_BASICS,
            completed: response.data.completed || false
          });
        }
      } catch (error) {
        console.error('Error fetching onboarding state:', error);
        toast({
          title: "Error",
          description: "Failed to load onboarding data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchOnboardingState();
  }, [toast]);

  // Form update handlers
  const updateBusinessBasics = (data: BusinessBasicsFormData) => {
    setFormState(prev => ({
      ...prev,
      businessBasics: data
    }));
  };

  const updatePropertyConfig = (data: PropertyConfigFormData) => {
    setFormState(prev => ({
      ...prev,
      propertyConfig: data
    }));
  };

  const updatePolicy = (policyIndex: number, data: PolicyFormData) => {
    setFormState(prev => {
      const updatedPolicies = [...prev.policies];
      updatedPolicies[policyIndex] = data;
      return {
        ...prev,
        policies: updatedPolicies
      };
    });
  };

  const addPolicy = () => {
    setFormState(prev => ({
      ...prev,
      policies: [...prev.policies, { ...EMPTY_POLICY_FORM }]
    }));
  };

  const removePolicy = (policyIndex: number) => {
    setFormState(prev => ({
      ...prev,
      policies: prev.policies.filter((_, index) => index !== policyIndex)
    }));
  };

  // API save handlers
  const saveBusinessBasics = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const data = convertBusinessBasicsFormToApiFormat(formState.businessBasics);
      const response = await onboardingService.saveBusinessBasics(data);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Business basics saved successfully"
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to save business basics",
          variant: "destructive"
        });
        return false;
      }
    } catch (error: any) {
      console.error('Error saving business basics:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save business basics",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const savePropertyConfig = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await onboardingService.savePropertyConfig(formState.propertyConfig);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Property configuration saved successfully"
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to save property configuration",
          variant: "destructive"
        });
        return false;
      }
    } catch (error: any) {
      console.error('Error saving property configuration:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save property configuration",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const savePolicies = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const policies = formState.policies.map(policy => convertPolicyFormToApiFormat(policy));
      const response = await onboardingService.savePolicies(policies);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Policies saved successfully"
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to save policies",
          variant: "destructive"
        });
        return false;
      }
    } catch (error: any) {
      console.error('Error saving policies:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save policies",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await onboardingService.completeOnboarding();
      
      if (response.success) {
        setFormState(prev => ({
          ...prev,
          completed: true
        }));
        
        toast({
          title: "Success",
          description: "Onboarding completed successfully"
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to complete onboarding",
          variant: "destructive"
        });
        return false;
      }
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Navigation
  const goToStep = (step: OnboardingStep) => {
    setFormState(prev => ({
      ...prev,
      currentStep: step
    }));
  };

  // Validate step before proceeding
  const isStepValid = (step: OnboardingStep): boolean => {
    switch (step) {
      case OnboardingStep.BUSINESS_BASICS:
        const bb = formState.businessBasics;
        return !!(
          bb.propertyName && 
          bb.propertyType && 
          bb.addressStreet && 
          bb.addressCity && 
          bb.addressState && 
          bb.addressCountry && 
          bb.addressPostalCode && 
          bb.contactPhone && 
          bb.contactEmail
        );
        
      case OnboardingStep.PROPERTY_CONFIG:
        const pc = formState.propertyConfig;
        return !!(
          pc.amenities.length > 0
        );
        
      case OnboardingStep.POLICIES:
        return formState.policies.every(policy => 
          !!(policy.name && policy.description && policy.rules.length > 0)
        );
        
      default:
        return true;
    }
  };

  // Provide context
  return (
    <OnboardingContext.Provider value={{
      formState,
      loading,
      updateBusinessBasics,
      updatePropertyConfig,
      updatePolicy,
      addPolicy,
      removePolicy,
      saveBusinessBasics,
      savePropertyConfig,
      savePolicies,
      completeOnboarding,
      goToStep,
      isStepValid
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Custom hook to use the context
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  
  return context;
}