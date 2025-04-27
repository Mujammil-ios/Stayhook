import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface BookingTile {
  id: string;
  roomNumber: string;
  roomType: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'new' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show' | 'on-hold';
  amount: number;
}

// Sample data for testing
const sampleBookings: BookingTile[] = [
  {
    id: "B1001",
    roomNumber: "101",
    roomType: "Deluxe",
    guestName: "Smit Akbari",
    checkInDate: "2024-04-27",
    checkOutDate: "2024-04-30",
    status: "checked-in",
    amount: 15000
  },
  {
    id: "B1002",
    roomNumber: "102",
    roomType: "Deluxe",
    guestName: "Nisha Patel",
    checkInDate: "2024-04-27",
    checkOutDate: "2024-05-01",
    status: "checked-in",
    amount: 20000
  },
  {
    id: "B1003",
    roomNumber: "201",
    roomType: "Suite",
    guestName: "Rahul Sharma",
    checkInDate: "2024-04-28",
    checkOutDate: "2024-05-02",
    status: "new",
    amount: 25000
  },
  {
    id: "B1004",
    roomNumber: "103",
    roomType: "Deluxe",
    guestName: "Anjali Desai",
    checkInDate: "2024-04-26",
    checkOutDate: "2024-04-27",
    status: "checked-out",
    amount: 18000
  },
  {
    id: "B1005",
    roomNumber: "202",
    roomType: "Suite",
    guestName: "Vikram Singh",
    checkInDate: "2024-04-22",
    checkOutDate: "2024-04-24",
    status: "cancelled",
    amount: 12000
  },
  {
    id: "B1006",
    roomNumber: "104",
    roomType: "Deluxe",
    guestName: "Priya Mehta",
    checkInDate: "2024-04-30",
    checkOutDate: "2024-05-02",
    status: "confirmed",
    amount: 10000
  },
  {
    id: "B1007",
    roomNumber: "203",
    roomType: "Suite",
    guestName: "Amir Khan",
    checkInDate: "2024-04-29",
    checkOutDate: "2024-05-03",
    status: "on-hold",
    amount: 30000
  },
  {
    id: "B1008",
    roomNumber: "105",
    roomType: "Deluxe",
    guestName: "Kavita Reddy",
    checkInDate: "2024-04-25",
    checkOutDate: "2024-04-28",
    status: "no-show",
    amount: 14000
  },
  {
    id: "B1009",
    roomNumber: "204",
    roomType: "Suite",
    guestName: "Jay Patel",
    checkInDate: "2024-05-01",
    checkOutDate: "2024-05-05",
    status: "confirmed",
    amount: 22000
  },
  {
    id: "B1010",
    roomNumber: "301",
    roomType: "Executive Suite",
    guestName: "Rohit Malhotra",
    checkInDate: "2024-05-02",
    checkOutDate: "2024-05-06",
    status: "new",
    amount: 35000
  }
];

interface BookingCalendarProps {
  bookings: BookingTile[];
}

// Booking calendar component
const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings }) => {
  // Get current date and month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Month name
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-24 border border-muted p-1"></div>);
  }
  
  // Map bookings to days
  const bookingsByDay: Record<string, BookingTile[]> = {};
  
  bookings.forEach(booking => {
    const checkInDate = new Date(booking.checkInDate);
    
    // Only include bookings from the current month
    if (checkInDate.getMonth() === currentMonth && checkInDate.getFullYear() === currentYear) {
      const day = checkInDate.getDate();
      if (!bookingsByDay[day]) {
        bookingsByDay[day] = [];
      }
      bookingsByDay[day].push(booking);
    }
  });
  
  // Add actual days with bookings
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    
    const dayBookings = bookingsByDay[day] || [];
    
    calendarDays.push(
      <div 
        key={`day-${day}`} 
        className={`min-h-24 border border-muted p-1 relative ${isToday ? "bg-primary/10" : ""}`}
      >
        <div className={`absolute top-1 right-1 text-xs font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>
          {day}
        </div>
        
        <div className="pt-5 space-y-1">
          {dayBookings.slice(0, 3).map((booking, index) => (
            <div 
              key={`booking-${booking.id}`} 
              className={`
                text-xs p-1 rounded truncate
                ${booking.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                ${booking.status === 'checked-in' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' : ''}
                ${booking.status === 'checked-out' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : ''}
                ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : ''}
                ${booking.status === 'no-show' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' : ''}
                ${booking.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : ''}
              `}
            >
              {booking.roomNumber}: {booking.guestName}
            </div>
          ))}
          
          {dayBookings.length > 3 && (
            <div className="text-xs text-muted-foreground pt-1">
              +{dayBookings.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{monthName} {currentYear}</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <i className="ri-arrow-left-s-line"></i>
          </Button>
          <Button variant="outline" size="sm">
            <i className="ri-arrow-right-s-line"></i>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        <div className="text-sm font-medium py-2">Sun</div>
        <div className="text-sm font-medium py-2">Mon</div>
        <div className="text-sm font-medium py-2">Tue</div>
        <div className="text-sm font-medium py-2">Wed</div>
        <div className="text-sm font-medium py-2">Thu</div>
        <div className="text-sm font-medium py-2">Fri</div>
        <div className="text-sm font-medium py-2">Sat</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-blue-500"></div>
          <span className="text-xs">New</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-green-500"></div>
          <span className="text-xs">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-indigo-500"></div>
          <span className="text-xs">Checked In</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-purple-500"></div>
          <span className="text-xs">Checked Out</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-red-500"></div>
          <span className="text-xs">Cancelled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-gray-500"></div>
          <span className="text-xs">No Show</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-yellow-500"></div>
          <span className="text-xs">On Hold</span>
        </div>
      </div>
    </div>
  );
};

// Main component
export function ReservationsOverview() {
  const { toast } = useToast();
  const [bookings] = useState<BookingTile[]>(sampleBookings);
  
  // Calculate stats
  const stats = {
    new: bookings.filter(b => b.status === "new").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    checkedIn: bookings.filter(b => b.status === "checked-in").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    noShow: bookings.filter(b => b.status === "no-show").length,
    onHold: bookings.filter(b => b.status === "on-hold").length,
    checkedOut: bookings.filter(b => b.status === "checked-out").length,
    total: bookings.length,
    totalAmount: bookings.reduce((sum, booking) => sum + booking.amount, 0)
  };
  
  // Group bookings by status for status cards
  const bookingsByStatus = {
    new: bookings.filter(b => b.status === "new"),
    confirmed: bookings.filter(b => b.status === "confirmed"),
    checkedIn: bookings.filter(b => b.status === "checked-in"),
    upcoming: bookings.filter(b => b.status === "new" || b.status === "confirmed"),
    cancelled: bookings.filter(b => b.status === "cancelled" || b.status === "no-show" || b.status === "on-hold"),
  };
  
  // Get status badge
  const getStatusBadge = (status: BookingTile['status']) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "checked-in":
        return <Badge className="bg-indigo-500">Checked In</Badge>;
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
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg">New / Confirmed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">{stats.new + stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">
              New: {stats.new} | Confirmed: {stats.confirmed}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg">In House</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">{stats.checkedIn}</div>
            <p className="text-xs text-muted-foreground">
              Currently occupied rooms
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg text-red-600 dark:text-red-400">Cancelled / No-show</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">{stats.cancelled + stats.noShow + stats.onHold}</div>
            <p className="text-xs text-muted-foreground">
              Cancelled: {stats.cancelled} | No-show: {stats.noShow} | On-hold: {stats.onHold}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg">Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">₹{stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {stats.total} bookings
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Calendar & Status Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Booking Calendar */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle>Booking Calendar</CardTitle>
            <CardDescription>
              View all bookings for the current month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingCalendar bookings={bookings} />
          </CardContent>
        </Card>
        
        {/* Status Tabs */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Bookings by Status</CardTitle>
            <CardDescription>
              Latest bookings grouped by their status
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="w-full grid grid-cols-3 h-auto p-0">
                <TabsTrigger value="upcoming" className="rounded-none py-3 data-[state=active]:bg-background">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="inhouse" className="rounded-none py-3 data-[state=active]:bg-background">
                  In House
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="rounded-none py-3 data-[state=active]:bg-background">
                  Cancelled
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="p-4 space-y-4">
                {bookingsByStatus.upcoming.length > 0 ? (
                  bookingsByStatus.upcoming.slice(0, 5).map(booking => (
                    <div 
                      key={booking.id} 
                      className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        toast({
                          title: "Booking details",
                          description: `Viewing details for booking ${booking.id}`,
                        });
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-xs text-muted-foreground">
                            Room {booking.roomNumber} - {booking.roomType}
                          </p>
                        </div>
                        <div>
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div className="flex justify-between mt-1">
                          <span>Check-in: {booking.checkInDate}</span>
                          <span>₹{booking.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No upcoming bookings
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="inhouse" className="p-4 space-y-4">
                {bookingsByStatus.checkedIn.length > 0 ? (
                  bookingsByStatus.checkedIn.slice(0, 5).map(booking => (
                    <div 
                      key={booking.id} 
                      className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        toast({
                          title: "Booking details",
                          description: `Viewing details for booking ${booking.id}`,
                        });
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-xs text-muted-foreground">
                            Room {booking.roomNumber} - {booking.roomType}
                          </p>
                        </div>
                        <div>
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div className="flex justify-between mt-1">
                          <span>Check-out: {booking.checkOutDate}</span>
                          <span>₹{booking.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No guests currently checked in
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="cancelled" className="p-4 space-y-4">
                {bookingsByStatus.cancelled.length > 0 ? (
                  bookingsByStatus.cancelled.slice(0, 5).map(booking => (
                    <div 
                      key={booking.id} 
                      className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        toast({
                          title: "Booking details",
                          description: `Viewing details for booking ${booking.id}`,
                        });
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-xs text-muted-foreground">
                            Room {booking.roomNumber} - {booking.roomType}
                          </p>
                        </div>
                        <div>
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div className="flex justify-between mt-1">
                          <span>Was due: {booking.checkInDate}</span>
                          <span>₹{booking.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No cancelled or no-show bookings
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Cancellation Policy */}
      <Card>
        <CardHeader>
          <CardTitle>Cancellation Policy</CardTitle>
          <CardDescription>
            Rules and policies for booking cancellations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Free Cancellation Period</h3>
                <p className="text-sm text-muted-foreground">
                  Bookings can be cancelled free of charge up to 48 hours before the check-in date.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Late Cancellation</h3>
                <p className="text-sm text-muted-foreground">
                  Cancellations within 48 hours of check-in will incur a charge equivalent to one night's stay.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">No-Show</h3>
                <p className="text-sm text-muted-foreground">
                  Guests who don't arrive on the check-in date will be charged the full amount of the reservation.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Early Check-out</h3>
                <p className="text-sm text-muted-foreground">
                  Guests who check out earlier than their scheduled departure date will be charged for the entire reserved stay.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Refunds</h3>
                <p className="text-sm text-muted-foreground">
                  Any applicable refunds will be processed within 7-10 business days to the original payment method.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Amendments</h3>
                <p className="text-sm text-muted-foreground">
                  Modifications to existing bookings are subject to availability and may result in rate changes.
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t text-sm text-muted-foreground">
              <p>These policies may be adjusted for group bookings, long-term stays, or during peak seasons.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}