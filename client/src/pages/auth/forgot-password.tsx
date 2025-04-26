import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';
import { TextInput } from '@/components/forms/text-input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{email?: string}>({});
  
  const [_, setLocation] = useLocation();
  const { forgotPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate form
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    // Start loading
    setIsLoading(true);
    
    try {
      // Attempt password reset
      const result = await forgotPassword(email);
      
      // Always show success message for security reasons
      // (don't let user know if email exists in the system)
      setIsSubmitted(true);
      
      if (!result.success) {
        console.error('Forgot password error:', result.message);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Show success state after submission
  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <i className="ri-mail-check-line text-3xl text-green-600 dark:text-green-400"></i>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Check your email</h1>
              
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                The link will expire in 10 minutes.
              </p>
              
              <div className="space-y-4 w-full">
                <Button 
                  onClick={() => setLocation('/login')} 
                  className="w-full"
                >
                  Return to login
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsSubmitted(false);
                    setIsLoading(false);
                  }}
                  className="w-full"
                >
                  Try another email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold mb-2">Forgot your password?</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Enter your email and we'll send you a reset link
          </p>
        </div>
        
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                id="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
                required
                icon="ri-mail-line"
                error={errors.email}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Sending reset link...
                  </>
                ) : "Send reset link"}
              </Button>
            </form>
          </div>
          
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 text-center bg-neutral-50 dark:bg-neutral-800/50">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Remembered your password?{' '}
              <button 
                onClick={() => setLocation('/login')}
                className="text-primary hover:underline font-medium"
              >
                Back to login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}