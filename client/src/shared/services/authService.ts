import { supabaseClient } from '@backend/supabaseClient';

export interface AuthCredentials {
  email: string;
  password: string;
}

export class AuthService {
  async signIn(credentials: AuthCredentials) {
    const { data, error } = await supabaseClient.auth.signInWithPassword(credentials);
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  }

  async getSession() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return data;
  }

  async getUser() {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return data;
  }
}

export const authService = new AuthService(); 