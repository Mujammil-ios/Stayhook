import React from "react";
import { Input } from "@/components/ui/input";
import { FormField } from "./form-field";

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string | null;
  className?: string;
  type?: "text" | "email" | "password" | "tel" | "number";
  hint?: string;
  disabled?: boolean;
  maxLength?: number;
  autoComplete?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  icon?: string;
}

export function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className,
  type = "text",
  hint,
  disabled = false,
  maxLength,
  autoComplete,
  onBlur,
  icon,
}: TextInputProps) {
  return (
    <FormField
      label={label}
      htmlFor={id}
      error={error}
      required={required}
      className={className}
      hint={hint}
    >
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className={`${icon} text-neutral-500`}></i>
          </div>
        )}
        <Input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `error-${id}` : undefined}
          className={icon ? "pl-10" : ""}
        />
      </div>
    </FormField>
  );
}