import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Booking status types
type BookingStatus = 
  | "confirmed" 
  | "checked-in" 
  | "checked-out" 
  | "cancelled" 
  | "no-show" 
  | "on-hold";

// Booking type definition
interface BookingGuest {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface Booking {
  id: string;
  roomNumber: string;
  roomType: string;
  status: BookingStatus;
  checkInDate: string;
  checkInTime?: string;
  checkOutDate: string;
  checkOutTime?: string;
  guests: BookingGuest[];
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "partial";
  notes?: string;
  checkOutSoon?: boolean;
}

// Sample data (would come from API in production)
const sampleBookings: Booking[] = [
  {
    id: "BK001",
    roomNumber: "101-A",
    roomType: "Deluxe Room",
    status: "checked-in",
    checkInDate: "2024-04-25",
    checkInTime: "05:38PM",
    checkOutDate: "2024-04-27",
    checkOutTime: "12:00PM",
    guests: [
      {
        id: 1,
        name: "Smit Akbari",
        phone: "+91 9876543210",
        email: "smit.akbari@example.com"
      },
      {
        id: 2,
        name: "Nisha Patel",
        phone: "+91 9876543211",
        email: "nisha.patel@example.com"
      }
    ],
    totalAmount: 12500,
    paymentStatus: "paid"
  },
  {
    id: "BK002",
    roomNumber: "102-A",
    roomType: "Deluxe Room",
    status: "checked-in",
    checkInDate: "2024-04-25",
    checkInTime: "06:15PM",
    checkOutDate: "2024-04-28",
    checkOutTime: "12:00PM",
    guests: [
      {
        id: 3,
        name: "Raj Mehta",
        phone: "+91 9876543212",
        email: "raj.mehta@example.com"
      }
    ],
    totalAmount: 18750,
    paymentStatus: "paid"
  },
  {
    id: "BK003",
    roomNumber: "201-A",
    roomType: "Suite Room",
    status: "checked-in",
    checkInDate: "2024-04-26",
    checkInTime: "02:30PM",
    checkOutDate: "2024-04-27",
    checkOutTime: "11:00AM",
    checkOutSoon: true,
    guests: [
      {
        id: 4,
        name: "Amir Khan",
        phone: "+91 9876543213",
        email: "amir.khan@example.com"
      },
      {
        id: 5,
        name: "Priya Sharma",
        phone: "+91 9876543214",
        email: "priya.sharma@example.com"
      }
    ],
    totalAmount: 15000,
    paymentStatus: "paid"
  },
  {
    id: "BK004",
    roomNumber: "103-A",
    roomType: "Deluxe Room",
    status: "confirmed",
    checkInDate: "2024-04-28",
    checkOutDate: "2024-04-30",
    guests: [
      {
        id: 6,
        name: "Ananya Desai",
        phone: "+91 9876543215",
        email: "ananya.desai@example.com"
      }
    ],
    totalAmount: 12500,
    paymentStatus: "partial"
  },
  {
    id: "BK005",
    roomNumber: "202-A",
    roomType: "Suite Room",
    status: "on-hold",
    checkInDate: "2024-04-29",
    checkOutDate: "2024-05-01",
    guests: [
      {
        id: 7,
        name: "Vikram Singhania",
        phone: "+91 9876543216",
        email: "vikram.singhania@example.com"
      }
    ],
    totalAmount: 22500,
    paymentStatus: "pending",
    notes: "Awaiting payment confirmation"
  },
  {
    id: "BK006",
    roomNumber: "104-A",
    roomType: "Deluxe Room",
    status: "cancelled",
    checkInDate: "2024-04-24",
    checkOutDate: "2024-04-26",
    guests: [
      {
        id: 8,
        name: "Sanya Malhotra",
        phone: "+91 9876543217",
        email: "sanya.malhotra@example.com"
      }
    ],
    totalAmount: 12500,
    paymentStatus: "paid",
    notes: "Refund processed"
  },
  {
    id: "BK007",
    roomNumber: "203-A",
    roomType: "Suite Room",
    status: "no-show",
    checkInDate: "2024-04-23",
    checkOutDate: "2024-04-25",
    guests: [
      {
        id: 9,
        name: "Karan Johar",
        phone: "+91 9876543218",
        email: "karan.johar@example.com"
      }
    ],
    totalAmount: 15000,
    paymentStatus: "paid",
    notes: "No-show penalty applied"
  },
];

// Booking table row component
const BookingRow: React.FC<{ 
  booking: Booking,
  onClick: (booking: Booking) => void 
}> = ({ booking, onClick }) => {
  const [blinking, setBlinking] = useState(false);
  
  // Set up blinking effect for bookings with upcoming checkout
  useEffect(() => {
    if (booking.checkOutSoon) {
      const interval = setInterval(() => {
        setBlinking(prev => !prev);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [booking.checkOutSoon]);

  // Status badge style
  const getStatusBadge = () => {
    switch (booking.status) {
      case "confirmed":
        return <Badge className="bg-blue-500">Confirmed</Badge>;
      case "checked-in":
        return <Badge className="bg-green-500">Checked In</Badge>;
      case "checked-out":
        return <Badge className="bg-neutral-500">Checked Out</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case "no-show":
        return <Badge variant="destructive">No Show</Badge>;
      case "on-hold":
        return <Badge className="bg-yellow-500">On Hold</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Payment status badge
  const getPaymentBadge = () => {
    switch (booking.paymentStatus) {
      case "paid":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700">Pending</Badge>;
      case "partial":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700">Partial</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <TableRow 
      className={`${booking.checkOutSoon && blinking ? 'bg-amber-50 dark:bg-amber-950/30' : ''} cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/30`}
      onClick={() => onClick(booking)}
    >
      <TableCell>
        <div className="font-medium">{booking.id}</div>
        <div className="text-xs text-muted-foreground">{booking.roomNumber}</div>
      </TableCell>
      <TableCell>{booking.roomType}</TableCell>
      <TableCell>
        <div>{booking.guests[0].name}</div>
        <div className="text-xs text-muted-foreground">
          {booking.guests.length > 1 ? `+${booking.guests.length - 1} more` : ''}
        </div>
      </TableCell>
      <TableCell>
        <div>{booking.checkInDate}</div>
        <div className="text-xs text-muted-foreground">{booking.checkInTime || ''}</div>
      </TableCell>
      <TableCell>
        <div>{booking.checkOutDate}</div>
        <div className="text-xs text-muted-foreground">{booking.checkOutTime || ''}</div>
      </TableCell>
      <TableCell>{getStatusBadge()}</TableCell>
      <TableCell>
        <div className="font-medium">₹{booking.totalAmount.toLocaleString()}</div>
        <div>{getPaymentBadge()}</div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-1 justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <i className="ri-eye-line"></i>
          </Button>
          {(booking.status === "confirmed" || booking.status === "on-hold") && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <i className="ri-edit-line"></i>
            </Button>
          )}
          {booking.status === "checked-in" && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <i className="ri-logout-box-line"></i>
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

// Booking details dialog component
const BookingDetailsDialog: React.FC<{
  booking: Booking | null,
  isOpen: boolean,
  onClose: () => void
}> = ({ booking, isOpen, onClose }) => {
  if (!booking) return null;

  // Get primary guest
  const primaryGuest = booking.guests[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            Reference ID: {booking.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Booking Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Room</div>
                <div className="font-medium">{booking.roomNumber} ({booking.roomType})</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <div>
                  {booking.status === "confirmed" && <Badge className="bg-blue-500">Confirmed</Badge>}
                  {booking.status === "checked-in" && <Badge className="bg-green-500">Checked In</Badge>}
                  {booking.status === "checked-out" && <Badge className="bg-neutral-500">Checked Out</Badge>}
                  {booking.status === "cancelled" && <Badge className="bg-red-500">Cancelled</Badge>}
                  {booking.status === "no-show" && <Badge variant="destructive">No Show</Badge>}
                  {booking.status === "on-hold" && <Badge className="bg-yellow-500">On Hold</Badge>}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Check-in</div>
                <div className="font-medium">{booking.checkInDate}</div>
                <div className="text-xs">{booking.checkInTime || ''}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Check-out</div>
                <div className="font-medium">{booking.checkOutDate}</div>
                <div className="text-xs">{booking.checkOutTime || ''}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Amount</div>
                <div className="font-medium">₹{booking.totalAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Payment</div>
                <div>
                  {booking.paymentStatus === "paid" && 
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700">Paid</Badge>
                  }
                  {booking.paymentStatus === "pending" && 
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700">Pending</Badge>
                  }
                  {booking.paymentStatus === "partial" && 
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700">Partial</Badge>
                  }
                </div>
              </div>
            </div>
            
            {booking.notes && (
              <div>
                <div className="text-xs text-muted-foreground">Notes</div>
                <div className="text-sm mt-1 p-2 bg-muted rounded-md">{booking.notes}</div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Guest Information</h3>
            
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                  <i className="ri-user-3-line"></i>
                </div>
                <div>
                  <div className="font-medium">{primaryGuest.name}</div>
                  <div className="text-xs text-muted-foreground">Primary Guest</div>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-muted-foreground">Contact</div>
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <i className="ri-phone-line text-muted-foreground"></i>
                    {primaryGuest.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-mail-line text-muted-foreground"></i>
                    {primaryGuest.email}
                  </div>
                </div>
              </div>
            </div>
            
            {booking.guests.length > 1 && (
              <div>
                <div className="text-xs text-muted-foreground mb-2">Additional Guests</div>
                <div className="space-y-2">
                  {booking.guests.slice(1).map(guest => (
                    <div key={guest.id} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs mr-2">
                        <i className="ri-user-line"></i>
                      </div>
                      <div>
                        <div className="text-sm">{guest.name}</div>
                        <div className="text-xs text-muted-foreground">{guest.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          {booking.status === "confirmed" && (
            <Button variant="default">
              <i className="ri-login-box-line mr-1"></i> Check In
            </Button>
          )}
          {booking.status === "checked-in" && (
            <Button variant="default">
              <i className="ri-logout-box-line mr-1"></i> Check Out
            </Button>
          )}
          {["confirmed", "on-hold"].includes(booking.status) && (
            <Button variant="outline">
              <i className="ri-edit-line mr-1"></i> Edit Booking
            </Button>
          )}
          {["confirmed", "on-hold"].includes(booking.status) && (
            <Button variant="outline" className="text-red-500 hover:text-red-600">
              <i className="ri-close-circle-line mr-1"></i> Cancel
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function BookingManagement() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  
  // Auto-refresh data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Refreshing booking data...");
      // In a real app, this would be an API call
      // For now, we'll just use the sample data
      setBookings([...sampleBookings]);
      
      // Only show the toast for debugging purposes
      if (process.env.NODE_ENV === "development") {
        toast({
          title: "Data Refreshed",
          description: "Booking data has been updated",
          variant: "default",
        });
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [toast]);
  
  // Check for bookings with upcoming checkout and show alerts
  useEffect(() => {
    const checkoutSoonBookings = bookings.filter(booking => booking.checkOutSoon);
    
    if (checkoutSoonBookings.length > 0) {
      checkoutSoonBookings.forEach(booking => {
        console.log("ALERT: Checkout soon", booking.id);
        
        toast({
          title: "Checkout Alert",
          description: `Room ${booking.roomNumber} is checking out soon`,
          variant: "destructive",
        });
      });
    }
  }, [bookings, toast]);
  
  // Filter bookings based on selected filter
  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    if (filter === "confirmed" && booking.status === "confirmed") return true;
    if (filter === "checked-in" && booking.status === "checked-in") return true;
    if (filter === "checked-out" && booking.status === "checked-out") return true;
    if (filter === "active" && ["confirmed", "checked-in"].includes(booking.status)) return true;
    if (filter === "inactive" && ["checked-out", "cancelled", "no-show"].includes(booking.status)) return true;
    if (filter === "checkout-soon" && booking.checkOutSoon) return true;
    return false;
  });

  // Handle row click to open details
  const handleRowClick = (booking: Booking) => {
    console.log("ACTION: View Booking Details", booking.id);
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };
  
  // Handle closing the details dialog
  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-semibold">Booking Management</h1>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              console.log("ACTION: Create New Booking");
              toast({
                title: "Feature",
                description: "Create New Booking functionality would open here",
                variant: "default",
              });
            }}
          >
            <i className="ri-add-line mr-1"></i> New Booking
          </Button>
        </div>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-4 text-center">
          <div className="text-sm font-medium text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{bookings.length}</div>
        </Card>
        <Card className="p-4 text-center bg-blue-50 dark:bg-blue-950/50">
          <div className="text-sm font-medium text-muted-foreground">Confirmed</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {bookings.filter(b => b.status === "confirmed").length}
          </div>
        </Card>
        <Card className="p-4 text-center bg-green-50 dark:bg-green-950/50">
          <div className="text-sm font-medium text-muted-foreground">Checked In</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {bookings.filter(b => b.status === "checked-in").length}
          </div>
        </Card>
        <Card className="p-4 text-center bg-neutral-50 dark:bg-neutral-950/50">
          <div className="text-sm font-medium text-muted-foreground">Checked Out</div>
          <div className="text-2xl font-bold text-neutral-600 dark:text-neutral-400">
            {bookings.filter(b => b.status === "checked-out").length}
          </div>
        </Card>
        <Card className="p-4 text-center bg-red-50 dark:bg-red-950/50">
          <div className="text-sm font-medium text-muted-foreground">Cancelled</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {bookings.filter(b => b.status === "cancelled").length}
          </div>
        </Card>
        <Card className="p-4 text-center bg-yellow-50 dark:bg-yellow-950/50">
          <div className="text-sm font-medium text-muted-foreground">On Hold</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {bookings.filter(b => b.status === "on-hold").length}
          </div>
        </Card>
        <Card className="p-4 text-center bg-amber-50 dark:bg-amber-950/50">
          <div className="text-sm font-medium text-muted-foreground">Checkout Soon</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {bookings.filter(b => b.checkOutSoon).length}
          </div>
        </Card>
      </div>
      
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Bookings
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("active")}
        >
          Active
        </Button>
        <Button
          variant={filter === "confirmed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("confirmed")}
          className="border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          Confirmed
        </Button>
        <Button
          variant={filter === "checked-in" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("checked-in")}
          className="border-green-500 hover:bg-green-100 dark:hover:bg-green-900"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Checked In
        </Button>
        <Button
          variant={filter === "checkout-soon" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("checkout-soon")}
          className="border-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900"
        >
          <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
          Checkout Soon
        </Button>
        <Button
          variant={filter === "inactive" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("inactive")}
        >
          Inactive
        </Button>
      </div>
      
      {/* Bookings table */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Room Type</TableHead>
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
                      No bookings found matching the selected filter
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map(booking => (
                    <BookingRow 
                      key={booking.id} 
                      booking={booking} 
                      onClick={handleRowClick}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Booking details dialog */}
      <BookingDetailsDialog
        booking={selectedBooking}
        isOpen={detailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
}