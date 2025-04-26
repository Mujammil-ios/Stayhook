/**
 * Onboarding Page
 * 
 * Page for post-signup property setup (onboarding).
 */

import { OnboardingWizard } from '@/features/onboarding/components';

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-background">
      <OnboardingWizard />
    </div>
  );
}