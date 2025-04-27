import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { NewBookingModal } from "./NewBookingModal";

// Define types
type BookingStatus = 
  | "confirmed" 
  | "checked-in" 
  | "checked-out" 
  | "cancelled" 
  | "no-show" 
  | "on-hold";

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

// Sample booking data
const sampleBookings: Booking[] = [
  {
    id: "B1001",
    roomNumber: "101",
    roomType: "Deluxe Room",
    status: "checked-in",
    checkInDate: "2024-04-25",
    checkInTime: "14:30",
    checkOutDate: "2024-04-27",
    checkOutTime: "12:00",
    guests: [
      { id: 1, name: "Smit Akbari", phone: "+91 9876543210", email: "smit@example.com" }
    ],
    totalAmount: 15000,
    paymentStatus: "paid",
    checkOutSoon: true
  },
  {
    id: "B1002",
    roomNumber: "102",
    roomType: "Deluxe Room",
    status: "checked-in",
    checkInDate: "2024-04-26",
    checkInTime: "13:45",
    checkOutDate: "2024-04-29",
    checkOutTime: "12:00",
    guests: [
      { id: 2, name: "Nisha Patel", phone: "+91 9876543211", email: "nisha@example.com" }
    ],
    totalAmount: 20000,
    paymentStatus: "paid"
  },
  {
    id: "B1003",
    roomNumber: "201",
    roomType: "Suite Room",
    status: "confirmed",
    checkInDate: "2024-04-28",
    checkOutDate: "2024-05-02",
    guests: [
      { id: 3, name: "Rahul Sharma", phone: "+91 9876543212", email: "rahul@example.com" }
    ],
    totalAmount: 25000,
    paymentStatus: "pending"
  },
  {
    id: "B1004",
    roomNumber: "103",
    roomType: "Deluxe Room",
    status: "checked-out",
    checkInDate: "2024-04-20",
    checkInTime: "13:45",
    checkOutDate: "2024-04-25",
    checkOutTime: "11:30",
    guests: [
      { id: 4, name: "Anjali Desai", phone: "+91 9876543213", email: "anjali@example.com" }
    ],
    totalAmount: 18000,
    paymentStatus: "paid"
  },
  {
    id: "B1005",
    roomNumber: "202",
    roomType: "Suite Room",
    status: "cancelled",
    checkInDate: "2024-04-22",
    checkOutDate: "2024-04-24",
    guests: [
      { id: 5, name: "Vikram Singh", phone: "+91 9876543214", email: "vikram@example.com" }
    ],
    totalAmount: 12000,
    paymentStatus: "partial"
  },
  {
    id: "B1006",
    roomNumber: "104",
    roomType: "Deluxe Room",
    status: "checked-in",
    checkInDate: "2024-04-27",
    checkInTime: "12:30",
    checkOutDate: "2024-04-29",
    checkOutTime: "12:00",
    guests: [
      { id: 6, name: "Priya Mehta", phone: "+91 9876543215", email: "priya@example.com" }
    ],
    totalAmount: 10000,
    paymentStatus: "paid",
    checkOutSoon: true
  },
  {
    id: "B1007",
    roomNumber: "203",
    roomType: "Suite Room",
    status: "no-show",
    checkInDate: "2024-04-26",
    checkOutDate: "2024-04-28",
    guests: [
      { id: 7, name: "Prakash Joshi", phone: "+91 9876543216", email: "prakash@example.com" }
    ],
    totalAmount: 15000,
    paymentStatus: "pending"
  },
  {
    id: "B1008",
    roomNumber: "105",
    roomType: "Deluxe Room",
    status: "on-hold",
    checkInDate: "2024-04-29",
    checkOutDate: "2024-05-01",
    guests: [
      { id: 8, name: "Meera Shah", phone: "+91 9876543217", email: "meera@example.com" }
    ],
    totalAmount: 13500,
    paymentStatus: "partial",
    notes: "Waiting for payment confirmation"
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
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
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
        return <Badge className="bg-amber-500">On Hold</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Get payment status badge
  const getPaymentBadge = (status: "paid" | "pending" | "partial") => {
    switch (status) {
      case "paid":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-400">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-400">Pending</Badge>;
      case "partial":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-400">Partial</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <TableRow 
      className={`${booking.checkOutSoon ? 'hover:bg-amber-50 dark:hover:bg-amber-950/30' : 'hover:bg-muted/50'} cursor-pointer`}
      onClick={() => onClick(booking)}
    >
      <TableCell>
        <div className="font-medium">{booking.id}</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{booking.roomNumber}</div>
        <div className="text-xs text-muted-foreground">{booking.roomType}</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{booking.guests[0]?.name}</div>
        <div className="text-xs text-muted-foreground">
          {booking.guests.length > 1 ? `+${booking.guests.length - 1} more` : ''}
        </div>
      </TableCell>
      <TableCell>
        <div>{formatDate(booking.checkInDate)}</div>
        <div className="text-xs text-muted-foreground">
          {booking.checkInTime || ''}
        </div>
      </TableCell>
      <TableCell>
        <div>{formatDate(booking.checkOutDate)}</div>
        <div className="text-xs text-muted-foreground">
          {booking.checkOutTime || ''}
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(booking.status)}</TableCell>
      <TableCell>
        <div className="font-medium">₹{booking.totalAmount.toLocaleString()}</div>
        <div>{getPaymentBadge(booking.paymentStatus)}</div>
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Quick action on ${booking.id}`);
          }}
        >
          <i className="ri-more-2-fill"></i>
        </Button>
      </TableCell>
    </TableRow>
  );
}

// Booking detail view component
function BookingDetailView({ 
  booking, 
  onClose,
  onAction
}: { 
  booking: Booking; 
  onClose: () => void;
  onAction: (action: string, bookingId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Booking {booking.id}</h2>
          <p className="text-muted-foreground">
            {booking.checkInDate} to {booking.checkOutDate}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            <i className="ri-close-line mr-1"></i> Close
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Booking Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Room</div>
                <div className="font-medium">{booking.roomNumber}</div>
                <div className="text-sm">{booking.roomType}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Check-in</div>
                <div className="font-medium">{booking.checkInDate}</div>
                <div className="text-sm">{booking.checkInTime || ''}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Check-out</div>
                <div className="font-medium">{booking.checkOutDate}</div>
                <div className="text-sm">{booking.checkOutTime || ''}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div>
                  {booking.status === "confirmed" && <Badge className="bg-green-500">Confirmed</Badge>}
                  {booking.status === "checked-in" && <Badge className="bg-blue-500">Checked In</Badge>}
                  {booking.status === "checked-out" && <Badge className="bg-purple-500">Checked Out</Badge>}
                  {booking.status === "cancelled" && <Badge className="bg-red-500">Cancelled</Badge>}
                  {booking.status === "no-show" && <Badge className="bg-gray-500">No Show</Badge>}
                  {booking.status === "on-hold" && <Badge className="bg-amber-500">On Hold</Badge>}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Amount</div>
                <div className="font-medium">₹{booking.totalAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Payment</div>
                <div>
                  {booking.paymentStatus === "paid" && <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-400">Paid</Badge>}
                  {booking.paymentStatus === "pending" && <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-400">Pending</Badge>}
                  {booking.paymentStatus === "partial" && <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-400">Partial</Badge>}
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-4">
                <div className="text-sm text-muted-foreground">Notes</div>
                <div className="mt-1 p-3 border rounded-md bg-muted/20">{booking.notes}</div>
              </div>
            )}

            <div className="flex items-center space-x-2 pt-4 border-t">
              {booking.status === "confirmed" && (
                <>
                  <Button onClick={() => onAction("Check In", booking.id)}>
                    <i className="ri-login-box-line mr-1"></i> Check In
                  </Button>
                  <Button variant="outline" onClick={() => onAction("Cancel", booking.id)}>
                    <i className="ri-close-line mr-1"></i> Cancel
                  </Button>
                </>
              )}
              {booking.status === "checked-in" && (
                <>
                  <Button onClick={() => onAction("Check Out", booking.id)}>
                    <i className="ri-logout-box-line mr-1"></i> Check Out
                  </Button>
                  <Button variant="outline" onClick={() => onAction("Extend", booking.id)}>
                    <i className="ri-calendar-line mr-1"></i> Extend Stay
                  </Button>
                </>
              )}
              {booking.status === "on-hold" && (
                <>
                  <Button onClick={() => onAction("Confirm", booking.id)}>
                    <i className="ri-check-line mr-1"></i> Confirm
                  </Button>
                  <Button variant="outline" onClick={() => onAction("Cancel", booking.id)}>
                    <i className="ri-close-line mr-1"></i> Cancel
                  </Button>
                </>
              )}
              {(booking.status === "confirmed" || booking.status === "checked-in" || booking.status === "on-hold") && (
                <Button variant="outline" onClick={() => onAction("Edit", booking.id)}>
                  <i className="ri-pencil-line mr-1"></i> Edit
                </Button>
              )}
              <Button variant="outline" onClick={() => onAction("Invoice", booking.id)}>
                <i className="ri-bill-line mr-1"></i> Invoice
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Guest Information */}
        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking.guests.map((guest) => (
              <div key={guest.id} className="p-3 border rounded-md space-y-2">
                <div className="font-medium">{guest.name}</div>
                <div className="flex items-center text-sm">
                  <i className="ri-phone-line text-muted-foreground mr-2"></i>
                  {guest.phone}
                </div>
                <div className="flex items-center text-sm">
                  <i className="ri-mail-line text-muted-foreground mr-2"></i>
                  {guest.email}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main booking management component
export function BookingManagement() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  
  // Handle row click
  const handleRowClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };
  
  // Handle booking action
  const handleBookingAction = (action: string, bookingId: string) => {
    console.log(`ACTION: ${action}`, bookingId);
    
    toast({
      title: action,
      description: `${action} action performed on booking ${bookingId}`,
    });
    
    // In a real app, this would make an API call
    // For now, let's just close the detail view
    if (action === "Check Out" || action === "Cancel") {
      setSelectedBooking(null);
    }
  };
  
  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchQuery === "" || 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guests.some(guest => guest.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      {selectedBooking ? (
        <BookingDetailView 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)}
          onAction={handleBookingAction}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="w-full sm:w-96 relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></i>
              <Input
                placeholder="Search by ID, room, or guest name..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setNewBookingModalOpen(true)}>
                <i className="ri-add-line mr-1"></i> New Booking
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
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
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      No bookings found
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
        </>
      )}
      
      <NewBookingModal 
        isOpen={newBookingModalOpen} 
        onClose={() => setNewBookingModalOpen(false)} 
      />
    </div>
  );
}