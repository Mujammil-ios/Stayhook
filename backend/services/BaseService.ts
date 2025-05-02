import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabaseClient';

export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export abstract class BaseService<T extends keyof Database['public']['Tables']> {
  protected readonly client: SupabaseClient<Database>;
  protected readonly tableName: T;

  constructor(client: SupabaseClient<Database>, tableName: T) {
    this.client = client;
    this.tableName = tableName;
  }

  protected async handleError(error: unknown): Promise<never> {
    if (error instanceof Error) {
      throw new ServiceError(error.message, 'UNKNOWN_ERROR', error);
    }
    throw new ServiceError('An unknown error occurred', 'UNKNOWN_ERROR', error);
  }

  protected async create<D extends Database['public']['Tables'][T]['Insert']>(
    data: D
  ): Promise<Database['public']['Tables'][T]['Row']> {
    try {
      const { data: result, error } = await this.client
        .from(this.tableName)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      if (!result) throw new Error('No data returned from insert');

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async update<D extends Database['public']['Tables'][T]['Update']>(
    id: string,
    data: D
  ): Promise<Database['public']['Tables'][T]['Row']> {
    try {
      const { data: result, error } = await this.client
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!result) throw new Error('No data returned from update');

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async getById(id: string): Promise<Database['public']['Tables'][T]['Row']> {
    try {
      const { data: result, error } = await this.client
        .from(this.tableName)
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!result) throw new Error('No data found');

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async getAll(): Promise<Database['public']['Tables'][T]['Row'][]> {
    try {
      const { data: result, error } = await this.client
        .from(this.tableName)
        .select();

      if (error) throw error;
      if (!result) throw new Error('No data found');

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async delete(id: string): Promise<void> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      return this.handleError(error);
    }
  }
} 