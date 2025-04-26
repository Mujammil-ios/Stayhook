import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// Import all form modals
import { GuestModal } from '@/components/forms/guest/GuestModal';
import { BookingModal } from '@/components/forms/booking/BookingModal';
import { StaffModal } from '@/components/forms/staff/StaffModal';

// Form types supported by the system
export type FormType = 
  | 'addGuest' 
  | 'addBooking' 
  | 'addStaff';

/**
 * Helper function to open any form modal based on a string parameter
 * @param formType The type of form to open
 * @param initialData Optional initial data to pre-populate the form
 * @param onClose Optional callback to execute when the form is closed
 */
export function openForm(formType: FormType, initialData?: any, onClose?: () => void) {
  // Create a temporary DOM element to render the modal into
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.appendChild(modalRoot);

  // Function to remove the element when modal closes
  const removeElement = () => {
    if (onClose) onClose();
    
    // Use ReactDOM.unmountComponentAtNode to properly clean up React before removing the DOM element
    const unmountResult = ReactDOM.unmountComponentAtNode(modalRoot);
    if (unmountResult && modalRoot.parentNode) {
      modalRoot.parentNode.removeChild(modalRoot);
    }
  };

  // Create a wrapper component to handle state
  const ModalWrapper = () => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
      setIsOpen(false);
      removeElement();
    };

    // Render the appropriate modal based on formType
    switch (formType) {
      case 'addGuest':
        return <GuestModal isOpen={isOpen} onClose={handleClose} />;
      
      case 'addBooking':
        return <BookingModal isOpen={isOpen} onClose={handleClose} initialData={initialData} />;
      
      case 'addStaff':
        return <StaffModal isOpen={isOpen} onClose={handleClose} />;
      
      default:
        console.error(`Unknown form type: ${formType}`);
        removeElement();
        return null;
    }
  };

  // Render the modal wrapper into the temporary DOM element
  ReactDOM.render(<ModalWrapper />, modalRoot);
}

// Example usage:
// openForm('addGuest');
// openForm('addBooking', { roomId: '101' });