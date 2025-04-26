import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { PropertyStep1Form, PropertyStep1Data } from "./PropertyStep1Form";
import { useToast } from "@/hooks/use-toast";

interface CreatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePropertyModal({ isOpen, onClose }: CreatePropertyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: PropertyStep1Data) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Log the data to console as required
      console.log('Form submitted with data:', data);
      
      setIsLoading(false);
      setSuccess(true);
      
      // Show success toast
      toast({
        title: "Success!",
        description: "Property details saved successfully.",
        variant: "default",
      });
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  // Success view
  const SuccessView = (
    <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
        <i className="ri-check-line text-3xl text-green-600 dark:text-green-400"></i>
      </div>
      <h3 className="text-xl font-medium mb-2">Property Created Successfully!</h3>
      <p className="text-neutral-500 mb-4">Your property details have been saved.</p>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={success ? () => {} : onClose}
      title={success ? "Success" : "Create New Property"}
      size="lg"
      closeOnClickOutside={!isLoading && !success}
      footer={
        success ? (
          <Button onClick={onClose} className="ml-auto">
            Close
          </Button>
        ) : undefined
      }
    >
      {success ? (
        SuccessView
      ) : (
        <PropertyStep1Form
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      )}
    </Modal>
  );
}