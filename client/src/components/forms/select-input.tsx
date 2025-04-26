import React from "react";
import { FormField } from "./form-field";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string | null;
  className?: string;
  hint?: string;
  disabled?: boolean;
}

export function SelectInput({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  error = null,
  className,
  hint,
  disabled = false,
}: SelectInputProps) {
  return (
    <FormField
      label={label}
      htmlFor={id}
      error={error}
      required={required}
      className={className}
      hint={hint}
    >
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className={cn(
            "w-full",
            error ? "border-destructive focus:ring-destructive" : ""
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}