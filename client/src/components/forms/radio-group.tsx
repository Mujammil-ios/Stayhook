import React from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  error?: string | null;
  className?: string;
  hint?: string;
  inline?: boolean;
}

export function RadioGroup({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  error = null,
  className,
  hint,
  inline = false,
}: RadioGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between">
        <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </div>
      
      <div className={cn("flex gap-4", inline ? "flex-row flex-wrap" : "flex-col")}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${id}-${option.value}`}
              name={id}
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className={cn(
                "h-4 w-4 border-neutral-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error ? "border-destructive focus:ring-destructive" : ""
              )}
            />
            <label
              htmlFor={`${id}-${option.value}`}
              className="ml-3 block text-sm font-medium text-neutral-900 dark:text-neutral-100"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {(hint || error) && (
        <div className="mt-1">
          {error ? (
            <p className="text-xs text-destructive animate-shake">{error}</p>
          ) : hint ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}