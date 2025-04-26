import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';
import { TextInput } from '@/components/forms/text-input';
import { CheckboxInput } from '@/components/forms/checkbox-input';
import { SelectInput } from '@/components/forms/select-input';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});
  
  const [_, setLocation] = useLocation();
  const { signup } = useAuth();
  const { toast } = useToast();

  // Password strength
  const getPasswordStrength = (password: string): { strength: number; text: string; color: string } => {
    if (!password) return { strength: 0, text: '', color: 'bg-neutral-200 dark:bg-neutral-700' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const strengthMap = [
      { text: 'Weak', color: 'bg-red-500' },
      { text: 'Fair', color: 'bg-orange-500' },
      { text: 'Good', color: 'bg-yellow-500' },
      { text: 'Strong', color: 'bg-green-500' },
      { text: 'Very Strong', color: 'bg-green-600' },
    ];
    
    return {
      strength,
      text: strengthMap[strength].text,
      color: strengthMap[strength].color,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate form
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      agreeTerms?: string;
    } = {};
    
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password && password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions';
    
    // If errors, show them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Start loading
    setIsLoading(true);
    
    try {
      // Attempt signup
      const result = await signup(name, email, password, role as 'admin' | 'manager' | 'staff');
      
      if (result.success) {
        // Show success toast
        toast({
          title: "Account created",
          description: "Your account has been created successfully",
          variant: "default",
        });
        
        // Redirect to dashboard
        setLocation('/dashboard');
      } else {
        // Show error toast
        toast({
          title: "Signup failed",
          description: result.message || "There was an error creating your account",
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
      console.error('Signup error:', error);
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold mb-2">Create an account</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Sign up to get started with our hotel management system
          </p>
        </div>
        
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                id="name"
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                icon="ri-user-line"
                error={errors.name}
              />
              
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
              
              <div className="space-y-1">
                <TextInput
                  id="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  type="password"
                  required
                  icon="ri-lock-line"
                  error={errors.password}
                />
                
                {password && (
                  <div className="space-y-1 pt-1">
                    <div className="flex h-1 gap-1 rounded-full bg-neutral-200 dark:bg-neutral-700">
                      <div 
                        className={`h-full rounded-full transition-all ${passwordStrength.color}`} 
                        style={{ width: `${(passwordStrength.strength + 1) * 20}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Password strength: <span className="font-medium">{passwordStrength.text}</span>
                    </p>
                  </div>
                )}
              </div>
              
              <TextInput
                id="confirmPassword"
                label="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                type="password"
                required
                icon="ri-lock-line"
                error={errors.confirmPassword}
              />
              
              <SelectInput
                id="role"
                label="Account type"
                value={role}
                onChange={(value) => setRole(value)}
                options={[
                  { value: 'admin', label: 'Administrator' },
                  { value: 'manager', label: 'Property Manager' },
                  { value: 'staff', label: 'Staff Member' },
                ]}
              />
              
              <CheckboxInput
                id="terms"
                label={
                  <span>
                    I agree to the{' '}
                    <button 
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => window.open('/terms', '_blank')}
                    >
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button 
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => window.open('/privacy', '_blank')}
                    >
                      Privacy Policy
                    </button>
                  </span>
                }
                checked={agreeTerms}
                onChange={setAgreeTerms}
                error={errors.agreeTerms}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Creating account...
                  </>
                ) : "Create account"}
              </Button>
            </form>
          </div>
          
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 text-center bg-neutral-50 dark:bg-neutral-800/50">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Already have an account?{' '}
              <button 
                onClick={() => setLocation('/login')}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}