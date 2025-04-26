/**
 * Property Types
 */

export interface PropertyAddress {
  street: string;
  secondary?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyContact {
  name: string;
  email: string;
  phone: string;
  position?: string;
}

export interface PropertyPhoto {
  id: number;
  propertyId: number;
  url: string;
  caption?: string;
  isFeatured: boolean;
  uploadedAt: string;
  sortOrder: number;
}

export interface PropertySettings {
  timezone: string;
  currency: string;
  language: string;
  checkInTime: string;
  checkOutTime: string;
  taxRate: number;
  hasBreakfast: boolean;
  breakfastPrice?: number;
  hasParkingSpace: boolean;
  parkingPrice?: number;
  petsAllowed: boolean;
  petFee?: number;
  cancellationDeadline: number;
  cancellationFee?: number;
  autoApproveBookings: boolean;
  maxGuestsPerRoom: number;
  maxChildrenPerRoom: number;
  extraPersonFee?: number;
  depositRequired: boolean;
  depositAmount?: number;
  depositPercentage?: number;
}

export interface PropertyStats {
  totalRooms: number;
  availableRooms: number;
  occupancyRate: number;
  avgRoomRate: number;
  currentGuests: number;
  upcomingReservations: number;
  pendingReservations: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  revenueToday: number;
  revenueThisMonth: number;
}

export interface PropertyPolicyRule {
  title: string;
  content: string;
}

export interface PropertyPolicy {
  id: number;
  propertyId: number;
  name: string;
  description: string;
  type: string;
  rules: PropertyPolicyRule[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertySearchParams {
  query?: string;
  type?: string;
  country?: string;
  state?: string;
  city?: string;
  amenities?: string[];
  minRooms?: number;
  maxRooms?: number;
  sort?: 'name' | 'location' | 'rooms' | 'rating' | 'revenue';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}