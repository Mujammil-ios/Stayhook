/**
 * Core application types
 * 
 * This file contains application-wide type definitions
 */

// Room related types
export interface Room {
  id: number;
  propertyId: number;
  number: string;
  floor: number;
  name: string;
  status: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  description: string;
  amenities: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertRoom {
  propertyId: number;
  number: string;
  floor: number;
  name: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  description: string;
  amenities: string[];
  images: string[];
}

// Reservation related types
export interface Reservation {
  id: number;
  roomId: number;
  guestId: number;
  checkInDate: Date;
  checkOutDate: Date;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertReservation {
  roomId: number;
  guestId: number;
  checkInDate: Date;
  checkOutDate: Date;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  specialRequests?: string;
}

// Guest related types
export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  idType?: string;
  idNumber?: string;
  nationality?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertGuest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  idType?: string;
  idNumber?: string;
  nationality?: string;
}

// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'guest';
  staffId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertUser {
  name: string;
  email: string;
  password: string; // Note: This should be hashed before insertion
  role: 'admin' | 'manager' | 'staff' | 'guest';
  staffId?: number;
}

// Property related types
export interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  type: string;
  amenities: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertProperty {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  type: string;
  amenities: string[];
  images: string[];
}