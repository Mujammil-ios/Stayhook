import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { LoginForm, LoginFormData } from "./LoginForm";
import { SignupForm, SignupFormData } from "./SignupForm";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuthContext';
import { onboardingService } from "@/shared/services";

type AuthMode = "login" | "signup";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signup, login } = useAuth();
  const [_, setLocation] = useLocation();

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      console.log('Login form submitted with data:', data);
      
      // Use actual auth context to login
      const result = await login(data.username, data.password);
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
          variant: "default",
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to login",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    
    try {
      console.log('Signup form submitted with data:', data);
      
      // Use actual auth context to sign up
      const result = await signup(data.name, data.email, data.password);
      
      if (result.success) {
        toast({
          title: "Account created successfully",
          description: "Welcome to the Hotel Management System!",
          variant: "default",
        });
        
        // Start onboarding process
        try {
          console.log('Starting onboarding from modal...');
          const onboardingResult = await onboardingService.startOnboarding();
          if (onboardingResult.success) {
            // Navigate to onboarding page and close modal
            setLocation('/onboarding');
          }
        } catch (onboardingError) {
          console.error('Error starting onboarding:', onboardingError);
        }
        
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(prev => prev === "login" ? "signup" : "login");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "login" ? "Log in to your account" : "Create a new account"}
      size="sm"
      closeOnClickOutside={!isLoading}
    >
      {mode === "login" ? (
        <LoginForm
          onSubmit={handleLoginSubmit}
          isLoading={isLoading}
          onSignupClick={switchMode}
        />
      ) : (
        <SignupForm
          onSubmit={handleSignupSubmit}
          isLoading={isLoading}
          onLoginClick={switchMode}
        />
      )}
    </Modal>
  );
}