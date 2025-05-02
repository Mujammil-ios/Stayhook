import { SupabaseService } from '../supabaseBase';
import { paginationToRange } from '../utils/pagination';
import { buildFilterConditions, applyFilters } from '../utils/filters';

/**
 * Represents a property in the system.
 */
export interface Property {
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'boutique' | 'motel' | 'guesthouse' | 'hostel' | 'apartment' | 'villa' | 'other';
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
  star_rating?: number;
  amenities?: string[];
  phone?: string;
  email?: string;
  website?: string;
  check_in_time?: string;
  check_out_time?: string;
  status: 'active' | 'inactive' | 'pending' | 'maintenance';
  owner_id: string;
  featured_image_url?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new property.
 */
export interface CreatePropertyInput {
  name: string;
  type: 'hotel' | 'resort' | 'boutique' | 'motel' | 'guesthouse' | 'hostel' | 'apartment' | 'villa' | 'other';
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
  star_rating?: number;
  amenities?: string[];
  phone?: string;
  email?: string;
  website?: string;
  check_in_time?: string;
  check_out_time?: string;
  owner_id: string;
  featured_image_url?: string;
  images?: string[];
}

/**
 * Filters for querying properties.
 */
export interface PropertyFilters {
  name?: string;
  type?: string;
  city?: string;
  state?: string;
  country?: string;
  status?: string;
  owner_id?: string;
  amenities?: string[];
  star_rating_min?: number;
  star_rating_max?: number;
}

/**
 * Service for managing properties.
 */
export class PropertiesService extends SupabaseService<Property> {
  /**
   * Creates a new PropertiesService instance.
   */
  constructor() {
    super('public.properties');
  }

  /**
   * Create a new property.
   * 
   * @param input - Property creation data
   * @returns The created property
   * 
   * @rbac Super Admin, Property Owner
   */
  async create(input: CreatePropertyInput): Promise<Property> {
    const { data, error } = await this.insert(input);
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  /**
   * Get a property by ID.
   * 
   * @param id - The property ID
   * @returns The property or null if not found
   * 
   * @rbac Super Admin, Property Owner (for their own properties), Staff (for assigned properties)
   */
  async getById(id: string): Promise<Property | null> {
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
   * List properties with optional filters and pagination.
   * 
   * @param filters - Optional filters to apply
   * @param page - Page number (starts at 1)
   * @param limit - Number of items per page
   * @returns Array of properties with count
   * 
   * @rbac Super Admin (all properties), Property Owner (their properties), Staff (assigned properties)
   */
  async list(
    filters?: PropertyFilters, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ data: Property[]; count: number }> {
    const { from, to } = paginationToRange(page, limit);
    
    // Build query
    let query = this.select().range(from, to);
    
    // Apply filters if provided
    if (filters) {
      // Handle special filters
      const starRatingMin = filters.star_rating_min;
      if (starRatingMin !== undefined) {
        query = query.gte('star_rating', starRatingMin);
        delete filters.star_rating_min;
      }
      
      const starRatingMax = filters.star_rating_max;
      if (starRatingMax !== undefined) {
        query = query.lte('star_rating', starRatingMax);
        delete filters.star_rating_max;
      }
      
      // Handle amenities filter (needs special treatment as it's an array)
      const amenities = filters.amenities;
      if (amenities && amenities.length > 0) {
        // For array containment operations in Supabase
        query = query.contains('amenities', amenities);
        delete filters.amenities;
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
   * Update a property by ID.
   * 
   * @param id - The property ID
   * @param payload - The data to update
   * @returns The updated property
   * 
   * @rbac Super Admin, Property Owner (for their own properties)
   */
  async updateById(id: string, payload: Partial<Property>): Promise<Property> {
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
   * Delete a property by ID.
   * 
   * @param id - The property ID to delete
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
   * Add an image to a property.
   * 
   * @param propertyId - The property ID
   * @param imageUrl - The image URL to add
   * @param isFeatured - Whether this is the featured image
   * 
   * @rbac Super Admin, Property Owner (for their own properties)
   */
  async addImage(propertyId: string, imageUrl: string, isFeatured: boolean = false): Promise<void> {
    const property = await this.getById(propertyId);
    
    if (!property) {
      throw new Error(`Property with ID ${propertyId} not found`);
    }
    
    const updateData: Partial<Property> = {};
    
    if (isFeatured) {
      updateData.featured_image_url = imageUrl;
    } else {
      const images = [...(property.images || []), imageUrl];
      updateData.images = images;
    }
    
    await this.updateById(propertyId, updateData);
  }
  
  /**
   * Remove an image from a property.
   * 
   * @param propertyId - The property ID
   * @param imageUrl - The image URL to remove
   * 
   * @rbac Super Admin, Property Owner (for their own properties)
   */
  async removeImage(propertyId: string, imageUrl: string): Promise<void> {
    const property = await this.getById(propertyId);
    
    if (!property) {
      throw new Error(`Property with ID ${propertyId} not found`);
    }
    
    // Handle featured image
    if (property.featured_image_url === imageUrl) {
      await this.updateById(propertyId, { featured_image_url: null });
      return;
    }
    
    // Handle regular images
    if (property.images) {
      const updatedImages = property.images.filter(img => img !== imageUrl);
      await this.updateById(propertyId, { images: updatedImages });
    }
  }
  
  /**
   * Update the status of a property.
   * 
   * @param propertyId - The property ID
   * @param status - The new status
   * 
   * @rbac Super Admin, Property Owner (for their own properties)
   */
  async updateStatus(propertyId: string, status: 'active' | 'inactive' | 'pending' | 'maintenance'): Promise<void> {
    await this.updateById(propertyId, { status });
  }
  
  /**
   * Get properties by owner ID.
   * 
   * @param ownerId - The owner's user ID
   * @param page - Page number
   * @param limit - Items per page
   * @returns Properties owned by the specified user
   * 
   * @rbac Super Admin, Property Owner (their own)
   */
  async getByOwnerId(
    ownerId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Property[]; count: number }> {
    return this.list({ owner_id: ownerId }, page, limit);
  }
}

export default new PropertiesService();