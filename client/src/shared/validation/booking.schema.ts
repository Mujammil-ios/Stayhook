/**
 * Booking Validation Schema
 * 
 * Defines validation rules for booking-related forms.
 */

import { FieldValidation } from "@/lib/validators";

/**
 * Validation schema for booking creation and editing
 */
export const bookingValidationSchema: FieldValidation = {
  guestId: [
    { 
      validate: (value: any) => !!value, 
      message: "Guest selection is required" 
    },
  ],
  roomId: [
    { 
      validate: (value: any) => !!value, 
      message: "Room selection is required" 
    },
  ],
  checkInDate: [
    { 
      validate: (value: any) => !!value, 
      message: "Check-in date is required" 
    },
  ],
  checkOutDate: [
    { 
      validate: (value: any) => !!value, 
      message: "Check-out date is required" 
    },
    {
      validate: (value: any, formData: any) => {
        if (!value || !formData.checkInDate) return true;
        return new Date(value) > new Date(formData.checkInDate);
      },
      message: "Check-out date must be after check-in date"
    }
  ],
  adults: [
    { 
      validate: (value: any) => !!value, 
      message: "Number of adults is required" 
    },
    { 
      validate: (value: any) => /^[1-9][0-9]*$/.test(value), 
      message: "Must be a positive number" 
    },
    { 
      validate: (value: any) => parseInt(value) <= 10, 
      message: "Maximum 10 adults allowed" 
    },
  ],
  children: [
    { 
      validate: (value: any) => /^[0-9]*$/.test(value), 
      message: "Must be a non-negative number" 
    },
    { 
      validate: (value: any) => parseInt(value) <= 6, 
      message: "Maximum 6 children allowed" 
    },
  ],
  totalAmount: [
    { 
      validate: (value: any) => !!value, 
      message: "Total amount is required" 
    },
    { 
      validate: (value: any) => /^\d+(\.\d{1,2})?$/.test(value), 
      message: "Enter a valid amount (e.g., 1999.99)" 
    },
  ],
  amountPaid: [
    { 
      validate: (value: any) => !!value, 
      message: "Amount paid is required" 
    },
    { 
      validate: (value: any) => /^\d+(\.\d{1,2})?$/.test(value), 
      message: "Enter a valid amount (e.g., 1999.99)" 
    },
    {
      validate: (value: any, formData: any) => {
        if (!value || !formData.totalAmount) return true;
        return parseFloat(value) <= parseFloat(formData.totalAmount);
      },
      message: "Amount paid cannot exceed total amount"
    }
  ],
  paymentMethod: [
    { 
      validate: (value: any) => !!value, 
      message: "Payment method is required" 
    },
  ],
  bookingStatus: [
    { 
      validate: (value: any) => !!value, 
      message: "Booking status is required" 
    },
  ],
};

/**
 * Validation schema for availability search
 */
export const availabilityValidationSchema: FieldValidation = {
  checkInDate: [
    { 
      validate: (value: any) => !!value, 
      message: "Check-in date is required" 
    },
  ],
  checkOutDate: [
    { 
      validate: (value: any) => !!value, 
      message: "Check-out date is required" 
    },
    {
      validate: (value: any, formData: any) => {
        if (!value || !formData.checkInDate) return true;
        return new Date(value) > new Date(formData.checkInDate);
      },
      message: "Check-out date must be after check-in date"
    }
  ],
  adults: [
    { 
      validate: (value: any) => !!value, 
      message: "Number of adults is required" 
    },
    { 
      validate: (value: any) => parseInt(value) > 0, 
      message: "At least 1 adult is required" 
    },
  ],
};

export default bookingValidationSchema;