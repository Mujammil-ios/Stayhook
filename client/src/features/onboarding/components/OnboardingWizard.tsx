/**
 * Onboarding Wizard Component
 * 
 * Main component for the onboarding flow
 */

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OnboardingProgress } from './OnboardingProgress';
import { OnboardingStep } from '../types/index';
import { useOnboarding } from '../hooks/useOnboarding';
import { BusinessBasicsForm } from './BusinessBasicsForm';
import { PropertyConfigForm } from './PropertyConfigForm';
import { PoliciesForm } from './PoliciesForm';
import { CompletedStep } from './CompletedStep';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';

export function OnboardingWizard() {
  const { 
    formState,
    loading,
    goToStep,
    isStepValid,
    saveBusinessBasics,
    savePropertyConfig,
    savePolicies,
    completeOnboarding
  } = useOnboarding();
  
  const [_, setLocation] = useLocation();
  
  // Redirect to dashboard if onboarding is already completed
  useEffect(() => {
    if (formState.completed) {
      setLocation('/dashboard');
    }
  }, [formState.completed, setLocation]);
  
  // Determine if current step is completed
  const stepsCompleted = {
    [OnboardingStep.BUSINESS_BASICS]: isStepValid(OnboardingStep.BUSINESS_BASICS),
    [OnboardingStep.PROPERTY_CONFIG]: isStepValid(OnboardingStep.PROPERTY_CONFIG),
    [OnboardingStep.POLICIES]: isStepValid(OnboardingStep.POLICIES),
  };
  
  // Handle next step navigation
  const handleNext = async () => {
    const currentStep = formState.currentStep;
    
    // Save current step data
    let success = false;
    
    switch (currentStep) {
      case OnboardingStep.BUSINESS_BASICS:
        success = await saveBusinessBasics();
        if (success) {
          goToStep(OnboardingStep.PROPERTY_CONFIG);
        }
        break;
        
      case OnboardingStep.PROPERTY_CONFIG:
        success = await savePropertyConfig();
        if (success) {
          goToStep(OnboardingStep.POLICIES);
        }
        break;
        
      case OnboardingStep.POLICIES:
        success = await savePolicies();
        if (success) {
          goToStep(OnboardingStep.COMPLETED);
        }
        break;
        
      case OnboardingStep.COMPLETED:
        success = await completeOnboarding();
        if (success) {
          setLocation('/dashboard');
        }
        break;
    }
  };
  
  // Handle previous step navigation
  const handlePrevious = () => {
    const currentStep = formState.currentStep;
    
    switch (currentStep) {
      case OnboardingStep.PROPERTY_CONFIG:
        goToStep(OnboardingStep.BUSINESS_BASICS);
        break;
        
      case OnboardingStep.POLICIES:
        goToStep(OnboardingStep.PROPERTY_CONFIG);
        break;
        
      case OnboardingStep.COMPLETED:
        goToStep(OnboardingStep.POLICIES);
        break;
    }
  };
  
  // Determine step content
  const renderStepContent = () => {
    switch (formState.currentStep) {
      case OnboardingStep.BUSINESS_BASICS:
        return <BusinessBasicsForm />;
        
      case OnboardingStep.PROPERTY_CONFIG:
        return <PropertyConfigForm />;
        
      case OnboardingStep.POLICIES:
        return <PoliciesForm />;
        
      case OnboardingStep.COMPLETED:
        return <CompletedStep onFinish={handleNext} />;
        
      default:
        return <div>Unknown step</div>;
    }
  };
  
  // Get step title and description
  const getStepInfo = () => {
    switch (formState.currentStep) {
      case OnboardingStep.BUSINESS_BASICS:
        return {
          title: 'Business Basics',
          description: 'Let\'s start with your property details and business information'
        };
        
      case OnboardingStep.PROPERTY_CONFIG:
        return {
          title: 'Property Configuration',
          description: 'Set up your property amenities, photos, and room types'
        };
        
      case OnboardingStep.POLICIES:
        return {
          title: 'Policies',
          description: 'Establish your property policies, rules, and guidelines'
        };
        
      case OnboardingStep.COMPLETED:
        return {
          title: 'All Set!',
          description: 'Review your setup before finishing the onboarding process'
        };
        
      default:
        return {
          title: 'Onboarding',
          description: 'Set up your property'
        };
    }
  };
  
  const stepInfo = getStepInfo();
  const canContinue = isStepValid(formState.currentStep);
  const showPrevious = formState.currentStep !== OnboardingStep.BUSINESS_BASICS;
  const isLastStep = formState.currentStep === OnboardingStep.COMPLETED;
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left sidebar with progress */}
        <div className="md:w-1/4 shrink-0">
          <div className="p-4 md:sticky md:top-20 bg-white dark:bg-gray-950 rounded-lg shadow-sm border">
            <OnboardingProgress 
              currentStep={formState.currentStep} 
              stepsCompleted={stepsCompleted}
              onSelectStep={(step) => {
                // Only allow navigation to completed steps or the current step
                const stepIndex = Object.values(OnboardingStep).indexOf(step);
                const currentStepIndex = Object.values(OnboardingStep).indexOf(formState.currentStep);
                
                if (stepIndex <= currentStepIndex) {
                  goToStep(step);
                }
              }}
            />
          </div>
          
          {/* Quick Start Guide Section */}
          <div className="mt-8">
            <h3 className="text-base font-medium mb-2">Quick Start Guide to Managing Your Hotel</h3>
            <div className="relative overflow-hidden rounded-lg aspect-video">
              <div className="bg-gray-200 dark:bg-gray-800 h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{stepInfo.title}</CardTitle>
              <CardDescription>{stepInfo.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              {renderStepContent()}
              
              <div className="flex justify-between mt-8">
                {showPrevious ? (
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                    disabled={loading}
                    className="min-w-[100px]"
                  >
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                
                <Button 
                  variant="default" 
                  onClick={handleNext}
                  disabled={!canContinue || loading}
                  className="min-w-[100px] bg-teal-600 hover:bg-teal-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isLastStep ? 'Completing...' : 'Saving...'}
                    </>
                  ) : (
                    isLastStep ? 'Complete Setup' : 'Next'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}