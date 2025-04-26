/**
 * BookingList Component
 * 
 * Displays a list of bookings with filtering, sorting, and pagination.
 * Demonstrates the use of our new services and hooks architecture.
 */

import { useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import { BookingFilterParams, BookingStatus } from '../types';
import { Reservation } from '@shared/schema';
import { BookingModal } from './BookingModal';
import { format } from 'date-fns';
import { guestService, roomService } from '@/shared/services';
import { UI_CONFIG } from '@/shared/config';
import { useQuery } from '@tanstack/react-query';
import { Notification } from '@/shared/components/Notification';

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Status badge style mapping
const statusStyles: Record<BookingStatus, string> = {
  'pending': 'status-badge status-pending',
  'confirmed': 'status-badge bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
  'checked-in': 'status-badge bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
  'checked-out': 'status-badge bg-neutral-100 text-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400',
  'cancelled': 'status-badge bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
  'no-show': 'status-badge bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500',
};

interface BookingListProps {
  title?: string;
  limit?: number;
  showControls?: boolean;
  className?: string;
}

export function BookingList({
  title = "Bookings",
  limit = 10,
  showControls = true,
  className = "",
}: BookingListProps) {
  // Filter state
  const [filters, setFilters] = useState<BookingFilterParams>({
    status: 'all',
    page: 1,
    limit: limit,
    sortBy: 'checkInDate',
    sortOrder: 'desc',
  });
  
  // Modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(null);
  
  // Fetch bookings with filters
  const { bookings, isLoading, isError, error, deleteBooking, isDeleting } = useBookings(filters);
  
  // Get page count
  const pageCount = Math.ceil((bookings?.length || 0) / limit);
  
  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'checked-in', label: 'Checked In' },
    { value: 'checked-out', label: 'Checked Out' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  
  // Edit booking
  const handleEditBooking = (booking: Reservation) => {
    setSelectedBooking(booking);
    setIsBookingModalOpen(true);
  };
  
  // Delete booking
  const handleDeleteBooking = (id: number) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      deleteBooking(id);
    }
  };
  
  // New booking
  const handleNewBooking = () => {
    setSelectedBooking(null);
    setIsBookingModalOpen(true);
  };
  
  // Update filters
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset to page 1 when filters change
      page: key !== 'page' ? 1 : value,
    }));
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;
    
    handleFilterChange('search', searchQuery);
  };
  
  // Format display values
  const formatDateDisplay = (date: string | Date) => {
    return date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A';
  };
  
  // Get guest name - fetch on demand
  const GuestName = ({ guestIds }: { guestIds: number[] }) => {
    const guestId = guestIds?.[0]; // Just show the primary guest
    
    const { data: guest } = useQuery({
      queryKey: ['guest', guestId],
      queryFn: () => guestService.getById(guestId),
      enabled: !!guestId,
    });
    
    return guest?.data ? (
      <span>{guest.data.firstName} {guest.data.lastName}</span>
    ) : (
      <span className="text-neutral-400">Loading...</span>
    );
  };
  
  // Get room number - fetch on demand
  const RoomNumber = ({ roomId }: { roomId: number }) => {
    const { data: room } = useQuery({
      queryKey: ['room', roomId],
      queryFn: () => roomService.getById(roomId),
      enabled: !!roomId,
    });
    
    return room?.data ? (
      <span>{room.data.number} ({room.data.category})</span>
    ) : (
      <span className="text-neutral-400">Loading...</span>
    );
  };
  
  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    
    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => handleFilterChange('page', Math.max(1, filters.page || 1 - 1))}
          disabled={(filters.page || 1) <= 1}
        />
      </PaginationItem>
    );
    
    // Page numbers
    if (pageCount <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= pageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={(filters.page || 1) === i}
              onClick={() => handleFilterChange('page', i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Complex pagination for more than 7 pages
      const currentPage = filters.page || 1;
      
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handleFilterChange('page', 1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Show ellipsis if not starting at page 2
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Calculate range around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(pageCount - 1, currentPage + 1);
      
      // Middle pages
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handleFilterChange('page', i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Show ellipsis if not ending at second-to-last page
      if (currentPage < pageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Always show last page
      items.push(
        <PaginationItem key={pageCount}>
          <PaginationLink
            isActive={currentPage === pageCount}
            onClick={() => handleFilterChange('page', pageCount)}
          >
            {pageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => handleFilterChange('page', Math.min(pageCount, (filters.page || 1) + 1))}
          disabled={(filters.page || 1) >= pageCount}
        />
      </PaginationItem>
    );
    
    return items;
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-xl font-medium">{title}</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
          <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (isError) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-xl font-medium">{title}</h2>
        <Notification
          variant="error"
          title="Error Loading Bookings"
          message={error?.toString() || "An error occurred while loading bookings."}
        />
      </div>
    );
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-medium">{title}</h2>
        
        {showControls && (
          <Button onClick={handleNewBooking} className="shrink-0">
            <i className="ri-add-line mr-1"></i>
            New Booking
          </Button>
        )}
      </div>
      
      {/* Filters */}
      {showControls && (
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <Input
              name="search"
              placeholder="Search bookings..."
              className="flex-1"
              defaultValue={filters.search || ''}
            />
            <Button type="submit" variant="outline">
              <i className="ri-search-line"></i>
            </Button>
          </form>
          
          <div className="flex gap-2">
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filters.sortBy || 'checkInDate'}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkInDate">Check In</SelectItem>
                <SelectItem value="checkOutDate">Check Out</SelectItem>
                <SelectItem value="createdAt">Created</SelectItem>
                <SelectItem value="totalAmount">Amount</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.sortOrder || 'desc'}
              onValueChange={(value) => handleFilterChange('sortOrder', value)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                  No bookings found. {showControls && "Create a new booking to get started."}
                </TableCell>
              </TableRow>
            ) : (
              bookings?.map((booking: Reservation) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">#{booking.id}</TableCell>
                  <TableCell>
                    <GuestName guestIds={booking.guestIds as number[]} />
                  </TableCell>
                  <TableCell>
                    <RoomNumber roomId={booking.roomId} />
                  </TableCell>
                  <TableCell>{formatDateDisplay(booking.checkInDate)}</TableCell>
                  <TableCell>{formatDateDisplay(booking.checkOutDate)}</TableCell>
                  <TableCell>
                    <Badge className={statusStyles[booking.status as BookingStatus]}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditBooking(booking)}
                        title="Edit Booking"
                      >
                        <i className="ri-pencil-line"></i>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteBooking(booking.id)}
                        disabled={isDeleting}
                        title="Delete Booking"
                      >
                        <i className="ri-delete-bin-line text-destructive"></i>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {showControls && pageCount > 1 && (
        <Pagination>
          <PaginationContent>
            {getPaginationItems()}
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialData={selectedBooking as any}
        isEditing={!!selectedBooking}
      />
    </div>
  );
}

export default BookingList;