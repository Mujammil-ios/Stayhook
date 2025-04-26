import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnClickOutside?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnClickOutside = true,
}: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (firstElement) {
        firstElement.focus();
      }

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener("keydown", handleTabKey);
      return () => document.removeEventListener("keydown", handleTabKey);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        "duration-300 ease-in-out"
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={cn(
          "bg-white dark:bg-neutral-800 rounded-lg shadow-lg w-full",
          "border border-neutral-200 dark:border-neutral-700",
          "bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md",
          "transform transition-all duration-300 ease-in-out",
          sizeClasses[size],
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="ri-close-line text-xl"></i>
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
}