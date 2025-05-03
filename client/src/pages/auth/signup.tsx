import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/authService';

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const result = await authService.signIn({
        email: username,
        password,
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({
        username: 'Failed to create account',
        password: 'Failed to create account'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <Input
                id="username"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                icon="ri-user-line"
                error={errors.username}
              />
              
              <div className="space-y-1">
                <Input
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
              
              <Input
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
                  { value: 'user', label: 'User' },
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
                onClick={() => router.push('/login')}
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