/**
 * Guest Types
 */

export interface GuestLoyalty {
  tier: string;
  points: number;
  expiryDate: Date | null;
  benefits: string[];
  history: Array<{
    date: string;
    action: string;
    points: number;
  }>;
}

export interface GuestDocument {
  id: number;
  guestId: number;
  type: string;
  documentNumber: string;
  issuingCountry: string;
  expiryDate: string;
  documentUrl: string;
  uploadedAt: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
}

export interface GuestPreferences {
  roomPreferences?: string[];
  dietaryRestrictions?: string[];
  specialRequests?: string[];
  communicationPreferences?: {
    email?: boolean;
    sms?: boolean;
    phone?: boolean;
  };
}

export interface GuestStayHistory {
  reservationId: number;
  propertyId: number;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  totalAmount: number;
  status: string;
  rating?: number;
  feedback?: string;
}

export interface GuestSearchParams {
  query?: string;
  propertyId?: number;
  status?: 'active' | 'inactive' | 'blacklisted';
  loyaltyTier?: string;
  sort?: 'name' | 'email' | 'lastStay' | 'totalStays' | 'totalSpent' | 'loyalty';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GuestNote {
  id: number;
  guestId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  category?: 'general' | 'complaint' | 'request' | 'feedback';
  isPrivate: boolean;
}