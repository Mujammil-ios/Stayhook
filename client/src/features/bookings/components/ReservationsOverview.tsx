import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";

// Define booking status types for better type safety
type BookingStatus = 
  | "confirmed" 
  | "checked-in" 
  | "checked-out" 
  | "cancelled" 
  | "no-show" 
  | "on-hold";

// Sample data for booking stats
const bookingStats = {
  total: 142,
  categories: {
    "confirmed": 48,
    "checked-in": 36,
    "checked-out": 28,
    "cancelled": 12,
    "no-show": 6,
    "on-hold": 12
  },
  revenue: {
    today: 25600,
    thisMonth: 386000,
    lastMonth: 325800
  },
  occupancy: {
    today: 76,
    thisMonth: 82,
    lastMonth: 68
  }
};

// Sample data for calendar view
const calendarBookings = [
  { date: new Date(2024, 3, 27), count: 8, type: "check-in" },
  { date: new Date(2024, 3, 27), count: 5, type: "check-out" },
  { date: new Date(2024, 3, 28), count: 6, type: "check-in" },
  { date: new Date(2024, 3, 28), count: 4, type: "check-out" },
  { date: new Date(2024, 3, 29), count: 10, type: "check-in" },
  { date: new Date(2024, 3, 29), count: 3, type: "check-out" },
  { date: new Date(2024, 3, 30), count: 7, type: "check-in" },
  { date: new Date(2024, 3, 30), count: 9, type: "check-out" },
  { date: new Date(2024, 4, 1), count: 12, type: "check-in" },
  { date: new Date(2024, 4, 1), count: 6, type: "check-out" },
  { date: new Date(2024, 4, 2), count: 5, type: "check-in" },
  { date: new Date(2024, 4, 2), count: 8, type: "check-out" },
];

// Sample upcoming bookings data
const upcomingBookings = [
  { 
    id: "B1007",
    guestName: "Rajesh Kumar",
    roomType: "Deluxe Room",
    checkInDate: "2024-04-28",
    nights: 3,
    status: "confirmed",
    amount: 15000
  },
  { 
    id: "B1008",
    guestName: "Ananya Patel",
    roomType: "Suite Room",
    checkInDate: "2024-04-28",
    nights: 2,
    status: "confirmed",
    amount: 24000
  },
  { 
    id: "B1009",
    guestName: "Suresh Mehta",
    roomType: "Standard Room",
    checkInDate: "2024-04-29",
    nights: 1,
    status: "on-hold",
    amount: 6500
  },
  { 
    id: "B1010",
    guestName: "Divya Singh",
    roomType: "Deluxe Room",
    checkInDate: "2024-04-30",
    nights: 4,
    status: "confirmed",
    amount: 20000
  },
  { 
    id: "B1011",
    guestName: "Vikrant Desai",
    roomType: "Suite Room",
    checkInDate: "2024-05-01",
    nights: 2,
    status: "confirmed",
    amount: 24000
  }
];

export function ReservationsOverview() {
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date());
  
  // Function to get booking counts for a specific date
  const getBookingsForDate = (date: Date) => {
    return calendarBookings.filter(booking => 
      booking.date.getDate() === date.getDate() && 
      booking.date.getMonth() === date.getMonth() &&
      booking.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Custom calendar render function to show booking counts
  const renderCalendarCell = (day: Date) => {
    const bookings = getBookingsForDate(day);
    const checkIns = bookings.find(b => b.type === "check-in")?.count || 0;
    const checkOuts = bookings.find(b => b.type === "check-out")?.count || 0;
    
    if (checkIns === 0 && checkOuts === 0) return null;
    
    return (
      <div className="flex flex-col items-center justify-center text-[10px] mt-1">
        {checkIns > 0 && (
          <div className="flex items-center text-green-600">
            <i className="ri-login-box-line mr-0.5"></i>
            <span>{checkIns}</span>
          </div>
        )}
        {checkOuts > 0 && (
          <div className="flex items-center text-red-600">
            <i className="ri-logout-box-line mr-0.5"></i>
            <span>{checkOuts}</span>
          </div>
        )}
      </div>
    );
  };
  
  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "checked-in":
        return <Badge className="bg-blue-500">Checked In</Badge>;
      case "checked-out":
        return <Badge className="bg-purple-500">Checked Out</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case "no-show":
        return <Badge className="bg-gray-500">No Show</Badge>;
      case "on-hold":
        return <Badge className="bg-amber-500">On Hold</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingStats.total}</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <div className="text-xs">
                  Active <span className="font-medium">{bookingStats.categories["confirmed"] + bookingStats.categories["checked-in"]}</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                <div className="text-xs">
                  On Hold <span className="font-medium">{bookingStats.categories["on-hold"]}</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                <div className="text-xs">
                  Cancelled <span className="font-medium">{bookingStats.categories["cancelled"]}</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
                <div className="text-xs">
                  No Show <span className="font-medium">{bookingStats.categories["no-show"]}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Current Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingStats.occupancy.today}%</div>
            <Progress className="h-2 mt-2" value={bookingStats.occupancy.today} />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">This Month</span>
                <span className="text-sm font-medium">{bookingStats.occupancy.thisMonth}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Last Month</span>
                <span className="text-sm font-medium">{bookingStats.occupancy.lastMonth}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Today's Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                <i className="ri-login-box-line text-xl text-green-600"></i>
                <span className="mt-1 text-lg font-semibold">8</span>
                <span className="text-xs text-muted-foreground">Check-ins</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                <i className="ri-logout-box-line text-xl text-red-600"></i>
                <span className="mt-1 text-lg font-semibold">5</span>
                <span className="text-xs text-muted-foreground">Check-outs</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">New Bookings</span>
                <span className="text-sm font-medium">3 today</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Cancellations</span>
                <span className="text-sm font-medium">1 today</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{bookingStats.revenue.today.toLocaleString()}</div>
            <div className="text-xs text-green-600 mt-1">+12% from yesterday</div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">This Month</span>
                <span className="text-sm font-medium">₹{bookingStats.revenue.thisMonth.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Last Month</span>
                <span className="text-sm font-medium">₹{bookingStats.revenue.lastMonth.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Booking Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Booking Calendar</CardTitle>
            <CardDescription>Check-ins and check-outs for the month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center mb-4 space-x-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Check-in</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Check-out</span>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={selectedMonth}
                onSelect={setSelectedMonth}
                month={selectedMonth}
                className="rounded-md border"
                components={{
                  DayContent: ({ date }) => (
                    <div className="flex flex-col items-center">
                      <div>{date.getDate()}</div>
                      {renderCalendarCell(date)}
                    </div>
                  ),
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Check-ins</CardTitle>
            <CardDescription>Next 5 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex flex-col p-3 border rounded-md hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{booking.guestName}</span>
                    {renderStatusBadge(booking.status)}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground">Room</span>
                      <p>{booking.roomType}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Check-in</span>
                      <p>{booking.checkInDate}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Nights</span>
                      <p>{booking.nights}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Amount</span>
                      <p>₹{booking.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Booking Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Status Distribution</CardTitle>
          <CardDescription>Current status of all bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(bookingStats.categories) as BookingStatus[]).map((status) => (
              <div 
                key={status} 
                className="flex flex-col p-4 border rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full 
                    ${status === "confirmed" ? "bg-green-100 text-green-600" : ""}
                    ${status === "checked-in" ? "bg-blue-100 text-blue-600" : ""}
                    ${status === "checked-out" ? "bg-purple-100 text-purple-600" : ""}
                    ${status === "cancelled" ? "bg-red-100 text-red-600" : ""}
                    ${status === "no-show" ? "bg-gray-100 text-gray-600" : ""}
                    ${status === "on-hold" ? "bg-amber-100 text-amber-600" : ""}
                  `}>
                    <i className={`
                      ${status === "confirmed" ? "ri-check-line" : ""}
                      ${status === "checked-in" ? "ri-login-box-line" : ""}
                      ${status === "checked-out" ? "ri-logout-box-line" : ""}
                      ${status === "cancelled" ? "ri-close-line" : ""}
                      ${status === "no-show" ? "ri-question-mark" : ""}
                      ${status === "on-hold" ? "ri-time-line" : ""}
                    `}></i>
                  </div>
                  <div>
                    <div className="font-medium capitalize">{status.replace("-", " ")}</div>
                    <div className="text-2xl font-bold">{bookingStats.categories[status]}</div>
                  </div>
                </div>
                <Progress 
                  className="h-2 mt-3" 
                  value={(bookingStats.categories[status] / bookingStats.total) * 100} 
                />
                <div className="text-xs text-muted-foreground mt-2">
                  {Math.round((bookingStats.categories[status] / bookingStats.total) * 100)}% of total
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}