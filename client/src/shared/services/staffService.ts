/**
 * Staff Service
 * 
 * Handles all API communication related to staff and employee data
 */

import { Staff, InsertStaff } from '@shared/schema';
import apiClient, { ApiResponse } from './api';
import { staffData, getStaffById } from '@/lib/data';

// API endpoints
const ENDPOINTS = {
  ALL: '/staff',
  DETAIL: (id: number | string) => `/staff/${id}`,
  BY_ROLE: (role: string) => `/staff/role/${role}`,
  BY_DEPARTMENT: (dept: string) => `/staff/department/${dept}`,
  SCHEDULE: '/staff/schedule',
  PERFORMANCE: '/staff/performance',
};

// Mocked staff service utilizing current data imported from lib/data.ts
// These will be replaced with actual API calls when backend is ready
class StaffService {
  /**
   * Get all staff members
   */
  async getAll(): Promise<ApiResponse<Staff[]>> {
    // This will be replaced with:
    // return apiClient.get<Staff[]>(ENDPOINTS.ALL);
    
    return {
      data: staffData,
      status: 200,
      success: true
    };
  }

  /**
   * Get a single staff member by ID
   */
  async getById(id: number): Promise<ApiResponse<Staff>> {
    // This will be replaced with:
    // return apiClient.get<Staff>(ENDPOINTS.DETAIL(id));
    
    const staff = getStaffById(id);
    if (!staff) {
      return {
        error: 'Staff member not found',
        status: 404,
        success: false
      };
    }
    
    return {
      data: staff,
      status: 200,
      success: true
    };
  }

  /**
   * Get staff members by role
   */
  async getByRole(role: string): Promise<ApiResponse<Staff[]>> {
    // This will be replaced with:
    // return apiClient.get<Staff[]>(ENDPOINTS.BY_ROLE(role));
    
    const filtered = staffData.filter(staff => 
      staff.role.toLowerCase() === role.toLowerCase()
    );
    
    return {
      data: filtered,
      status: 200,
      success: true
    };
  }

  /**
   * Get staff members by department
   */
  async getByDepartment(department: string): Promise<ApiResponse<Staff[]>> {
    // This will be replaced with:
    // return apiClient.get<Staff[]>(ENDPOINTS.BY_DEPARTMENT(department));
    
    const filtered = staffData.filter(staff => 
      staff.employmentDetails && 
      staff.employmentDetails.department.toLowerCase() === department.toLowerCase()
    );
    
    return {
      data: filtered,
      status: 200,
      success: true
    };
  }

  /**
   * Get staff schedule for a specific day/date
   */
  async getSchedule(date?: string): Promise<ApiResponse<any[]>> {
    // This will be replaced with:
    // return apiClient.get(ENDPOINTS.SCHEDULE, { params: { date } });
    
    // Convert staff schedules into daily assignments
    const staffSchedules = staffData.map(staff => {
      // In a real implementation, this would filter by the provided date
      // For now, return all schedules
      return {
        staffId: staff.id,
        name: `${staff.firstName} ${staff.lastName}`,
        role: staff.role,
        schedule: staff.schedule
      };
    });
    
    return {
      data: staffSchedules,
      status: 200,
      success: true
    };
  }

  /**
   * Get staff performance metrics
   */
  async getPerformanceMetrics(): Promise<ApiResponse<any[]>> {
    // This will be replaced with:
    // return apiClient.get(ENDPOINTS.PERFORMANCE);
    
    const performanceData = staffData.map(staff => ({
      staffId: staff.id,
      name: `${staff.firstName} ${staff.lastName}`,
      role: staff.role,
      lastReview: staff.performance?.lastReview,
      rating: staff.performance?.rating,
      comments: staff.performance?.comments
    }));
    
    return {
      data: performanceData,
      status: 200,
      success: true
    };
  }

  /**
   * Create a new staff member
   */
  async create(staff: InsertStaff): Promise<ApiResponse<Staff>> {
    // This will be replaced with:
    // return apiClient.post<Staff>(ENDPOINTS.ALL, staff);
    
    // For now, simply return a mocked response with the data
    const newStaff: Staff = {
      ...staff,
      id: Math.max(...staffData.map(s => s.id)) + 1,
    };
    
    return {
      data: newStaff,
      status: 201,
      success: true
    };
  }

  /**
   * Update an existing staff member
   */
  async update(id: number, data: Partial<Staff>): Promise<ApiResponse<Staff>> {
    // This will be replaced with:
    // return apiClient.patch<Staff>(ENDPOINTS.DETAIL(id), data);
    
    const staff = getStaffById(id);
    if (!staff) {
      return {
        error: 'Staff member not found',
        status: 404,
        success: false
      };
    }
    
    const updated = { ...staff, ...data };
    
    return {
      data: updated,
      status: 200,
      success: true
    };
  }

  /**
   * Delete a staff member
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    // This will be replaced with:
    // return apiClient.delete<void>(ENDPOINTS.DETAIL(id));
    
    const staff = getStaffById(id);
    if (!staff) {
      return {
        error: 'Staff member not found',
        status: 404,
        success: false
      };
    }
    
    return {
      status: 204,
      success: true
    };
  }

  /**
   * Update staff schedule
   */
  async updateSchedule(
    id: number, 
    schedule: Array<{ day: string; hours: string }>
  ): Promise<ApiResponse<Staff>> {
    // This will be replaced with:
    // return apiClient.patch<Staff>(`${ENDPOINTS.DETAIL(id)}/schedule`, { schedule });
    
    const staff = getStaffById(id);
    if (!staff) {
      return {
        error: 'Staff member not found',
        status: 404,
        success: false
      };
    }
    
    const updated = { ...staff, schedule };
    
    return {
      data: updated,
      status: 200,
      success: true
    };
  }

  /**
   * Update staff performance record
   */
  async updatePerformance(
    id: number, 
    performance: { lastReview: string; rating: number; comments: string }
  ): Promise<ApiResponse<Staff>> {
    // This will be replaced with:
    // return apiClient.patch<Staff>(`${ENDPOINTS.DETAIL(id)}/performance`, performance);
    
    const staff = getStaffById(id);
    if (!staff) {
      return {
        error: 'Staff member not found',
        status: 404,
        success: false
      };
    }
    
    const updated = { 
      ...staff, 
      performance: { ...(staff.performance || {}), ...performance }
    };
    
    return {
      data: updated,
      status: 200,
      success: true
    };
  }
}

// Export a singleton instance
export const staffService = new StaffService();

// Default export
export default staffService;