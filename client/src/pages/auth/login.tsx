import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TextInput } from '@/components/forms/text-input';
import { CheckboxInput } from '@/components/forms/checkbox-input';

import { authService } from '@/services/authService';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{username?: string; password?: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const { user, session } = await authService.signIn({
        email: username,
        password,
      });

      if (user && session) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        username: 'Invalid username or password',
        password: 'Invalid username or password'
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
                id="username"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                icon="ri-user-line"
                error={errors.username}
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
                  onClick={() => router.push('/forgot-password')}
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
                onClick={() => router.push('/signup')}
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