/**
 * Onboarding Wizard Component
 * 
 * Main component for the onboarding flow
 */
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
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
  const methods = useForm({
    defaultValues: {
      businessName: '',
      businessType: 'hotel',
      businessEmail: '',
      businessPhone: '',
      businessAddress: '',
      businessCity: '',
      businessState: '',
      businessZip: '',
      businessCountry: 'US',
      businessDescription: '',
      businessWebsite: '',
      businessLogo: null,
      propertyName: '',
      propertyDescription: '',
      propertyAddress: '',
      propertyCity: '',
      propertyState: '',
      propertyZip: '',
      propertyCountry: 'US',
      propertyPhoto: null,
      propertyAmenities: [],
      propertyRoomTypes: [],
      propertyPolicies: [],
      propertyRules: [],
    }
  });
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
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left sidebar with progress */}
        <div className="lg:w-1/3 xl:w-1/4 shrink-0">
          <div className="sticky top-8 space-y-8">
            <div className="p-6 bg-white dark:bg-gray-950 rounded-lg shadow-sm border">
              <OnboardingProgress 
                currentStep={formState.currentStep} 
                stepsCompleted={stepsCompleted}
                onSelectStep={(step) => {
                  const stepIndex = Object.values(OnboardingStep).indexOf(step);
                  const currentStepIndex = Object.values(OnboardingStep).indexOf(formState.currentStep);
                  
                  if (stepIndex <= currentStepIndex) {
                    goToStep(step);
                  }
                }}
              />
            </div>
            
            {/* Quick Start Guide Section */}
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium mb-4">Quick Start Guide</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/your-video-id"
                  title="How to setup your account on StayHook?"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          <Card className="shadow-lg">
            <CardHeader className="space-y-2 pb-8 border-b">
              <CardTitle className="text-2xl font-bold">{stepInfo.title}</CardTitle>
              <CardDescription className="text-base">{stepInfo.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-8">
              <Form {...methods}>
                {renderStepContent()}
                
                <div className="flex justify-between mt-8 pt-6 border-t">
                  {showPrevious ? (
                    <Button 
                      variant="outline" 
                      onClick={handlePrevious}
                      disabled={loading}
                      className="min-w-[120px]"
                    >
                      <i className="ri-arrow-left-line mr-2"></i>
                      Back
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  
                  <Button 
                    variant="default" 
                    onClick={handleNext}
                    disabled={!canContinue || loading}
                    className="min-w-[120px] bg-teal-600 hover:bg-teal-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isLastStep ? 'Completing...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        {isLastStep ? 'Complete Setup' : 'Next'}
                        {!isLastStep && <i className="ri-arrow-right-line ml-2"></i>}
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
  
}