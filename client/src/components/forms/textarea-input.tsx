import React from "react";
import { FormField } from "./form-field";
import { cn } from "@/lib/utils";

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
  error = null,
  className,
  hint,
  disabled = false,
  rows = 4,
  maxLength,
  onBlur,
}: TextareaInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = React.useState(value.length);

  React.useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  return (
    <FormField
      label={label}
      htmlFor={id}
      error={error}
      required={required}
      className={className}
      hint={
        maxLength
          ? `${hint ? hint + " • " : ""}${charCount}/${maxLength} characters`
          : hint
      }
    >
      <textarea
        ref={textareaRef}
        id={id}
        name={id}
        value={value}
        onChange={(e) => {
          onChange(e);
          setCharCount(e.target.value.length);
        }}
        onBlur={onBlur}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-destructive focus:ring-destructive" : ""
        )}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
      />
    </FormField>
  );
}