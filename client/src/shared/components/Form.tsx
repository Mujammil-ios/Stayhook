/**
 * Form Component
 * 
 * A generic form wrapper built on top of React Hook Form to provide consistent form handling,
 * validation and submission across the application.
 */

import React, { 
  createContext, 
  useContext, 
  useState, 
  ReactNode,
  FormEvent,
  useEffect,
} from 'react';
import { TextInput } from '@/components/forms/text-input';
import { SelectInput, SelectOption } from '@/components/forms/select-input';
import { DatePicker } from '@/components/forms/date-picker';
import { CheckboxInput } from '@/components/forms/checkbox-input';
import { TextareaInput } from '@/components/forms/textarea-input';
import { MultiCheckbox } from '@/components/forms/multi-checkbox';
import { RadioGroup } from '@/components/forms/radio-group';
import { FileUpload } from '@/components/forms/file-upload';
import { FieldGroup } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Validators, FieldValidation, ValidationErrors, validateForm, getFieldError } from '@/lib/validators';

// Form Context Type
interface FormContextProps<T extends Record<string, any>> {
  values: T;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  setValue: (name: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (name: keyof T) => void;
  reset: () => void;
}

// Create context with a generic type parameter
const FormContext = createContext<FormContextProps<any> | undefined>(undefined);

// Custom hook to use form context
export function useForm<T extends Record<string, any>>() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context as FormContextProps<T>;
}

// Form Provider Props
interface FormProviderProps<T extends Record<string, any>> {
  initialValues: T;
  validationSchema?: FieldValidation;
  onSubmit: (values: T) => void;
  children: ReactNode;
}

// Form Provider Component
export function FormProvider<T extends Record<string, any>>({
  initialValues,
  validationSchema = {},
  onSubmit,
  children,
}: FormProviderProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Reset form to initial values
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsDirty(false);
  };
  
  // Set a single form value
  const setValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };
  
  // Update multiple form values at once
  const setFormValues = (newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
    setIsDirty(true);
  };
  
  // Handle input change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setValue(name as keyof T, checked);
    } else {
      setValue(name as keyof T, value);
    }
  };
  
  // Mark field as touched on blur
  const handleBlur = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };
  
  // Validate form on values or touched fields change
  useEffect(() => {
    if (Object.keys(touched).length > 0 && validationSchema) {
      const validationErrors = validateForm(values, validationSchema);
      
      // Only show errors for fields that have been touched
      const filteredErrors: ValidationErrors = {};
      Object.keys(validationErrors).forEach(field => {
        if (touched[field]) {
          filteredErrors[field] = validationErrors[field];
        }
      });
      
      setErrors(filteredErrors);
    }
  }, [values, touched, validationSchema]);
  
  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(validationSchema).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    // Validate all fields
    const validationErrors = validateForm(values, validationSchema);
    setErrors(validationErrors);
    
    // If no errors, submit the form
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Context value
  const contextValue: FormContextProps<T> = {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    setValue,
    setValues: setFormValues,
    handleChange,
    handleBlur,
    reset,
  };
  
  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} noValidate>
        {children}
      </form>
    </FormContext.Provider>
  );
}

// Form Components
export interface FormProps<T extends Record<string, any>> {
  initialValues: T;
  validationSchema?: FieldValidation;
  onSubmit: (values: T) => void;
  children: ReactNode;
}

export function Form<T extends Record<string, any>>(props: FormProps<T>) {
  return <FormProvider<T> {...props} />;
}

// Input Component
interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: string;
  className?: string;
}

export function FormInput({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  icon,
  className,
}: FormInputProps) {
  const { values, handleChange, handleBlur, errors } = useForm();
  
  return (
    <TextInput
      id={name}
      name={name}
      label={label}
      type={type}
      value={values[name] || ''}
      onChange={handleChange}
      onBlur={() => handleBlur(name)}
      placeholder={placeholder}
      required={required}
      error={getFieldError(name, errors)}
      icon={icon}
      className={className}
    />
  );
}

// Select Component
interface FormSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function FormSelect({
  name,
  label,
  options,
  required = false,
  placeholder,
  className,
}: FormSelectProps) {
  const { values, setValue, handleBlur, errors } = useForm();
  
  return (
    <SelectInput
      id={name}
      label={label}
      value={values[name] || ''}
      onChange={(value) => setValue(name, value)}
      options={options}
      required={required}
      placeholder={placeholder}
      error={getFieldError(name, errors)}
      className={className}
    />
  );
}

// Textarea Component
interface FormTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export function FormTextarea({
  name,
  label,
  placeholder,
  required = false,
  rows = 4,
  className,
}: FormTextareaProps) {
  const { values, handleChange, handleBlur, errors } = useForm();
  
  return (
    <TextareaInput
      id={name}
      name={name}
      label={label}
      value={values[name] || ''}
      onChange={handleChange}
      onBlur={() => handleBlur(name)}
      placeholder={placeholder}
      required={required}
      rows={rows}
      error={getFieldError(name, errors)}
      className={className}
    />
  );
}

// Checkbox Component
interface FormCheckboxProps {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
}

export function FormCheckbox({
  name,
  label,
  required = false,
  className,
}: FormCheckboxProps) {
  const { values, setValue, handleBlur, errors } = useForm();
  
  return (
    <CheckboxInput
      id={name}
      name={name}
      label={label}
      checked={values[name] || false}
      onChange={(checked) => setValue(name, checked)}
      onBlur={() => handleBlur(name)}
      required={required}
      error={getFieldError(name, errors)}
      className={className}
    />
  );
}

// Date Picker Component
interface FormDatePickerProps {
  name: string;
  label: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function FormDatePicker({
  name,
  label,
  required = false,
  minDate,
  maxDate,
  className,
}: FormDatePickerProps) {
  const { values, setValue, handleBlur, errors } = useForm();
  
  return (
    <DatePicker
      id={name}
      label={label}
      value={values[name] || null}
      onChange={(date) => setValue(name, date)}
      onBlur={() => handleBlur(name)}
      required={required}
      minDate={minDate}
      maxDate={maxDate}
      error={getFieldError(name, errors)}
      className={className}
    />
  );
}

// Submit Button Component
interface FormSubmitProps {
  label: string;
  loadingLabel?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  icon?: string;
}

export function FormSubmit({
  label,
  loadingLabel = 'Processing...',
  variant = 'default',
  size = 'default',
  className,
  icon,
}: FormSubmitProps) {
  const { isSubmitting } = useForm();
  
  return (
    <Button 
      type="submit" 
      variant={variant} 
      size={size} 
      className={className}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <i className="ri-loader-4-line animate-spin mr-2"></i>
          {loadingLabel}
        </>
      ) : (
        <>
          {icon && <i className={icon}></i>}
          {label}
        </>
      )}
    </Button>
  );
}

// Form Section Component
interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={`mb-6 ${className}`}>
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      {description && <p className="text-sm text-neutral-500 mb-4">{description}</p>}
      {children}
    </div>
  );
}

// Form Actions Component
interface FormActionsProps {
  onCancel?: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  align?: 'left' | 'center' | 'right';
  children?: ReactNode;
}

export function FormActions({
  onCancel,
  cancelLabel = 'Cancel',
  submitLabel = 'Submit',
  align = 'right',
  children,
}: FormActionsProps) {
  const { isSubmitting } = useForm();
  
  const alignmentClass = 
    align === 'left' ? 'justify-start' : 
    align === 'center' ? 'justify-center' : 
    'justify-end';
  
  return (
    <div className={`flex ${alignmentClass} space-x-3 mt-8`}>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
      )}
      
      {children ? children : (
        <FormSubmit label={submitLabel} />
      )}
    </div>
  );
}

// Form Error Summary Component
interface FormErrorSummaryProps {
  title?: string;
  className?: string;
}

export function FormErrorSummary({
  title = 'Please fix the following errors:',
  className,
}: FormErrorSummaryProps) {
  const { errors } = useForm();
  
  if (Object.keys(errors).length === 0) {
    return null;
  }
  
  return (
    <div className={`bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md mb-6 ${className}`}>
      <h4 className="font-medium mb-2">{title}</h4>
      <ul className="list-disc list-inside text-sm">
        {Object.entries(errors).map(([field, messages]) => (
          <li key={field}>
            {messages[0]}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Export a complete Form object with all components
Form.Input = FormInput;
Form.Select = FormSelect;
Form.Textarea = FormTextarea;
Form.Checkbox = FormCheckbox;
Form.DatePicker = FormDatePicker;
Form.Submit = FormSubmit;
Form.Group = FieldGroup;
Form.Section = FormSection;
Form.Actions = FormActions;
Form.ErrorSummary = FormErrorSummary;

export default Form;