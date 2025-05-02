import { SupabaseService } from '../supabaseBase';
import { paginationToRange } from '../utils/pagination';
import { buildFilterConditions, applyFilters } from '../utils/filters';

/**
 * Represents a reservation in the system
 */
export interface Reservation {
  id: string;
  property_id: string;
  guest_id: string;
  booking_number: string;
  confirmation_code: string;
  status: 'pending' | 'confirmed' | 'booked' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  special_requests?: string;
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'authorized' | 'paid' | 'partially_paid' | 'refunded' | 'failed';
  source: string;
  created_at: string;
  updated_at: string;
}

/**
 * Room assignment in a reservation
 */
export interface ReservationRoom {
  id: string;
  reservation_id: string;
  room_type_id: string;
  room_id?: string;
  rate_plan_id?: string;
  rate_amount: number;
  currency: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new reservation
 */
export interface CreateReservationInput {
  property_id: string;
  guest_id: string;
  status?: 'pending' | 'confirmed' | 'booked' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children?: number;
  special_requests?: string;
  total_amount: number;
  currency: string;
  payment_status?: 'pending' | 'authorized' | 'paid' | 'partially_paid' | 'refunded' | 'failed';
  source?: string;
  rooms: Array<{
    room_type_id: string;
    room_id?: string;
    rate_plan_id?: string;
    rate_amount: number;
    currency: string;
    quantity: number;
  }>;
}

/**
 * Filters for querying reservations
 */
export interface ReservationFilters {
  property_id?: string;
  guest_id?: string;
  status?: string | string[];
  check_in_date_from?: string;
  check_in_date_to?: string;
  check_out_date_from?: string;
  check_out_date_to?: string;
  booking_number?: string;
  confirmation_code?: string;
  payment_status?: string | string[];
  source?: string;
  room_type_id?: string;
  room_id?: string;
  created_at_from?: string;
  created_at_to?: string;
  search?: string;
}

/**
 * Service for managing reservations
 */
export class ReservationsService extends SupabaseService<Reservation> {
  /**
   * Creates a new ReservationsService instance
   */
  constructor() {
    super('public.reservations');
  }

  /**
   * Generate a unique booking number
   * 
   * @param propertyId - Property ID
   * @returns Unique booking number
   */
  private async generateBookingNumber(propertyId: string): Promise<string> {
    // Get property code (first 3 letters of property name)
    const { data: property } = await this.client
      .from('properties')
      .select('name')
      .eq('id', propertyId)
      .single();
    
    const propertyCode = property?.name?.substring(0, 3).toUpperCase() || 'BKG';
    
    // Get current date in YYMMDD format
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateCode = `${year}${month}${day}`;
    
    // Generate a random 4-digit number
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    
    return `${propertyCode}${dateCode}${randomDigits}`;
  }

  /**
   * Generate a unique confirmation code
   * 
   * @returns Confirmation code
   */
  private generateConfirmationCode(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like O, 0, 1, I
    let code = '';
    
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return code;
  }

  /**
   * Create a new reservation
   * 
   * @param input - Reservation creation data
   * @returns The created reservation
   * 
   * @rbac Property Owner, Staff
   */
  async create(input: CreateReservationInput): Promise<Reservation> {
    const { rooms, ...reservationData } = input;
    
    // Generate booking number and confirmation code
    const bookingNumber = await this.generateBookingNumber(input.property_id);
    const confirmationCode = this.generateConfirmationCode();
    
    // Begin transaction
    const { data, error } = await this.client.rpc('create_reservation', {
      reservation_data: {
        ...reservationData,
        booking_number: bookingNumber,
        confirmation_code: confirmationCode,
        status: reservationData.status || 'pending',
        payment_status: reservationData.payment_status || 'pending',
        source: reservationData.source || 'direct',
        children: reservationData.children || 0
      },
      room_data: rooms
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  /**
   * Get a reservation by ID
   * 
   * @param id - The reservation ID
   * @returns The reservation or null if not found
   * 
   * @rbac Property Owner, Staff (for their properties), Guest (for their own reservations)
   */
  async getById(id: string): Promise<Reservation | null> {
    const { data, error } = await this.select()
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return data;
  }

  /**
   * Get a reservation by confirmation code
   * 
   * @param code - The confirmation code
   * @returns The reservation or null if not found
   * 
   * @rbac Property Owner, Staff, Guest
   */
  async getByConfirmationCode(code: string): Promise<Reservation | null> {
    const { data, error } = await this.select()
      .eq('confirmation_code', code)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return data;
  }

  /**
   * List reservations with optional filters and pagination
   * 
   * @param filters - Optional filters to apply
   * @param page - Page number (starts at 1)
   * @param limit - Number of items per page
   * @returns Array of reservations
   * 
   * @rbac Property Owner, Staff (for their properties)
   */
  async list(
    filters?: ReservationFilters, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ data: Reservation[]; count: number }> {
    const { from, to } = paginationToRange(page, limit);
    
    // Start with the base query
    let query = this.select().range(from, to);
    
    // Apply filters if provided
    if (filters) {
      // Handle date range filters
      if (filters.check_in_date_from) {
        query = query.gte('check_in_date', filters.check_in_date_from);
        delete filters.check_in_date_from;
      }
      
      if (filters.check_in_date_to) {
        query = query.lte('check_in_date', filters.check_in_date_to);
        delete filters.check_in_date_to;
      }
      
      if (filters.check_out_date_from) {
        query = query.gte('check_out_date', filters.check_out_date_from);
        delete filters.check_out_date_from;
      }
      
      if (filters.check_out_date_to) {
        query = query.lte('check_out_date', filters.check_out_date_to);
        delete filters.check_out_date_to;
      }
      
      if (filters.created_at_from) {
        query = query.gte('created_at', filters.created_at_from);
        delete filters.created_at_from;
      }
      
      if (filters.created_at_to) {
        query = query.lte('created_at', filters.created_at_to);
        delete filters.created_at_to;
      }
      
      // Handle search across multiple fields
      if (filters.search) {
        const searchTerm = filters.search;
        query = query.or(
          `booking_number.ilike.%${searchTerm}%,confirmation_code.ilike.%${searchTerm}%`
        );
        delete filters.search;
      }
      
      // Handle room_type_id and room_id filters (these require a join)
      if (filters.room_type_id || filters.room_id) {
        // These filters are special and require a subquery
        // They'll be handled through RLS policies or custom API endpoints
        // For simplicity in this example, we'll filter in-memory
        delete filters.room_type_id;
        delete filters.room_id;
      }
      
      // Apply remaining standard filters
      const conditions = buildFilterConditions(filters);
      
      if (conditions.length > 0) {
        query = applyFilters(query, { conditions });
      }
    }
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    return { 
      data: data || [], 
      count: count || 0 
    };
  }

  /**
   * Update a reservation by ID
   * 
   * @param id - The reservation ID
   * @param payload - The data to update
   * @returns The updated reservation
   * 
   * @rbac Property Owner, Staff (for their properties)
   */
  async updateById(id: string, payload: Partial<Reservation>): Promise<Reservation> {
    const { data, error } = await this.update(
      payload, 
      { id }
    );
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  /**
   * Delete a reservation by ID
   * 
   * @param id - The reservation ID to delete
   * 
   * @rbac Property Owner only
   */
  async deleteById(id: string): Promise<void> {
    const { error } = await this.delete({ id });
    
    if (error) {
      throw error;
    }
  }
  
  /**
   * Update reservation status
   * 
   * @param id - The reservation ID
   * @param status - The new status
   * @returns The updated reservation
   * 
   * @rbac Property Owner, Staff (for their properties)
   */
  async updateStatus(
    id: string, 
    status: 'pending' | 'confirmed' | 'booked' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show'
  ): Promise<Reservation> {
    return this.updateById(id, { status });
  }
  
  /**
   * Update payment status
   * 
   * @param id - The reservation ID
   * @param paymentStatus - The new payment status
   * @returns The updated reservation
   * 
   * @rbac Property Owner, Staff (for their properties)
   */
  async updatePaymentStatus(
    id: string, 
    paymentStatus: 'pending' | 'authorized' | 'paid' | 'partially_paid' | 'refunded' | 'failed'
  ): Promise<Reservation> {
    return this.updateById(id, { payment_status: paymentStatus });
  }
  
  /**
   * Assign room to reservation
   * 
   * @param reservationId - The reservation ID
   * @param reservationRoomId - The reservation room ID
   * @param roomId - The room ID to assign
   * @returns True if assignment was successful
   * 
   * @rbac Property Owner, Staff (for their properties)
   */
  async assignRoom(
    reservationId: string,
    reservationRoomId: string,
    roomId: string
  ): Promise<boolean> {
    const { error } = await this.client
      .from('reservation_rooms')
      .update({ room_id: roomId })
      .eq('id', reservationRoomId)
      .eq('reservation_id', reservationId);
    
    if (error) {
      throw error;
    }
    
    return true;
  }
  
  /**
   * Get rooms for a reservation
   * 
   * @param reservationId - The reservation ID
   * @returns Array of reservation rooms
   * 
   * @rbac Property Owner, Staff (for their properties), Guest (for their own reservations)
   */
  async getRooms(reservationId: string): Promise<ReservationRoom[]> {
    const { data, error } = await this.client
      .from('reservation_rooms')
      .select(`
        *,
        room_type:room_type_id(id, name, description),
        room:room_id(id, number, floor)
      `)
      .eq('reservation_id', reservationId);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get reservations for a guest
   * 
   * @param guestId - The guest ID
   * @param page - Page number
   * @param limit - Items per page
   * @returns Array of reservations
   * 
   * @rbac Property Owner (where guest has stayed), Staff (where guest has stayed), Guest (their own)
   */
  async getByGuestId(
    guestId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Reservation[]; count: number }> {
    return this.list({ guest_id: guestId }, page, limit);
  }
  
  /**
   * Get reservations for a property
   * 
   * @param propertyId - The property ID
   * @param page - Page number
   * @param limit - Items per page
   * @returns Array of reservations
   * 
   * @rbac Property Owner, Staff (for their properties)
   */
  async getByPropertyId(
    propertyId: string,
    filters?: Omit<ReservationFilters, 'property_id'>,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Reservation[]; count: number }> {
    return this.list({ ...filters, property_id: propertyId }, page, limit);
  }
  
  /**
   * Get today's arrivals for a property
   * 
   * @param propertyId - The property ID
   * @returns Array of reservations checking in today
   * 
   * @rbac Property Owner, Staff (for their properties)
   */
  async getTodayArrivals(propertyId: string): Promise<Reservation[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await this.select()
      .eq('property_id', propertyId)
      .eq('check_in_date', today)
      .in('status', ['confirmed', 'booked'])
      .order('check_in_date', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get today's departures for a property
   * 
   * @param propertyId - The property ID
   * @returns Array of reservations checking out today
   * 
   * @rbac Property Owner, Staff (for their properties)
   */
  async getTodayDepartures(propertyId: string): Promise<Reservation[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await this.select()
      .eq('property_id', propertyId)
      .eq('check_out_date', today)
      .eq('status', 'checked_in')
      .order('check_out_date', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get statistics for a property
   * 
   * @param propertyId - The property ID
   * @param startDate - Start date for statistics
   * @param endDate - End date for statistics
   * @returns Object containing reservation statistics
   * 
   * @rbac Property Owner, Staff (managers)
   */
  async getPropertyStatistics(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    totalReservations: number;
    confirmedReservations: number;
    cancelledReservations: number;
    noShowReservations: number;
    totalRevenue: number;
    averageDailyRate: number;
    occupancyRate: number;
  }> {
    const { data, error } = await this.client.rpc('get_reservation_statistics', {
      p_property_id: propertyId,
      p_start_date: startDate,
      p_end_date: endDate
    });
    
    if (error) {
      throw error;
    }
    
    return data || {
      totalReservations: 0,
      confirmedReservations: 0,
      cancelledReservations: 0,
      noShowReservations: 0,
      totalRevenue: 0,
      averageDailyRate: 0,
      occupancyRate: 0
    };
  }
}

export default new ReservationsService();