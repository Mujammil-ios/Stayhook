import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  id: string;
  label: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  required?: boolean;
  error?: string | null;
  className?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  id,
  label,
  value,
  onChange,
  required = false,
  error = null,
  className,
  hint,
  placeholder = "Select date",
  disabled = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setIsOpen(false);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[role="dialog"]')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium text-neutral-900 dark:text-neutral-100"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            id={id}
            variant="outline"
            size="sm"
            className={cn(
              "w-full justify-start text-left font-normal border h-10",
              "hover:bg-transparent",
              !value && "text-muted-foreground",
              error ? "border-destructive focus-visible:ring-destructive" : "",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            disabled={disabled}
            onClick={() => setIsOpen(true)}
          >
            <i className="ri-calendar-line mr-2 h-4 w-4"></i>
            {value ? format(value, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            disabled={disabled || ((date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            })}
            initialFocus
          />
        </PopoverContent>
      </Popover>

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