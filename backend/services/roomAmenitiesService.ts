import { SupabaseService } from '../supabaseBase';
import { paginationToRange } from '../utils/pagination';
import { buildFilterConditions, applyFilters } from '../utils/filters';

/**
 * Represents a room amenity in the system.
 */
export interface RoomAmenity {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new room amenity.
 */
export interface CreateRoomAmenityInput {
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  is_active?: boolean;
}

/**
 * Filters for querying room amenities.
 */
export interface RoomAmenityFilters {
  name?: string;
  category?: string;
  is_active?: boolean;
}

/**
 * Service for managing room amenities.
 */
export class RoomAmenitiesService extends SupabaseService<RoomAmenity> {
  /**
   * Creates a new RoomAmenitiesService instance.
   */
  constructor() {
    super('public.room_amenities');
  }

  /**
   * Create a new room amenity.
   * 
   * @param input - Room amenity creation data
   * @returns The created room amenity
   * 
   * @rbac Super Admin, Property Owner
   */
  async create(input: CreateRoomAmenityInput): Promise<RoomAmenity> {
    const { data, error } = await this.insert({
      ...input,
      is_active: input.is_active !== undefined ? input.is_active : true
    });
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  /**
   * Get a room amenity by ID.
   * 
   * @param id - The room amenity ID
   * @returns The room amenity or null if not found
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async getById(id: string): Promise<RoomAmenity | null> {
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
   * List room amenities with optional filters and pagination.
   * 
   * @param filters - Optional filters to apply
   * @param page - Page number (starts at 1)
   * @param limit - Number of items per page
   * @returns Array of room amenities
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async list(
    filters?: RoomAmenityFilters, 
    page: number = 1, 
    limit: number = 50
  ): Promise<{ data: RoomAmenity[]; count: number }> {
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
   * Update a room amenity by ID.
   * 
   * @param id - The room amenity ID
   * @param payload - The data to update
   * @returns The updated room amenity
   * 
   * @rbac Super Admin, Property Owner
   */
  async updateById(id: string, payload: Partial<RoomAmenity>): Promise<RoomAmenity> {
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
   * Delete a room amenity by ID.
   * 
   * @param id - The room amenity ID to delete
   * 
   * @rbac Super Admin, Property Owner
   */
  async deleteById(id: string): Promise<void> {
    const { error } = await this.delete({ id });
    
    if (error) {
      throw error;
    }
  }
  
  /**
   * Toggle room amenity active status.
   * 
   * @param id - The room amenity ID
   * @param isActive - Whether the amenity is active
   * @returns The updated room amenity
   * 
   * @rbac Super Admin, Property Owner
   */
  async toggleActive(id: string, isActive: boolean): Promise<RoomAmenity> {
    return this.updateById(id, { is_active: isActive });
  }
  
  /**
   * Get room amenities by category.
   * 
   * @param category - The category name
   * @param isActive - Filter by active status
   * @returns Amenities in the specified category
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async getByCategory(
    category: string,
    isActive: boolean = true
  ): Promise<RoomAmenity[]> {
    const { data, error } = await this.select()
      .eq('category', category)
      .eq('is_active', isActive);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get all room amenity categories.
   * 
   * @returns Array of unique category names
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async getCategories(): Promise<string[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('category')
      .not('category', 'is', null)
      .order('category');
    
    if (error) {
      throw error;
    }
    
    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category))];
    
    return categories;
  }
  
  /**
   * Assign amenities to a room type.
   * 
   * @param roomTypeId - The room type ID
   * @param amenityIds - Array of amenity IDs to assign
   * 
   * @rbac Super Admin, Property Owner
   */
  async assignToRoomType(roomTypeId: string, amenityIds: string[]): Promise<void> {
    // Create array of room type amenity entries
    const entries = amenityIds.map(amenityId => ({
      room_type_id: roomTypeId,
      amenity_id: amenityId
    }));
    
    // Delete existing entries first
    await this.client
      .from('public.room_type_amenities')
      .delete()
      .eq('room_type_id', roomTypeId);
    
    // Insert new entries
    const { error } = await this.client
      .from('public.room_type_amenities')
      .insert(entries);
    
    if (error) {
      throw error;
    }
  }
  
  /**
   * Get amenities for a room type.
   * 
   * @param roomTypeId - The room type ID
   * @returns Array of amenities assigned to the room type
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async getForRoomType(roomTypeId: string): Promise<RoomAmenity[]> {
    const { data, error } = await this.client
      .from('public.room_type_amenities')
      .select('amenity:amenity_id(*)')
      .eq('room_type_id', roomTypeId);
    
    if (error) {
      throw error;
    }
    
    return data.map((item: any) => item.amenity);
  }
}

export default new RoomAmenitiesService();