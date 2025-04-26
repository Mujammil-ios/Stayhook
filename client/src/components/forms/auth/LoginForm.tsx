import React, { useState, useEffect } from "react";
import { TextInput } from "../text-input";
import { CheckboxInput } from "../checkbox-input";
import { Button } from "@/components/ui/button";
import { Validators, validateForm, getFieldError, ValidationErrors } from "@/lib/validators";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<LoginFormData>;
  isLoading?: boolean;
  onSignupClick?: () => void;
}

export interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export function LoginForm({ 
  onSubmit, 
  onCancel, 
  initialData,
  isLoading = false,
  onSignupClick
}: LoginFormProps) {
  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    username: initialData?.username || "",
    password: initialData?.password || "",
    rememberMe: initialData?.rememberMe || false,
  });
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Form validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation rules
  const validationRules = {
    username: [
      Validators.required("Email or username is required"),
    ],
    password: [
      Validators.required("Password is required"),
    ],
  };

  // Validate on change
  useEffect(() => {
    const validationErrors = validateForm(formData, validationRules);
    
    // Only show errors for fields that have been touched
    const filteredErrors: ValidationErrors = {};
    Object.keys(validationErrors).forEach(field => {
      if (touched[field]) {
        filteredErrors[field] = validationErrors[field];
      }
    });
    
    setErrors(filteredErrors);
  }, [formData, touched]);

  // Handle change for text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle change for checkbox inputs
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Mark field as touched on blur
  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(validationRules).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const validationErrors = validateForm(formData, validationRules);
    setErrors(validationErrors);

    // Submit if no errors
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <TextInput
        id="username"
        label="Email or Username"
        value={formData.username}
        onChange={handleChange}
        onBlur={() => handleBlur("username")}
        placeholder="Enter your email or username"
        required
        error={getFieldError("username", errors)}
        icon="ri-user-line"
        autoComplete="username"
      />

      <div className="relative">
        <TextInput
          id="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          onBlur={() => handleBlur("password")}
          placeholder="Enter your password"
          required
          error={getFieldError("password", errors)}
          type={showPassword ? "text" : "password"}
          icon="ri-lock-line"
          autoComplete="current-password"
        />
        <button 
          type="button"
          className="absolute right-3 top-9 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
        >
          <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line`}></i>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <CheckboxInput
          id="rememberMe"
          label="Remember me"
          checked={formData.rememberMe}
          onChange={(checked) => handleCheckboxChange("rememberMe", checked)}
        />
        
        <a href="#" className="text-sm font-medium text-primary hover:text-primary-600">
          Forgot password?
        </a>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <i className="ri-loader-4-line animate-spin mr-2"></i>
            Logging in...
          </>
        ) : (
          "Log in"
        )}
      </Button>

      {onSignupClick && (
        <div className="text-center mt-4">
          <span className="text-sm text-neutral-500">Don't have an account? </span>
          <button 
            type="button" 
            className="text-sm font-medium text-primary hover:text-primary-600"
            onClick={onSignupClick}
          >
            Sign up
          </button>
        </div>
      )}
    </form>
  );
}