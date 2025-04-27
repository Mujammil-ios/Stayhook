import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Booking status type for type safety
type BookingStatus = 
  | "confirmed" 
  | "checked-in" 
  | "checked-out" 
  | "cancelled" 
  | "no-show" 
  | "on-hold";

// Guest information
interface BookingGuest {
  id: number;
  name: string;
  phone: string;
  email: string;
}

// Booking information
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

// Sample bookings data
const sampleBookings: Booking[] = [
  {
    id: "BK-2024-001",
    roomNumber: "101",
    roomType: "Deluxe Room",
    status: "checked-in",
    checkInDate: "2024-04-25",
    checkInTime: "14:30",
    checkOutDate: "2024-04-28",
    guests: [
      { id: 1, name: "Rahul Sharma", phone: "+91 98765 43210", email: "rahul@example.com" }
    ],
    totalAmount: 15000,
    paymentStatus: "paid",
    checkOutSoon: true
  },
  {
    id: "BK-2024-002",
    roomNumber: "102",
    roomType: "Suite Room",
    status: "confirmed",
    checkInDate: "2024-04-28",
    checkOutDate: "2024-05-01",
    guests: [
      { id: 2, name: "Priya Patel", phone: "+91 98765 43211", email: "priya@example.com" }
    ],
    totalAmount: 25000,
    paymentStatus: "partial",
    notes: "Guest requested extra towels and early check-in"
  },
  {
    id: "BK-2024-003",
    roomNumber: "205",
    roomType: "Deluxe Room",
    status: "cancelled",
    checkInDate: "2024-04-26",
    checkOutDate: "2024-04-29",
    guests: [
      { id: 3, name: "Vijay Malhotra", phone: "+91 98765 43212", email: "vijay@example.com" }
    ],
    totalAmount: 12000,
    paymentStatus: "refunded",
    notes: "Cancelled due to emergency"
  },
  {
    id: "BK-2024-004",
    roomNumber: "301",
    roomType: "Executive Suite",
    status: "checked-in",
    checkInDate: "2024-04-24",
    checkInTime: "16:15",
    checkOutDate: "2024-04-27",
    guests: [
      { id: 4, name: "Ananya Singh", phone: "+91 98765 43213", email: "ananya@example.com" },
      { id: 5, name: "Raj Singh", phone: "+91 98765 43214", email: "raj@example.com" }
    ],
    totalAmount: 30000,
    paymentStatus: "paid",
    notes: "Anniversary celebration",
    checkOutSoon: true
  },
  {
    id: "BK-2024-005",
    roomNumber: "104",
    roomType: "Standard Room",
    status: "no-show",
    checkInDate: "2024-04-25",
    checkOutDate: "2024-04-26",
    guests: [
      { id: 6, name: "Karan Kapoor", phone: "+91 98765 43215", email: "karan@example.com" }
    ],
    totalAmount: 5000,
    paymentStatus: "pending"
  },
  {
    id: "BK-2024-006",
    roomNumber: "202",
    roomType: "Deluxe Room",
    status: "checked-out",
    checkInDate: "2024-04-22",
    checkInTime: "13:00",
    checkOutDate: "2024-04-25",
    checkOutTime: "11:45",
    guests: [
      { id: 7, name: "Neha Gupta", phone: "+91 98765 43216", email: "neha@example.com" }
    ],
    totalAmount: 15000,
    paymentStatus: "paid"
  },
  {
    id: "BK-2024-007",
    roomNumber: "105",
    roomType: "Deluxe Room",
    status: "on-hold",
    checkInDate: "2024-04-28",
    checkOutDate: "2024-04-30",
    guests: [
      { id: 8, name: "Vivek Desai", phone: "+91 98765 43217", email: "vivek@example.com" }
    ],
    totalAmount: 10000,
    paymentStatus: "pending",
    notes: "Awaiting payment confirmation"
  },
  {
    id: "BK-2024-008",
    roomNumber: "303",
    roomType: "Suite Room",
    status: "confirmed",
    checkInDate: "2024-04-29",
    checkOutDate: "2024-05-03",
    guests: [
      { id: 9, name: "Shreya Joshi", phone: "+91 98765 43218", email: "shreya@example.com" }
    ],
    totalAmount: 22000,
    paymentStatus: "paid"
  }
];

// Booking row component
function BookingRow({ 
  booking, 
  onClick 
}: { 
  booking: Booking, 
  onClick: (booking: Booking) => void 
}) {
  // Get status badge
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "checked-in":
        return booking.checkOutSoon 
          ? <Badge className="bg-amber-500">Checkout Soon</Badge>
          : <Badge className="bg-blue-500">Checked In</Badge>;
      case "checked-out":
        return <Badge className="bg-purple-500">Checked Out</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case "no-show":
        return <Badge className="bg-gray-500">No Show</Badge>;
      case "on-hold":
        return <Badge className="bg-yellow-500">On Hold</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Get payment status badge
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "partial":
        return <Badge className="bg-blue-500">Partial</Badge>;
      case "refunded":
        return <Badge className="bg-purple-500">Refunded</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  return (
    <TableRow 
      className={`${booking.checkOutSoon ? "bg-amber-50 dark:bg-amber-950/30" : ""} hover:bg-muted/50 cursor-pointer`}
      onClick={() => onClick(booking)}
    >
      <TableCell className="font-medium">{booking.id}</TableCell>
      <TableCell>
        <div className="font-medium">{booking.roomNumber}</div>
        <div className="text-xs text-muted-foreground">{booking.roomType}</div>
      </TableCell>
      <TableCell>
        {booking.guests.length > 0 ? (
          <div>
            <div className="font-medium">{booking.guests[0].name}</div>
            {booking.guests.length > 1 && (
              <div className="text-xs text-muted-foreground">+{booking.guests.length - 1} more guests</div>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">No guests</span>
        )}
      </TableCell>
      <TableCell>
        <div>{booking.checkInDate}</div>
        {booking.checkInTime && <div className="text-xs text-muted-foreground">{booking.checkInTime}</div>}
      </TableCell>
      <TableCell>
        <div>{booking.checkOutDate}</div>
        {booking.checkOutTime && <div className="text-xs text-muted-foreground">{booking.checkOutTime}</div>}
      </TableCell>
      <TableCell>{getStatusBadge(booking.status)}</TableCell>
      <TableCell>
        <div>₹{booking.totalAmount.toLocaleString()}</div>
        <div className="text-xs">{getPaymentBadge(booking.paymentStatus)}</div>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <i className="ri-more-2-fill"></i>
        </Button>
      </TableCell>
    </TableRow>
  );
}

// Booking detail dialog component
function BookingDetailDialog({
  booking,
  isOpen,
  onClose
}: {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  
  if (!booking) return null;
  
  // Handle action clicks
  const handleAction = (action: string) => {
    console.log(`ACTION: ${action}`, booking.id);
    
    toast({
      title: `Booking ${booking.id}`,
      description: `Action performed: ${action}`,
      variant: "default",
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            Booking ID: {booking.id} | Status: {booking.status}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Room Information */}
            <div>
              <h3 className="text-lg font-medium mb-2">Room Information</h3>
              <Card>
                <CardContent className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Room Number</div>
                    <div className="font-medium">{booking.roomNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Room Type</div>
                    <div className="font-medium">{booking.roomType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Check-In</div>
                    <div className="font-medium">{booking.checkInDate}</div>
                    {booking.checkInTime && <div className="text-xs">{booking.checkInTime}</div>}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Check-Out</div>
                    <div className="font-medium">{booking.checkOutDate}</div>
                    {booking.checkOutTime && <div className="text-xs">{booking.checkOutTime}</div>}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Guest Information */}
            <div>
              <h3 className="text-lg font-medium mb-2">Guest Information</h3>
              <Card>
                <CardContent className="p-4 space-y-4">
                  {booking.guests.map((guest) => (
                    <div key={guest.id} className="space-y-2">
                      <div className="font-medium">{guest.name}</div>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center">
                          <i className="ri-phone-line text-muted-foreground mr-2"></i>
                          <span>{guest.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-mail-line text-muted-foreground mr-2"></i>
                          <span>{guest.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-medium mb-2">Payment Information</h3>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">₹{booking.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize">{booking.paymentStatus}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleAction("View Invoice")}
                    >
                      <i className="ri-bill-line mr-2"></i>
                      View Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Notes */}
            {booking.notes && (
              <div>
                <h3 className="text-lg font-medium mb-2">Notes</h3>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm">{booking.notes}</p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Actions */}
            <div>
              <h3 className="text-lg font-medium mb-2">Actions</h3>
              <Card>
                <CardContent className="p-4 space-y-3">
                  {booking.status === "confirmed" && (
                    <Button 
                      className="w-full"
                      onClick={() => handleAction("Check In")}
                    >
                      <i className="ri-login-box-line mr-2"></i>
                      Check In
                    </Button>
                  )}
                  
                  {booking.status === "checked-in" && (
                    <Button 
                      className="w-full"
                      onClick={() => handleAction("Check Out")}
                    >
                      <i className="ri-logout-box-line mr-2"></i>
                      Check Out
                    </Button>
                  )}
                  
                  {(booking.status === "confirmed" || booking.status === "on-hold") && (
                    <Button 
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleAction("Cancel Booking")}
                    >
                      <i className="ri-close-circle-line mr-2"></i>
                      Cancel Booking
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleAction("Edit Booking")}
                  >
                    <i className="ri-edit-line mr-2"></i>
                    Edit Booking
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleAction("Print Details")}
                  >
                    <i className="ri-printer-line mr-2"></i>
                    Print Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main component
export function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    // Search filter (case insensitive)
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guests.some(guest => 
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    // Status filter
    const matchesStatus = 
      statusFilter === "all" || 
      booking.status === statusFilter || 
      (statusFilter === "active" && (booking.status === "confirmed" || booking.status === "checked-in"));
    
    return matchesSearch && matchesStatus;
  });
  
  // Handle booking row click
  const handleRowClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-semibold">Booking Management</h2>
        <Button>
          <i className="ri-add-line mr-2"></i>
          New Booking
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="w-full md:w-72 relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></i>
          <Input
            placeholder="Search bookings..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 overflow-auto pb-2 md:pb-0">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active Bookings</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="checked-out">Checked Out</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <i className="ri-refresh-line"></i>
          </Button>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Booking ID</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No bookings found matching your criteria
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
      
      {/* Booking Detail Dialog */}
      <BookingDetailDialog
        booking={selectedBooking}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}