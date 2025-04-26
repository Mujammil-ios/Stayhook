/**
 * BookingModal Component
 * 
 * A modal dialog for creating and editing bookings.
 */

import { useState } from 'react';
import { BookingForm } from './BookingForm';
import { BookingFormData } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const [success, setSuccess] = useState(false);
  
  // Handle successful submission
  const handleSubmitSuccess = () => {
    setSuccess(true);
    
    // Auto-close after delay
    setTimeout(() => {
      setSuccess(false);
      onClose();
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {success 
              ? "Success" 
              : isEditing 
                ? "Edit Booking" 
                : "Create New Booking"}
          </DialogTitle>
        </DialogHeader>
        
        {success ? (
          SuccessView
        ) : (
          <BookingForm
            initialData={initialData}
            onSubmitSuccess={handleSubmitSuccess}
            onCancel={onClose}
            isEditing={isEditing}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default BookingModal;