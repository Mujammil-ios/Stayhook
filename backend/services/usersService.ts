import { SupabaseService } from '../supabaseBase';
import { paginationToRange } from '../utils/pagination';
import { buildFilterConditions, applyFilters } from '../utils/filters';

/**
 * Represents a user in the system.
 */
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  avatar_url?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new user.
 */
export interface CreateUserInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  avatar_url?: string;
}

/**
 * Filters for querying users.
 */
export interface UserFilters {
  email?: string;
  name?: string;
  is_active?: boolean;
  role_id?: string;
  property_id?: string;
}

/**
 * Service for managing users.
 */
export class UsersService extends SupabaseService<User> {
  /**
   * Creates a new UsersService instance.
   */
  constructor() {
    super('public.users');
  }

  /**
   * Create a new user.
   * 
   * @param input - User creation data
   * @returns The created user
   * 
   * @rbac Super Admin can create any user, Property Owner can create staff users
   */
  async create(input: CreateUserInput): Promise<User> {
    // First create the auth user
    const { data: authData, error: authError } = await this.client.auth.admin.createUser({
      email: input.email,
      password: input.password,
      user_metadata: {
        first_name: input.first_name,
        last_name: input.last_name
      }
    });
    
    if (authError) {
      throw authError;
    }
    
    // Then create the app user record
    const userData = {
      id: authData.user.id,
      email: input.email,
      first_name: input.first_name,
      last_name: input.last_name,
      phone_number: input.phone_number,
      avatar_url: input.avatar_url,
      is_active: true
    };
    
    const { data, error } = await this.insert(userData);
    
    if (error) {
      // If there's an error, try to clean up the auth user
      await this.client.auth.admin.deleteUser(authData.user.id);
      throw error;
    }
    
    return data[0];
  }

  /**
   * Get a user by ID.
   * 
   * @param id - The user ID
   * @returns The user or null if not found
   * 
   * @rbac Super Admin, Property Owner (for their staff), User (their own profile)
   */
  async getById(id: string): Promise<User | null> {
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
   * Get a user by email.
   * 
   * @param email - The user's email
   * @returns The user or null if not found
   * 
   * @rbac Super Admin, Property Owner
   */
  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.select()
      .eq('email', email)
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
   * List users with optional filters and pagination.
   * 
   * @param filters - Optional filters to apply
   * @param page - Page number (starts at 1)
   * @param limit - Number of items per page
   * @returns Array of users
   * 
   * @rbac Super Admin (all users), Property Owner (their staff)
   */
  async list(
    filters?: UserFilters, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ data: User[]; count: number }> {
    const { from, to } = paginationToRange(page, limit);
    
    // Start with the base query
    let query = this.select().range(from, to);
    
    // Handle special filters
    if (filters) {
      // Handle name search (needs special treatment as it spans multiple columns)
      const nameSearch = filters.name;
      if (nameSearch) {
        query = query.or(`first_name.ilike.%${nameSearch}%,last_name.ilike.%${nameSearch}%`);
        delete filters.name;
      }
      
      // Handle role filter (needs a join)
      const roleId = filters.role_id;
      if (roleId) {
        query = query.eq('user_roles.role_id', roleId);
        delete filters.role_id;
      }
      
      // Handle property filter (needs a join)
      const propertyId = filters.property_id;
      if (propertyId) {
        query = query.eq('user_properties.property_id', propertyId);
        delete filters.property_id;
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
   * Update a user by ID.
   * 
   * @param id - The user ID
   * @param payload - The data to update
   * @returns The updated user
   * 
   * @rbac Super Admin, Property Owner (for their staff), User (their own profile)
   */
  async updateById(id: string, payload: Partial<User>): Promise<User> {
    // If updating email, need to update auth user as well
    if (payload.email) {
      const { error: authError } = await this.client.auth.admin.updateUserById(
        id,
        { email: payload.email }
      );
      
      if (authError) {
        throw authError;
      }
    }
    
    // Update user record
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
   * Deactivate a user (soft delete).
   * 
   * @param id - The user ID to deactivate
   * 
   * @rbac Super Admin, Property Owner (for their staff)
   */
  async deactivateById(id: string): Promise<void> {
    // Disable the auth user
    const { error: authError } = await this.client.auth.admin.updateUserById(
      id,
      { banned: true }
    );
    
    if (authError) {
      throw authError;
    }
    
    // Update the app user
    const { error } = await this.update(
      { is_active: false }, 
      { id }
    );
    
    if (error) {
      throw error;
    }
  }
  
  /**
   * Reactivate a user.
   * 
   * @param id - The user ID to reactivate
   * 
   * @rbac Super Admin, Property Owner (for their staff)
   */
  async reactivateById(id: string): Promise<void> {
    // Re-enable the auth user
    const { error: authError } = await this.client.auth.admin.updateUserById(
      id,
      { banned: false }
    );
    
    if (authError) {
      throw authError;
    }
    
    // Update the app user
    const { error } = await this.update(
      { is_active: true }, 
      { id }
    );
    
    if (error) {
      throw error;
    }
  }
  
  /**
   * Delete a user completely (hard delete).
   * 
   * @param id - The user ID to delete
   * 
   * @rbac Super Admin only
   */
  async deleteById(id: string): Promise<void> {
    // Delete the auth user first
    const { error: authError } = await this.client.auth.admin.deleteUser(id);
    
    if (authError) {
      throw authError;
    }
    
    // Delete the app user
    const { error } = await this.delete({ id });
    
    if (error) {
      throw error;
    }
  }
  
  /**
   * Assign a user to a property.
   * 
   * @param userId - The user ID
   * @param propertyId - The property ID
   * 
   * @rbac Super Admin, Property Owner (their own properties)
   */
  async assignUserToProperty(userId: string, propertyId: string): Promise<void> {
    const { error } = await this.client
      .from('public.user_properties')
      .insert({ user_id: userId, property_id: propertyId });
    
    if (error) {
      throw error;
    }
  }
  
  /**
   * Remove a user from a property.
   * 
   * @param userId - The user ID
   * @param propertyId - The property ID
   * 
   * @rbac Super Admin, Property Owner (their own properties)
   */
  async removeUserFromProperty(userId: string, propertyId: string): Promise<void> {
    const { error } = await this.client
      .from('public.user_properties')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);
    
    if (error) {
      throw error;
    }
  }
  
  /**
   * Get properties for a user.
   * 
   * @param userId - The user ID
   * @returns Array of property IDs the user is assigned to
   * 
   * @rbac Super Admin, Property Owner (for their staff), Staff (for themselves)
   */
  async getPropertiesForUser(userId: string): Promise<string[]> {
    const { data, error } = await this.client
      .from('public.user_properties')
      .select('property_id')
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
    
    return data.map((item: any) => item.property_id);
  }
}

export default new UsersService();