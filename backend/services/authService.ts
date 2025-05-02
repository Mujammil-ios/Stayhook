import { SupabaseClient, createClient, User, Session, Provider } from '@supabase/supabase-js';
import { SupabaseError } from '../supabaseBase';
import { z } from 'zod';

/**
 * Auth credentials for email/password login
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * User profile information
 */
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

/**
 * Staff invitation data
 */
export interface StaffInvitation {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  propertyId?: string;
  expiresAt: Date;
}

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const signupSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phoneNumber: z.string().optional(),
  inviteToken: z.string().optional()
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

/**
 * Service for handling authentication with Supabase Auth
 */
export class AuthService {
  private client: SupabaseClient;
  private refreshTimerId: NodeJS.Timeout | null = null;

  /**
   * Creates a new AuthService instance
   */
  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new SupabaseError('Supabase URL or key not found in environment variables');
    }

    this.client = createClient(supabaseUrl, supabaseKey);
    this.setupSessionRefresh();
  }

  /**
   * Set up automatic session refresh
   */
  private setupSessionRefresh(): void {
    const refreshSession = async () => {
      const { data, error } = await this.client.auth.refreshSession();
      
      if (error) {
        console.error('Failed to refresh session:', error);
        return;
      }
      
      const expiresIn = this.calculateSessionExpiry(data.session);
      
      if (expiresIn) {
        // Schedule next refresh for 5 minutes before expiry
        const refreshDelay = Math.max(0, expiresIn - 5 * 60 * 1000);
        this.refreshTimerId = setTimeout(refreshSession, refreshDelay);
      }
    };
    
    // Initial session check
    this.client.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        return;
      }
      
      const expiresIn = this.calculateSessionExpiry(data.session);
      
      if (expiresIn) {
        // Schedule refresh for 5 minutes before expiry
        const refreshDelay = Math.max(0, expiresIn - 5 * 60 * 1000);
        this.refreshTimerId = setTimeout(refreshSession, refreshDelay);
      }
    });
    
    // Listen for auth state changes
    this.client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const expiresIn = this.calculateSessionExpiry(session);
        
        if (expiresIn && this.refreshTimerId) {
          clearTimeout(this.refreshTimerId);
          
          // Schedule refresh for 5 minutes before expiry
          const refreshDelay = Math.max(0, expiresIn - 5 * 60 * 1000);
          this.refreshTimerId = setTimeout(refreshSession, refreshDelay);
        }
      } else if (event === 'SIGNED_OUT' && this.refreshTimerId) {
        clearTimeout(this.refreshTimerId);
        this.refreshTimerId = null;
      }
    });
  }

  /**
   * Calculate session expiry time in milliseconds
   */
  private calculateSessionExpiry(session: Session | null): number | null {
    if (!session || !session.expires_at) {
      return null;
    }
    
    const expiresAt = new Date(session.expires_at).getTime();
    const now = Date.now();
    
    return Math.max(0, expiresAt - now);
  }

  /**
   * Sign in with email and password
   * 
   * @param credentials - Login credentials
   * @returns User and session data
   */
  async signIn(credentials: AuthCredentials): Promise<{ user: User; session: Session }> {
    const validatedData = loginSchema.parse(credentials);
    
    const { data, error } = await this.client.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password
    });
    
    if (error) {
      throw new SupabaseError('Authentication failed', error);
    }
    
    if (!data.user || !data.session) {
      throw new SupabaseError('No user or session returned');
    }
    
    return {
      user: data.user,
      session: data.session
    };
  }

  /**
   * Sign in with magic link (passwordless)
   * 
   * @param email - User's email address
   * @returns True if email was sent successfully
   */
  async signInWithMagicLink(email: string): Promise<boolean> {
    const { error } = await this.client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      throw new SupabaseError('Failed to send magic link', error);
    }
    
    return true;
  }

  /**
   * Sign in with third-party provider
   * 
   * @param provider - Authentication provider
   * @returns Redirect URL
   */
  async signInWithProvider(provider: Provider): Promise<{ url: string }> {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      throw new SupabaseError(`Failed to sign in with ${provider}`, error);
    }
    
    return { url: data.url };
  }

  /**
   * Create a new user account
   * 
   * @param userData - User signup data
   * @returns Created user
   */
  async signUp(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    inviteToken?: string;
  }): Promise<User> {
    const validatedData = signupSchema.parse(userData);
    
    // Check if this is an invited user
    if (validatedData.inviteToken) {
      return this.acceptInvitation(validatedData);
    }
    
    // Regular signup
    const { data, error } = await this.client.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          phone_number: validatedData.phoneNumber
        }
      }
    });
    
    if (error) {
      throw new SupabaseError('Signup failed', error);
    }
    
    if (!data.user) {
      throw new SupabaseError('No user returned after signup');
    }
    
    return data.user;
  }

  /**
   * Accept a staff invitation and create account
   * 
   * @param userData - User data with invitation token
   * @returns Created user
   */
  private async acceptInvitation(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    inviteToken: string;
  }): Promise<User> {
    // Verify the invitation token
    const { data: inviteData, error: inviteError } = await this.client
      .from('staff_invitations')
      .select('*')
      .eq('token', userData.inviteToken)
      .single();
    
    if (inviteError || !inviteData) {
      throw new SupabaseError('Invalid or expired invitation');
    }
    
    // Check if invitation is expired
    const expiresAt = new Date(inviteData.expires_at);
    if (expiresAt < new Date()) {
      throw new SupabaseError('Invitation has expired');
    }
    
    // Check if email matches
    if (inviteData.email !== userData.email) {
      throw new SupabaseError('Email does not match invitation');
    }
    
    // Create the user
    const { data, error } = await this.client.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone_number: userData.phoneNumber,
          role: inviteData.role,
          property_id: inviteData.property_id
        }
      }
    });
    
    if (error) {
      throw new SupabaseError('Failed to create account', error);
    }
    
    if (!data.user) {
      throw new SupabaseError('No user returned after signup');
    }
    
    // Mark invitation as used
    await this.client
      .from('staff_invitations')
      .update({ used_at: new Date().toISOString() })
      .eq('token', userData.inviteToken);
    
    return data.user;
  }

  /**
   * Sign out the current user
   * 
   * @returns True if sign out was successful
   */
  async signOut(): Promise<boolean> {
    const { error } = await this.client.auth.signOut();
    
    if (error) {
      throw new SupabaseError('Failed to sign out', error);
    }
    
    return true;
  }

  /**
   * Reset password with a token
   * 
   * @param token - Password reset token
   * @param newPassword - New password
   * @returns True if password was reset successfully
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const { error } = await this.client.auth.resetPasswordForEmail(newPassword, {
      redirectTo: `${window.location.origin}/auth/callback?token=${token}`
    });
    
    if (error) {
      throw new SupabaseError('Failed to reset password', error);
    }
    
    return true;
  }

  /**
   * Update user password
   * 
   * @param newPassword - New password
   * @returns True if password was updated successfully
   */
  async updatePassword(newPassword: string): Promise<boolean> {
    const { error } = await this.client.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      throw new SupabaseError('Failed to update password', error);
    }
    
    return true;
  }

  /**
   * Send a password reset email
   * 
   * @param email - User's email address
   * @returns True if email was sent successfully
   */
  async sendPasswordResetEmail(email: string): Promise<boolean> {
    const { error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    
    if (error) {
      throw new SupabaseError('Failed to send password reset email', error);
    }
    
    return true;
  }

  /**
   * Get the current user
   * 
   * @returns Current user or null if not logged in
   */
  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await this.client.auth.getUser();
    
    if (error) {
      return null;
    }
    
    return data.user;
  }

  /**
   * Get the current session
   * 
   * @returns Current session or null if not logged in
   */
  async getSession(): Promise<Session | null> {
    const { data, error } = await this.client.auth.getSession();
    
    if (error || !data.session) {
      return null;
    }
    
    return data.session;
  }

  /**
   * Update user profile data
   * 
   * @param profile - User profile data to update
   * @returns Updated user
   */
  async updateProfile(profile: Partial<UserProfile>): Promise<User> {
    const { data, error } = await this.client.auth.updateUser({
      data: {
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone_number: profile.phoneNumber,
        avatar_url: profile.avatarUrl
      }
    });
    
    if (error) {
      throw new SupabaseError('Failed to update profile', error);
    }
    
    return data.user;
  }

  /**
   * Generate a staff invitation
   * 
   * @param invitation - Staff invitation data
   * @returns Invitation token
   */
  async createStaffInvitation(invitation: Omit<StaffInvitation, 'expiresAt'>): Promise<string> {
    // Generate a random token
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    // Set expiration date (48 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);
    
    // Save invitation to database
    const { error } = await this.client
      .from('staff_invitations')
      .insert({
        token,
        email: invitation.email,
        first_name: invitation.firstName,
        last_name: invitation.lastName,
        role: invitation.role,
        property_id: invitation.propertyId,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      });
    
    if (error) {
      throw new SupabaseError('Failed to create invitation', error);
    }
    
    return token;
  }

  /**
   * Validate a staff invitation
   * 
   * @param token - Invitation token
   * @returns Invitation data if valid
   */
  async validateInvitation(token: string): Promise<StaffInvitation | null> {
    const { data, error } = await this.client
      .from('staff_invitations')
      .select('*')
      .eq('token', token)
      .is('used_at', null)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    // Check if expired
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      return null;
    }
    
    return {
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      role: data.role,
      propertyId: data.property_id,
      expiresAt
    };
  }
}

export default new AuthService();