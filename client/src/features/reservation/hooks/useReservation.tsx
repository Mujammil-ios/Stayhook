import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Reservation } from '@/types';

export interface ReservationFormData {
  customerName: string;
  aadharNo: string;
  mobileNo: string;
  vehicleNo?: string;
  checkInDate: Date;
  checkOutDate: Date;
  travellingFrom: string;
  travellingTo: string;
  maleCount: number;
  femaleCount: number;
  childCount: number;
  address: string;
  nationality: string;
  roomId: number;
  roomType: string;
  roomRate: number;
  additionalGuests?: Array<{
    name: string;
    idNumber: string;
    mobileNo: string;
  }>;
  aadharImage?: File;
  customerPhoto?: File;
  email?: string;
}

export function useReservation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const { toast } = useToast();

  // Function to create a new reservation
  const createReservation = async (formData: ReservationFormData): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call
      // For demo purposes, we create a mock reservation object
      const newReservation: Reservation = {
        id: Math.floor(Math.random() * 10000),
        customerName: formData.customerName,
        aadharNo: formData.aadharNo,
        mobileNo: formData.mobileNo,
        vehicleNo: formData.vehicleNo || '',
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        travellingFrom: formData.travellingFrom,
        travellingTo: formData.travellingTo,
        maleCount: formData.maleCount,
        femaleCount: formData.femaleCount,
        childCount: formData.childCount,
        address: formData.address,
        nationality: formData.nationality,
        roomId: formData.roomId,
        roomType: formData.roomType,
        roomRate: formData.roomRate,
        email: formData.email || '',
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store the created reservation in state
      setCreatedReservation(newReservation);
      
      // Show success toast
      toast({
        title: 'Reservation Created',
        description: `Reservation for ${formData.customerName} has been created successfully.`,
        variant: 'default',
      });
      
      // Open the invoice modal
      setIsInvoiceModalOpen(true);
      
      return true;
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create reservation. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to close the invoice modal
  const closeInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
  };

  // Function to reset the form and state
  const resetForm = () => {
    setCreatedReservation(null);
    setIsInvoiceModalOpen(false);
  };

  return {
    isSubmitting,
    createdReservation,
    isInvoiceModalOpen,
    createReservation,
    closeInvoiceModal,
    resetForm,
  };
}