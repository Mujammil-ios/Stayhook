import { SupabaseService } from '../supabaseBase';
import { paginationToRange } from '../utils/pagination';
import { buildFilterConditions, applyFilters } from '../utils/filters';
import storageService from './storageService';

/**
 * Represents a housekeeping request in the system
 */
export interface HousekeepingRequest {
  id: string;
  property_id: string;
  room_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requested_at: string;
  due_by: string;
  started_at?: string;
  completed_at?: string;
  assigned_to?: string;
  notes?: string;
  issue_type?: string;
  reported_by?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  before_photos?: string[];
  after_photos?: string[];
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new housekeeping request
 */
export interface CreateHousekeepingRequestInput {
  property_id: string;
  room_id: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_by?: string;  // ISO date string
  assigned_to?: string;
  notes?: string;
  issue_type?: string;
  reported_by?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  before_photos?: File[] | string[];
}

/**
 * Filters for querying housekeeping requests
 */
export interface HousekeepingRequestFilters {
  property_id?: string;
  room_id?: string;
  status?: string | string[];
  priority?: string | string[];
  assigned_to?: string;
  issue_type?: string;
  is_recurring?: boolean;
  requested_at_from?: string;
  requested_at_to?: string;
  due_by_from?: string;
  due_by_to?: string;
  completed_at_from?: string;
  completed_at_to?: string;
  search?: string;
}

/**
 * Service for managing housekeeping requests
 */
export class HousekeepingService extends SupabaseService<HousekeepingRequest> {
  /**
   * Creates a new HousekeepingService instance
   */
  constructor() {
    super('public.housekeeping_requests');
  }

  /**
   * Create a new housekeeping request
   * 
   * @param input - Housekeeping request creation data
   * @returns The created housekeeping request
   * 
   * @rbac Property Owner, Staff
   */
  async create(input: CreateHousekeepingRequestInput): Promise<HousekeepingRequest> {
    // Handle file uploads first if any
    let beforePhotos: string[] | undefined;
    
    if (input.before_photos && input.before_photos.length > 0) {
      beforePhotos = await this.uploadPhotos(input.property_id, input.before_photos);
    }
    
    // Prepare request data
    const requestData = {
      property_id: input.property_id,
      room_id: input.room_id,
      status: input.status || 'pending',
      priority: input.priority || 'medium',
      requested_at: new Date().toISOString(),
      due_by: input.due_by || this.calculateDefaultDueBy(),
      assigned_to: input.assigned_to,
      notes: input.notes,
      issue_type: input.issue_type,
      reported_by: input.reported_by,
      is_recurring: input.is_recurring || false,
      recurrence_pattern: input.recurrence_pattern,
      before_photos: beforePhotos
    };
    
    // Create the record
    const { data, error } = await this.insert(requestData);
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }
  
  /**
   * Upload photos for a housekeeping request
   * 
   * @param propertyId - The property ID
   * @param photos - Array of photos to upload
   * @returns Array of photo URLs
   * 
   * @private
   */
  private async uploadPhotos(
    propertyId: string,
    photos: File[] | string[]
  ): Promise<string[]> {
    // If photos are already URLs, just return them
    if (photos.length > 0 && typeof photos[0] === 'string') {
      return photos as string[];
    }
    
    // Upload each photo
    const photoUrls = await Promise.all(
      (photos as File[]).map(async (photo) => {
        const metadata = await storageService.upload(
          'housekeeping-photos',
          photo,
          `${propertyId}/${Date.now()}_${photo.name}`
        );
        
        return metadata.publicUrl;
      })
    );
    
    return photoUrls;
  }
  
  /**
   * Calculate default due by date (3 hours from now for regular cleaning)
   * 
   * @returns ISO date string
   * 
   * @private
   */
  private calculateDefaultDueBy(): string {
    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + 3);
    return dueDate.toISOString();
  }

  /**
   * Get a housekeeping request by ID
   * 
   * @param id - The housekeeping request ID
   * @returns The housekeeping request or null if not found
   * 
   * @rbac Property Owner, Staff
   */
  async getById(id: string): Promise<HousekeepingRequest | null> {
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
   * List housekeeping requests with optional filters and pagination
   * 
   * @param filters - Optional filters to apply
   * @param page - Page number (starts at 1)
   * @param limit - Number of items per page
   * @returns Array of housekeeping requests
   * 
   * @rbac Property Owner, Staff
   */
  async list(
    filters?: HousekeepingRequestFilters, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ data: HousekeepingRequest[]; count: number }> {
    const { from, to } = paginationToRange(page, limit);
    
    // Start with the base query
    let query = this.select()
      .range(from, to);
    
    // Apply filters if provided
    if (filters) {
      // Handle date range filters
      if (filters.requested_at_from) {
        query = query.gte('requested_at', filters.requested_at_from);
        delete filters.requested_at_from;
      }
      
      if (filters.requested_at_to) {
        query = query.lte('requested_at', filters.requested_at_to);
        delete filters.requested_at_to;
      }
      
      if (filters.due_by_from) {
        query = query.gte('due_by', filters.due_by_from);
        delete filters.due_by_from;
      }
      
      if (filters.due_by_to) {
        query = query.lte('due_by', filters.due_by_to);
        delete filters.due_by_to;
      }
      
      if (filters.completed_at_from) {
        query = query.gte('completed_at', filters.completed_at_from);
        delete filters.completed_at_from;
      }
      
      if (filters.completed_at_to) {
        query = query.lte('completed_at', filters.completed_at_to);
        delete filters.completed_at_to;
      }
      
      // Handle search across multiple fields
      if (filters.search) {
        const searchTerm = filters.search;
        query = query.or(`notes.ilike.%${searchTerm}%,issue_type.ilike.%${searchTerm}%`);
        delete filters.search;
      }
      
      // Apply remaining standard filters
      const conditions = buildFilterConditions(filters);
      
      if (conditions.length > 0) {
        query = applyFilters(query, { conditions });
      }
    }
    
    // Add default sorting
    query = query.order('priority', { ascending: false }).order('due_by', { ascending: true });
    
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
   * Update a housekeeping request by ID
   * 
   * @param id - The housekeeping request ID
   * @param payload - The data to update
   * @returns The updated housekeeping request
   * 
   * @rbac Property Owner, Staff
   */
  async updateById(id: string, payload: Partial<HousekeepingRequest>): Promise<HousekeepingRequest> {
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
   * Delete a housekeeping request by ID
   * 
   * @param id - The housekeeping request ID to delete
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
   * Update housekeeping request status
   * 
   * @param id - The housekeeping request ID
   * @param status - The new status
   * @param notes - Optional notes to add
   * @returns The updated housekeeping request
   * 
   * @rbac Property Owner, Staff
   */
  async updateStatus(
    id: string, 
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue',
    notes?: string
  ): Promise<HousekeepingRequest> {
    const now = new Date().toISOString();
    const updateData: Partial<HousekeepingRequest> = { status };
    
    // Add timestamp based on status
    if (status === 'in_progress') {
      updateData.started_at = now;
    } else if (status === 'completed') {
      updateData.completed_at = now;
    }
    
    // Add notes if provided
    if (notes) {
      updateData.notes = notes;
    }
    
    return this.updateById(id, updateData);
  }
  
  /**
   * Assign a housekeeping request to a staff member
   * 
   * @param id - The housekeeping request ID
   * @param staffId - The staff user ID to assign
   * @returns The updated housekeeping request
   * 
   * @rbac Property Owner, Staff (managers)
   */
  async assignToStaff(id: string, staffId: string): Promise<HousekeepingRequest> {
    return this.updateById(id, { assigned_to: staffId });
  }
  
  /**
   * Add "after" photos to a completed housekeeping request
   * 
   * @param id - The housekeeping request ID
   * @param photos - Array of photos
   * @returns The updated housekeeping request
   * 
   * @rbac Staff
   */
  async addAfterPhotos(id: string, photos: File[]): Promise<HousekeepingRequest> {
    // Get the request
    const request = await this.getById(id);
    
    if (!request) {
      throw new Error(`Housekeeping request with ID ${id} not found`);
    }
    
    // Upload the photos
    const photoUrls = await this.uploadPhotos(request.property_id, photos);
    
    // Combine with existing photos if any
    const existingPhotos = request.after_photos || [];
    const allPhotos = [...existingPhotos, ...photoUrls];
    
    // Update the request
    return this.updateById(id, { after_photos: allPhotos });
  }
  
  /**
   * Get all overdue housekeeping requests for a property
   * 
   * @param propertyId - The property ID
   * @returns Array of overdue housekeeping requests
   * 
   * @rbac Property Owner, Staff (managers)
   */
  async getOverdueRequests(propertyId: string): Promise<HousekeepingRequest[]> {
    const now = new Date().toISOString();
    
    const { data, error } = await this.select()
      .eq('property_id', propertyId)
      .eq('status', 'pending')
      .lt('due_by', now)
      .order('priority', { ascending: false })
      .order('due_by', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get all housekeeping requests assigned to a staff member
   * 
   * @param staffId - The staff user ID
   * @param status - Optional status filter
   * @returns Array of housekeeping requests
   * 
   * @rbac Property Owner, Staff (self)
   */
  async getRequestsForStaff(
    staffId: string,
    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue'
  ): Promise<HousekeepingRequest[]> {
    let query = this.select()
      .eq('assigned_to', staffId)
      .order('priority', { ascending: false })
      .order('due_by', { ascending: true });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get all housekeeping requests for a room
   * 
   * @param roomId - The room ID
   * @param limit - Maximum number of requests to return
   * @returns Array of housekeeping requests
   * 
   * @rbac Property Owner, Staff
   */
  async getRequestsForRoom(roomId: string, limit: number = 10): Promise<HousekeepingRequest[]> {
    const { data, error } = await this.select()
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Create recurring housekeeping tasks
   * 
   * @param propertyId - The property ID
   * @param pattern - Recurrence pattern (daily, weekly, etc.)
   * @param roomIds - Array of room IDs to create tasks for
   * @returns Number of tasks created
   * 
   * @rbac Property Owner
   */
  async createRecurringTasks(
    propertyId: string,
    pattern: string,
    roomIds: string[]
  ): Promise<number> {
    const { count, error } = await this.client.rpc('create_recurring_housekeeping_tasks', {
      p_property_id: propertyId,
      p_pattern: pattern,
      p_room_ids: roomIds
    });
    
    if (error) {
      throw error;
    }
    
    return count || 0;
  }
  
  /**
   * Get housekeeping statistics for a property
   * 
   * @param propertyId - The property ID
   * @param startDate - Start date for statistics
   * @param endDate - End date for statistics
   * @returns Object containing housekeeping statistics
   * 
   * @rbac Property Owner, Staff (managers)
   */
  async getPropertyStatistics(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    overdueRequests: number;
    averageCompletionTime: number;
    tasksByPriority: Record<string, number>;
    tasksByStaff: Array<{ staff_id: string; staff_name: string; completed: number; pending: number }>;
  }> {
    const { data, error } = await this.client.rpc('get_housekeeping_statistics', {
      p_property_id: propertyId,
      p_start_date: startDate,
      p_end_date: endDate
    });
    
    if (error) {
      throw error;
    }
    
    return data || {
      totalRequests: 0,
      completedRequests: 0,
      pendingRequests: 0,
      overdueRequests: 0,
      averageCompletionTime: 0,
      tasksByPriority: {},
      tasksByStaff: []
    };
  }
}

export default new HousekeepingService();