import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Guest {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface Booking {
  id: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime?: string;
  status: 'upcoming' | 'in-house' | 'completed' | 'cancelled' | 'no-show';
  guests: Guest[];
  paymentStatus: 'paid' | 'pending' | 'partial';
  totalAmount: number;
  checkOutSoon?: boolean;
}

// Sample booking data
const sampleBookings: Booking[] = [
  {
    id: "B1001",
    roomNumber: "101",
    roomType: "Deluxe Room",
    checkInDate: "2024-04-27",
    checkOutDate: "2024-04-30",
    checkInTime: "02:30 PM",
    status: "in-house",
    guests: [
      { id: 1, name: "Smit Akbari", phone: "+91 9876543210", email: "smit@example.com" }
    ],
    paymentStatus: "paid",
    totalAmount: 15000,
    checkOutSoon: true
  },
  {
    id: "B1002",
    roomNumber: "102",
    roomType: "Deluxe Room",
    checkInDate: "2024-04-27",
    checkOutDate: "2024-05-01",
    checkInTime: "03:15 PM",
    status: "in-house",
    guests: [
      { id: 2, name: "Nisha Patel", phone: "+91 9876543211", email: "nisha@example.com" }
    ],
    paymentStatus: "paid",
    totalAmount: 20000
  },
  {
    id: "B1003",
    roomNumber: "201",
    roomType: "Suite Room",
    checkInDate: "2024-04-28",
    checkOutDate: "2024-05-02",
    status: "upcoming",
    guests: [
      { id: 3, name: "Rahul Sharma", phone: "+91 9876543212", email: "rahul@example.com" }
    ],
    paymentStatus: "pending",
    totalAmount: 25000
  },
  {
    id: "B1004",
    roomNumber: "103",
    roomType: "Deluxe Room",
    checkInDate: "2024-04-20",
    checkOutDate: "2024-04-25",
    checkInTime: "01:45 PM",
    status: "completed",
    guests: [
      { id: 4, name: "Anjali Desai", phone: "+91 9876543213", email: "anjali@example.com" }
    ],
    paymentStatus: "paid",
    totalAmount: 18000
  },
  {
    id: "B1005",
    roomNumber: "202",
    roomType: "Suite Room",
    checkInDate: "2024-04-22",
    checkOutDate: "2024-04-24",
    status: "cancelled",
    guests: [
      { id: 5, name: "Vikram Singh", phone: "+91 9876543214", email: "vikram@example.com" }
    ],
    paymentStatus: "partial",
    totalAmount: 12000
  },
  {
    id: "B1006",
    roomNumber: "104",
    roomType: "Deluxe Room",
    checkInDate: "2024-04-27",
    checkOutDate: "2024-04-29",
    checkInTime: "12:30 PM",
    status: "in-house",
    guests: [
      { id: 6, name: "Priya Mehta", phone: "+91 9876543215", email: "priya@example.com" }
    ],
    paymentStatus: "paid",
    totalAmount: 10000,
    checkOutSoon: true
  }
];

export function BookingMonitoring() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [blinkingIds, setBlinkingIds] = useState<Set<string>>(new Set());

  // Auto-refresh bookings data every 60 seconds
  useEffect(() => {
    // Initial fetch
    fetchBookings();
    
    // Set up interval for periodic refresh
    const intervalId = setInterval(() => {
      fetchBookings();
    }, 60000); // 60 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // Blinking effect for checkout-soon bookings
  useEffect(() => {
    // Create a set of ids that need to blink
    const checkoutSoonIds = new Set(
      bookings
        .filter(booking => booking.checkOutSoon)
        .map(booking => booking.id)
    );
    
    if (checkoutSoonIds.size === 0) return;
    
    // Toggle the blinking state
    const blinkInterval = setInterval(() => {
      setBlinkingIds(prev => {
        const newSet = new Set(prev);
        checkoutSoonIds.forEach(id => {
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
        });
        return newSet;
      });
    }, 1000);
    
    return () => clearInterval(blinkInterval);
  }, [bookings]);

  // Show alert toast for checkout-soon bookings
  useEffect(() => {
    const checkoutSoonBookings = bookings.filter(booking => booking.checkOutSoon);
    
    if (checkoutSoonBookings.length > 0) {
      toast({
        title: "Checkout Alert",
        description: `${checkoutSoonBookings.length} room(s) are due for checkout soon!`,
        variant: "destructive",
      });
    }
  }, []);

  // Fetch bookings data (simulated)
  const fetchBookings = async () => {
    console.log("Fetching bookings data...");
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be an API call
      // For now we'll just use our sample data
      setBookings([...sampleBookings]);
      
      console.log("Bookings data refreshed");
    } catch (error) {
      console.error("Error fetching bookings data:", error);
    }
  };

  // Filter bookings based on search query and status filter
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guests.some(guest => 
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesStatus = 
      statusFilter === "all" || 
      booking.status === statusFilter ||
      (statusFilter === "checkout-soon" && booking.checkOutSoon);
    
    return matchesSearch && matchesStatus;
  });

  // Handle booking selection
  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetail(true);
    
    console.log("ACTION: View Booking Details", booking.id);
  };

  // Handle action buttons
  const handleAction = (action: string, bookingId: string) => {
    console.log(`ACTION: ${action}`, bookingId);
    
    toast({
      title: `Action: ${action}`,
      description: `Performed ${action} on booking ${bookingId}`,
      variant: "default",
    });
  };

  // Get status badge
  const getStatusBadge = (status: Booking['status'], checkOutSoon?: boolean) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case "in-house":
        return checkOutSoon 
          ? <Badge className="bg-amber-500">Checkout Soon</Badge>
          : <Badge className="bg-green-500">In House</Badge>;
      case "completed":
        return <Badge className="bg-purple-500">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case "no-show":
        return <Badge className="bg-gray-500">No Show</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-semibold">Booking Management</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={fetchBookings}
          >
            <i className="ri-refresh-line mr-1"></i> Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => console.log("ACTION: Create New Booking")}
          >
            <i className="ri-add-line mr-1"></i> New Booking
          </Button>
        </div>
      </div>
      
      {/* Search and filter controls */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="w-full md:w-96 relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></i>
          <Input
            placeholder="Search by booking ID, room, or guest name..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "upcoming" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("upcoming")}
            className="border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-1.5"></span>
            Upcoming
          </Button>
          <Button
            variant={statusFilter === "in-house" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("in-house")}
            className="border-green-500 hover:bg-green-100 dark:hover:bg-green-900"
          >
            <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
            In House
          </Button>
          <Button
            variant={statusFilter === "checkout-soon" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("checkout-soon")}
            className="border-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-1.5"></span>
            Checkout Soon
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("completed")}
            className="border-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900"
          >
            <span className="h-2 w-2 rounded-full bg-purple-500 mr-1.5"></span>
            Completed
          </Button>
        </div>
      </div>
      
      {/* Bookings table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Booking ID</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No bookings found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow 
                  key={booking.id} 
                  className={`
                    ${blinkingIds.has(booking.id) ? 'bg-amber-100 dark:bg-amber-950/30' : ''}
                    cursor-pointer hover:bg-muted/50
                  `}
                  onClick={() => handleSelectBooking(booking)}
                >
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.roomNumber}</div>
                    <div className="text-xs text-muted-foreground">{booking.roomType}</div>
                  </TableCell>
                  <TableCell>
                    {booking.guests.length > 0 && (
                      <div>
                        <div>{booking.guests[0].name}</div>
                        <div className="text-xs text-muted-foreground">
                          {booking.guests.length > 1 ? `+${booking.guests.length - 1} more` : ''}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{booking.checkInDate}</TableCell>
                  <TableCell>{booking.checkOutDate}</TableCell>
                  <TableCell>{getStatusBadge(booking.status, booking.checkOutSoon)}</TableCell>
                  <TableCell>
                    <div className="font-medium">₹{booking.totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground capitalize">{booking.paymentStatus}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction("View", booking.id);
                        }}
                      >
                        <i className="ri-eye-line"></i>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction("Edit", booking.id);
                        }}
                      >
                        <i className="ri-pencil-line"></i>
                      </Button>
                      {booking.status === "in-house" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction("Checkout", booking.id);
                          }}
                        >
                          <i className="ri-logout-box-line"></i>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Booking detail panel (slides in/out based on selection) */}
      {selectedBooking && (
        <Card className={`fixed right-0 top-0 h-full w-full md:w-1/3 lg:w-1/4 z-50 shadow-lg transition-transform duration-300 ease-in-out ${showDetail ? 'translate-x-0' : 'translate-x-full'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
            <div>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>
                ID: {selectedBooking.id} | Room: {selectedBooking.roomNumber}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowDetail(false)}
            >
              <i className="ri-close-line"></i>
            </Button>
          </CardHeader>
          <CardContent className="pt-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Booking Information</h3>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Room Type</p>
                    <p className="font-medium">{selectedBooking.roomType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p>{getStatusBadge(selectedBooking.status, selectedBooking.checkOutSoon)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-medium">{selectedBooking.checkInDate}</p>
                    <p className="text-xs text-muted-foreground">{selectedBooking.checkInTime || ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-medium">{selectedBooking.checkOutDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">₹{selectedBooking.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment</p>
                    <p className="font-medium capitalize">{selectedBooking.paymentStatus}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Guest Information</h3>
                {selectedBooking.guests.map((guest, index) => (
                  <div key={guest.id} className="mt-3 p-3 border rounded-md">
                    <p className="font-medium">{guest.name}</p>
                    <div className="text-sm mt-1 space-y-1">
                      <p className="flex items-center">
                        <i className="ri-phone-line mr-2 text-muted-foreground"></i>
                        {guest.phone}
                      </p>
                      <p className="flex items-center">
                        <i className="ri-mail-line mr-2 text-muted-foreground"></i>
                        {guest.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-3 pt-4 border-t">
                {selectedBooking.status === "in-house" && (
                  <Button 
                    className="flex-1"
                    onClick={() => handleAction("Checkout", selectedBooking.id)}
                  >
                    <i className="ri-logout-box-line mr-1"></i> Checkout
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleAction("Edit", selectedBooking.id)}
                >
                  <i className="ri-pencil-line mr-1"></i> Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction("Invoice", selectedBooking.id)}
                >
                  <i className="ri-bill-line mr-1"></i> Invoice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Overlay for booking detail panel */}
      {showDetail && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={() => setShowDetail(false)}
        ></div>
      )}
    </div>
  );
}