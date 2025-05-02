import { SupabaseService } from '../supabaseBase';
import { paginationToRange } from '../utils/pagination';
import { buildFilterConditions, applyFilters } from '../utils/filters';

/**
 * Represents a role in the system.
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new role.
 */
export interface CreateRoleInput {
  name: string;
  description?: string;
  permissions: string[];
}

/**
 * Filters for querying roles.
 */
export interface RoleFilters {
  name?: string;
  permissions?: string[];
}

/**
 * Service for managing roles.
 */
export class RolesService extends SupabaseService<Role> {
  /**
   * Creates a new RolesService instance.
   */
  constructor() {
    super('public.roles');
  }

  /**
   * Create a new role.
   * 
   * @param input - Role creation data
   * @returns The created role
   * 
   * @rbac Super Admin only
   */
  async create(input: CreateRoleInput): Promise<Role> {
    const { data, error } = await this.insert(input);
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  /**
   * Get a role by ID.
   * 
   * @param id - The role ID
   * @returns The role or null if not found
   * 
   * @rbac Super Admin, Property Owner (limited to their assigned roles)
   */
  async getById(id: string): Promise<Role | null> {
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
   * List roles with optional filters and pagination.
   * 
   * @param filters - Optional filters to apply
   * @param page - Page number (starts at 1)
   * @param limit - Number of items per page
   * @returns Array of roles
   * 
   * @rbac Super Admin, Property Owner (limited to roles they can assign)
   */
  async list(
    filters?: RoleFilters, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ data: Role[]; count: number }> {
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
   * Update a role by ID.
   * 
   * @param id - The role ID
   * @param payload - The data to update
   * @returns The updated role
   * 
   * @rbac Super Admin only
   */
  async updateById(id: string, payload: Partial<Role>): Promise<Role> {
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
   * Delete a role by ID.
   * 
   * @param id - The role ID to delete
   * 
   * @rbac Super Admin only
   */
  async deleteById(id: string): Promise<void> {
    const { error } = await this.delete({ id });
    
    if (error) {
      throw error;
    }
  }
  
  /**
   * Assign a role to a user.
   * 
   * @param userId - The user ID
   * @param roleId - The role ID
   * 
   * @rbac Super Admin, Property Owner (for their own staff)
   */
  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    const { error } = await this.client
      .from('public.user_roles')
      .insert({ user_id: userId, role_id: roleId });
    
    if (error) {
      throw error;
    }
  }
  
  /**
   * Remove a role from a user.
   * 
   * @param userId - The user ID
   * @param roleId - The role ID
   * 
   * @rbac Super Admin, Property Owner (for their own staff)
   */
  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    const { error } = await this.client
      .from('public.user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId);
    
    if (error) {
      throw error;
    }
  }
  
  /**
   * Get roles for a user.
   * 
   * @param userId - The user ID
   * @returns Array of roles assigned to the user
   * 
   * @rbac Super Admin, Property Owner (for their own staff), Staff (for themselves)
   */
  async getRolesForUser(userId: string): Promise<Role[]> {
    const { data, error } = await this.client
      .from('public.user_roles')
      .select('role:role_id(*)')
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
    
    return data.map((item: any) => item.role);
  }
}

export default new RolesService();