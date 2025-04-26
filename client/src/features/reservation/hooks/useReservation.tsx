import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'wouter';
import { Reservation, InsertReservation } from '../../../types';
import { reservationService, invoiceService } from '../../../shared/services';
import { useToast } from '../../../hooks/use-toast';

export interface ReservationFormData {
  // Customer details
  customerName: string;
  aadharNo: string;
  aadharImage?: File;
  mobileNo: string;
  vehicleNo?: string;
  
  // Dates
  checkInDate: Date;
  checkOutDate: Date;
  
  // Travel details
  travellingFrom: string;
  travellingTo: string;
  
  // Guest counts
  maleCount: number;
  femaleCount: number;
  childCount: number;
  
  // Additional details
  customerPhoto?: File;
  address: string;
  nationality: string;
  
  // Room details
  roomId: number;
  roomType: string;
  roomRate: number;
  
  // Additional guests
  additionalGuests: {
    name: string;
    idNumber: string;
    mobileNo: string;
  }[];
}

export function useReservation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);
  const [step, setStep] = useState<'reservation' | 'invoice'>('reservation');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const createReservation = async (formData: ReservationFormData) => {
    setIsSubmitting(true);

    try {
      // Format data for API
      const reservationData: InsertReservation = {
        roomId: formData.roomId,
        guestId: 0, // This would be generated on the backend or should be provided if the guest exists
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        status: 'confirmed',
        totalAmount: calculateTotalAmount(formData),
        paymentStatus: 'pending',
        specialRequests: '',
      };

      // Create the reservation
      const response = await reservationService.create(reservationData);

      if (response.success && response.data) {
        // Store the created reservation
        setCreatedReservation(response.data);
        
        // Navigate to invoice step
        setStep('invoice');
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['/api/reservations'] });
        
        toast({
          title: 'Reservation created',
          description: `Reservation #${response.data.id} has been created successfully.`,
        });
        
        return response.data;
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to create reservation',
          description: response.message || 'An error occurred while creating the reservation.',
        });
        return null;
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred while creating the reservation.',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total amount based on room rate and length of stay
  const calculateTotalAmount = (formData: ReservationFormData): number => {
    const checkInDate = new Date(formData.checkInDate);
    const checkOutDate = new Date(formData.checkOutDate);
    
    // Calculate the difference in days
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Calculate total amount (room rate per night * number of nights)
    return formData.roomRate * (daysDiff || 1); // Ensure at least 1 day
  };

  // Reset the form and navigate back to reservations list
  const resetForm = () => {
    setCreatedReservation(null);
    setStep('reservation');
    navigate('/reservations');
  };

  return {
    isSubmitting,
    createdReservation,
    step,
    createReservation,
    calculateTotalAmount,
    resetForm,
  };
}