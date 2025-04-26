/**
 * Validation Schemas Index
 * 
 * Export all validation schemas for easier imports
 */

// Form validation schemas
export { default as bookingValidationSchema, availabilityValidationSchema } from './booking.schema';

// Re-export validation utilities
export { 
  Validators, 
  validateField, 
  validateForm, 
  hasErrors, 
  getFieldError 
} from '@/lib/validators';
export type { 
  ValidationRule, 
  FieldValidation, 
  ValidationErrors 
} from '@/lib/validators';