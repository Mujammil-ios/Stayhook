import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';
import { TextInput } from '@/components/forms/text-input';
import { CheckboxInput } from '@/components/forms/checkbox-input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  
  const [_, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate form
    const newErrors: {email?: string; password?: string} = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    // If errors, show them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Start loading
    setIsLoading(true);
    
    try {
      // Attempt login
      const result = await login(email, password);
      
      if (result.success) {
        // Show success toast
        toast({
          title: "Login successful",
          description: "Welcome back!",
          variant: "default",
        });
        
        // Redirect to dashboard
        setLocation('/dashboard');
      } else {
        // Show error toast
        toast({
          title: "Login failed",
          description: result.message || "Invalid email or password",
          variant: "destructive",
        });
        
        // Set field errors if available
        if (result.message?.toLowerCase().includes('email')) {
          setErrors(prev => ({ ...prev, email: result.message }));
        } else if (result.message?.toLowerCase().includes('password')) {
          setErrors(prev => ({ ...prev, password: result.message }));
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Sign in to your account to continue
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
              
              <TextInput
                id="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                type="password"
                required
                icon="ri-lock-line"
                error={errors.password}
              />
              
              <div className="flex items-center justify-between">
                <CheckboxInput
                  id="remember-me"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={setRememberMe}
                />
                
                <button 
                  type="button" 
                  onClick={() => setLocation('/forgot-password')}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Signing in...
                  </>
                ) : "Sign in"}
              </Button>
            </form>
          </div>
          
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 text-center bg-neutral-50 dark:bg-neutral-800/50">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Don't have an account?{' '}
              <button 
                onClick={() => setLocation('/signup')}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}