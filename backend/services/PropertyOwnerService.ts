import { supabaseClient } from '../supabaseClient';
import { BaseService } from './BaseService';
import { Database } from '../supabaseClient';

export type PropertyOwner = Database['public']['Tables']['property_owners']['Row'];
export type CreatePropertyOwner = Database['public']['Tables']['property_owners']['Insert'];
export type UpdatePropertyOwner = Database['public']['Tables']['property_owners']['Update'];

export interface PropertyOwnerFilters {
  email?: string;
  role?: PropertyOwner['role'];
  search?: string;
}

export class PropertyOwnerService extends BaseService<'property_owners'> {
  constructor() {
    super(supabaseClient, 'property_owners');
  }

  async createOwner(data: CreatePropertyOwner): Promise<PropertyOwner> {
    return this.create(data);
  }

  async updateOwner(id: string, data: UpdatePropertyOwner): Promise<PropertyOwner> {
    return this.update(id, data);
  }

  async getOwnerById(id: string): Promise<PropertyOwner> {
    return this.getById(id);
  }

  async getAllOwners(): Promise<PropertyOwner[]> {
    return this.getAll();
  }

  async deleteOwner(id: string): Promise<void> {
    return this.delete(id);
  }

  async getOwnersByFilters(filters: PropertyOwnerFilters): Promise<PropertyOwner[]> {
    try {
      let query = this.client.from(this.tableName).select();

      if (filters.email) {
        query = query.eq('email', filters.email);
      }

      if (filters.role) {
        query = query.eq('role', filters.role);
      }

      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data: result, error } = await query;

      if (error) throw error;
      if (!result) throw new Error('No data found');

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }
} 