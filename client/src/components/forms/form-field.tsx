import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string | null;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
  hint?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  required = false,
  className,
  children,
  hint,
}: FormFieldProps) {
  const id = `error-${htmlFor}`;
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor} className="flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      
      {children}
      
      {hint && !error && (
        <p className="text-sm text-neutral-500">{hint}</p>
      )}
      
      {error && (
        <p
          id={id}
          className="text-sm text-red-500 animate-fadeIn"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function FieldGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {children}
    </div>
  );
}