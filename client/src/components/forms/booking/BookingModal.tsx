import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { BookingForm, BookingFormData } from "./BookingForm";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<BookingFormData>;
}

export function BookingModal({ 
  isOpen, 
  onClose, 
  initialData 
}: BookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: BookingFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    console.log('Booking form submitted with data:', data);
    
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      
      // Show success toast
      toast({
        title: "Booking confirmed",
        description: `Booking for Room ${data.roomId} has been confirmed.`,
        variant: "default",
      });
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 1500);
  };

  // Success view
  const SuccessView = (
    <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
        <i className="ri-check-line text-3xl text-green-600 dark:text-green-400"></i>
      </div>
      <h3 className="text-xl font-medium mb-2">Booking Confirmed Successfully!</h3>
      <p className="text-neutral-500 mb-4">The booking has been confirmed and added to the system.</p>
      <div className="max-w-md mx-auto p-4 border border-green-200 dark:border-green-800 rounded-md bg-green-50 dark:bg-green-900/20 text-left">
        <h4 className="font-medium text-sm mb-2">Booking Reference: <span className="font-bold">BK-{Math.floor(Math.random() * 10000)}</span></h4>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">A confirmation has been sent to the guest's email address and mobile number.</p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={success ? () => {} : onClose}
      title={success ? "Success" : "Confirm Booking"}
      size="lg"
      closeOnClickOutside={!isLoading && !success}
    >
      {success ? (
        SuccessView
      ) : (
        <BookingForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialData={initialData}
          isLoading={isLoading}
        />
      )}
    </Modal>
  );
}