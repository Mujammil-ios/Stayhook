/**
 * useBookings Hook
 * 
 * A custom hook for managing booking data with React Query.
 * Provides methods for fetching, creating, updating, and deleting bookings.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/shared/services';
import { BookingFilterParams, BookingFormData } from '../types';
import { Reservation } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export function useBookings(filterParams?: BookingFilterParams) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Build query key with filter parameters
  const queryKey = filterParams 
    ? ['bookings', filterParams] 
    : ['bookings'];
  
  // Main bookings query
  const bookingsQuery = useQuery({
    queryKey,
    queryFn: () => bookingService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Recent bookings query with limit
  const useRecentBookings = (limit: number = 5) => {
    return useQuery({
      queryKey: ['bookings', 'recent', limit],
      queryFn: () => bookingService.getRecent(limit),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };
  
  // Get a single booking by ID
  const useBooking = (id: number) => {
    return useQuery({
      queryKey: ['bookings', id],
      queryFn: () => bookingService.getById(id),
      enabled: !!id, // Only run if ID is provided
    });
  };
  
  // Create booking mutation
  const createBooking = useMutation({
    mutationFn: (data: BookingFormData) => bookingService.create(data as any),
    onSuccess: () => {
      // Invalidate bookings queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      // Show success toast
      toast({
        title: "Booking Created",
        description: "The booking has been successfully created.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: "Booking Error",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Update booking mutation
  const updateBooking = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Reservation> }) => 
      bookingService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.id] });
      
      // Show success toast
      toast({
        title: "Booking Updated",
        description: "The booking has been successfully updated.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Error",
        description: error.message || "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Delete booking mutation
  const deleteBooking = useMutation({
    mutationFn: (id: number) => bookingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      toast({
        title: "Booking Deleted",
        description: "The booking has been successfully deleted.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Error",
        description: error.message || "Failed to delete booking. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Check availability mutation
  const checkAvailability = useMutation({
    mutationFn: (params: {
      startDate: Date | string;
      endDate: Date | string;
      roomType?: string;
      guestCount?: number;
    }) => bookingService.checkAvailability(params),
  });
  
  return {
    // Queries
    bookings: bookingsQuery.data?.data || [],
    isLoading: bookingsQuery.isLoading,
    isError: bookingsQuery.isError,
    error: bookingsQuery.error,
    
    // Helper hooks
    useRecentBookings,
    useBooking,
    
    // Mutations
    createBooking: createBooking.mutate,
    isCreating: createBooking.isPending,
    
    updateBooking: updateBooking.mutate,
    isUpdating: updateBooking.isPending,
    
    deleteBooking: deleteBooking.mutate,
    isDeleting: deleteBooking.isPending,
    
    checkAvailability: checkAvailability.mutate,
    isCheckingAvailability: checkAvailability.isPending,
    availabilityData: checkAvailability.data?.data,
    
    // Refetch
    refetch: bookingsQuery.refetch,
  };
}

export default useBookings;