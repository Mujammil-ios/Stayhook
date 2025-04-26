/**
 * Invoice Service
 * 
 * Service for invoice-related API operations.
 */

import type { ApiResponse } from './api';
import { apiRequest } from './api';

// API endpoints for invoices
const ENDPOINTS = {
  BASE: '/api/invoices',
  DETAIL: (id: number | string) => `/api/invoices/${id}`,
  RESERVATION: (reservationId: number | string) => `/api/reservations/${reservationId}/invoice`,
  GENERATE_PDF: (id: number | string) => `/api/invoices/${id}/pdf`,
  EMAIL: (id: number | string) => `/api/invoices/${id}/email`,
};

/**
 * Invoice interface
 */
export interface Invoice {
  id: number;
  reservationId: number;
  invoiceNumber: string;
  customerName: string;
  customerDetails: {
    email: string;
    phone: string;
    address?: string;
    gstNumber?: string;
  };
  roomDetails: {
    roomNumber: string;
    roomType: string;
    rate: number;
  };
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
  subTotal: number;
  taxDetails: {
    gst: number;
    serviceCharge?: number;
    otherTaxes?: Record<string, number>;
  };
  discounts?: {
    type: 'percentage' | 'fixed';
    value: number;
    reason?: string;
  }[];
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentMethod?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Insert invoice interface for creating new invoices
 */
export interface InsertInvoice {
  reservationId: number;
  customerName: string;
  customerDetails: {
    email: string;
    phone: string;
    address?: string;
    gstNumber?: string;
  };
  roomDetails: {
    roomNumber: string;
    roomType: string;
    rate: number;
  };
  checkInDate: Date;
  checkOutDate: Date;
  subTotal: number;
  taxDetails: {
    gst: number;
    serviceCharge?: number;
    otherTaxes?: Record<string, number>;
  };
  discounts?: {
    type: 'percentage' | 'fixed';
    value: number;
    reason?: string;
  }[];
  totalAmount: number;
  amountPaid: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentMethod?: string;
  notes?: string;
}

/**
 * Invoice Service class for handling invoice-related API operations
 */
class InvoiceService {
  /**
   * Get all invoices
   */
  async getAll(): Promise<ApiResponse<Invoice[]>> {
    return await apiRequest<Invoice[]>({
      url: ENDPOINTS.BASE,
      method: 'GET',
    });
  }

  /**
   * Get an invoice by ID
   */
  async getById(id: number): Promise<ApiResponse<Invoice>> {
    return await apiRequest<Invoice>({
      url: ENDPOINTS.DETAIL(id),
      method: 'GET',
    });
  }

  /**
   * Get invoice by reservation ID
   */
  async getByReservationId(reservationId: number): Promise<ApiResponse<Invoice>> {
    return await apiRequest<Invoice>({
      url: ENDPOINTS.RESERVATION(reservationId),
      method: 'GET',
    });
  }

  /**
   * Create a new invoice
   */
  async create(invoice: InsertInvoice): Promise<ApiResponse<Invoice>> {
    return await apiRequest<Invoice>({
      url: ENDPOINTS.BASE,
      method: 'POST',
      data: invoice,
    });
  }

  /**
   * Update an invoice
   */
  async update(id: number, invoice: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    return await apiRequest<Invoice>({
      url: ENDPOINTS.DETAIL(id),
      method: 'PATCH',
      data: invoice,
    });
  }

  /**
   * Delete an invoice
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return await apiRequest<void>({
      url: ENDPOINTS.DETAIL(id),
      method: 'DELETE',
    });
  }

  /**
   * Generate a PDF invoice and return the download URL
   */
  async generatePdf(id: number): Promise<ApiResponse<{ url: string }>> {
    // In a mock implementation, we would return a static URL
    // In the real implementation, the backend would generate a PDF and return its URL
    return await apiRequest<{ url: string }>({
      url: ENDPOINTS.GENERATE_PDF(id),
      method: 'POST',
    });
  }

  /**
   * Send invoice via email
   */
  async sendByEmail(id: number, email: string): Promise<ApiResponse<void>> {
    return await apiRequest<void>({
      url: ENDPOINTS.EMAIL(id),
      method: 'POST',
      data: { email },
    });
  }

  /**
   * Calculate invoice totals from reservation data
   * This is a helper method that can be used before creating an invoice
   */
  calculateInvoiceTotals(reservationData: any): {
    nights: number;
    subTotal: number;
    taxAmount: number;
    totalAmount: number;
  } {
    // Extract check-in and check-out dates
    const checkInDate = new Date(reservationData.checkInDate);
    const checkOutDate = new Date(reservationData.checkOutDate);
    
    // Calculate number of nights
    const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate subtotal (room rate × nights)
    const roomRate = reservationData.roomDetails?.rate || 0;
    const subTotal = roomRate * nights;
    
    // Calculate tax (assuming 18% GST)
    const taxRate = 0.18;
    const taxAmount = subTotal * taxRate;
    
    // Calculate total amount
    const totalAmount = subTotal + taxAmount;
    
    return {
      nights,
      subTotal,
      taxAmount,
      totalAmount
    };
  }
}

// Export a singleton instance
export const invoiceService = new InvoiceService();