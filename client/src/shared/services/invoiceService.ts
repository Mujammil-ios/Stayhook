import api from './api';
import { Invoice, InsertInvoice, ApiResponse } from '@/types';

/**
 * Service for handling invoice-related API calls
 */
export const invoiceService = {
  /**
   * Get all invoices
   * @returns Promise with array of invoices
   */
  async getAll(): Promise<ApiResponse<Invoice[]>> {
    try {
      return await api.get<Invoice[]>('/api/invoices');
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : 'Failed to fetch invoices',
      };
    }
  },

  /**
   * Get a specific invoice by ID
   * @param id The invoice ID
   * @returns Promise with the invoice data
   */
  async getById(id: number): Promise<ApiResponse<Invoice>> {
    try {
      return await api.get<Invoice>(`/api/invoices/${id}`);
    } catch (error) {
      console.error(`Error fetching invoice ${id}:`, error);
      return {
        success: false,
        data: {} as Invoice,
        message: error instanceof Error ? error.message : `Failed to fetch invoice ${id}`,
      };
    }
  },

  /**
   * Get invoices for a specific reservation
   * @param reservationId The reservation ID
   * @returns Promise with array of invoices
   */
  async getByReservationId(reservationId: number): Promise<ApiResponse<Invoice[]>> {
    try {
      return await api.get<Invoice[]>(`/api/invoices/reservation/${reservationId}`);
    } catch (error) {
      console.error(`Error fetching invoices for reservation ${reservationId}:`, error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : `Failed to fetch invoices for reservation ${reservationId}`,
      };
    }
  },

  /**
   * Create a new invoice
   * @param data The invoice data
   * @returns Promise with the created invoice
   */
  async create(data: InsertInvoice): Promise<ApiResponse<Invoice>> {
    try {
      // For development, mock API call with data
      // This would be replaced with the actual API call in production
      
      // Simulate API call
      console.log('Creating invoice:', data);
      
      // Mock a successful response
      const mockResponse: Invoice = {
        id: Math.floor(Math.random() * 10000) + 1,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      return {
        success: true,
        data: mockResponse,
        message: 'Invoice created successfully',
      };
      
      // Uncomment for actual API implementation:
      // return await api.post<Invoice>('/api/invoices', data);
    } catch (error) {
      console.error('Error creating invoice:', error);
      return {
        success: false,
        data: {} as Invoice,
        message: error instanceof Error ? error.message : 'Failed to create invoice',
      };
    }
  },

  /**
   * Update an invoice
   * @param id The invoice ID
   * @param data The updated invoice data
   * @returns Promise with the updated invoice
   */
  async update(id: number, data: Partial<InsertInvoice>): Promise<ApiResponse<Invoice>> {
    try {
      return await api.patch<Invoice>(`/api/invoices/${id}`, data);
    } catch (error) {
      console.error(`Error updating invoice ${id}:`, error);
      return {
        success: false,
        data: {} as Invoice,
        message: error instanceof Error ? error.message : `Failed to update invoice ${id}`,
      };
    }
  },

  /**
   * Delete an invoice
   * @param id The invoice ID
   * @returns Promise with success/failure status
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      return await api.delete<void>(`/api/invoices/${id}`);
    } catch (error) {
      console.error(`Error deleting invoice ${id}:`, error);
      return {
        success: false,
        data: undefined as unknown as void,
        message: error instanceof Error ? error.message : `Failed to delete invoice ${id}`,
      };
    }
  },

  /**
   * Update payment status for an invoice
   * @param id The invoice ID
   * @param paymentStatus The new payment status
   * @param amountPaid The amount paid (optional)
   * @returns Promise with the updated invoice
   */
  async updatePaymentStatus(
    id: number, 
    paymentStatus: 'paid' | 'partial' | 'unpaid',
    amountPaid?: number
  ): Promise<ApiResponse<Invoice>> {
    try {
      const updateData: any = { paymentStatus };
      if (amountPaid !== undefined) {
        updateData.amountPaid = amountPaid;
      }
      
      return await api.patch<Invoice>(`/api/invoices/${id}/payment-status`, updateData);
    } catch (error) {
      console.error(`Error updating invoice ${id} payment status:`, error);
      return {
        success: false,
        data: {} as Invoice,
        message: error instanceof Error ? error.message : `Failed to update invoice ${id} payment status`,
      };
    }
  },

  /**
   * Generate a PDF for the invoice
   * @param reservationId The reservation ID
   * @returns Promise with PDF download URL
   */
  async generatePdf(reservationId: number): Promise<ApiResponse<{ url: string }>> {
    try {
      // Mock implementation for development
      console.log(`Generating PDF for reservation ${reservationId}`);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: {
          url: `data:application/pdf;base64,JVBERi0xLjMKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9GaWx0ZXIgL0ZsYXRlRGVjb2RlCi9MZW5ndGggMTM0Pj4Kc3RyZWFtCnicVY6xDoJAEET7/Yod2VhclLvL7WKiiZ1aGAMJLRZgYfz7XUAliWbzZrNvdlMk3DK/R1Oo9JJ9pqCcZcF+ZE5QwC/IOgZ7b2Rs+0ZRoFLyXZWrylHEcZnXdNxPkL3qYDzBrPRVHfvnYHSfnXcvdnzBlqsB1qp9E2gTnbEFQCHrHYDyBQ35CksKZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqCjw8L1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUiBdCi9Db3VudCAxCi9NZWRpYUJveCBbMCAwIDMwMCAxNDRdCj4+CmVuZG9iago1IDAgb2JqCjw8L1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCj4+CmVuZG9iago2IDAgb2JqCjw8L1Byb2R1Y2VyIChjcnlzdGFsUERGIDIuMC42LmpzIChodHRwczovL2dpdGh1Yi5jb20vUGFFUC9jcnlzdGFsUERGKSkKL0NyZWF0aW9uRGF0ZSAoRDoyMDIzMDYxMDIyMzI0OVopCj4+CmVuZG9iagoyIDAgb2JqCjw8L1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldCj4+CmVuZG9iagp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAyMzcgMDAwMDAgbiAKMDAwMDAwMDQ0NSAwMDAwMCBuIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwODcgMDAwMDAgbiAKMDAwMDAwMDMyMCAwMDAwMCBuIAowMDAwMDAwMzY5IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA3Ci9Sb290IDUgMCBSCi9JbmZvIDYgMCBSCj4+CnN0YXJ0eHJlZgo0OTkKJSVFT0YK`
        },
        message: 'PDF generated successfully',
      };
      
      // Uncomment for actual API implementation:
      // return await api.get<{ url: string }>(`/api/invoices/reservation/${reservationId}/pdf`);
    } catch (error) {
      console.error(`Error generating PDF for reservation ${reservationId}:`, error);
      return {
        success: false,
        data: { url: '' },
        message: error instanceof Error ? error.message : `Failed to generate PDF for reservation ${reservationId}`,
      };
    }
  },

  /**
   * Send invoice to guest via email
   * @param id The invoice ID
   * @param email The email address (optional, will use guest email if not provided)
   * @returns Promise with success/failure status
   */
  async sendViaEmail(id: number, email?: string): Promise<ApiResponse<{ sent: boolean }>> {
    try {
      const params: Record<string, string> = {};
      if (email) {
        params.email = email;
      }
      
      return await api.post<{ sent: boolean }>(`/api/invoices/${id}/send-email`, params);
    } catch (error) {
      console.error(`Error sending invoice ${id} via email:`, error);
      return {
        success: false,
        data: { sent: false },
        message: error instanceof Error ? error.message : `Failed to send invoice ${id} via email`,
      };
    }
  },

  /**
   * Get invoice statistics
   * @returns Promise with invoice stats
   */
  async getStats(): Promise<ApiResponse<any>> {
    try {
      return await api.get<any>('/api/invoices/stats');
    } catch (error) {
      console.error('Error fetching invoice stats:', error);
      return {
        success: false,
        data: {},
        message: error instanceof Error ? error.message : 'Failed to fetch invoice stats',
      };
    }
  },
};

export default invoiceService;

export type { Invoice };