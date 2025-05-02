import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_ANON_KEY
 */

// Define your database types here
export type Database = {
  public: {
    Tables: {
      property_owners: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          created_at: string;
          updated_at: string;
          role: 'owner' | 'admin';
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          created_at?: string;
          updated_at?: string;
          role?: 'owner' | 'admin';
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          created_at?: string;
          updated_at?: string;
          role?: 'owner' | 'admin';
        };
      };
      // Add other tables as needed
    };
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase URL or anonymous key. Authentication may not work properly.');
}

export const supabaseClient: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export default supabaseClient;