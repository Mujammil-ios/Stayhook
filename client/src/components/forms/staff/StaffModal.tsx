import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { StaffForm, StaffFormData } from "./StaffForm";
import { useToast } from "@/hooks/use-toast";

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<StaffFormData>;
}

export function StaffModal({ 
  isOpen, 
  onClose, 
  initialData 
}: StaffModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: StaffFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    console.log('Staff form submitted with data:', data);
    
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      
      // Show success toast
      toast({
        title: "Staff member added",
        description: `${data.name} has been added to the staff directory.`,
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
      <h3 className="text-xl font-medium mb-2">Staff Member Added Successfully!</h3>
      <p className="text-neutral-500 mb-4">The staff member has been added to the system.</p>
      <div className="max-w-md mx-auto p-4 border border-green-200 dark:border-green-800 rounded-md bg-green-50 dark:bg-green-900/20 text-left">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">Remember to provide the staff member with their login credentials and access rights information.</p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={success ? () => {} : onClose}
      title={success ? "Success" : "Add Staff Member"}
      size="lg"
      closeOnClickOutside={!isLoading && !success}
    >
      {success ? (
        SuccessView
      ) : (
        <StaffForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialData={initialData}
          isLoading={isLoading}
        />
      )}
    </Modal>
  );
}