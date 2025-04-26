import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { GuestForm, GuestFormData } from "./GuestForm";
import { useToast } from "@/hooks/use-toast";

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<GuestFormData>;
}

export function GuestModal({ 
  isOpen, 
  onClose, 
  initialData 
}: GuestModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: GuestFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    console.log('Guest form submitted with data:', data);
    
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      
      // Show success toast
      toast({
        title: "Guest added successfully",
        description: `${data.name} has been registered as a guest.`,
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
      <h3 className="text-xl font-medium mb-2">Guest Registered Successfully!</h3>
      <p className="text-neutral-500 mb-4">The guest information has been saved to the system.</p>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={success ? () => {} : onClose}
      title={success ? "Success" : "Add New Guest"}
      size="lg"
      closeOnClickOutside={!isLoading && !success}
    >
      {success ? (
        SuccessView
      ) : (
        <GuestForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialData={initialData}
          isLoading={isLoading}
        />
      )}
    </Modal>
  );
}