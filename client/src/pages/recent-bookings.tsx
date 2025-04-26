import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  getRecentReservations,
  getGuestById,
  getRoomById,
} from "@/lib/data";
import { format, subDays } from "date-fns";

// Sort options
type SortOption = "newest" | "oldest" | "checkIn" | "checkOut" | "guestName";

export default function RecentBookings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Get all reservations (more than the dashboard shows)
  const allReservations = getRecentReservations(20);
  
  // Filtered and sorted reservations
  const filteredReservations = useMemo(() => {
    return allReservations
      .filter((booking) => {
        // Get guest info for search
        const guest = getGuestById(booking.guestIds[0]);
        const room = getRoomById(booking.roomId);
        const guestName = `${guest?.firstName} ${guest?.lastName}`.toLowerCase();
        const roomInfo = `Room ${room?.number} ${room?.category}`.toLowerCase();
        
        // Search filter
        const matchesSearch = 
          searchQuery === "" || 
          guestName.includes(searchQuery.toLowerCase()) ||
          roomInfo.includes(searchQuery.toLowerCase()) ||
          booking.status.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Status filter
        const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Handle sorting
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case "oldest":
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case "checkIn":
            return new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime();
          case "checkOut":
            return new Date(a.checkOutDate).getTime() - new Date(b.checkOutDate).getTime();
          case "guestName": {
            const guestA = getGuestById(a.guestIds[0]);
            const guestB = getGuestById(b.guestIds[0]);
            return `${guestA?.firstName} ${guestA?.lastName}`.localeCompare(
              `${guestB?.firstName} ${guestB?.lastName}`
            );
          }
          default:
            return 0;
        }
      });
  }, [allReservations, searchQuery, sortBy, statusFilter]);

  // Function to get status badge styles
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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Recent Bookings</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            View and manage recent guest bookings
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="self-start">
          <Link href="/" className="flex items-center">
            <i className="ri-arrow-left-line mr-2 text-lg"></i>
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="glass mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search Filter */}
            <div className="col-span-1 sm:col-span-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <i className="ri-search-line text-neutral-400"></i>
                </span>
                <Input
                  type="text"
                  placeholder="Search by guest name, room, or status..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
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
            </div>

            {/* Sort Filter */}
            <div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="checkIn">Check-in Date</SelectItem>
                  <SelectItem value="checkOut">Check-out Date</SelectItem>
                  <SelectItem value="guestName">Guest Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSortBy("newest");
                setStatusFilter("all");
              }}
            >
              Reset Filters
            </Button>
            <Badge className="bg-primary py-1 px-3">
              {filteredReservations.length} Booking{filteredReservations.length !== 1 && "s"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="glass mb-10">
        <CardHeader className="pb-0">
          <CardTitle>Recent Booking Activity</CardTitle>
          <CardDescription>
            Showing bookings from the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="responsive-table">
            {filteredReservations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((booking) => {
                    const guest = getGuestById(booking.guestIds[0]);
                    const room = getRoomById(booking.roomId);
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium">
                              {guest?.firstName.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div>{guest?.firstName} {guest?.lastName}</div>
                              <div className="text-sm text-neutral-500">{guest?.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>Room {room?.number}</div>
                          <div className="text-sm text-neutral-500">{room?.category}</div>
                        </TableCell>
                        <TableCell>{format(booking.checkInDate, "MMM dd, yyyy")}</TableCell>
                        <TableCell>{format(booking.checkOutDate, "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadgeClasses(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${booking.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="mr-1 tooltip" data-tooltip="View details">
                            <i className="ri-eye-line"></i>
                          </Button>
                          <Button variant="ghost" size="icon" className="mr-1 tooltip" data-tooltip="Edit">
                            <i className="ri-pencil-line"></i>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive tooltip" data-tooltip="Cancel">
                            <i className="ri-close-circle-line"></i>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <i className="ri-calendar-2-line text-4xl text-neutral-400 mb-3"></i>
                <h3 className="text-lg font-semibold mb-1">No Bookings Found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
                  Try adjusting your filters or search query to find bookings.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-end mb-10">
        <Button variant="outline">
          <i className="ri-download-line mr-2"></i>
          Export to CSV
        </Button>
        <Button>
          <i className="ri-add-line mr-2"></i>
          New Booking
        </Button>
      </div>
    </div>
  );
}