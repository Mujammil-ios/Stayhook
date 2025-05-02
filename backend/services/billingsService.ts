import { SupabaseService } from '../supabaseBase';
import { paginationToRange } from '../utils/pagination';
import { buildFilterConditions, applyFilters } from '../utils/filters';

/**
 * Represents a billing record in the system
 */
export interface Billing {
  id: string;
  property_id: string;
  reservation_id?: string;
  guest_id?: string;
  invoice_number: string;
  billing_date: string;
  due_date: string;
  amount: number;
  currency: string;
  tax_amount: number;
  tax_rate: number;
  category: string;
  description: string;
  status: 'draft' | 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled' | 'refunded';
  payment_method?: string;
  payment_reference?: string;
  payment_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a billing item
 */
export interface BillingItem {
  id: string;
  billing_id: string;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  category: string;
  service_date?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new billing record
 */
export interface CreateBillingInput {
  property_id: string;
  reservation_id?: string;
  guest_id?: string;
  billing_date: string;
  due_date: string;
  amount: number;
  currency: string;
  tax_amount: number;
  tax_rate: number;
  category: string;
  description: string;
  status?: 'draft' | 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled' | 'refunded';
  payment_method?: string;
  payment_reference?: string;
  payment_date?: string;
  notes?: string;
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    discount_amount: number;
    category: string;
    service_date?: string;
  }>;
}

/**
 * Filters for querying billings
 */
export interface BillingFilters {
  property_id?: string;
  reservation_id?: string;
  guest_id?: string;
  invoice_number?: string;
  status?: string | string[];
  category?: string | string[];
  billing_date_from?: string;
  billing_date_to?: string;
  due_date_from?: string;
  due_date_to?: string;
  payment_method?: string;
  created_at_from?: string;
  created_at_to?: string;
  amount_min?: number;
  amount_max?: number;
  search?: string;
}

/**
 * Service for managing billings
 */
export class BillingsService extends SupabaseService<Billing> {
  /**
   * Creates a new BillingsService instance
   */
  constructor() {
    super('public.billings');
  }

  /**
   * Generate a unique invoice number
   * 
   * @param propertyId - Property ID
   * @returns Unique invoice number
   */
  private async generateInvoiceNumber(propertyId: string): Promise<string> {
    // Get property code (first 3 letters of property name)
    const { data: property } = await this.client
      .from('properties')
      .select('name')
      .eq('id', propertyId)
      .single();
    
    const propertyCode = property?.name?.substring(0, 3).toUpperCase() || 'INV';
    
    // Get current date in YYMMDD format
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateCode = `${year}${month}${day}`;
    
    // Get the count of invoices created today for this property and add 1
    const { count } = await this.client
      .from('billings')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId)
      .like('invoice_number', `${propertyCode}${dateCode}%`);
    
    const sequence = ((count || 0) + 1).toString().padStart(3, '0');
    
    return `${propertyCode}${dateCode}${sequence}`;
  }

  /**
   * Create a new billing record
   * 
   * @param input - Billing creation data
   * @returns The created billing
   * 
   * @rbac Property Owner, Staff (with finance permissions)
   */
  async create(input: CreateBillingInput): Promise<Billing> {
    const { items, ...billingData } = input;
    
    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber(input.property_id);
    
    // Begin transaction
    const { data, error } = await this.client.rpc('create_billing', {
      billing_data: {
        ...billingData,
        invoice_number: invoiceNumber,
        status: billingData.status || 'draft'
      },
      item_data: items.map(item => {
        // Calculate tax amount and total amount
        const taxAmount = item.unit_price * item.quantity * (item.tax_rate / 100);
        const totalAmount = (item.unit_price * item.quantity) + taxAmount - item.discount_amount;
        
        return {
          ...item,
          tax_amount: taxAmount,
          total_amount: totalAmount
        };
      })
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  /**
   * Get a billing by ID
   * 
   * @param id - The billing ID
   * @returns The billing or null if not found
   * 
   * @rbac Property Owner, Staff (with finance permissions), Guest (their own billings)
   */
  async getById(id: string): Promise<Billing | null> {
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
   * Get a billing by invoice number
   * 
   * @param invoiceNumber - The invoice number
   * @returns The billing or null if not found
   * 
   * @rbac Property Owner, Staff (with finance permissions), Guest (their own billings)
   */
  async getByInvoiceNumber(invoiceNumber: string): Promise<Billing | null> {
    const { data, error } = await this.select()
      .eq('invoice_number', invoiceNumber)
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
   * List billings with optional filters and pagination
   * 
   * @param filters - Optional filters to apply
   * @param page - Page number (starts at 1)
   * @param limit - Number of items per page
   * @returns Array of billings
   * 
   * @rbac Property Owner, Staff (with finance permissions)
   */
  async list(
    filters?: BillingFilters, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ data: Billing[]; count: number }> {
    const { from, to } = paginationToRange(page, limit);
    
    // Start with the base query
    let query = this.select().range(from, to);
    
    // Apply filters if provided
    if (filters) {
      // Handle date range filters
      if (filters.billing_date_from) {
        query = query.gte('billing_date', filters.billing_date_from);
        delete filters.billing_date_from;
      }
      
      if (filters.billing_date_to) {
        query = query.lte('billing_date', filters.billing_date_to);
        delete filters.billing_date_to;
      }
      
      if (filters.due_date_from) {
        query = query.gte('due_date', filters.due_date_from);
        delete filters.due_date_from;
      }
      
      if (filters.due_date_to) {
        query = query.lte('due_date', filters.due_date_to);
        delete filters.due_date_to;
      }
      
      if (filters.created_at_from) {
        query = query.gte('created_at', filters.created_at_from);
        delete filters.created_at_from;
      }
      
      if (filters.created_at_to) {
        query = query.lte('created_at', filters.created_at_to);
        delete filters.created_at_to;
      }
      
      // Handle amount range filters
      if (filters.amount_min !== undefined) {
        query = query.gte('amount', filters.amount_min);
        delete filters.amount_min;
      }
      
      if (filters.amount_max !== undefined) {
        query = query.lte('amount', filters.amount_max);
        delete filters.amount_max;
      }
      
      // Handle search across multiple fields
      if (filters.search) {
        const searchTerm = filters.search;
        query = query.or(
          `invoice_number.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
        delete filters.search;
      }
      
      // Apply remaining standard filters
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
   * Update a billing by ID
   * 
   * @param id - The billing ID
   * @param payload - The data to update
   * @returns The updated billing
   * 
   * @rbac Property Owner, Staff (with finance permissions)
   */
  async updateById(id: string, payload: Partial<Billing>): Promise<Billing> {
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
   * Delete a billing by ID
   * 
   * @param id - The billing ID to delete
   * 
   * @rbac Property Owner only
   */
  async deleteById(id: string): Promise<void> {
    const { error } = await this.delete({ id });
    
    if (error) {
      throw error;
    }
  }
  
  /**
   * Update billing status
   * 
   * @param id - The billing ID
   * @param status - The new status
   * @returns The updated billing
   * 
   * @rbac Property Owner, Staff (with finance permissions)
   */
  async updateStatus(
    id: string, 
    status: 'draft' | 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled' | 'refunded'
  ): Promise<Billing> {
    return this.updateById(id, { status });
  }
  
  /**
   * Record payment for a billing
   * 
   * @param id - The billing ID
   * @param paymentMethod - Payment method used
   * @param paymentReference - Payment reference number
   * @param amount - Payment amount
   * @returns The updated billing
   * 
   * @rbac Property Owner, Staff (with finance permissions)
   */
  async recordPayment(
    id: string,
    paymentMethod: string,
    paymentReference: string,
    amount: number
  ): Promise<Billing> {
    const billing = await this.getById(id);
    
    if (!billing) {
      throw new Error(`Billing with ID ${id} not found`);
    }
    
    // Determine the new status based on payment amount
    let status: 'paid' | 'partially_paid' = 'paid';
    if (amount < billing.amount) {
      status = 'partially_paid';
    }
    
    return this.updateById(id, {
      status,
      payment_method: paymentMethod,
      payment_reference: paymentReference,
      payment_date: new Date().toISOString()
    });
  }
  
  /**
   * Get billing items
   * 
   * @param billingId - The billing ID
   * @returns Array of billing items
   * 
   * @rbac Property Owner, Staff (with finance permissions), Guest (their own billings)
   */
  async getItems(billingId: string): Promise<BillingItem[]> {
    const { data, error } = await this.client
      .from('billing_items')
      .select('*')
      .eq('billing_id', billingId);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Add item to billing
   * 
   * @param billingId - The billing ID
   * @param item - The billing item to add
   * @returns The created billing item
   * 
   * @rbac Property Owner, Staff (with finance permissions)
   */
  async addItem(
    billingId: string,
    item: {
      name: string;
      description?: string;
      quantity: number;
      unit_price: number;
      tax_rate: number;
      discount_amount: number;
      category: string;
      service_date?: string;
    }
  ): Promise<BillingItem> {
    // Calculate tax amount and total amount
    const taxAmount = item.unit_price * item.quantity * (item.tax_rate / 100);
    const totalAmount = (item.unit_price * item.quantity) + taxAmount - item.discount_amount;
    
    const { data, error } = await this.client
      .from('billing_items')
      .insert({
        billing_id: billingId,
        ...item,
        tax_amount: taxAmount,
        total_amount: totalAmount
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Update the billing total
    await this.client.rpc('update_billing_totals', { p_billing_id: billingId });
    
    return data;
  }
  
  /**
   * Remove item from billing
   * 
   * @param billingId - The billing ID
   * @param itemId - The billing item ID
   * 
   * @rbac Property Owner, Staff (with finance permissions)
   */
  async removeItem(billingId: string, itemId: string): Promise<void> {
    const { error } = await this.client
      .from('billing_items')
      .delete()
      .eq('id', itemId)
      .eq('billing_id', billingId);
    
    if (error) {
      throw error;
    }
    
    // Update the billing total
    await this.client.rpc('update_billing_totals', { p_billing_id: billingId });
  }
  
  /**
   * Get billings for a reservation
   * 
   * @param reservationId - The reservation ID
   * @returns Array of billings
   * 
   * @rbac Property Owner, Staff (with finance permissions), Guest (their own billings)
   */
  async getByReservationId(reservationId: string): Promise<Billing[]> {
    const { data, error } = await this.select()
      .eq('reservation_id', reservationId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get billings for a guest
   * 
   * @param guestId - The guest ID
   * @param page - Page number
   * @param limit - Items per page
   * @returns Array of billings
   * 
   * @rbac Property Owner, Staff (with finance permissions), Guest (their own billings)
   */
  async getByGuestId(
    guestId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Billing[]; count: number }> {
    return this.list({ guest_id: guestId }, page, limit);
  }
  
  /**
   * Get overdue billings for a property
   * 
   * @param propertyId - The property ID
   * @returns Array of overdue billings
   * 
   * @rbac Property Owner, Staff (with finance permissions)
   */
  async getOverdueBillings(propertyId: string): Promise<Billing[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await this.select()
      .eq('property_id', propertyId)
      .lt('due_date', today)
      .in('status', ['draft', 'pending'])
      .order('due_date', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }
  
  /**
   * Get billing statistics for a property
   * 
   * @param propertyId - The property ID
   * @param startDate - Start date for statistics
   * @param endDate - End date for statistics
   * @returns Object containing billing statistics
   * 
   * @rbac Property Owner, Staff (managers)
   */
  async getPropertyStatistics(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    totalBillings: number;
    paidBillings: number;
    pendingBillings: number;
    overdueBillings: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
  }> {
    const { data, error } = await this.client.rpc('get_billing_statistics', {
      p_property_id: propertyId,
      p_start_date: startDate,
      p_end_date: endDate
    });
    
    if (error) {
      throw error;
    }
    
    return data || {
      totalBillings: 0,
      paidBillings: 0,
      pendingBillings: 0,
      overdueBillings: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0
    };
  }
}

export default new BillingsService();