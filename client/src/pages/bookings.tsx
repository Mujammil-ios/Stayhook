import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReservationsOverview } from "@/features/bookings/components/ReservationsOverview";
import { BookingManagement } from "@/features/bookings/components/BookingManagement";
import { BookingMonitoring } from "@/features/bookings/components/BookingMonitoring";
import { NewBookingModal } from "@/features/bookings/components/NewBookingModal";

const Bookings: React.FC = () => {
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Bookings & Reservations</h1>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button onClick={() => setNewBookingModalOpen(true)}>
            <i className="ri-add-line mr-2"></i>
            New Booking
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="management">Booking Management</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ReservationsOverview />
        </TabsContent>

        <TabsContent value="management">
          <BookingManagement />
        </TabsContent>

        <TabsContent value="monitoring">
          <BookingMonitoring />
        </TabsContent>
      </Tabs>
      
      {/* New Booking Modal */}
      <NewBookingModal 
        isOpen={newBookingModalOpen} 
        onClose={() => setNewBookingModalOpen(false)} 
      />
    </div>
  );
};

export default Bookings;