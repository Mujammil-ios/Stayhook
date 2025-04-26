import { useState } from "react";
import { format } from "date-fns";
import { reservationsData, getGuestById, getRoomById } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("checkInDate");
  
  // Sort and filter reservations
  const filteredBookings = [...reservationsData]
    .filter(booking => {
      // Filter by status
      if (statusFilter !== "all" && booking.status !== statusFilter) return false;
      
      // Filter by search term (guest name, room, etc)
      if (searchTerm) {
        const guest = getGuestById(booking.guestIds[0]);
        const room = getRoomById(booking.roomId);
        const searchLower = searchTerm.toLowerCase();
        
        const guestName = `${guest?.firstName} ${guest?.lastName}`.toLowerCase();
        const roomInfo = `${room?.number} ${room?.category}`.toLowerCase();
        
        if (!guestName.includes(searchLower) && !roomInfo.includes(searchLower)) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "checkInDate":
          return a.checkInDate.getTime() - b.checkInDate.getTime();
        case "guestName":
          const guestA = getGuestById(a.guestIds[0]);
          const guestB = getGuestById(b.guestIds[0]);
          return `${guestA?.lastName}, ${guestA?.firstName}`.localeCompare(`${guestB?.lastName}, ${guestB?.firstName}`);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300";
      default:
        return "bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-300";
    }
  };

  return (
    <div>
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Booking History</h1>
        <div className="mt-3 sm:mt-0">
          <Button>
            <i className="ri-add-line mr-2"></i>
            New Booking
          </Button>
        </div>
      </div>

      <Card className="glass mb-6">
        <CardHeader>
          <CardTitle>Booking Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
              <Input
                type="text"
                placeholder="Search by guest or room..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkInDate">Check-in Date</SelectItem>
                <SelectItem value="guestName">Guest Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking #</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => {
                const guest = getGuestById(booking.guestIds[0]);
                const room = getRoomById(booking.roomId);
                
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">#{booking.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium mr-2">
                          {guest?.firstName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{guest?.firstName} {guest?.lastName}</div>
                          <div className="text-xs text-neutral-500">{guest?.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">Room {room?.number}</div>
                      <div className="text-xs text-neutral-500">{room?.category}</div>
                    </TableCell>
                    <TableCell>{format(booking.checkInDate, "MMM dd, yyyy")}</TableCell>
                    <TableCell>{format(booking.checkOutDate, "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(getStatusBadgeClasses(booking.status))}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ${booking.paymentDetails.totalAmount}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button className="text-primary hover:text-primary-600 tooltip" data-tooltip="View">
                          <i className="ri-eye-line"></i>
                        </button>
                        <button className="text-primary hover:text-primary-600 tooltip" data-tooltip="Edit">
                          <i className="ri-pencil-line"></i>
                        </button>
                        {booking.status !== "cancelled" && (
                          <button className="text-red-500 hover:text-red-600 tooltip" data-tooltip="Cancel">
                            <i className="ri-close-circle-line"></i>
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bookings;
