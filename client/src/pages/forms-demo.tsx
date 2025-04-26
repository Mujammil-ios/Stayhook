import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GuestModal } from '@/components/forms/guest/GuestModal';
import { BookingModal } from '@/components/forms/booking/BookingModal';
import { StaffModal } from '@/components/forms/staff/StaffModal';
import { openForm } from '@/utils/formUtils';

export default function FormsDemo() {
  // Modal visibility state
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Hotel Management System Forms</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          This page demonstrates all the form components available in the Hotel Management System.
          You can open forms either by using the modal components directly or by using the utility function.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Method 1: Direct Modal Components */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Method 1: Direct Modal Components</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            These buttons use state to control the visibility of the modal components.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => setShowGuestModal(true)} 
              className="w-full"
            >
              <i className="ri-user-add-line mr-2"></i>
              Add Guest
            </Button>
            <Button 
              onClick={() => setShowBookingModal(true)} 
              className="w-full"
              variant="secondary"
            >
              <i className="ri-calendar-check-line mr-2"></i>
              New Booking
            </Button>
            <Button 
              onClick={() => setShowStaffModal(true)} 
              className="w-full"
              variant="outline"
            >
              <i className="ri-user-star-line mr-2"></i>
              Add Staff Member
            </Button>
          </div>
        </div>

        {/* Method 2: Utility Function */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Method 2: Utility Function</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            These buttons use the openForm utility function to create and render the modals on demand.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => openForm('addGuest')} 
              className="w-full"
            >
              <i className="ri-user-add-line mr-2"></i>
              Add Guest (Utility)
            </Button>
            <Button 
              onClick={() => openForm('addBooking')} 
              className="w-full"
              variant="secondary"
            >
              <i className="ri-calendar-check-line mr-2"></i>
              New Booking (Utility)
            </Button>
            <Button 
              onClick={() => openForm('addStaff')} 
              className="w-full"
              variant="outline"
            >
              <i className="ri-user-star-line mr-2"></i>
              Add Staff (Utility)
            </Button>
          </div>
        </div>
      </div>

      {/* Modal components (controlled by state) */}
      <GuestModal 
        isOpen={showGuestModal} 
        onClose={() => setShowGuestModal(false)} 
      />
      
      <BookingModal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)} 
      />
      
      <StaffModal 
        isOpen={showStaffModal} 
        onClose={() => setShowStaffModal(false)} 
      />
    </div>
  );
}