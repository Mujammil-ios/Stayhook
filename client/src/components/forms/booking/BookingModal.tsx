import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { BookingForm, BookingFormData } from "./BookingForm";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<BookingFormData>;
  isEditing?: boolean;
}

export function BookingModal({ 
  isOpen, 
  onClose, 
  initialData,
  isEditing = false 
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
        title: isEditing ? "Booking updated" : "Booking created",
        description: isEditing
          ? "The booking has been updated successfully."
          : "The booking has been created successfully.",
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
      <h3 className="text-xl font-medium mb-2">
        {isEditing ? 'Booking Updated Successfully!' : 'Booking Created Successfully!'}
      </h3>
      <p className="text-neutral-500 mb-4">
        {isEditing 
          ? 'The booking details have been updated in the system.' 
          : 'The new booking has been added to the system.'}
      </p>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={success ? () => {} : onClose}
      title={success ? "Success" : isEditing ? "Edit Booking" : "Create New Booking"}
      size="xl"
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