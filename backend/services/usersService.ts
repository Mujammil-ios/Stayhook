import { SupabaseService } from '../supabaseBase';
import { paginationToRange } from '../utils/pagination';
import { buildFilterConditions, applyFilters } from '../utils/filters';

/**
 * Represents a user in the system.
 */
export interface User {
  id?: number;
  username: string;
  password: string;
  staff_id?: number;
  role: string;
}

/**
 * Input type for creating a new user.
 */
export interface CreateUserInput {
  username: string;
  password: string;
  staff_id?: number;
  role?: string;
}

/**
 * Filters for querying users.
 */
export interface UserFilters {
  username?: string;
  role?: string;
  staff_id?: number;
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
   */
  async create(input: CreateUserInput): Promise<User> {
    // Validate required fields
    if (!input.username) {
      throw new Error('Username is required');
    }
    if (!input.password) {
      throw new Error('Password is required');
    }

    const userData = {
      username: input.username,
      password: input.password,
      role: input.role || 'user', // Default role if not provided
      staff_id: input.staff_id
    };
    
    const { data, error } = await this.insert(userData);
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  /**
   * Get a user by ID.
   * 
   * @param id - The user ID
   * @returns The user or null if not found
   */
  async getById(id: number): Promise<User | null> {
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
   * Get a user by username.
   * 
   * @param username - The user's username
   * @returns The user or null if not found
   */
  async getByUsername(username: string): Promise<User | null> {
    const { data, error } = await this.select()
      .eq('username', username)
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
   */
  async list(
    filters?: UserFilters, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ data: User[]; count: number }> {
    const { from, to } = paginationToRange(page, limit);
    
    // Start with the base query
    let query = this.select().range(from, to);
    
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
   * Update a user by ID.
   * 
   * @param id - The user ID
   * @param payload - The data to update
   * @returns The updated user
   */
  async updateById(id: number, payload: Partial<User>): Promise<User> {
    // First get the current user to ensure we have all required fields
    const currentUser = await this.getById(id);
    if (!currentUser) {
      throw new Error('User not found');
    }

    const updateData = {
      ...currentUser,
      ...payload,
      id // Ensure id is always set
    };
    
    const { data, error } = await this.update(
      updateData, 
      { id }
    );
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  /**
   * Delete a user by ID.
   * 
   * @param id - The user ID to delete
   */
  async deleteById(id: number): Promise<void> {
    const { error } = await this.delete({ id });
    
    if (error) {
      throw error;
    }
  }
}

export default new UsersService();