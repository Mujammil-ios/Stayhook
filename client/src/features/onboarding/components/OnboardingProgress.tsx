/**
 * OnboardingProgress Component
 * 
 * Displays a vertical progress stepper for the onboarding process
 * Design based on provided screenshots
 */

import { OnboardingStep } from '../types/index';
import { Check, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
  currentStep: OnboardingStep;
  stepsCompleted: Record<OnboardingStep, boolean>;
  onSelectStep: (step: OnboardingStep) => void;
}

interface StepInfo {
  id: OnboardingStep;
  name: string;
  description: string;
}

export function OnboardingProgress({
  currentStep,
  stepsCompleted,
  onSelectStep
}: OnboardingProgressProps) {
  // Define all steps and their display names
  const steps: StepInfo[] = [
    { 
      id: OnboardingStep.BUSINESS_BASICS, 
      name: 'Add Property Details', 
      description: 'Provide us with a few details to personalize your experience.'
    },
    { 
      id: OnboardingStep.PROPERTY_CONFIG, 
      name: 'Add Property Details', 
      description: 'Provide us with a few details to personalize your experience.'
    },
    { 
      id: OnboardingStep.POLICIES, 
      name: 'Upload Hotel Photos', 
      description: 'Showcase your hotel with high-quality images.'
    },
    { 
      id: OnboardingStep.COMPLETED, 
      name: 'Add Room Details', 
      description: 'Help us understand your room offerings to set up your hotel efficiently.'
    }
  ];

  // Calculate active and completed steps
  const getStepStatus = (step: StepInfo) => {
    const stepIndex = steps.findIndex(s => s.id === step.id);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (step.id === currentStep) {
      return 'current';
    } else if (stepIndex < currentIndex || stepsCompleted[step.id]) {
      return 'completed';
    } else {
      return 'future';
    }
  };
  
  return (
    <div className="flex flex-col space-y-2">
      {steps.map((step, index) => {
        const status = getStepStatus(step);
        const isCompleted = status === 'completed';
        const isCurrent = status === 'current';
        const stepNumber = index + 1;
        
        // Determine if there should be a connecting line after this step
        const showConnector = index < steps.length - 1;
        
        return (
          <div key={step.id} className="relative">
            <div className="flex items-start">
              {/* Step indicator and number */}
              <div className="relative flex-shrink-0 mr-4">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center z-10",
                    {
                      "bg-teal-600 text-white": isCompleted || isCurrent,
                      "border-2 border-gray-200 text-gray-400": !isCompleted && !isCurrent
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                
                {/* Vertical connector line */}
                {showConnector && (
                  <div 
                    className={cn(
                      "absolute top-8 left-4 -ml-px h-full w-0.5 -z-10",
                      {
                        "bg-teal-600": isCompleted,
                        "bg-gray-200": !isCompleted
                      }
                    )}
                  />
                )}
              </div>
              
              {/* Step content */}
              <div 
                className={cn(
                  "flex flex-col cursor-pointer mt-1",
                  {
                    "text-gray-500": !isCurrent && !isCompleted,
                    "text-gray-900": isCurrent || isCompleted
                  }
                )}
                onClick={() => {
                  // Only allow navigation to completed steps or the current step
                  if (isCompleted || isCurrent) {
                    onSelectStep(step.id);
                  }
                }}
              >
                <div className="text-sm font-medium">{step.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{step.description}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}