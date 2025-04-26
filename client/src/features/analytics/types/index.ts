/**
 * Analytics Types
 */

export interface AnalyticsSummary {
  occupancyRate: number;
  revPAR: number;
  ADR: number;
  totalRevenue: number;
  totalBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
}

export interface AnalyticsChartData {
  label: string;
  value: number;
  previousValue?: number;
  change?: number;
  color?: string;
}

export interface OccupancyData {
  averageOccupancy: number;
  occupancyByDate: Array<{
    date: string;
    occupancy: number;
    available: number;
    total: number;
  }>;
  occupancyByRoomType: Array<{
    roomType: string;
    occupancy: number;
    available: number;
    total: number;
  }>;
}

export interface RevenueData {
  totalRevenue: number;
  revenueByDate: Array<{
    date: string;
    revenue: number;
    previousRevenue?: number;
  }>;
  revenueByRoomType: Array<{
    roomType: string;
    revenue: number;
    percentage: number;
  }>;
  revenueBySource: Array<{
    source: string;
    revenue: number;
    percentage: number;
  }>;
  ADR: number;
  revPAR: number;
}

export interface BookingStatsData {
  totalBookings: number;
  bookingsByDate: Array<{
    date: string;
    bookings: number;
    previousBookings?: number;
  }>;
  bookingsBySource: Array<{
    source: string;
    bookings: number;
    percentage: number;
  }>;
  bookingsByStatus: Array<{
    status: string;
    bookings: number;
    percentage: number;
  }>;
  averageStayLength: number;
  cancellationRate: number;
}

export interface GuestStatsData {
  totalGuests: number;
  newGuests: number;
  returningGuests: number;
  guestsByLoyaltyTier: Array<{
    tier: string;
    guests: number;
    percentage: number;
  }>;
  guestsByCountry: Array<{
    country: string;
    guests: number;
    percentage: number;
  }>;
  guestsBySource: Array<{
    source: string;
    guests: number;
    percentage: number;
  }>;
}

export interface PerformanceStatsData {
  topPerformers: Array<{
    staffId: number;
    name: string;
    department: string;
    tasksCompleted: number;
    averageRating: number;
  }>;
  departmentPerformance: Array<{
    department: string;
    tasksCompleted: number;
    tasksPending: number;
    averageRating: number;
  }>;
  tasksCompleted: number;
  tasksPending: number;
  averageRating: number;
}

export interface ForecastData {
  forecastValues: Array<{
    date: string;
    value: number;
  }>;
  confidenceInterval: Array<{
    date: string;
    lower: number;
    upper: number;
  }>;
  seasonalFactors: Array<{
    period: string;
    factor: number;
  }>;
  forecastAccuracy: number;
}

export interface CustomReportResult {
  results: Array<Record<string, any>>;
  metadata: {
    metrics: string[];
    dimensions: string[];
    filters?: Record<string, any>;
    startDate?: string;
    endDate?: string;
  };
}

export interface AnalyticsFilters {
  propertyId?: number;
  startDate?: Date;
  endDate?: Date;
  groupBy?: 'day' | 'week' | 'month';
  roomCategory?: string;
  includeAddOns?: boolean;
  segmentBy?: 'demographics' | 'source' | 'loyalty' | 'frequency';
  departmentId?: number;
  forecastType?: 'occupancy' | 'revenue' | 'bookings';
}