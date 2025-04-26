/**
 * OnboardingProgress Component
 * 
 * Displays a progress stepper for the onboarding process
 */

import { useState } from 'react';
import { OnboardingStep } from '../types/index';
import { Check, CircleDashed, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
  currentStep: OnboardingStep;
  stepsCompleted: Record<OnboardingStep, boolean>;
  onSelectStep: (step: OnboardingStep) => void;
}

export function OnboardingProgress({
  currentStep,
  stepsCompleted,
  onSelectStep
}: OnboardingProgressProps) {
  // Define all steps and their display names
  const steps = [
    { id: OnboardingStep.BUSINESS_BASICS, name: 'Business Basics' },
    { id: OnboardingStep.PROPERTY_CONFIG, name: 'Property Setup' },
    { id: OnboardingStep.POLICIES, name: 'Policies' },
    { id: OnboardingStep.COMPLETED, name: 'Complete' }
  ];

  // Calculate active and completed steps
  const getStepStatus = (stepId: OnboardingStep) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    // Current step
    if (stepId === currentStep) {
      return 'current';
    }
    
    // Completed step
    if (stepIndex < currentIndex) {
      return 'completed';
    }
    
    // Future step
    return 'future';
  };
  
  // Check if a step is clickable
  const isStepClickable = (stepId: OnboardingStep) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    // All steps before current are clickable
    if (stepIndex < currentIndex) {
      return true;
    }
    
    // Current step is clickable
    if (stepId === currentStep) {
      return true;
    }
    
    // Future steps are not clickable by default
    return false;
  };
  
  return (
    <div className="relative">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const clickable = isStepClickable(step.id);
          const completed = stepsCompleted[step.id];
          
          return (
            <div 
              key={step.id} 
              className="flex flex-col items-center relative"
            >
              {/* Line connecting steps */}
              {index > 0 && (
                <div 
                  className={cn(
                    "absolute h-[2px] top-4 -left-1/2 w-full -z-10 transition-colors",
                    {
                      "bg-primary": status === 'completed' || (status === 'current' && steps[index-1] && getStepStatus(steps[index-1].id) === 'completed'),
                      "bg-muted": status === 'future' || (status === 'current' && steps[index-1] && getStepStatus(steps[index-1].id) !== 'completed')
                    }
                  )}
                />
              )}
              
              {/* Step indicator */}
              <button
                onClick={() => clickable && onSelectStep(step.id)}
                disabled={!clickable}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors",
                  {
                    "bg-primary text-primary-foreground": status === 'current',
                    "bg-primary/10 text-primary hover:bg-primary/20": status === 'completed' && clickable,
                    "bg-muted text-muted-foreground": status === 'future' || !clickable
                  }
                )}
              >
                {status === 'completed' ? (
                  <Check className="h-4 w-4" />
                ) : status === 'current' ? (
                  <CircleDot className="h-4 w-4" />
                ) : (
                  <CircleDashed className="h-4 w-4" />
                )}
              </button>
              
              {/* Step name */}
              <span 
                className={cn(
                  "text-sm font-medium",
                  {
                    "text-primary": status === 'current',
                    "text-foreground": status === 'completed',
                    "text-muted-foreground": status === 'future'
                  }
                )}
              >
                {step.name}
              </span>
              
              {/* Completion status for current step */}
              {status === 'current' && (
                <span 
                  className={cn(
                    "text-xs mt-1",
                    completed ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                  )}
                >
                  {completed ? "Complete" : "In progress"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}