import { useState } from "react";
import { format, addDays } from "date-fns";
import { roomsData, guestsData } from "@/lib/data";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { GuestModal } from "@/components/forms/guest/GuestModal";
import { BookingModal } from "@/components/forms/booking/BookingModal";

const Reservations = () => {
  const today = new Date();
  const [selectedDates, setSelectedDates] = useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: today,
    to: addDays(today, 3)
  });
  
  const [roomType, setRoomType] = useState("all");
  const [search, setSearch] = useState("");
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Get unique room types
  const roomTypes = Array.from(new Set(roomsData.map(room => room.category)));

  // Filter available rooms based on selected criteria
  const availableRooms = roomsData.filter(room => {
    if (roomType !== "all" && room.category !== roomType) return false;
    if (search && !room.number.toLowerCase().includes(search.toLowerCase())) return false;
    return room.status === "available";
  });

  return (
    <div>
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Reservation System</h1>
        <div className="mt-3 sm:mt-0">
          <Button
            onClick={() => setIsBookingModalOpen(true)}
            disabled={!selectedGuest || !selectedRoom}
          >
            <i className="ri-calendar-check-line mr-2"></i>
            Confirm Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar and Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Select Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="range"
                selected={selectedDates}
                onSelect={(value) => setSelectedDates(value as { from: Date; to: Date | undefined })}
                className="rounded-md border"
                initialFocus
              />
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Check-in:</span>
                  <span className="text-sm">{selectedDates.from ? format(selectedDates.from, "MMM dd, yyyy") : "Select date"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Check-out:</span>
                  <span className="text-sm">{selectedDates.to ? format(selectedDates.to, "MMM dd, yyyy") : "Select date"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Duration:</span>
                  <span className="text-sm">
                    {selectedDates.from && selectedDates.to 
                      ? Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24)) 
                      : 0} night(s)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Filter Rooms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Room Type</label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {roomTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
                  <Input
                    type="text"
                    placeholder="Room number..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Guest</label>
                <Select value={selectedGuest} onValueChange={setSelectedGuest}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select existing guest" />
                  </SelectTrigger>
                  <SelectContent>
                    {guestsData.map(guest => (
                      <SelectItem key={guest.id} value={guest.id.toString()}>
                        {guest.firstName} {guest.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center">
                <span className="mr-2 text-sm text-neutral-500">Or</span>
                <hr className="flex-grow" />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsGuestModalOpen(true)}
              >
                <i className="ri-user-add-line mr-2"></i>
                Add New Guest
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Available Rooms */}
        <div className="lg:col-span-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Available Rooms</CardTitle>
              <p className="text-sm text-neutral-500">
                {selectedDates.from && selectedDates.to
                  ? `For ${format(selectedDates.from, "MMM dd, yyyy")} to ${format(selectedDates.to, "MMM dd, yyyy")}`
                  : "Select dates to see availability"}
              </p>
            </CardHeader>
            <CardContent>
              {availableRooms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableRooms.map(room => (
                    <div 
                      key={room.id} 
                      className="glass overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                        <i className="ri-hotel-bed-line text-3xl text-neutral-400"></i>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium">Room {room.number}</h3>
                          <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                            Available
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">{room.category}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="font-bold">${room.baseRate}/night</span>
                          <Button 
                            size="sm" 
                            variant={selectedRoom === room.id ? "default" : "outline"}
                            onClick={() => setSelectedRoom(room.id)}
                          >
                            {selectedRoom === room.id ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="ri-search-line text-4xl text-neutral-400"></i>
                  <h3 className="mt-4 text-lg font-medium">No Available Rooms</h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    Try changing your search criteria or selecting different dates.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Guest Modal */}
      <GuestModal 
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        initialData={{
          checkInDate: selectedDates.from,
          checkOutDate: selectedDates.to || addDays(selectedDates.from, 1)
        }}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          // Reset the selected room when closing the modal
          setSelectedRoom(null);
        }}
        initialData={{
          guestId: selectedGuest,
          roomId: selectedRoom?.toString() || "",
          checkInDate: selectedDates.from,
          checkOutDate: selectedDates.to || addDays(selectedDates.from, 1),
          adults: "1",
          children: "0"
        }}
      />
    </div>
  );
};

export default Reservations;
