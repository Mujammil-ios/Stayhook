import React from "react";
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
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-neutral-900 dark:text-neutral-100"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </div>

      {children}

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

export function FieldGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      {children}
    </div>
  );
}