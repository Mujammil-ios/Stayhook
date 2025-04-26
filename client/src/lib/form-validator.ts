// Form validation rules and utilities

type ValidationRule = {
  validate: (value: any) => boolean;
  message: string;
};

export type FieldValidation = {
  [key: string]: ValidationRule[];
};

export type ValidationErrors = {
  [key: string]: string[];
};

// Basic validation rules
export const Validators = {
  required: (message = "This field is required"): ValidationRule => ({
    validate: (value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === "string") return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    },
    message,
  }),
  
  minLength: (length: number, message = `Minimum length is ${length} characters`): ValidationRule => ({
    validate: (value) => typeof value === "string" && value.trim().length >= length,
    message,
  }),
  
  maxLength: (length: number, message = `Maximum length is ${length} characters`): ValidationRule => ({
    validate: (value) => typeof value === "string" && value.trim().length <= length,
    message,
  }),
  
  pattern: (pattern: RegExp, message = "Invalid format"): ValidationRule => ({
    validate: (value) => typeof value === "string" && pattern.test(value),
    message,
  }),
  
  email: (message = "Please enter a valid email address"): ValidationRule => ({
    validate: (value) => 
      typeof value === "string" && 
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    message,
  }),
  
  phone: (message = "Please enter a valid phone number"): ValidationRule => ({
    validate: (value) => 
      typeof value === "string" && 
      /^[\d\s\-()+]+$/.test(value) && 
      value.replace(/[^\d]/g, "").length >= 10,
    message,
  }),
  
  numeric: (message = "Please enter a number"): ValidationRule => ({
    validate: (value) => !isNaN(parseFloat(value)) && isFinite(value),
    message,
  }),
  
  integer: (message = "Please enter a whole number"): ValidationRule => ({
    validate: (value) => Number.isInteger(Number(value)),
    message,
  }),
  
  min: (min: number, message = `Minimum value is ${min}`): ValidationRule => ({
    validate: (value) => Number(value) >= min,
    message,
  }),
  
  max: (max: number, message = `Maximum value is ${max}`): ValidationRule => ({
    validate: (value) => Number(value) <= max,
    message,
  }),
  
  match: (field: string, message = "Fields do not match"): ValidationRule => ({
    validate: (value, formData) => value === formData[field],
    message,
  }),
  
  custom: (validatorFn: (value: any) => boolean, message: string): ValidationRule => ({
    validate: validatorFn,
    message,
  }),
  
  gst: (message = "Please enter a valid GST number"): ValidationRule => ({
    validate: (value) => 
      typeof value === "string" && 
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(value),
    message,
  }),
};

// Validate a single field
export function validateField(
  name: string,
  value: any,
  formData: any,
  validations: FieldValidation
): string[] {
  if (!validations[name]) return [];
  
  const errors: string[] = [];
  
  for (const rule of validations[name]) {
    if (!rule.validate(value, formData)) {
      errors.push(rule.message);
    }
  }
  
  return errors;
}

// Validate entire form
export function validateForm(
  formData: any,
  validations: FieldValidation
): ValidationErrors {
  const errors: ValidationErrors = {};
  
  for (const field in validations) {
    const fieldErrors = validateField(field, formData[field], formData, validations);
    if (fieldErrors.length) {
      errors[field] = fieldErrors;
    }
  }
  
  return errors;
}

// Check if form has any errors
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

// Extract first error message for a field (for display)
export function getFieldError(fieldName: string, errors: ValidationErrors): string | null {
  return errors[fieldName] && errors[fieldName].length > 0 ? errors[fieldName][0] : null;
}