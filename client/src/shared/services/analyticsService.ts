/**
 * Analytics Service
 * 
 * Service for fetching analytics and reporting data.
 */

import { ApiResponse } from './api';
import apiClient from './api';

// API endpoints for analytics
const ENDPOINTS = {
  DASHBOARD: '/analytics/dashboard',
  OCCUPANCY: '/analytics/occupancy',
  REVENUE: '/analytics/revenue',
  BOOKINGS: '/analytics/bookings',
  GUESTS: '/analytics/guests',
  PERFORMANCE: '/analytics/performance',
  FORECAST: '/analytics/forecast',
  CUSTOM: '/analytics/custom',
  EXPORT: '/analytics/export',
};

class AnalyticsService {
  /**
   * Get dashboard analytics
   */
  async getDashboardStats(propertyId?: number): Promise<ApiResponse<any>> {
    try {
      const params: any = {};
      if (propertyId) params.propertyId = propertyId;
      
      const response = await apiClient.get(ENDPOINTS.DASHBOARD, params);
      return response;
    } catch (error: any) {
      return {
        data: {
          occupancyRate: 0,
          revPAR: 0,
          ADR: 0,
          totalRevenue: 0,
          totalBookings: 0,
          pendingBookings: 0,
          cancelledBookings: 0,
          topRoomTypes: [],
          revenueByDay: [],
          occupancyTrend: [],
        },
        status: error.status || 500,
        message: error.message || 'Failed to fetch dashboard analytics'
      };
    }
  }

  /**
   * Get occupancy analytics
   */
  async getOccupancyStats(params: {
    propertyId?: number;
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'week' | 'month';
    roomCategory?: string;
  } = {}): Promise<ApiResponse<any>> {
    try {
      const queryParams: any = {};
      
      if (params.propertyId) queryParams.propertyId = params.propertyId;
      if (params.groupBy) queryParams.groupBy = params.groupBy;
      if (params.roomCategory) queryParams.roomCategory = params.roomCategory;
      
      if (params.startDate) {
        queryParams.startDate = params.startDate.toISOString().split('T')[0];
      }
      
      if (params.endDate) {
        queryParams.endDate = params.endDate.toISOString().split('T')[0];
      }
      
      const response = await apiClient.get(ENDPOINTS.OCCUPANCY, queryParams);
      return response;
    } catch (error: any) {
      return {
        data: {
          averageOccupancy: 0,
          occupancyByDate: [],
          occupancyByRoomType: [],
        },
        status: error.status || 500,
        message: error.message || 'Failed to fetch occupancy analytics'
      };
    }
  }

  /**
   * Get revenue analytics
   */
  async getRevenueStats(params: {
    propertyId?: number;
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'week' | 'month';
    includeAddOns?: boolean;
  } = {}): Promise<ApiResponse<any>> {
    try {
      const queryParams: any = {};
      
      if (params.propertyId) queryParams.propertyId = params.propertyId;
      if (params.groupBy) queryParams.groupBy = params.groupBy;
      if (params.includeAddOns !== undefined) queryParams.includeAddOns = params.includeAddOns;
      
      if (params.startDate) {
        queryParams.startDate = params.startDate.toISOString().split('T')[0];
      }
      
      if (params.endDate) {
        queryParams.endDate = params.endDate.toISOString().split('T')[0];
      }
      
      const response = await apiClient.get(ENDPOINTS.REVENUE, queryParams);
      return response;
    } catch (error: any) {
      return {
        data: {
          totalRevenue: 0,
          revenueByDate: [],
          revenueByRoomType: [],
          revenueBySource: [],
          ADR: 0,
          revPAR: 0,
        },
        status: error.status || 500,
        message: error.message || 'Failed to fetch revenue analytics'
      };
    }
  }

  /**
   * Get booking analytics
   */
  async getBookingStats(params: {
    propertyId?: number;
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'week' | 'month';
  } = {}): Promise<ApiResponse<any>> {
    try {
      const queryParams: any = {};
      
      if (params.propertyId) queryParams.propertyId = params.propertyId;
      if (params.groupBy) queryParams.groupBy = params.groupBy;
      
      if (params.startDate) {
        queryParams.startDate = params.startDate.toISOString().split('T')[0];
      }
      
      if (params.endDate) {
        queryParams.endDate = params.endDate.toISOString().split('T')[0];
      }
      
      const response = await apiClient.get(ENDPOINTS.BOOKINGS, queryParams);
      return response;
    } catch (error: any) {
      return {
        data: {
          totalBookings: 0,
          bookingsByDate: [],
          bookingsBySource: [],
          bookingsByStatus: [],
          averageStayLength: 0,
          cancellationRate: 0,
        },
        status: error.status || 500,
        message: error.message || 'Failed to fetch booking analytics'
      };
    }
  }

  /**
   * Get guest analytics
   */
  async getGuestStats(params: {
    propertyId?: number;
    startDate?: Date;
    endDate?: Date;
    segmentBy?: 'demographics' | 'source' | 'loyalty' | 'frequency';
  } = {}): Promise<ApiResponse<any>> {
    try {
      const queryParams: any = {};
      
      if (params.propertyId) queryParams.propertyId = params.propertyId;
      if (params.segmentBy) queryParams.segmentBy = params.segmentBy;
      
      if (params.startDate) {
        queryParams.startDate = params.startDate.toISOString().split('T')[0];
      }
      
      if (params.endDate) {
        queryParams.endDate = params.endDate.toISOString().split('T')[0];
      }
      
      const response = await apiClient.get(ENDPOINTS.GUESTS, queryParams);
      return response;
    } catch (error: any) {
      return {
        data: {
          totalGuests: 0,
          newGuests: 0,
          returningGuests: 0,
          guestsByLoyaltyTier: [],
          guestsByCountry: [],
          guestsBySource: [],
        },
        status: error.status || 500,
        message: error.message || 'Failed to fetch guest analytics'
      };
    }
  }

  /**
   * Get staff performance analytics
   */
  async getPerformanceStats(params: {
    propertyId?: number;
    startDate?: Date;
    endDate?: Date;
    departmentId?: number;
  } = {}): Promise<ApiResponse<any>> {
    try {
      const queryParams: any = {};
      
      if (params.propertyId) queryParams.propertyId = params.propertyId;
      if (params.departmentId) queryParams.departmentId = params.departmentId;
      
      if (params.startDate) {
        queryParams.startDate = params.startDate.toISOString().split('T')[0];
      }
      
      if (params.endDate) {
        queryParams.endDate = params.endDate.toISOString().split('T')[0];
      }
      
      const response = await apiClient.get(ENDPOINTS.PERFORMANCE, queryParams);
      return response;
    } catch (error: any) {
      return {
        data: {
          topPerformers: [],
          departmentPerformance: [],
          tasksCompleted: 0,
          tasksPending: 0,
          averageRating: 0,
        },
        status: error.status || 500,
        message: error.message || 'Failed to fetch performance analytics'
      };
    }
  }

  /**
   * Get forecast analytics
   */
  async getForecastStats(params: {
    propertyId?: number;
    startDate?: Date;
    endDate?: Date;
    forecastType?: 'occupancy' | 'revenue' | 'bookings';
  } = {}): Promise<ApiResponse<any>> {
    try {
      const queryParams: any = {};
      
      if (params.propertyId) queryParams.propertyId = params.propertyId;
      if (params.forecastType) queryParams.forecastType = params.forecastType;
      
      if (params.startDate) {
        queryParams.startDate = params.startDate.toISOString().split('T')[0];
      }
      
      if (params.endDate) {
        queryParams.endDate = params.endDate.toISOString().split('T')[0];
      }
      
      const response = await apiClient.get(ENDPOINTS.FORECAST, queryParams);
      return response;
    } catch (error: any) {
      return {
        data: {
          forecastValues: [],
          confidenceInterval: [],
          seasonalFactors: [],
          forecastAccuracy: 0,
        },
        status: error.status || 500,
        message: error.message || 'Failed to fetch forecast analytics'
      };
    }
  }

  /**
   * Get custom analytics report
   */
  async getCustomReport(params: {
    metrics: string[];
    dimensions: string[];
    filters?: Record<string, any>;
    startDate?: Date;
    endDate?: Date;
    propertyId?: number;
  }): Promise<ApiResponse<any>> {
    try {
      const queryParams: any = {
        metrics: params.metrics,
        dimensions: params.dimensions,
      };
      
      if (params.filters) queryParams.filters = params.filters;
      if (params.propertyId) queryParams.propertyId = params.propertyId;
      
      if (params.startDate) {
        queryParams.startDate = params.startDate.toISOString().split('T')[0];
      }
      
      if (params.endDate) {
        queryParams.endDate = params.endDate.toISOString().split('T')[0];
      }
      
      const response = await apiClient.post(ENDPOINTS.CUSTOM, queryParams);
      return response;
    } catch (error: any) {
      return {
        data: {
          results: [],
          metadata: {},
        },
        status: error.status || 500,
        message: error.message || 'Failed to fetch custom analytics report'
      };
    }
  }

  /**
   * Export analytics data
   */
  async exportReport(params: {
    reportType: 'occupancy' | 'revenue' | 'bookings' | 'guests' | 'performance' | 'custom';
    format: 'csv' | 'excel' | 'pdf';
    startDate?: Date;
    endDate?: Date;
    propertyId?: number;
    customParams?: Record<string, any>;
  }): Promise<ApiResponse<string>> {
    try {
      const response = await apiClient.post<string>(ENDPOINTS.EXPORT, params);
      return response;
    } catch (error: any) {
      return {
        data: '',
        status: error.status || 500,
        message: error.message || 'Failed to export analytics report'
      };
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;