/**
 * BookingForm Component
 * 
 * A form for creating and editing bookings using the centralized Form component.
 */

import React, { useEffect, useState } from 'react';
import { Form } from '@/shared/components/Form';
import { roomService, guestService } from '@/shared/services';
import { useBookings } from '../hooks/useBookings';
import { BookingFormData } from '../types';
import { SelectOption } from '@/components/forms/select-input';
import { Notification } from '@/shared/components/Notification';
import { addDays, differenceInDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { UI_CONFIG } from '@/shared/config';

const { CURRENCY } = UI_CONFIG;

// Validation schema for booking form
const bookingValidationSchema = {
  guestId: [
    { validate: (value: any) => !!value, message: "Guest selection is required" },
  ],
  roomId: [
    { validate: (value: any) => !!value, message: "Room selection is required" },
  ],
  adults: [
    { validate: (value: any) => !!value, message: "Number of adults is required" },
    { validate: (value: any) => /^[1-9][0-9]*$/.test(value), message: "Must be a positive number" },
    { validate: (value: any) => parseInt(value) <= 10, message: "Maximum 10 adults allowed" },
  ],
  children: [
    { validate: (value: any) => /^[0-9]*$/.test(value), message: "Must be a non-negative number" },
    { validate: (value: any) => parseInt(value) <= 6, message: "Maximum 6 children allowed" },
  ],
  totalAmount: [
    { validate: (value: any) => !!value, message: "Total amount is required" },
    { validate: (value: any) => /^\d+(\.\d{1,2})?$/.test(value), message: "Enter a valid amount (e.g., 1999.99)" },
  ],
  amountPaid: [
    { validate: (value: any) => !!value, message: "Amount paid is required" },
    { validate: (value: any) => /^\d+(\.\d{1,2})?$/.test(value), message: "Enter a valid amount (e.g., 1999.99)" },
  ],
};

// Payment method options
const paymentMethodOptions: SelectOption[] = [
  { value: "creditCard", label: "Credit Card" },
  { value: "debitCard", label: "Debit Card" },
  { value: "upi", label: "UPI" },
  { value: "netBanking", label: "Net Banking" },
  { value: "cash", label: "Cash" },
];

// Status options
const statusOptions: SelectOption[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checkedIn", label: "Checked In" },
  { value: "checkedOut", label: "Checked Out" },
  { value: "cancelled", label: "Cancelled" },
];

interface BookingFormProps {
  initialData?: Partial<BookingFormData>;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function BookingForm({
  initialData,
  onSubmitSuccess,
  onCancel,
  isEditing = false
}: BookingFormProps) {
  // Set default dates if not provided
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  // State for calculating room rates
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [stayDuration, setStayDuration] = useState(1);
  const [baseAmount, setBaseAmount] = useState(0);
  
  // Fetch booking-related data
  const { createBooking, updateBooking, isCreating, isUpdating } = useBookings();
  
  // Fetch available rooms
  const { data: roomsData } = useQuery({
    queryKey: ['rooms', 'available'],
    queryFn: () => roomService.getByStatus('available'),
  });
  
  // Fetch guests
  const { data: guestsData } = useQuery({
    queryKey: ['guests'],
    queryFn: () => guestService.getAll(),
  });
  
  // Room options - dynamic based on data
  const roomOptions: SelectOption[] = (roomsData?.data || [])
    .map(room => ({
      value: room.id.toString(),
      label: `Room ${room.number} (${room.category}) - ${CURRENCY.SYMBOL}${room.baseRate}/night`
    }));
    
  // Guest options - dynamic based on data
  const guestOptions: SelectOption[] = (guestsData?.data || [])
    .map(guest => ({
      value: guest.id.toString(),
      label: `${guest.firstName} ${guest.lastName}`
    }));
  
  // Form default values
  const defaultValues: BookingFormData = {
    guestId: initialData?.guestId || '',
    roomId: initialData?.roomId || '',
    checkInDate: initialData?.checkInDate || today,
    checkOutDate: initialData?.checkOutDate || tomorrow,
    adults: initialData?.adults || '1',
    children: initialData?.children || '0',
    paymentMethod: initialData?.paymentMethod || 'creditCard',
    totalAmount: initialData?.totalAmount || '',
    taxRate: initialData?.taxRate || '18',
    amountPaid: initialData?.amountPaid || '0',
    bookingStatus: initialData?.bookingStatus || 'pending',
    specialRequests: initialData?.specialRequests || '',
  };
  
  // Handle form submission
  const handleSubmit = (formData: BookingFormData) => {
    if (isEditing && initialData?.roomId) {
      // Update existing booking
      updateBooking({
        id: parseInt(initialData.roomId),
        data: formData as any
      }, {
        onSuccess: () => {
          if (onSubmitSuccess) onSubmitSuccess();
        }
      });
    } else {
      // Create new booking
      createBooking(formData as any, {
        onSuccess: () => {
          if (onSubmitSuccess) onSubmitSuccess();
        }
      });
    }
  };
  
  return (
    <Form
      initialValues={defaultValues}
      validationSchema={bookingValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setValue, errors }) => (
        <>
          <Form.ErrorSummary />
          
          <Form.Section title="Booking Information">
            <Form.Group>
              <Form.Select
                name="guestId"
                label="Select Guest"
                options={guestOptions}
                required
              />
              
              <Form.Select
                name="roomId"
                label="Select Room"
                options={roomOptions}
                required
                onChange={(value) => {
                  setValue('roomId', value);
                  
                  // Find selected room details
                  const room = roomsData?.data?.find(r => r.id.toString() === value);
                  setSelectedRoom(room);
                  
                  // Calculate stay duration and base amount
                  if (room && values.checkInDate && values.checkOutDate) {
                    const checkIn = new Date(values.checkInDate);
                    const checkOut = new Date(values.checkOutDate);
                    
                    const days = Math.max(differenceInDays(checkOut, checkIn), 1);
                    setStayDuration(days);
                    
                    const baseRate = parseFloat(room.baseRate.toString());
                    const calculatedBaseAmount = baseRate * days;
                    setBaseAmount(calculatedBaseAmount);
                    
                    // Calculate total amount with tax
                    const taxRate = parseFloat(values.taxRate) || 0;
                    const taxAmount = (calculatedBaseAmount * taxRate) / 100;
                    const totalAmount = (calculatedBaseAmount + taxAmount).toFixed(2);
                    
                    setValue('totalAmount', totalAmount);
                  }
                }}
              />
            </Form.Group>
            
            <Form.Group>
              <Form.DatePicker
                name="checkInDate"
                label="Check-in Date"
                required
                minDate={new Date()}
                onChange={(date) => {
                  setValue('checkInDate', date);
                  
                  // Ensure check-out is after check-in
                  const checkIn = new Date(date);
                  const checkOut = new Date(values.checkOutDate);
                  
                  if (checkIn >= checkOut) {
                    setValue('checkOutDate', addDays(checkIn, 1));
                  }
                  
                  // Recalculate amount if room is selected
                  if (selectedRoom) {
                    const days = Math.max(differenceInDays(
                      new Date(values.checkOutDate),
                      new Date(date)
                    ), 1);
                    
                    setStayDuration(days);
                    const newBaseAmount = parseFloat(selectedRoom.baseRate) * days;
                    setBaseAmount(newBaseAmount);
                    
                    // Update total with tax
                    const taxRate = parseFloat(values.taxRate) || 0;
                    const taxAmount = (newBaseAmount * taxRate) / 100;
                    const totalAmount = (newBaseAmount + taxAmount).toFixed(2);
                    setValue('totalAmount', totalAmount);
                  }
                }}
              />
              
              <Form.DatePicker
                name="checkOutDate"
                label="Check-out Date"
                required
                minDate={
                  values.checkInDate ? 
                    addDays(new Date(values.checkInDate), 1) : 
                    addDays(new Date(), 1)
                }
                onChange={(date) => {
                  setValue('checkOutDate', date);
                  
                  // Recalculate amount if room is selected
                  if (selectedRoom && values.checkInDate) {
                    const days = Math.max(differenceInDays(
                      new Date(date),
                      new Date(values.checkInDate)
                    ), 1);
                    
                    setStayDuration(days);
                    const newBaseAmount = parseFloat(selectedRoom.baseRate) * days;
                    setBaseAmount(newBaseAmount);
                    
                    // Update total with tax
                    const taxRate = parseFloat(values.taxRate) || 0;
                    const taxAmount = (newBaseAmount * taxRate) / 100;
                    const totalAmount = (newBaseAmount + taxAmount).toFixed(2);
                    setValue('totalAmount', totalAmount);
                  }
                }}
              />
            </Form.Group>
            
            <Form.Group>
              <Form.Input
                name="adults"
                label="Number of Adults"
                type="number"
                required
              />
              
              <Form.Input
                name="children"
                label="Number of Children"
                type="number"
              />
            </Form.Group>
          </Form.Section>
          
          <Form.Section title="Booking Summary">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-md space-y-3">
              {selectedRoom ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">Stay Duration</p>
                    <p className="font-medium">{stayDuration} night(s)</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500">Room Rate</p>
                    <p className="font-medium">
                      {selectedRoom ? 
                        `${CURRENCY.SYMBOL}${selectedRoom.baseRate}/night` : 
                        "Select a room"}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500">Base Amount</p>
                    <p className="font-medium">{CURRENCY.SYMBOL}{baseAmount.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500">Tax Rate</p>
                    <div className="flex items-center">
                      <Form.Input
                        name="taxRate"
                        type="number"
                        className="w-16 h-8 rounded-md mr-2"
                      />
                      <span>%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <Notification
                  variant="info"
                  title="Room Selection Required"
                  message="Please select a room to view pricing details"
                  icon="ri-information-line"
                />
              )}
            </div>
          </Form.Section>
          
          <Form.Section title="Payment Details">
            <Form.Group>
              <Form.Select
                name="paymentMethod"
                label="Payment Method"
                options={paymentMethodOptions}
                required
              />
              
              <Form.Select
                name="bookingStatus"
                label="Booking Status"
                options={statusOptions}
                required
              />
            </Form.Group>
            
            <Form.Group>
              <Form.Input
                name="totalAmount"
                label={`Total Amount (${CURRENCY.SYMBOL})`}
                required
              />
              
              <Form.Input
                name="amountPaid"
                label={`Amount Paid (${CURRENCY.SYMBOL})`}
                required
              />
            </Form.Group>
            
            <Form.Textarea
              name="specialRequests"
              label="Special Requests"
            />
          </Form.Section>
          
          <Form.Actions onCancel={onCancel}>
            <Form.Submit 
              label={isEditing ? "Update Booking" : "Create Booking"} 
              loadingLabel={isEditing ? "Updating..." : "Creating..."} 
              icon="ri-calendar-check-line"
            />
          </Form.Actions>
        </>
      )}
    </Form>
  );
}

export default BookingForm;