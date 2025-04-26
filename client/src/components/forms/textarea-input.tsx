import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "./form-field";

interface TextareaInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string | null;
  className?: string;
  hint?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export function TextareaInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className,
  hint,
  disabled = false,
  rows = 4,
  maxLength,
  onBlur,
}: TextareaInputProps) {
  return (
    <FormField
      label={label}
      htmlFor={id}
      error={error}
      required={required}
      className={className}
      hint={hint}
    >
      <Textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? `error-${id}` : undefined}
      />
      {maxLength && (
        <div className="text-xs text-neutral-500 mt-1 text-right">
          {value.length}/{maxLength}
        </div>
      )}
    </FormField>
  );
}