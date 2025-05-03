import { createClient, SupabaseClient, PostgrestBuilder, PostgrestResponse } from '@supabase/supabase-js';

/**
 * Environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY
 */

export class SupabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'SupabaseError';
  }
}

/**
 * Abstract base class for Supabase services.
 * Provides common functionality for interacting with Supabase.
 */
export abstract class SupabaseService<T = any> {
  protected client: SupabaseClient;
  protected tableName: string;
  private maxRetries = 3;
  private retryDelay = 500; // ms

  /**
   * Creates a new instance of the SupabaseService.
   * @param tableName - The name of the table to operate on.
   */
  constructor(tableName: string) {
    const supabaseUrl = "https://lkpsjrpssibtnqayzubh.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrcHNqcnBzc2lidG5xYXl6dWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjU2MjksImV4cCI6MjA2MTM0MTYyOX0.oI4DuBVTxijKWKlhi1lXAb5SFVAaA6Yag53ZIvggg2M";

    if (!supabaseUrl || !supabaseKey) {
      throw new SupabaseError('Supabase URL or key not found in environment variables');
    }

    this.client = createClient(supabaseUrl, supabaseKey);
    this.tableName = tableName;
  }

  /**
   * Create a select query for the table.
   * @param cols - Optional array of column names to select.
   * @returns A PostgrestBuilder instance for chaining additional query methods.
   */
  protected select<R = T>(cols?: string[]): PostgrestBuilder<R> {
    return this.client
      .from(this.tableName)
      .select(cols?.join(', ') || '*') as PostgrestBuilder<R>;
  }

  /**
   * Insert data into the table.
   * @param payload - The data to insert.
   * @returns A promise that resolves to the PostgrestResponse.
   */
  protected async insert<D = T>(payload: D): Promise<PostgrestResponse<D>> {
    return this.withRetry(() => 
      this.client
        .from(this.tableName)
        .insert(payload)
        .select()
    );
  }

  /**
   * Update data in the table.
   * @param payload - The data to update.
   * @param match - Optional match criteria.
   * @returns A promise that resolves to the PostgrestResponse.
   */
  protected async update<D = Partial<T>>(
    payload: D, 
    match?: Record<string, any>
  ): Promise<PostgrestResponse<D>> {
    let query = this.client
      .from(this.tableName)
      .update(payload);
    
    if (match) {
      Object.entries(match).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    return this.withRetry(() => query.select());
  }

  /**
   * Delete data from the table.
   * @param match - Optional match criteria.
   * @returns A promise that resolves to the PostgrestResponse.
   */
  protected async delete(match?: Record<string, any>): Promise<PostgrestResponse<null>> {
    let query = this.client
      .from(this.tableName)
      .delete();
    
    if (match) {
      Object.entries(match).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    return this.withRetry(() => query);
  }

  /**
   * Execute a function with automatic retries.
   * @param fn - The function to execute.
   * @returns The result of the function.
   * @throws SupabaseError if all retries fail.
   */
  private async withRetry<R>(fn: () => Promise<R>): Promise<R> {
    let lastError: any;
    
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const result = await fn();
        
        // Check for errors in the PostgrestResponse
        if ('error' in result && result.error) {
          throw result.error;
        }
        
        return result;
      } catch (error) {
        lastError = error;
        
        // If this is not the last attempt, wait before retrying
        if (attempt < this.maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * Math.pow(2, attempt)));
        }
      }
    }
    
    throw new SupabaseError(`Failed after ${this.maxRetries} attempts`, lastError);
  }
}