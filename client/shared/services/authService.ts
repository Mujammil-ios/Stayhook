import { supabaseClient } from '@/lib/supabaseClient';

export interface AuthCredentials {
  email: string;
  password: string;
}

export class AuthService {
  async signIn(credentials: AuthCredentials) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

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
    return data.session;
  }

  async getUser() {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return data.user;
  }
}

export const authService = new AuthService(); 