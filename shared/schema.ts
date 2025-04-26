import { pgTable, text, serial, integer, boolean, jsonb, date, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  description: text("description").notNull(),
  taxInfo: text("tax_info"),
  geoCoordinates: jsonb("geo_coordinates"),
  contactInfo: jsonb("contact_info"),
  amenities: jsonb("amenities"),
  mediaGallery: jsonb("media_gallery"),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  number: text("number").notNull(),
  floor: integer("floor").notNull(),
  category: text("category").notNull(),
  capacity: integer("capacity").notNull(),
  baseRate: real("base_rate").notNull(),
  status: text("status").notNull().default("available"),
  amenities: jsonb("amenities"),
  dynamicPricing: jsonb("dynamic_pricing"),
  maintenanceHistory: jsonb("maintenance_history"),
  mediaGallery: jsonb("media_gallery"),
});

export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  identificationDoc: text("identification_doc"),
  personalInfo: jsonb("personal_info"),
  contactDetails: jsonb("contact_details"),
  preferences: jsonb("preferences"),
  stayHistory: jsonb("stay_history"),
  loyaltyInfo: jsonb("loyalty_info"),
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  checkInDate: date("check_in_date").notNull(),
  checkOutDate: date("check_out_date").notNull(),
  status: text("status").notNull().default("pending"),
  guestIds: jsonb("guest_ids"),
  specialRequests: jsonb("special_requests"),
  paymentDetails: jsonb("payment_details"),
  timeline: jsonb("timeline"),
  linkedBookings: jsonb("linked_bookings"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  personalInfo: jsonb("personal_info"),
  employmentDetails: jsonb("employment_details"),
  performance: jsonb("performance"),
  schedule: jsonb("schedule"),
  accessPermissions: jsonb("access_permissions"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  staffId: integer("staff_id"),
  role: text("role").notNull().default("user"),
});

export const finance = pgTable("finance", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  date: date("date").notNull(),
  dailyMetrics: jsonb("daily_metrics"),
  monthlySummaries: jsonb("monthly_summaries"),
  yearlyReports: jsonb("yearly_reports"),
  forecastData: jsonb("forecast_data"),
  expenseCategories: jsonb("expense_categories"),
});

// Insert schemas
export const insertPropertySchema = createInsertSchema(properties);
export const insertRoomSchema = createInsertSchema(rooms);
export const insertGuestSchema = createInsertSchema(guests);
export const insertReservationSchema = createInsertSchema(reservations);
export const insertStaffSchema = createInsertSchema(staff);
export const insertUserSchema = createInsertSchema(users);
export const insertFinanceSchema = createInsertSchema(finance);

// Types
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type Guest = typeof guests.$inferSelect;
export type InsertGuest = z.infer<typeof insertGuestSchema>;

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

export type Staff = typeof staff.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Finance = typeof finance.$inferSelect;
export type InsertFinance = z.infer<typeof insertFinanceSchema>;
