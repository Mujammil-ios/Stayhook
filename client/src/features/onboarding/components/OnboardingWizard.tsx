/**
 * Onboarding Wizard
 * 
 * Container component for the multi-step onboarding wizard.
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'wouter';
import { OnboardingProvider, useOnboarding } from '../hooks/useOnboarding';
import { BusinessBasicsForm } from './BusinessBasicsForm';
import { PropertyConfigForm } from './PropertyConfigForm';
import { PoliciesForm } from './PoliciesForm';
import { CompletedStep } from './CompletedStep';
import { OnboardingProgress } from './OnboardingProgress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_CONFIG } from '@/shared/config';

// Wrapper component that uses the context
const OnboardingWizardContent = () => {
  const { currentStep, error } = useOnboarding();
  const [, navigate] = useLocation();
  
  // Redirect to dashboard if onboarding is completed
  useEffect(() => {
    if (currentStep === 'completed') {
      // Add a small delay to allow the completed step animation to be seen
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Set Up Your Property</h1>
        <p className="text-muted-foreground">
          Welcome to {APP_CONFIG.APP_NAME}! Let's set up your property to get you started.
        </p>
      </div>
      
      <OnboardingProgress />
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {currentStep === 'business-basics' && 'Business & Property Basics'}
            {currentStep === 'property-config' && 'Property Configuration'}
            {currentStep === 'policies' && 'Policies & Launch'}
            {currentStep === 'completed' && 'Setup Complete!'}
          </CardTitle>
          <CardDescription>
            {currentStep === 'business-basics' && 'Provide basic information about your business and property.'}
            {currentStep === 'property-config' && 'Configure your property amenities, photos, and room types.'}
            {currentStep === 'policies' && 'Set up your policies and prepare to launch your property.'}
            {currentStep === 'completed' && 'Your property has been set up successfully!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 'business-basics' && <BusinessBasicsForm />}
          {currentStep === 'property-config' && <PropertyConfigForm />}
          {currentStep === 'policies' && <PoliciesForm />}
          {currentStep === 'completed' && <CompletedStep />}
        </CardContent>
      </Card>
    </div>
  );
};

// Main component that provides the context
export const OnboardingWizard = () => {
  return (
    <OnboardingProvider>
      <OnboardingWizardContent />
    </OnboardingProvider>
  );
};