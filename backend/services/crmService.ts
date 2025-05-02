import { SupabaseService } from '../supabaseBase';
import { paginationToRange } from '../utils/pagination';
import { buildFilterConditions, applyFilters } from '../utils/filters';
import storageService from './storageService';

/**
 * Represents a guest interaction in the CRM system
 */
export interface GuestInteraction {
  id: string;
  property_id: string;
  guest_id: string;
  staff_id?: string;
  interaction_type: 'inquiry' | 'feedback' | 'complaint' | 'request' | 'followup' | 'other';
  channel: 'email' | 'phone' | 'in_person' | 'web' | 'social' | 'sms' | 'other';
  subject: string;
  content: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  response?: string;
  response_by?: string;
  response_at?: string;
  attachments?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new guest interaction
 */
export interface CreateGuestInteractionInput {
  property_id: string;
  guest_id: string;
  staff_id?: string;
  interaction_type: 'inquiry' | 'feedback' | 'complaint' | 'request' | 'followup' | 'other';
  channel: 'email' | 'phone' | 'in_person' | 'web' | 'social' | 'sms' | 'other';
  subject: string;
  content: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed' | 'pending';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: File[] | string[];
  tags?: string[];
}

/**
 * Represents a guest preference in the CRM system
 */
export interface GuestPreference {
  id: string;
  guest_id: string;
  category: 'room' | 'food' | 'amenities' | 'service' | 'communication' | 'other';
  name: string;
  value: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new guest preference
 */
export interface CreateGuestPreferenceInput {
  guest_id: string;
  category: 'room' | 'food' | 'amenities' | 'service' | 'communication' | 'other';
  name: string;
  value: string;
  notes?: string;
}

/**
 * Represents a guest loyalty record in the CRM system
 */
export interface GuestLoyalty {
  id: string;
  guest_id: string;
  program_id: string;
  membership_number?: string;
  tier?: string;
  points: number;
  status: 'active' | 'inactive' | 'expired';
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new guest loyalty record
 */
export interface CreateGuestLoyaltyInput {
  guest_id: string;
  program_id: string;
  membership_number?: string;
  tier?: string;
  points?: number;
  status?: 'active' | 'inactive' | 'expired';
  expiry_date?: string;
}

/**
 * Represents a guest marketing consent record in the CRM system
 */
export interface GuestMarketingConsent {
  id: string;
  guest_id: string;
  channel: 'email' | 'sms' | 'phone' | 'mail' | 'all';
  consented: boolean;
  purpose: 'promotions' | 'newsletters' | 'surveys' | 'service_updates' | 'all';
  consent_date: string;
  expiry_date?: string;
  source: string;
  ip_address?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new guest marketing consent record
 */
export interface CreateGuestMarketingConsentInput {
  guest_id: string;
  channel: 'email' | 'sms' | 'phone' | 'mail' | 'all';
  consented: boolean;
  purpose: 'promotions' | 'newsletters' | 'surveys' | 'service_updates' | 'all';
  source: string;
  ip_address?: string;
  expiry_date?: string;
}

/**
 * Filters for querying guest interactions
 */
export interface GuestInteractionFilters {
  property_id?: string;
  guest_id?: string;
  staff_id?: string;
  interaction_type?: string | string[];
  channel?: string | string[];
  status?: string | string[];
  priority?: string | string[];
  created_at_from?: string;
  created_at_to?: string;
  tags?: string[];
  search?: string;
}

/**
 * Service for managing customer relationship management features
 */
export class CrmService extends SupabaseService<any> {
  /**
   * Creates a new CrmService instance
   */
  constructor() {
    super('public.guest_interactions');
  }

  /**
   * Upload attachments for guest interactions
   * 
   * @param guestId - The guest ID
   * @param files - Array of files to upload
   * @returns Array of file URLs
   * 
   * @private
   */
  private async uploadAttachments(
    guestId: string,
    files: File[] | string[]
  ): Promise<string[]> {
    // If attachments are already URLs, just return them
    if (files.length > 0 && typeof files[0] === 'string') {
      return files as string[];
    }
    
    // Upload each file
    const fileUrls = await Promise.all(
      (files as File[]).map(async (file) => {
        const metadata = await storageService.upload(
          'crm-attachments',
          file,
          `${guestId}/${Date.now()}_${file.name}`
        );
        
        return metadata.publicUrl;
      })
    );
    
    return fileUrls;
  }

  /**
   * Create a new guest interaction
   * 
   * @param input - Guest interaction creation data
   * @returns The created guest interaction
   * 
   * @rbac Property Owner, Staff
   */
  async createInteraction(input: CreateGuestInteractionInput): Promise<GuestInteraction> {
    // Handle attachment uploads first if any
    let attachmentUrls: string[] | undefined;
    
    if (input.attachments && input.attachments.length > 0) {
      attachmentUrls = await this.uploadAttachments(input.guest_id, input.attachments);
    }
    
    // Prepare request data
    const interactionData = {
      property_id: input.property_id,
      guest_id: input.guest_id,
      staff_id: input.staff_id,
      interaction_type: input.interaction_type,
      channel: input.channel,
      subject: input.subject,
      content: input.content,
      status: input.status || 'open',
      priority: input.priority || 'medium',
      attachments: attachmentUrls,
      tags: input.tags
    };
    
    // Create the record
    const { data, error } = await this.client
      .from('guest_interactions')
      .insert(interactionData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  /**
   * Get an interaction by ID
   * 
   * @param id - The interaction ID
   * @returns The interaction or null if not found
   * 
   * @rbac Property Owner, Staff
   */
  async getInteractionById(id: string): Promise<GuestInteraction | null> {
    const { data, error } = await this.client
      .from('guest_interactions')
      .select('*')
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
   * List guest interactions with optional filters and pagination
   * 
   * @param filters - Optional filters to apply
   * @param page - Page number (starts at 1)
   * @param limit - Number of items per page
   * @returns Array of guest interactions
   * 
   * @rbac Property Owner, Staff
   */
  async listInteractions(
    filters?: GuestInteractionFilters, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ data: GuestInteraction[]; count: number }> {
    const { from, to } = paginationToRange(page, limit);
    
    // Start with the base query
    let query = this.client
      .from('guest_interactions')
      .select('*', { count: 'exact' })
      .range(from, to);
    
    // Apply filters if provided
    if (filters) {
      // Handle date range filters
      if (filters.created_at_from) {
        query = query.gte('created_at', filters.created_at_from);
        delete filters.created_at_from;
      }
      
      if (filters.created_at_to) {
        query = query.lte('created_at', filters.created_at_to);
        delete filters.created_at_to;
      }
      
      // Handle search across multiple fields
      if (filters.search) {
        const searchTerm = filters.search;
        query = query.or(`subject.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
        delete filters.search;
      }
      
      // Handle tags filter (needs special treatment as it's an array)
      if (filters.tags && filters.tags.length > 0) {
        // For array containment operations in Supabase
        query = query.contains('tags', filters.tags);
        delete filters.tags;
      }
      
      // Apply remaining standard filters
      const conditions = buildFilterConditions(filters);
      
      if (conditions.length > 0) {
        // Apply filters manually since this is a more complex query
        conditions.forEach(condition => {
          if (Array.isArray(condition.value)) {
            query = query.in(condition.field, condition.value);
          } else {
            query = query.eq(condition.field, condition.value);
          }
        });
      }
    }
    
    // Add default sorting
    query = query.order('created_at', { ascending: false });
    
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
   * Update an interaction by ID
   * 
   * @param id - The interaction ID
   * @param payload - The data to update
   * @returns The updated interaction
   * 
   * @rbac Property Owner, Staff
   */
  async updateInteraction(id: string, payload: Partial<GuestInteraction>): Promise<GuestInteraction> {
    const { data, error } = await this.client
      .from('guest_interactions')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  /**
   * Respond to an interaction
   * 
   * @param id - The interaction ID
   * @param response - The response content
   * @param staffId - The staff user ID
   * @param newStatus - Optional new status for the interaction
   * @returns The updated interaction
   * 
   * @rbac Property Owner, Staff
   */
  async respondToInteraction(
    id: string, 
    response: string,
    staffId: string,
    newStatus?: 'open' | 'in_progress' | 'resolved' | 'closed' | 'pending'
  ): Promise<GuestInteraction> {
    const now = new Date().toISOString();
    
    const updateData: Partial<GuestInteraction> = {
      response,
      response_by: staffId,
      response_at: now
    };
    
    if (newStatus) {
      updateData.status = newStatus;
    }
    
    return this.updateInteraction(id, updateData);
  }

  /**
   * Create a guest preference
   * 
   * @param input - Guest preference creation data
   * @returns The created guest preference
   * 
   * @rbac Property Owner, Staff
   */
  async createPreference(input: CreateGuestPreferenceInput): Promise<GuestPreference> {
    const { data, error } = await this.client
      .from('guest_preferences')
      .insert(input)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  /**
   * Get preferences for a guest
   * 
   * @param guestId - The guest ID
   * @returns Array of guest preferences
   * 
   * @rbac Property Owner, Staff
   */
  async getPreferencesForGuest(guestId: string): Promise<GuestPreference[]> {
    const { data, error } = await this.client
      .from('guest_preferences')
      .select('*')
      .eq('guest_id', guestId)
      .order('category');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }

  /**
   * Update a guest preference
   * 
   * @param id - The preference ID
   * @param value - The new preference value
   * @param notes - Optional notes about the preference
   * @returns The updated preference
   * 
   * @rbac Property Owner, Staff
   */
  async updatePreference(
    id: string,
    value: string,
    notes?: string
  ): Promise<GuestPreference> {
    const updateData: Partial<GuestPreference> = { value };
    
    if (notes !== undefined) {
      updateData.notes = notes;
    }
    
    const { data, error } = await this.client
      .from('guest_preferences')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  /**
   * Delete a guest preference
   * 
   * @param id - The preference ID
   * 
   * @rbac Property Owner, Staff
   */
  async deletePreference(id: string): Promise<void> {
    const { error } = await this.client
      .from('guest_preferences')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  }

  /**
   * Create a loyalty program membership for a guest
   * 
   * @param input - Loyalty creation data
   * @returns The created loyalty record
   * 
   * @rbac Property Owner, Staff
   */
  async createLoyalty(input: CreateGuestLoyaltyInput): Promise<GuestLoyalty> {
    const { data, error } = await this.client
      .from('guest_loyalty')
      .insert({
        ...input,
        points: input.points || 0,
        status: input.status || 'active'
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  /**
   * Get loyalty information for a guest
   * 
   * @param guestId - The guest ID
   * @returns Array of guest loyalty records
   * 
   * @rbac Property Owner, Staff
   */
  async getLoyaltyForGuest(guestId: string): Promise<GuestLoyalty[]> {
    const { data, error } = await this.client
      .from('guest_loyalty')
      .select(`
        *,
        program:program_id(id, name, description)
      `)
      .eq('guest_id', guestId);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }

  /**
   * Update loyalty points for a guest
   * 
   * @param id - The loyalty record ID
   * @param pointsToAdd - Points to add (can be negative)
   * @param notes - Optional note about the points change
   * @returns The updated loyalty record
   * 
   * @rbac Property Owner, Staff
   */
  async updateLoyaltyPoints(
    id: string,
    pointsToAdd: number,
    notes?: string
  ): Promise<GuestLoyalty> {
    // First get the current record
    const { data: currentRecord, error: fetchError } = await this.client
      .from('guest_loyalty')
      .select('points')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Calculate new points
    const newPoints = (currentRecord.points || 0) + pointsToAdd;
    
    // Update record
    const { data, error } = await this.client
      .from('guest_loyalty')
      .update({ points: newPoints })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Record the points change
    if (pointsToAdd !== 0) {
      await this.client
        .from('loyalty_transactions')
        .insert({
          loyalty_id: id,
          points_change: pointsToAdd,
          notes: notes || `Points ${pointsToAdd > 0 ? 'added' : 'deducted'}`,
          created_at: new Date().toISOString()
        });
    }
    
    return data;
  }

  /**
   * Create a marketing consent record for a guest
   * 
   * @param input - Marketing consent data
   * @returns The created consent record
   * 
   * @rbac Property Owner, Staff
   */
  async createMarketingConsent(input: CreateGuestMarketingConsentInput): Promise<GuestMarketingConsent> {
    const consentData = {
      ...input,
      consent_date: new Date().toISOString()
    };
    
    const { data, error } = await this.client
      .from('guest_marketing_consents')
      .insert(consentData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  /**
   * Get marketing consents for a guest
   * 
   * @param guestId - The guest ID
   * @returns Array of guest consent records
   * 
   * @rbac Property Owner, Staff
   */
  async getMarketingConsentsForGuest(guestId: string): Promise<GuestMarketingConsent[]> {
    const { data, error } = await this.client
      .from('guest_marketing_consents')
      .select('*')
      .eq('guest_id', guestId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }

  /**
   * Update a marketing consent record
   * 
   * @param id - The consent record ID
   * @param consented - Whether the guest has consented
   * @param source - Source of the consent update
   * @returns The updated consent record
   * 
   * @rbac Property Owner, Staff
   */
  async updateMarketingConsent(
    id: string,
    consented: boolean,
    source: string
  ): Promise<GuestMarketingConsent> {
    const { data, error } = await this.client
      .from('guest_marketing_consents')
      .update({
        consented,
        source,
        consent_date: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  /**
   * Get guest interaction statistics
   * 
   * @param guestId - The guest ID
   * @returns Statistics about guest interactions
   * 
   * @rbac Property Owner, Staff
   */
  async getGuestInteractionStats(guestId: string): Promise<{
    totalInteractions: number;
    openInteractions: number;
    resolvedInteractions: number;
    byType: Record<string, number>;
    byChannel: Record<string, number>;
    responseTime: number;
    lastInteraction: string | null;
  }> {
    const { data, error } = await this.client.rpc('get_guest_interaction_stats', {
      p_guest_id: guestId
    });
    
    if (error) {
      throw error;
    }
    
    return data || {
      totalInteractions: 0,
      openInteractions: 0,
      resolvedInteractions: 0,
      byType: {},
      byChannel: {},
      responseTime: 0,
      lastInteraction: null
    };
  }

  /**
   * Get interactions for a specific guest
   * 
   * @param guestId - The guest ID
   * @param page - Page number
   * @param limit - Items per page
   * @returns Array of guest interactions
   * 
   * @rbac Property Owner, Staff
   */
  async getInteractionsForGuest(
    guestId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: GuestInteraction[]; count: number }> {
    return this.listInteractions({ guest_id: guestId }, page, limit);
  }

  /**
   * Get open interactions for a property
   * 
   * @param propertyId - The property ID
   * @param page - Page number
   * @param limit - Items per page
   * @returns Array of open interactions
   * 
   * @rbac Property Owner, Staff
   */
  async getOpenInteractionsForProperty(
    propertyId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: GuestInteraction[]; count: number }> {
    return this.listInteractions(
      { 
        property_id: propertyId,
        status: ['open', 'in_progress', 'pending']
      }, 
      page, 
      limit
    );
  }

  /**
   * Get interactions assigned to a staff member
   * 
   * @param staffId - The staff user ID
   * @param status - Optional status filter
   * @param page - Page number
   * @param limit - Items per page
   * @returns Array of interactions
   * 
   * @rbac Property Owner, Staff (self)
   */
  async getInteractionsForStaff(
    staffId: string,
    status?: string | string[],
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: GuestInteraction[]; count: number }> {
    const filters: GuestInteractionFilters = { staff_id: staffId };
    
    if (status) {
      filters.status = status;
    }
    
    return this.listInteractions(filters, page, limit);
  }

  /**
   * Assign an interaction to a staff member
   * 
   * @param interactionId - The interaction ID
   * @param staffId - The staff user ID
   * @returns The updated interaction
   * 
   * @rbac Property Owner, Staff (managers)
   */
  async assignInteractionToStaff(
    interactionId: string,
    staffId: string
  ): Promise<GuestInteraction> {
    return this.updateInteraction(interactionId, {
      staff_id: staffId,
      status: 'in_progress'
    });
  }
}

export default new CrmService();