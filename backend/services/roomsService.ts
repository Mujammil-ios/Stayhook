import { SupabaseService } from '../supabaseBase';
import { paginationToRange } from '../utils/pagination';
import { buildFilterConditions, applyFilters } from '../utils/filters';

/**
 * Represents a room in the system.
 */
export interface Room {
  id: string;
  property_id: string;
  room_type_id: string;
  number: string;
  floor: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'reserved';
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new room.
 */
export interface CreateRoomInput {
  property_id: string;
  room_type_id: string;
  number: string;
  floor: string;
  status?: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'reserved';
  is_active?: boolean;
  notes?: string;
}

/**
 * Filters for querying rooms.
 */
export interface RoomFilters {
  property_id?: string;
  room_type_id?: string;
  floor?: string;
  status?: string;
  is_active?: boolean;
}

/**
 * Service for managing rooms.
 */
export class RoomsService extends SupabaseService<Room> {
  /**
   * Creates a new RoomsService instance.
   */
  constructor() {
    super('public.rooms');
  }

  /**
   * Create a new room.
   * 
   * @param input - Room creation data
   * @returns The created room
   * 
   * @rbac Super Admin, Property Owner (for their own properties)
   */
  async create(input: CreateRoomInput): Promise<Room> {
    const { data, error } = await this.insert({
      ...input,
      status: input.status || 'available',
      is_active: input.is_active !== undefined ? input.is_active : true
    });
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  /**
   * Get a room by ID.
   * 
   * @param id - The room ID
   * @returns The room or null if not found
   * 
   * @rbac Super Admin, Property Owner (for their own properties), Staff (for assigned properties)
   */
  async getById(id: string): Promise<Room | null> {
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
   * List rooms with optional filters and pagination.
   * 
   * @param filters - Optional filters to apply
   * @param page - Page number (starts at 1)
   * @param limit - Number of items per page
   * @returns Array of rooms
   * 
   * @rbac Super Admin, Property Owner (for their own properties), Staff (for assigned properties)
   */
  async list(
    filters?: RoomFilters, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ data: Room[]; count: number }> {
    const { from, to } = paginationToRange(page, limit);
    
    // Build query
    let query = this.select()
      .range(from, to);
    
    // Apply filters if provided
    if (filters) {
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
   * Update a room by ID.
   * 
   * @param id - The room ID
   * @param payload - The data to update
   * @returns The updated room
   * 
   * @rbac Super Admin, Property Owner (for their own properties), Staff (for assigned properties)
   */
  async updateById(id: string, payload: Partial<Room>): Promise<Room> {
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
   * Delete a room by ID.
   * 
   * @param id - The room ID to delete
   * 
   * @rbac Super Admin, Property Owner (for their own properties)
   */
  async deleteById(id: string): Promise<void> {
    const { error } = await this.delete({ id });
    
    if (error) {
      throw error;
    }
  }
  
  /**
   * Get rooms by property ID.
   * 
   * @param propertyId - The property ID
   * @param filters - Additional filters
   * @param page - Page number
   * @param limit - Items per page
   * @returns Rooms in the property
   * 
   * @rbac Super Admin, Property Owner (for their own properties), Staff (for assigned properties)
   */
  async getByPropertyId(
    propertyId: string,
    filters?: Omit<RoomFilters, 'property_id'>,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Room[]; count: number }> {
    return this.list({ ...filters, property_id: propertyId }, page, limit);
  }
  
  /**
   * Get rooms by room type ID.
   * 
   * @param roomTypeId - The room type ID
   * @param filters - Additional filters
   * @param page - Page number
   * @param limit - Items per page
   * @returns Rooms of the specified type
   * 
   * @rbac Super Admin, Property Owner (for their own properties), Staff (for assigned properties)
   */
  async getByRoomTypeId(
    roomTypeId: string,
    filters?: Omit<RoomFilters, 'room_type_id'>,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Room[]; count: number }> {
    return this.list({ ...filters, room_type_id: roomTypeId }, page, limit);
  }
  
  /**
   * Update room status.
   * 
   * @param id - The room ID
   * @param status - The new status
   * @returns The updated room
   * 
   * @rbac Super Admin, Property Owner (for their own properties), Staff (for assigned properties)
   */
  async updateStatus(
    id: string, 
    status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'reserved'
  ): Promise<Room> {
    return this.updateById(id, { status });
  }
  
  /**
   * Toggle room active status.
   * 
   * @param id - The room ID
   * @param isActive - Whether the room is active
   * @returns The updated room
   * 
   * @rbac Super Admin, Property Owner (for their own properties)
   */
  async toggleActive(id: string, isActive: boolean): Promise<Room> {
    return this.updateById(id, { is_active: isActive });
  }
  
  /**
   * Bulk create rooms.
   * 
   * @param inputs - Array of room data to create
   * @returns Array of created rooms
   * 
   * @rbac Super Admin, Property Owner (for their own properties)
   */
  async bulkCreate(inputs: CreateRoomInput[]): Promise<Room[]> {
    const preparedInputs = inputs.map(input => ({
      ...input,
      status: input.status || 'available',
      is_active: input.is_active !== undefined ? input.is_active : true
    }));
    
    const { data, error } = await this.client
      .from(this.tableName)
      .insert(preparedInputs)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data;
  }
  
  /**
   * Get available rooms for a property.
   * 
   * @param propertyId - The property ID
   * @param page - Page number
   * @param limit - Items per page
   * @returns Available rooms in the property
   * 
   * @rbac Super Admin, Property Owner (for their own properties), Staff (for assigned properties)
   */
  async getAvailableRooms(
    propertyId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Room[]; count: number }> {
    return this.list(
      { 
        property_id: propertyId, 
        status: 'available',
        is_active: true
      }, 
      page, 
      limit
    );
  }
}

export default new RoomsService();