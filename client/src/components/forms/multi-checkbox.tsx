import React from "react";
import { CheckboxInput } from "./checkbox-input";
import { cn } from "@/lib/utils";

export interface CheckboxOption {
  value: string;
  label: string;
}

interface MultiCheckboxProps {
  id: string;
  label: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  required?: boolean;
  error?: string | null;
  className?: string;
  hint?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function MultiCheckbox({
  id,
  label,
  options,
  selectedValues,
  onChange,
  required = false,
  error = null,
  className,
  hint,
  columns = 1,
}: MultiCheckboxProps) {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter(v => v !== value));
    }
  };

  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between">
        <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </div>
      
      <div className={cn("grid gap-x-4 gap-y-2", columnClasses[columns])}>
        {options.map((option) => (
          <CheckboxInput
            key={option.value}
            id={`${id}-${option.value}`}
            label={option.label}
            checked={selectedValues.includes(option.value)}
            onChange={(checked) => handleCheckboxChange(option.value, checked)}
          />
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