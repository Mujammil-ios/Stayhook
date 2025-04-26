import React, { useState, useEffect } from "react";
import { TextInput } from "../text-input";
import { CheckboxInput } from "../checkbox-input";
import { Button } from "@/components/ui/button";
import { Validators, validateForm, getFieldError, ValidationErrors } from "@/lib/validators";
import { Progress } from "@/components/ui/progress";

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<SignupFormData>;
  isLoading?: boolean;
  onLoginClick?: () => void;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export function SignupForm({ 
  onSubmit, 
  onCancel, 
  initialData,
  isLoading = false,
  onLoginClick
}: SignupFormProps) {
  // Form state
  const [formData, setFormData] = useState<SignupFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: initialData?.password || "",
    confirmPassword: initialData?.confirmPassword || "",
    agreeToTerms: initialData?.agreeToTerms || false,
  });
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // Form validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Calculate password strength
  useEffect(() => {
    calculatePasswordStrength(formData.password);
  }, [formData.password]);

  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback("");
      return;
    }

    let strength = 0;
    let feedback = "";

    // Length check
    if (password.length >= 8) strength += 25;
    
    // Check for numbers
    if (/\d/.test(password)) strength += 25;
    
    // Check for lowercase and uppercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    
    // Check for special chars
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    // Set feedback based on strength
    if (strength <= 25) {
      feedback = "Very Weak";
    } else if (strength <= 50) {
      feedback = "Weak";
    } else if (strength <= 75) {
      feedback = "Good";
    } else {
      feedback = "Strong";
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  };

  // Get strength color based on score
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Validation rules
  const validationRules = {
    name: [
      Validators.required("Full name is required"),
      Validators.minLength(2, "Name must be at least 2 characters"),
    ],
    email: [
      Validators.required("Email is required"),
      Validators.email("Please enter a valid email address"),
    ],
    password: [
      Validators.required("Password is required"),
      Validators.minLength(8, "Password must be at least 8 characters"),
    ],
    confirmPassword: [
      Validators.required("Please confirm your password"),
      Validators.match("password", "Passwords don't match"),
    ],
    agreeToTerms: [
      Validators.custom((value) => Boolean(value), "You must agree to the terms and conditions"),
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
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
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
        id="name"
        label="Full Name"
        value={formData.name}
        onChange={handleChange}
        onBlur={() => handleBlur("name")}
        placeholder="Enter your full name"
        required
        error={getFieldError("name", errors)}
        icon="ri-user-line"
      />

      <TextInput
        id="email"
        label="Email Address"
        value={formData.email}
        onChange={handleChange}
        onBlur={() => handleBlur("email")}
        placeholder="Enter your email address"
        required
        error={getFieldError("email", errors)}
        type="email"
        icon="ri-mail-line"
        autoComplete="email"
      />

      <div className="relative">
        <TextInput
          id="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          onBlur={() => handleBlur("password")}
          placeholder="Create a password"
          required
          error={getFieldError("password", errors)}
          type={showPassword ? "text" : "password"}
          icon="ri-lock-line"
          autoComplete="new-password"
        />
        <button 
          type="button"
          className="absolute right-3 top-9 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          onClick={() => togglePasswordVisibility('password')}
          tabIndex={-1}
        >
          <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line`}></i>
        </button>
        
        {formData.password && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-neutral-500">Password strength:</span>
              <span className={`text-xs font-medium ${
                passwordStrength <= 25 ? 'text-red-500' : 
                passwordStrength <= 50 ? 'text-orange-500' : 
                passwordStrength <= 75 ? 'text-yellow-500' : 
                'text-green-500'
              }`}>{passwordFeedback}</span>
            </div>
            <Progress value={passwordStrength} className="h-1" indicatorClassName={getStrengthColor()} />
          </div>
        )}
      </div>

      <div className="relative">
        <TextInput
          id="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={() => handleBlur("confirmPassword")}
          placeholder="Confirm your password"
          required
          error={getFieldError("confirmPassword", errors)}
          type={showConfirmPassword ? "text" : "password"}
          icon="ri-lock-line"
          autoComplete="new-password"
        />
        <button 
          type="button"
          className="absolute right-3 top-9 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          onClick={() => togglePasswordVisibility('confirmPassword')}
          tabIndex={-1}
        >
          <i className={`ri-${showConfirmPassword ? 'eye-off' : 'eye'}-line`}></i>
        </button>
      </div>

      <CheckboxInput
        id="agreeToTerms"
        label={
          <span>
            I agree to the{" "}
            <a href="#" className="text-primary hover:text-primary-600">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:text-primary-600">
              Privacy Policy
            </a>
          </span>
        }
        checked={formData.agreeToTerms}
        onChange={(checked) => handleCheckboxChange("agreeToTerms", checked)}
        required
        error={getFieldError("agreeToTerms", errors)}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <i className="ri-loader-4-line animate-spin mr-2"></i>
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      {onLoginClick && (
        <div className="text-center mt-4">
          <span className="text-sm text-neutral-500">Already have an account? </span>
          <button 
            type="button" 
            className="text-sm font-medium text-primary hover:text-primary-600"
            onClick={onLoginClick}
          >
            Log in
          </button>
        </div>
      )}
    </form>
  );
}