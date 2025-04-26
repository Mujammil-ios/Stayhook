/**
 * Notification Component
 * 
 * A flexible notification component that can be used in various contexts:
 * - Inline alerts and notifications
 * - Status indicators
 * - Banner announcements
 * - Toast notifications (via the toast hook)
 */

import React, { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export type NotificationVariant = 'success' | 'error' | 'warning' | 'info';
export type NotificationSize = 'sm' | 'md' | 'lg';

// Icons mapping for different variants
const ICONS = {
  success: 'ri-check-line',
  error: 'ri-error-warning-line',
  warning: 'ri-alert-line',
  info: 'ri-information-line',
};

// Background colors for different variants
const BG_COLORS = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
};

// Text colors for different variants
const TEXT_COLORS = {
  success: 'text-green-800 dark:text-green-200',
  error: 'text-red-800 dark:text-red-200',
  warning: 'text-amber-800 dark:text-amber-200',
  info: 'text-blue-800 dark:text-blue-200',
};

// Icon wrapper colors for different variants
const ICON_BG_COLORS = {
  success: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200',
  error: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-200',
  warning: 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-200',
  info: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200',
};

// Size classes
const SIZE_CLASSES = {
  sm: 'p-3 text-sm',
  md: 'p-4',
  lg: 'p-5 text-lg',
};

// Icon size classes
const ICON_SIZE_CLASSES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export interface NotificationProps {
  variant?: NotificationVariant;
  title?: string;
  children?: ReactNode;
  message?: string;
  icon?: string | boolean; // custom icon or false to hide
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  size?: NotificationSize;
  timestamp?: string;
  bordered?: boolean;
  elevated?: boolean;
  fullWidth?: boolean;
}

export const Notification = ({
  variant = 'info',
  title,
  children,
  message,
  icon = true,
  dismissible = false,
  onDismiss,
  className,
  size = 'md',
  timestamp,
  bordered = true,
  elevated = false,
  fullWidth = false,
}: NotificationProps) => {
  // Determine the icon to use
  const displayIcon = typeof icon === 'string' 
    ? icon 
    : (icon === true ? ICONS[variant] : '');
  
  return (
    <Alert
      className={cn(
        BG_COLORS[variant],
        TEXT_COLORS[variant],
        SIZE_CLASSES[size],
        bordered ? 'border' : 'border-0',
        elevated ? 'shadow-md' : '',
        fullWidth ? 'w-full' : '',
        'flex items-start',
        className
      )}
    >
      {/* Icon */}
      {displayIcon && (
        <div className={cn(
          'flex-shrink-0 mr-3 rounded-full w-8 h-8 flex items-center justify-center',
          ICON_BG_COLORS[variant]
        )}>
          <i className={cn(displayIcon, ICON_SIZE_CLASSES[size])}></i>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1">
        {title && (
          <AlertTitle className="mb-1 font-medium">{title}</AlertTitle>
        )}
        
        {/* Show either children or message */}
        {children ? (
          children
        ) : message ? (
          <AlertDescription>{message}</AlertDescription>
        ) : null}
        
        {/* Timestamp if provided */}
        {timestamp && (
          <div className="mt-2 text-xs opacity-70">{timestamp}</div>
        )}
      </div>
      
      {/* Dismiss button */}
      {dismissible && onDismiss && (
        <button 
          onClick={onDismiss}
          className="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <i className="ri-close-line"></i>
        </button>
      )}
    </Alert>
  );
};

// Helper function to show a toast notification
export const showNotification = ({
  variant = 'info',
  title,
  message,
  duration,
  ...props
}: NotificationProps & { duration?: number }) => {
  const { toast } = useToast();
  
  toast({
    variant: variant === 'error' ? 'destructive' : 'default',
    title: title,
    description: message,
    duration: duration,
  });
};

export default Notification;