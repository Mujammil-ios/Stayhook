import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

// Room types and statuses
type RoomStatus = "available" | "occupied" | "maintenance" | "cleaning" | "reserved";
type RoomType = "standard" | "deluxe" | "suite" | "executive";
type FloorNumber = "1" | "2" | "3" | "4" | "5";

// Room information type
interface Room {
  id: string;
  number: string;
  floor: FloorNumber;
  type: RoomType;
  status: RoomStatus;
  guest?: {
    name: string;
    checkIn: string;
    checkOut: string;
    email?: string;
    phone?: string;
  };
  alerts?: {
    checkoutSoon?: boolean;
    needsMaintenance?: boolean;
    needsCleaning?: boolean;
  };
  lastCleaned?: string;
}

// Sample room data
const sampleRooms: Room[] = [
  {
    id: "r101",
    number: "101",
    floor: "1",
    type: "deluxe",
    status: "occupied",
    guest: {
      name: "Smit Akbari",
      checkIn: "2024-04-25 14:30",
      checkOut: "2024-04-27 12:00",
      email: "smit@example.com",
      phone: "+91 98765 43210"
    },
    alerts: {
      checkoutSoon: true
    },
    lastCleaned: "2024-04-25 10:15"
  },
  {
    id: "r102",
    number: "102",
    floor: "1",
    type: "deluxe",
    status: "occupied",
    guest: {
      name: "Nisha Patel",
      checkIn: "2024-04-26 13:45",
      checkOut: "2024-04-29 12:00",
      email: "nisha@example.com",
      phone: "+91 98765 43211"
    },
    lastCleaned: "2024-04-26 10:30"
  },
  {
    id: "r103",
    number: "103",
    floor: "1",
    type: "standard",
    status: "cleaning",
    lastCleaned: "2024-04-27 08:45"
  },
  {
    id: "r104",
    number: "104",
    floor: "1",
    type: "standard",
    status: "available",
    lastCleaned: "2024-04-26 16:20"
  },
  {
    id: "r105",
    number: "105",
    floor: "1",
    type: "standard",
    status: "available",
    lastCleaned: "2024-04-26 15:10"
  },
  {
    id: "r201",
    number: "201",
    floor: "2",
    type: "suite",
    status: "occupied",
    guest: {
      name: "Raj Mehta",
      checkIn: "2024-04-24 15:00",
      checkOut: "2024-04-28 12:00",
      email: "raj@example.com",
      phone: "+91 98765 43212"
    },
    lastCleaned: "2024-04-24 11:30"
  },
  {
    id: "r202",
    number: "202",
    floor: "2",
    type: "suite",
    status: "maintenance",
    alerts: {
      needsMaintenance: true
    },
    lastCleaned: "2024-04-25 09:45"
  },
  {
    id: "r203",
    number: "203",
    floor: "2",
    type: "deluxe",
    status: "reserved",
    guest: {
      name: "Priya Sharma",
      checkIn: "2024-04-28 14:00",
      checkOut: "2024-04-30 12:00",
    },
    lastCleaned: "2024-04-26 16:30"
  },
  {
    id: "r204",
    number: "204",
    floor: "2",
    type: "deluxe",
    status: "available",
    lastCleaned: "2024-04-26 14:15"
  },
  {
    id: "r301",
    number: "301",
    floor: "3",
    type: "executive",
    status: "occupied",
    guest: {
      name: "Amir Khan",
      checkIn: "2024-04-23 16:15",
      checkOut: "2024-04-27 12:00",
      email: "amir@example.com",
      phone: "+91 98765 43213"
    },
    alerts: {
      checkoutSoon: true
    },
    lastCleaned: "2024-04-23 10:45"
  },
  {
    id: "r302",
    number: "302",
    floor: "3",
    type: "executive",
    status: "available",
    lastCleaned: "2024-04-26 15:30"
  },
  {
    id: "r303",
    number: "303",
    floor: "3",
    type: "suite",
    status: "cleaning",
    alerts: {
      needsCleaning: true
    },
    lastCleaned: "2024-04-27 09:15"
  },
  {
    id: "r304",
    number: "304",
    floor: "3",
    type: "deluxe",
    status: "available",
    lastCleaned: "2024-04-26 16:45"
  },
  {
    id: "r401",
    number: "401",
    floor: "4",
    type: "standard",
    status: "available",
    lastCleaned: "2024-04-26 16:00"
  },
  {
    id: "r402",
    number: "402",
    floor: "4",
    type: "standard",
    status: "available",
    lastCleaned: "2024-04-26 16:30"
  }
];

// Room card component
function RoomCard({ room, onClick }: { room: Room; onClick: (room: Room) => void }) {
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Set up blinking effect for rooms with alerts
  useEffect(() => {
    if (room.alerts?.checkoutSoon || room.alerts?.needsMaintenance || room.alerts?.needsCleaning) {
      const interval = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [room.alerts]);
  
  // Get status color
  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return "bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-700";
      case "occupied":
        return "bg-blue-100 border-blue-400 dark:bg-blue-900/30 dark:border-blue-700";
      case "maintenance":
        return "bg-red-100 border-red-400 dark:bg-red-900/30 dark:border-red-700";
      case "cleaning":
        return "bg-yellow-100 border-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-700";
      case "reserved":
        return "bg-purple-100 border-purple-400 dark:bg-purple-900/30 dark:border-purple-700";
      default:
        return "bg-gray-100 border-gray-400 dark:bg-gray-800 dark:border-gray-600";
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>;
      case "occupied":
        return room.alerts?.checkoutSoon 
          ? <Badge className="bg-amber-500">Checkout Soon</Badge>
          : <Badge className="bg-blue-500">Occupied</Badge>;
      case "maintenance":
        return <Badge className="bg-red-500">Maintenance</Badge>;
      case "cleaning":
        return <Badge className="bg-yellow-500">Cleaning</Badge>;
      case "reserved":
        return <Badge className="bg-purple-500">Reserved</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Get room type label
  const getRoomTypeLabel = (type: RoomType) => {
    switch (type) {
      case "standard":
        return "Standard Room";
      case "deluxe":
        return "Deluxe Room";
      case "suite":
        return "Suite";
      case "executive":
        return "Executive Suite";
      default:
        return "Unknown";
    }
  };
  
  // Card styles based on room status and alerts
  const cardClasses = `relative border p-4 rounded-lg cursor-pointer transition-all
    ${getStatusColor(room.status)}
    ${(room.alerts?.checkoutSoon || room.alerts?.needsMaintenance) && isBlinking 
      ? "border-red-500 dark:border-red-400 shadow-md" 
      : ""}
    hover:shadow-md`;
  
  return (
    <div 
      className={cardClasses} 
      onClick={() => onClick(room)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold">Room {room.number}</h3>
          <p className="text-sm text-muted-foreground">{getRoomTypeLabel(room.type)}</p>
        </div>
        <div>
          {getStatusBadge(room.status)}
        </div>
      </div>
      
      {room.status === "occupied" && room.guest && (
        <div className="mt-2 text-sm">
          <p className="font-medium">{room.guest.name}</p>
          <div className="text-xs text-muted-foreground mt-1 space-y-1">
            <p>Check-in: {new Date(room.guest.checkIn).toLocaleString('en-US', { 
              month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true 
            })}</p>
            <p>Check-out: {new Date(room.guest.checkOut).toLocaleString('en-US', { 
              month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true 
            })}</p>
          </div>
        </div>
      )}
      
      {room.status === "reserved" && room.guest && (
        <div className="mt-2 text-sm">
          <p className="font-medium">{room.guest.name}</p>
          <div className="text-xs text-muted-foreground mt-1">
            <p>Arriving: {new Date(room.guest.checkIn).toLocaleString('en-US', { 
              month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true 
            })}</p>
          </div>
        </div>
      )}
      
      {(room.status === "available" || room.status === "cleaning" || room.status === "maintenance") && (
        <div className="mt-2 text-sm">
          <p className="text-xs text-muted-foreground">
            Last cleaned: {new Date(room.lastCleaned || "").toLocaleString('en-US', { 
              month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true 
            })}
          </p>
        </div>
      )}
      
      {/* Alert indicators */}
      {room.alerts?.checkoutSoon && (
        <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-amber-500 animate-pulse"></div>
      )}
      
      {room.alerts?.needsMaintenance && (
        <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
      )}
      
      {room.alerts?.needsCleaning && (
        <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-yellow-500 animate-pulse"></div>
      )}
    </div>
  );
}

// Room detail dialog component
function RoomDetailDialog({ 
  room, 
  isOpen, 
  onClose 
}: { 
  room: Room | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { toast } = useToast();
  
  if (!room) return null;
  
  // Handle actions
  const handleAction = (action: string) => {
    console.log(`ACTION: ${action}`, room.id);
    
    toast({
      title: `Room ${room.number}`,
      description: `Action performed: ${action}`,
      variant: "default",
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Room {room.number} Details</DialogTitle>
          <DialogDescription>
            Floor {room.floor} - {room.type === "standard" ? "Standard Room" : 
              room.type === "deluxe" ? "Deluxe Room" : 
              room.type === "suite" ? "Suite" : "Executive Suite"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Status</div>
            <div>
              {room.status === "available" && <Badge className="bg-green-500">Available</Badge>}
              {room.status === "occupied" && <Badge className="bg-blue-500">Occupied</Badge>}
              {room.status === "maintenance" && <Badge className="bg-red-500">Maintenance</Badge>}
              {room.status === "cleaning" && <Badge className="bg-yellow-500">Cleaning</Badge>}
              {room.status === "reserved" && <Badge className="bg-purple-500">Reserved</Badge>}
            </div>
          </div>
          
          {room.lastCleaned && (
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Last Cleaned</div>
              <div className="text-sm text-muted-foreground">
                {new Date(room.lastCleaned).toLocaleString('en-US', { 
                  year: 'numeric', month: 'short', day: 'numeric', 
                  hour: 'numeric', minute: 'numeric', hour12: true 
                })}
              </div>
            </div>
          )}
          
          {room.guest && (
            <>
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Guest Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="text-sm font-medium">{room.guest.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Check-in</span>
                    <span className="text-sm">
                      {new Date(room.guest.checkIn).toLocaleString('en-US', { 
                        year: 'numeric', month: 'short', day: 'numeric', 
                        hour: 'numeric', minute: 'numeric', hour12: true 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Check-out</span>
                    <span className="text-sm">
                      {new Date(room.guest.checkOut).toLocaleString('en-US', { 
                        year: 'numeric', month: 'short', day: 'numeric', 
                        hour: 'numeric', minute: 'numeric', hour12: true 
                      })}
                    </span>
                  </div>
                  
                  {room.guest.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Email</span>
                      <span className="text-sm">{room.guest.email}</span>
                    </div>
                  )}
                  
                  {room.guest.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <span className="text-sm">{room.guest.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          {room.alerts && Object.values(room.alerts).some(alert => alert) && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Alerts</h3>
              <div className="space-y-2">
                {room.alerts.checkoutSoon && (
                  <div className="flex items-center text-amber-600 dark:text-amber-400">
                    <i className="ri-timer-line mr-2"></i>
                    <span className="text-sm">Checkout approaching</span>
                  </div>
                )}
                {room.alerts.needsMaintenance && (
                  <div className="flex items-center text-red-600 dark:text-red-400">
                    <i className="ri-tools-line mr-2"></i>
                    <span className="text-sm">Requires maintenance</span>
                  </div>
                )}
                {room.alerts.needsCleaning && (
                  <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                    <i className="ri-brush-line mr-2"></i>
                    <span className="text-sm">Requires cleaning</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          {room.status === "available" && (
            <Button onClick={() => handleAction("New Booking")}>
              New Booking
            </Button>
          )}
          {room.status === "occupied" && (
            <Button onClick={() => handleAction("Check Out")}>
              Check Out Guest
            </Button>
          )}
          {room.status === "reserved" && (
            <Button onClick={() => handleAction("Check In")}>
              Check In Guest
            </Button>
          )}
          {room.status === "cleaning" && (
            <Button onClick={() => handleAction("Mark Clean")}>
              Mark as Clean
            </Button>
          )}
          {room.status === "maintenance" && (
            <Button onClick={() => handleAction("Mark Fixed")}>
              Mark as Fixed
            </Button>
          )}
          <Button 
            variant={room.status === "maintenance" ? "default" : "outline"}
            onClick={() => handleAction("Request Maintenance")}
            disabled={room.status === "maintenance"}
          >
            Maintenance
          </Button>
          <Button 
            variant={room.status === "cleaning" ? "default" : "outline"}
            onClick={() => handleAction("Request Cleaning")}
            disabled={room.status === "cleaning"}
          >
            Cleaning
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Floor legend component
function FloorLegend() {
  return (
    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 py-3">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-green-500"></div>
        <span className="text-sm">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-blue-500"></div>
        <span className="text-sm">Occupied</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-amber-500"></div>
        <span className="text-sm">Checkout Soon</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-purple-500"></div>
        <span className="text-sm">Reserved</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
        <span className="text-sm">Cleaning</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-red-500"></div>
        <span className="text-sm">Maintenance</span>
      </div>
    </div>
  );
}

// Main Room Monitoring component
export function RoomMonitoring() {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>(sampleRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  // Refresh data every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Refreshing room data...");
      // In a real app, this would be an API call to refresh data
      setRooms([...sampleRooms]);
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Check for alerts
  useEffect(() => {
    const checkoutSoonRooms = rooms.filter(room => room.alerts?.checkoutSoon);
    const maintenanceRooms = rooms.filter(room => room.alerts?.needsMaintenance);
    const cleaningRooms = rooms.filter(room => room.alerts?.needsCleaning);
    
    if (checkoutSoonRooms.length > 0) {
      toast({
        title: "Checkout Alert",
        description: `${checkoutSoonRooms.length} rooms are due for checkout soon`,
        variant: "destructive",
      });
    }
    
    if (maintenanceRooms.length > 0) {
      toast({
        title: "Maintenance Alert",
        description: `${maintenanceRooms.length} rooms require maintenance`,
        variant: "destructive",
      });
    }
    
    if (cleaningRooms.length > 0) {
      toast({
        title: "Cleaning Alert",
        description: `${cleaningRooms.length} rooms require cleaning`,
        variant: "destructive",
      });
    }
  }, []);
  
  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter(room => {
    // Search query filter
    const matchesSearch = 
      searchQuery === "" || 
      room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.guest && room.guest.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Floor filter
    const matchesFloor = selectedFloor === "all" || room.floor === selectedFloor;
    
    // Room type filter
    const matchesType = selectedType === "all" || room.type === selectedType;
    
    // Status filter
    const matchesStatus = 
      selectedStatus === "all" || 
      room.status === selectedStatus || 
      (selectedStatus === "checkout-soon" && room.alerts?.checkoutSoon);
    
    return matchesSearch && matchesFloor && matchesType && matchesStatus;
  });
  
  // Get stats
  const stats = {
    total: rooms.length,
    available: rooms.filter(room => room.status === "available").length,
    occupied: rooms.filter(room => room.status === "occupied").length,
    reserved: rooms.filter(room => room.status === "reserved").length,
    maintenance: rooms.filter(room => room.status === "maintenance").length,
    cleaning: rooms.filter(room => room.status === "cleaning").length,
    checkoutSoon: rooms.filter(room => room.alerts?.checkoutSoon).length,
  };
  
  // Handle room selection
  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setIsDetailOpen(true);
  };
  
  // Handle dialog close
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };
  
  // Group rooms by floor for better display
  const roomsByFloor = filteredRooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<string, Room[]>);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <h1 className="text-2xl font-semibold">Room Monitoring</h1>
        <Button 
          size="sm"
          onClick={() => {
            console.log("Refreshing room data...");
            setRooms([...sampleRooms]);
            toast({
              title: "Data Refreshed",
              description: "Room data has been updated",
              variant: "default",
            });
          }}
        >
          <i className="ri-refresh-line mr-1"></i> Refresh
        </Button>
      </div>
      
      {/* Room Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-4 text-center">
          <div className="text-sm font-medium text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </Card>
        <Card className="p-4 text-center bg-green-50 dark:bg-green-950/30">
          <div className="text-sm font-medium text-muted-foreground">Available</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.available}</div>
        </Card>
        <Card className="p-4 text-center bg-blue-50 dark:bg-blue-950/30">
          <div className="text-sm font-medium text-muted-foreground">Occupied</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.occupied}</div>
        </Card>
        <Card className="p-4 text-center bg-purple-50 dark:bg-purple-950/30">
          <div className="text-sm font-medium text-muted-foreground">Reserved</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.reserved}</div>
        </Card>
        <Card className="p-4 text-center bg-yellow-50 dark:bg-yellow-950/30">
          <div className="text-sm font-medium text-muted-foreground">Cleaning</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.cleaning}</div>
        </Card>
        <Card className="p-4 text-center bg-red-50 dark:bg-red-950/30">
          <div className="text-sm font-medium text-muted-foreground">Maintenance</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.maintenance}</div>
        </Card>
        <Card className="p-4 text-center bg-amber-50 dark:bg-amber-950/30">
          <div className="text-sm font-medium text-muted-foreground">Checkout Soon</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.checkoutSoon}</div>
        </Card>
      </div>
      
      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <FloorLegend />
        </CardContent>
      </Card>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <Input
          placeholder="Search room or guest..."
          className="md:max-w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="flex space-x-2">
          <Select value={selectedFloor} onValueChange={setSelectedFloor}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              <SelectItem value="1">Floor 1</SelectItem>
              <SelectItem value="2">Floor 2</SelectItem>
              <SelectItem value="3">Floor 3</SelectItem>
              <SelectItem value="4">Floor 4</SelectItem>
              <SelectItem value="5">Floor 5</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="deluxe">Deluxe</SelectItem>
              <SelectItem value="suite">Suite</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="checkout-soon">Checkout Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Rooms by floor */}
      {Object.keys(roomsByFloor).length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No rooms found matching your criteria
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(roomsByFloor)
            .sort(([floorA], [floorB]) => parseInt(floorA) - parseInt(floorB))
            .map(([floor, rooms]) => (
              <div key={floor} className="space-y-4">
                <h2 className="text-xl font-medium">Floor {floor}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {rooms
                    .sort((a, b) => parseInt(a.number) - parseInt(b.number))
                    .map(room => (
                      <RoomCard 
                        key={room.id} 
                        room={room} 
                        onClick={handleRoomClick} 
                      />
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      )}
      
      {/* Room detail dialog */}
      <RoomDetailDialog
        room={selectedRoom}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}