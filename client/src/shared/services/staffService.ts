/**
 * Staff Service
 * 
 * Service for managing hotel staff members.
 */

import { ApiResponse } from './api';
import apiClient from './api';
import { Staff, InsertStaff } from '@shared/schema';

// API endpoints for staff
const ENDPOINTS = {
  ALL: '/staff',
  DETAIL: (id: number) => `/staff/${id}`,
  SEARCH: '/staff/search',
  BY_ROLE: (role: string) => `/staff/role/${role}`,
  PERFORMANCE: (id: number) => `/staff/${id}/performance`,
  SCHEDULE: (id: number) => `/staff/${id}/schedule`,
  REPORTS: '/staff/reports',
  PERMISSIONS: (id: number) => `/staff/${id}/permissions`,
  PROFILE_PHOTO: (id: number) => `/staff/${id}/photo`,
};

class StaffService {
  /**
   * Get all staff members
   */
  async getAll(): Promise<ApiResponse<Staff[]>> {
    try {
      const response = await apiClient.get<Staff[]>(ENDPOINTS.ALL);
      return response;
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        message: error.message || 'Failed to fetch staff'
      };
    }
  }

  /**
   * Get a staff member by ID
   */
  async getById(id: number): Promise<ApiResponse<Staff>> {
    try {
      const response = await apiClient.get<Staff>(ENDPOINTS.DETAIL(id));
      return response;
    } catch (error: any) {
      return {
        data: {} as Staff,
        status: error.status || 500,
        message: error.message || 'Failed to fetch staff member'
      };
    }
  }

  /**
   * Search staff members by name or email
   */
  async search(query: string): Promise<ApiResponse<Staff[]>> {
    try {
      const response = await apiClient.get<Staff[]>(ENDPOINTS.SEARCH, { query });
      return response;
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        message: error.message || 'Failed to search staff'
      };
    }
  }

  /**
   * Get staff members by role
   */
  async getByRole(role: string): Promise<ApiResponse<Staff[]>> {
    try {
      const response = await apiClient.get<Staff[]>(ENDPOINTS.BY_ROLE(role));
      return response;
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        message: error.message || 'Failed to fetch staff by role'
      };
    }
  }

  /**
   * Get performance data for a staff member
   */
  async getPerformance(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(ENDPOINTS.PERFORMANCE(id));
      
      // Format performance data
      const data = response.data || {};
      const performanceData = {
        metrics: data.metrics || {},
        ratings: data.ratings || [],
        completedTasks: data.completedTasks || 0,
        pendingTasks: data.pendingTasks || 0,
        department: data.department || 'General',
        revenueGenerated: data.revenueGenerated || 0,
        achievements: data.achievements || [],
      };
      
      return {
        ...response,
        data: performanceData
      };
    } catch (error: any) {
      return {
        data: {
          metrics: {},
          ratings: [],
          completedTasks: 0,
          pendingTasks: 0,
          department: 'General',
          revenueGenerated: 0,
          achievements: [],
        },
        status: error.status || 500,
        message: error.message || 'Failed to fetch performance data'
      };
    }
  }

  /**
   * Get schedule for a staff member
   */
  async getSchedule(id: number, startDate?: Date, endDate?: Date): Promise<ApiResponse<any>> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate.toISOString().split('T')[0];
      if (endDate) params.endDate = endDate.toISOString().split('T')[0];
      
      const response = await apiClient.get(ENDPOINTS.SCHEDULE(id), params);
      return response;
    } catch (error: any) {
      return {
        data: [],
        status: error.status || 500,
        message: error.message || 'Failed to fetch staff schedule'
      };
    }
  }

  /**
   * Create a new staff member
   */
  async create(data: InsertStaff): Promise<ApiResponse<Staff>> {
    try {
      const response = await apiClient.post<Staff>(ENDPOINTS.ALL, data);
      return response;
    } catch (error: any) {
      return {
        data: {} as Staff,
        status: error.status || 500,
        message: error.message || 'Failed to create staff member'
      };
    }
  }

  /**
   * Update a staff member
   */
  async update(id: number, data: Partial<Staff>): Promise<ApiResponse<Staff>> {
    try {
      const response = await apiClient.patch<Staff>(ENDPOINTS.DETAIL(id), data);
      return response;
    } catch (error: any) {
      return {
        data: {} as Staff,
        status: error.status || 500,
        message: error.message || 'Failed to update staff member'
      };
    }
  }

  /**
   * Delete a staff member
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(ENDPOINTS.DETAIL(id));
      return response;
    } catch (error: any) {
      return {
        data: undefined,
        status: error.status || 500,
        message: error.message || 'Failed to delete staff member'
      };
    }
  }

  /**
   * Add performance review for a staff member
   */
  async addPerformanceReview(id: number, review: {
    date: Date;
    rating: number;
    comments: string;
    reviewedBy: number;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(ENDPOINTS.PERFORMANCE(id), review);
      return response;
    } catch (error: any) {
      return {
        data: {},
        status: error.status || 500,
        message: error.message || 'Failed to add performance review'
      };
    }
  }

  /**
   * Update staff permissions
   */
  async updatePermissions(id: number, permissions: string[]): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.patch(ENDPOINTS.PERMISSIONS(id), { permissions });
      return response;
    } catch (error: any) {
      return {
        data: {},
        status: error.status || 500,
        message: error.message || 'Failed to update permissions'
      };
    }
  }

  /**
   * Upload staff profile photo
   */
  async uploadProfilePhoto(id: number, photo: File): Promise<ApiResponse<string>> {
    try {
      const formData = new FormData();
      formData.append('photo', photo);
      
      const response = await apiClient.upload<string>(ENDPOINTS.PROFILE_PHOTO(id), formData);
      return response;
    } catch (error: any) {
      return {
        data: '',
        status: error.status || 500,
        message: error.message || 'Failed to upload profile photo'
      };
    }
  }

  /**
   * Get staff reports/analytics
   */
  async getReports(params?: {
    department?: string;
    startDate?: Date;
    endDate?: Date;
    type?: 'performance' | 'attendance' | 'revenue' | 'tasks';
  }): Promise<ApiResponse<any>> {
    try {
      const queryParams: any = {};
      
      if (params) {
        if (params.department) queryParams.department = params.department;
        if (params.type) queryParams.type = params.type;
        if (params.startDate) queryParams.startDate = params.startDate.toISOString().split('T')[0];
        if (params.endDate) queryParams.endDate = params.endDate.toISOString().split('T')[0];
      }
      
      const response = await apiClient.get(ENDPOINTS.REPORTS, queryParams);
      return response;
    } catch (error: any) {
      return {
        data: {},
        status: error.status || 500,
        message: error.message || 'Failed to fetch staff reports'
      };
    }
  }
}

export const staffService = new StaffService();
export default staffService;