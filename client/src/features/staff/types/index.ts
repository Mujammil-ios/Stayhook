/**
 * Staff Types
 */

export interface StaffPerformance {
  metrics: Record<string, number>;
  ratings: Array<{
    date: string;
    rating: number;
    comments?: string;
    reviewedBy: number;
  }>;
  completedTasks: number;
  pendingTasks: number;
  department: string;
  revenueGenerated: number;
  achievements: string[];
}

export interface StaffSchedule {
  id: number;
  staffId: number;
  date: string;
  startTime: string;
  endTime: string;
  shiftType: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface StaffPermission {
  module: string;
  actions: Array<'view' | 'create' | 'edit' | 'delete' | 'approve'>;
}

export interface StaffTask {
  id: number;
  staffId: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedBy: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
}

export interface StaffReport {
  period: string;
  department?: string;
  metrics: {
    tasksCompleted: number;
    tasksPending: number;
    attendanceRate: number;
    avgRating: number;
    revenueGenerated?: number;
    serviceSatisfaction?: number;
  };
  topPerformers: Array<{
    staffId: number;
    name: string;
    performance: number;
    metric: string;
  }>;
  trends: Array<{
    date: string;
    value: number;
    metric: string;
  }>;
}

export interface StaffTraining {
  id: number;
  staffId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  certificationType?: string;
  certificationExpiry?: string;
  score?: number;
  notes?: string;
}

export interface StaffAttendance {
  id: number;
  staffId: number;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'vacation' | 'sick-leave';
  notes?: string;
}

export interface StaffSearchParams {
  query?: string;
  propertyId?: number;
  role?: string;
  department?: string;
  status?: 'active' | 'inactive' | 'on-leave';
  skills?: string[];
  sort?: 'name' | 'role' | 'department' | 'performance' | 'joinDate';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}