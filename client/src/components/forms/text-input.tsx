import React from "react";
import { FormField } from "./form-field";
import { cn } from "@/lib/utils";

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  name?: string;  // Make name optional with default to id
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
  onBlur?: (() => void) | ((e: React.FocusEvent<HTMLInputElement>) => void);
  icon?: string;
}

export function TextInput({
  id,
  label,
  value,
  name,
  onChange,
  placeholder,
  required = false,
  error = null,
  className,
  type = "text",
  hint,
  disabled = false,
  maxLength,
  autoComplete,
  onBlur,
  icon,
}: TextInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

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
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className={`${icon} text-neutral-500`}></i>
          </div>
        )}
        <input
          ref={inputRef}
          id={id}
          name={name || id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-destructive focus:ring-destructive" : "",
            icon ? "pl-10" : ""
          )}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
        />
      </div>
    </FormField>
  );
}