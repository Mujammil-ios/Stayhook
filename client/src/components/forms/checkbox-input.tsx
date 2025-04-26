import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "./form-field";
import { cn } from "@/lib/utils";

interface CheckboxInputProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  error?: string | null;
  className?: string;
  hint?: string;
  disabled?: boolean;
  labelClassName?: string;
}

export function CheckboxInput({
  id,
  label,
  checked,
  onChange,
  required = false,
  error,
  className,
  hint,
  disabled = false,
  labelClassName,
}: CheckboxInputProps) {
  return (
    <div className={cn("flex items-start space-x-2", className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `error-${id}` : undefined}
        className="mt-1"
      />
      <div className="space-y-1 leading-none">
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {hint && !error && <p className="text-sm text-neutral-500">{hint}</p>}
        {error && (
          <p
            id={`error-${id}`}
            className="text-sm text-red-500 animate-fadeIn"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}