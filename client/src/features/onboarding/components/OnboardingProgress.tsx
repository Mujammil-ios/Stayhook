/**
 * Onboarding Progress
 * 
 * Displays the current progress in the onboarding wizard.
 */

import { Check, Hotel, Settings, FileText } from 'lucide-react';
import { useOnboarding } from '../hooks/useOnboarding';
import { cn } from '@/lib/utils';
import { OnboardingStep } from '../types';

export const OnboardingProgress = () => {
  const { currentStep, setCurrentStep, isLoading } = useOnboarding();
  
  // Define steps
  const steps: { id: OnboardingStep, label: string, icon: React.ReactNode }[] = [
    {
      id: 'business-basics',
      label: 'Business Basics',
      icon: <Hotel className="h-5 w-5" />,
    },
    {
      id: 'property-config',
      label: 'Property Setup',
      icon: <Settings className="h-5 w-5" />,
    },
    {
      id: 'policies',
      label: 'Policies & Launch',
      icon: <FileText className="h-5 w-5" />,
    },
  ];
  
  // Map step IDs to their indices for comparison
  const stepIndices: Record<OnboardingStep, number> = {
    'business-basics': 0,
    'property-config': 1,
    'policies': 2,
    'completed': 3,
  };
  
  // Handle step click - allow going back to previous steps but not skipping ahead
  const handleStepClick = (stepId: OnboardingStep) => {
    if (isLoading) return; // Don't allow changing steps while loading
    
    const currentIndex = stepIndices[currentStep];
    const targetIndex = stepIndices[stepId];
    
    // Only allow going backward or staying on current step
    if (targetIndex <= currentIndex) {
      setCurrentStep(stepId);
    }
  };
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = stepIndices[currentStep] > index;
          
          return (
            <div key={step.id} className="relative flex-1">
              {/* Connector line */}
              {index > 0 && (
                <div 
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 -mx-2 z-0",
                    isCompleted || (isActive && index > 0) 
                      ? "bg-primary" 
                      : "bg-muted"
                  )}
                  style={{ left: '-50%', right: '50%' }}
                />
              )}
              
              {/* Step button */}
              <button
                type="button"
                onClick={() => handleStepClick(step.id)}
                disabled={isLoading}
                className={cn(
                  "relative flex flex-col items-center justify-center z-10 transition-all",
                  "disabled:opacity-70 disabled:cursor-not-allowed"
                )}
              >
                {/* Step circle */}
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    isActive && "border-primary bg-primary text-primary-foreground",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    !isActive && !isCompleted && "border-muted-foreground bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                
                {/* Step label */}
                <span 
                  className={cn(
                    "mt-2 text-sm font-medium",
                    isActive && "text-primary font-semibold",
                    isCompleted && "text-primary",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};