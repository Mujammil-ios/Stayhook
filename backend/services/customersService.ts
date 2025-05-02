import { SupabaseService } from '../supabaseBase';
import { paginationToRange } from '../utils/pagination';
import { buildFilterConditions, applyFilters } from '../utils/filters';

/**
 * Represents a customer in the system.
 */
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  nationality?: string;
  id_type?: string;
  id_number?: string;
  id_image_url?: string;
  photo_url?: string;
  notes?: string;
  tags?: string[];
  vip: boolean;
  blacklisted: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new customer.
 */
export interface CreateCustomerInput {
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  nationality?: string;
  id_type?: string;
  id_number?: string;
  id_image_url?: string;
  photo_url?: string;
  notes?: string;
  tags?: string[];
  vip?: boolean;
  blacklisted?: boolean;
}

/**
 * Filters for querying customers.
 */
export interface CustomerFilters {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  vip?: boolean;
  blacklisted?: boolean;
  tags?: string[];
}

/**
 * Service for managing customers.
 */
export class CustomersService extends SupabaseService<Customer> {
  /**
   * Creates a new CustomersService instance.
   */
  constructor() {
    super('public.customers');
  }

  /**
   * Create a new customer.
   * 
   * @param input - Customer creation data
   * @returns The created customer
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async create(input: CreateCustomerInput): Promise<Customer> {
    const { data, error } = await this.insert({
      ...input,
      vip: input.vip !== undefined ? input.vip : false,
      blacklisted: input.blacklisted !== undefined ? input.blacklisted : false
    });
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  /**
   * Get a customer by ID.
   * 
   * @param id - The customer ID
   * @returns The customer or null if not found
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async getById(id: string): Promise<Customer | null> {
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
   * Find a customer by phone number.
   * 
   * @param phone - The phone number to search for
   * @returns The customer or null if not found
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async getByPhone(phone: string): Promise<Customer | null> {
    const { data, error } = await this.select()
      .eq('phone', phone)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return data;
  }
  
  /**
   * Find a customer by email.
   * 
   * @param email - The email to search for
   * @returns The customer or null if not found
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async getByEmail(email: string): Promise<Customer | null> {
    const { data, error } = await this.select()
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  /**
   * List customers with optional filters and pagination.
   * 
   * @param filters - Optional filters to apply
   * @param page - Page number (starts at 1)
   * @param limit - Number of items per page
   * @returns Array of customers
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async list(
    filters?: CustomerFilters, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ data: Customer[]; count: number }> {
    const { from, to } = paginationToRange(page, limit);
    
    // Build query
    let query = this.select().range(from, to);
    
    // Apply filters if provided
    if (filters) {
      // Handle name search (needs special treatment as it spans multiple columns)
      const nameSearch = filters.name;
      if (nameSearch) {
        query = query.or(`first_name.ilike.%${nameSearch}%,last_name.ilike.%${nameSearch}%`);
        delete filters.name;
      }
      
      // Handle tags filter (needs special treatment as it's an array)
      const tags = filters.tags;
      if (tags && tags.length > 0) {
        // For array containment operations in Supabase
        query = query.contains('tags', tags);
        delete filters.tags;
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
   * Update a customer by ID.
   * 
   * @param id - The customer ID
   * @param payload - The data to update
   * @returns The updated customer
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async updateById(id: string, payload: Partial<Customer>): Promise<Customer> {
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
   * Delete a customer by ID.
   * 
   * @param id - The customer ID to delete
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
   * Set a customer's VIP status.
   * 
   * @param id - The customer ID
   * @param isVip - Whether the customer is a VIP
   * @returns The updated customer
   * 
   * @rbac Super Admin, Property Owner
   */
  async setVipStatus(id: string, isVip: boolean): Promise<Customer> {
    return this.updateById(id, { vip: isVip });
  }
  
  /**
   * Set a customer's blacklisted status.
   * 
   * @param id - The customer ID
   * @param isBlacklisted - Whether the customer is blacklisted
   * @param reason - Optional reason for blacklisting
   * @returns The updated customer
   * 
   * @rbac Super Admin, Property Owner
   */
  async setBlacklistedStatus(
    id: string, 
    isBlacklisted: boolean, 
    reason?: string
  ): Promise<Customer> {
    const updateData: Partial<Customer> = { blacklisted: isBlacklisted };
    
    if (reason) {
      updateData.notes = reason;
    }
    
    return this.updateById(id, updateData);
  }
  
  /**
   * Add tags to a customer.
   * 
   * @param id - The customer ID
   * @param newTags - Array of tags to add
   * @returns The updated customer
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async addTags(id: string, newTags: string[]): Promise<Customer> {
    // Get current customer
    const customer = await this.getById(id);
    
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`);
    }
    
    // Merge and deduplicate tags
    const currentTags = customer.tags || [];
    const uniqueTags = [...new Set([...currentTags, ...newTags])];
    
    // Update customer
    return this.updateById(id, { tags: uniqueTags });
  }
  
  /**
   * Remove tags from a customer.
   * 
   * @param id - The customer ID
   * @param tagsToRemove - Array of tags to remove
   * @returns The updated customer
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async removeTags(id: string, tagsToRemove: string[]): Promise<Customer> {
    // Get current customer
    const customer = await this.getById(id);
    
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`);
    }
    
    // Filter out tags to remove
    const currentTags = customer.tags || [];
    const filteredTags = currentTags.filter(tag => !tagsToRemove.includes(tag));
    
    // Update customer
    return this.updateById(id, { tags: filteredTags });
  }
  
  /**
   * Search for customers by name, email, or phone.
   * 
   * @param searchTerm - The term to search for
   * @param limit - Maximum number of results
   * @returns Array of matching customers
   * 
   * @rbac Super Admin, Property Owner, Staff
   */
  async search(searchTerm: string, limit: number = 10): Promise<Customer[]> {
    const { data, error } = await this.select()
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }
}

export default new CustomersService();