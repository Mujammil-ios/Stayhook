import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Temporary simplified version 
const SimplifiedRoomMonitoring = () => {
  type RoomStatus = "occupied" | "vacant" | "cleaning" | "maintenance";
  
  interface Room {
    id: number;
    number: string;
    status: RoomStatus;
    guest?: string;
    checkIn?: string;
    checkOut?: string;
    lastCleaned?: string;
  }
  
  const rooms: Room[] = [
    { id: 1, number: "101", status: "occupied", guest: "John Smith", checkIn: "Apr 24", checkOut: "Apr 27" },
    { id: 2, number: "102", status: "vacant", lastCleaned: "Apr 26" },
    { id: 3, number: "103", status: "cleaning", lastCleaned: "Apr 27" },
    { id: 4, number: "201", status: "maintenance" },
    { id: 5, number: "202", status: "occupied", guest: "Jane Doe", checkIn: "Apr 25", checkOut: "Apr 28" },
    { id: 6, number: "203", status: "vacant", lastCleaned: "Apr 26" }
  ];

  const getStatusColor = (status: RoomStatus): string => {
    switch(status) {
      case "occupied": return "bg-slate-500";
      case "vacant": return "bg-green-500";
      case "cleaning": return "bg-blue-500";
      case "maintenance": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {rooms.map(room => (
          <Card key={room.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Room {room.number}</CardTitle>
                <Badge className={getStatusColor(room.status)}>
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              {room.status === "occupied" && (
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{room.guest}</p>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Check-in: {room.checkIn}</span>
                    <span>Check-out: {room.checkOut}</span>
                  </div>
                </div>
              )}
              
              {room.status === "vacant" && (
                <p className="text-sm text-muted-foreground">
                  Last cleaned: {room.lastCleaned}
                </p>
              )}
              
              {room.status === "cleaning" && (
                <p className="text-sm text-muted-foreground">
                  Cleaning in progress
                </p>
              )}
              
              {room.status === "maintenance" && (
                <p className="text-sm text-muted-foreground">
                  Under maintenance
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

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
      <SimplifiedRoomMonitoring />
    </div>
  );
}