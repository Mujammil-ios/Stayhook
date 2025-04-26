// Export API service
import api from './api';
export { api };

// Import domain-specific services
import reservationService from './reservationService';
import invoiceService from './invoiceService';

// Mock onboardingService to ensure compatibility
const onboardingService = {
  getProgress: async () => ({
    success: true,
    data: {
      completed: false,
      steps: {
        'business-basics': false,
        'property-config': false,
        'policies': false,
        'completed': false
      }
    },
    message: 'Onboarding progress retrieved'
  }),
  saveProgress: async (stepId: string, data: any) => ({
    success: true,
    data: {
      step: stepId,
      completed: true
    },
    message: `Step ${stepId} saved successfully`
  }),
  completeOnboarding: async () => ({
    success: true,
    data: {
      completed: true
    },
    message: 'Onboarding completed successfully'
  })
};

// Export all services
export {
  reservationService,
  invoiceService,
  onboardingService
};