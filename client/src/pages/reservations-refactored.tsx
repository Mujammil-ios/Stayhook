/**
 * Reservations Page (Refactored Version)
 * 
 * This is a refactored version of the reservations page that uses
 * the new feature-based architecture and components.
 */

import { useState } from "react";
import { BookingList, BookingModal, useBookings } from "@/features/booking";
import { Notification } from "@/shared/components/Notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  
  return (
    <div className="page-container">
      <div className="section-header">
        <div>
          <h1 className="section-title">Reservations</h1>
          <p className="section-description">
            Manage all reservations and bookings for your property.
          </p>
        </div>
        
        <Button onClick={() => setIsNewBookingModalOpen(true)}>
          <i className="ri-add-line mr-1.5"></i>
          New Reservation
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Manage Reservations</CardTitle>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        
        <CardContent>
          <TabsContent value="all" className="mt-0">
            <BookingList 
              title="" 
              showControls={true}
            />
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-0">
            <UpcomingReservations />
          </TabsContent>
          
          <TabsContent value="current" className="mt-0">
            <CurrentReservations />
          </TabsContent>
          
          <TabsContent value="past" className="mt-0">
            <PastReservations />
          </TabsContent>
        </CardContent>
      </Card>
      
      <BookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
      />
    </div>
  );
}

// Upcoming reservations tab content
function UpcomingReservations() {
  const today = new Date();
  const { bookings, isLoading, isError, error } = useBookings({
    status: 'confirmed',
    dateRange: {
      from: today
    },
    sortBy: 'checkInDate',
    sortOrder: 'asc'
  });
  
  if (isLoading) {
    return <div className="py-4">Loading upcoming reservations...</div>;
  }
  
  if (isError) {
    return (
      <Notification
        variant="error"
        title="Error Loading Reservations"
        message={error?.toString() || "Failed to load upcoming reservations"}
        className="mt-4"
      />
    );
  }
  
  if (bookings?.length === 0) {
    return (
      <Notification
        variant="info"
        title="No Upcoming Reservations"
        message="There are no upcoming reservations at this time."
        className="mt-4"
      />
    );
  }
  
  return (
    <BookingList 
      title="" 
      showControls={false}
    />
  );
}

// Current reservations tab content
function CurrentReservations() {
  const today = new Date();
  const { bookings, isLoading, isError, error } = useBookings({
    status: 'checked-in',
    sortBy: 'checkOutDate',
    sortOrder: 'asc'
  });
  
  if (isLoading) {
    return <div className="py-4">Loading current reservations...</div>;
  }
  
  if (isError) {
    return (
      <Notification
        variant="error"
        title="Error Loading Reservations"
        message={error?.toString() || "Failed to load current reservations"}
        className="mt-4"
      />
    );
  }
  
  if (bookings?.length === 0) {
    return (
      <Notification
        variant="info"
        title="No Current Guests"
        message="There are no guests currently checked in."
        className="mt-4"
      />
    );
  }
  
  return (
    <BookingList 
      title="" 
      showControls={false}
    />
  );
}

// Past reservations tab content
function PastReservations() {
  const today = new Date();
  const { bookings, isLoading, isError, error } = useBookings({
    status: 'checked-out',
    sortBy: 'checkOutDate',
    sortOrder: 'desc'
  });
  
  if (isLoading) {
    return <div className="py-4">Loading past reservations...</div>;
  }
  
  if (isError) {
    return (
      <Notification
        variant="error"
        title="Error Loading Reservations"
        message={error?.toString() || "Failed to load past reservations"}
        className="mt-4"
      />
    );
  }
  
  if (bookings?.length === 0) {
    return (
      <Notification
        variant="info"
        title="No Past Reservations"
        message="There are no past reservations to display."
        className="mt-4"
      />
    );
  }
  
  return (
    <BookingList 
      title="" 
      showControls={false}
    />
  );
}