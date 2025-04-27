import React from "react";
import { RefinedRoomMonitoring } from "@/features/rooms/components/RefinedRoomMonitoring";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function LiveMonitoring() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2 sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Live Monitoring</h1>
          <p className="text-sm text-muted-foreground">
            Real-time overview of room status and occupancy
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/bookings" className="flex items-center">
              <i className="ri-calendar-line mr-2"></i> Bookings
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/rooms" className="flex items-center">
              <i className="ri-door-line mr-2"></i> Room Management
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard" className="flex items-center">
              <i className="ri-dashboard-line mr-2"></i> Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Room monitoring component */}
      <RefinedRoomMonitoring />
    </div>
  );
}