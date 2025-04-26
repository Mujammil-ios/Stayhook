import React from "react";
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
  error = null,
  className,
  hint,
  disabled = false,
  labelClassName,
}: CheckboxInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={cn(
            "h-4 w-4 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-destructive focus:ring-destructive" : ""
          )}
          disabled={disabled}
          required={required}
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
        <label
          htmlFor={id}
          className={cn(
            "ml-3 block text-sm font-medium text-neutral-900 dark:text-neutral-100",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </div>
      
      {(hint || error) && (
        <div className="mt-1 ml-7">
          {error ? (
            <p className="text-xs text-destructive animate-shake">{error}</p>
          ) : hint ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400" id={`${id}-hint`}>{hint}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}