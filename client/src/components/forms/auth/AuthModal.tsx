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

  const handleLoginSubmit = (data: LoginFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    console.log('Login form submitted with data:', data);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: "Welcome back!",
        variant: "default",
      });
      onClose();
    }, 1500);
  };

  const handleSignupSubmit = (data: SignupFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    console.log('Signup form submitted with data:', data);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created successfully",
        description: "Welcome to the Hotel Management System!",
        variant: "default",
      });
      onClose();
    }, 1500);
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