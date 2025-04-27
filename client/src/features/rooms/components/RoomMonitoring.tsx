import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Room status types
type RoomStatus = "occupied" | "vacant" | "cleaning" | "maintenance" | "reserved";

// Room type definition
interface RoomGuest {
  id: number;
  name: string;
  gender: "M" | "F";
}

interface Room {
  id: string;
  number: string;
  type: "Deluxe Room" | "Suite Room" | "Standard Room";
  status: RoomStatus;
  checkInTime?: string;
  checkOutDate?: string;
  guests?: RoomGuest[];
  needsAttention?: boolean;
  checkOutSoon?: boolean;
}

// Sample data (would come from API in production)
const sampleRooms: Room[] = [
  // Deluxe Rooms
  {
    id: "d1",
    number: "101-A",
    type: "Deluxe Room",
    status: "occupied",
    checkInTime: "05:38PM",
    checkOutDate: "20-12-2024",
    guests: [
      { id: 1, name: "Smit Akbari", gender: "M" },
      { id: 2, name: "Nisha Patel", gender: "F" }
    ]
  },
  {
    id: "d2",
    number: "102-A",
    type: "Deluxe Room",
    status: "occupied",
    checkInTime: "05:38PM",
    checkOutDate: "20-12-2024",
    guests: [
      { id: 1, name: "Smit Akbari", gender: "M" },
      { id: 2, name: "Nisha Patel", gender: "F" }
    ]
  },
  {
    id: "d3",
    number: "103-A",
    type: "Deluxe Room",
    status: "occupied",
    checkInTime: "05:38PM",
    checkOutDate: "20-12-2024",
    guests: [
      { id: 1, name: "Smit Akbari", gender: "M" },
      { id: 2, name: "Nisha Patel", gender: "F" }
    ]
  },
  {
    id: "d4",
    number: "104-A",
    type: "Deluxe Room",
    status: "occupied",
    checkInTime: "05:38PM",
    checkOutDate: "20-12-2024",
    checkOutSoon: true,
    guests: [
      { id: 1, name: "Smit Akbari", gender: "M" },
      { id: 2, name: "Nisha Patel", gender: "F" }
    ]
  },
  {
    id: "d5",
    number: "105-A",
    type: "Deluxe Room",
    status: "vacant",
  },
  {
    id: "d6",
    number: "106-A",
    type: "Deluxe Room",
    status: "cleaning",
  },
  {
    id: "d7",
    number: "107-A",
    type: "Deluxe Room",
    status: "maintenance",
    needsAttention: true,
  },
  
  // Suite Rooms
  {
    id: "s1",
    number: "201-A",
    type: "Suite Room",
    status: "occupied",
    checkInTime: "05:38PM",
    checkOutDate: "20-12-2024",
    guests: [
      { id: 1, name: "Smit Akbari", gender: "M" },
      { id: 2, name: "Nisha Patel", gender: "F" }
    ]
  },
  {
    id: "s2",
    number: "202-A",
    type: "Suite Room",
    status: "occupied",
    checkInTime: "05:38PM",
    checkOutDate: "20-12-2024",
    guests: [
      { id: 1, name: "Smit Akbari", gender: "M" },
      { id: 2, name: "Nisha Patel", gender: "F" }
    ]
  },
  {
    id: "s3",
    number: "203-A",
    type: "Suite Room",
    status: "vacant",
  },
  {
    id: "s4",
    number: "204-A",
    type: "Suite Room",
    status: "occupied",
    checkInTime: "05:38PM",
    checkOutDate: "20-12-2024",
    checkOutSoon: true,
    guests: [
      { id: 1, name: "Smit Akbari", gender: "M" },
      { id: 2, name: "Nisha Patel", gender: "F" }
    ]
  },
  {
    id: "s5",
    number: "205-A",
    type: "Suite Room",
    status: "occupied",
    checkInTime: "05:38PM",
    checkOutDate: "20-12-2024",
    guests: [
      { id: 1, name: "Smit Akbari", gender: "M" },
      { id: 2, name: "Nisha Patel", gender: "F" }
    ]
  },
];

const RoomCard: React.FC<{ room: Room }> = ({ room }) => {
  const { toast } = useToast();
  const [blinking, setBlinking] = useState(false);
  
  // Set up blinking effect for rooms with upcoming checkout
  useEffect(() => {
    if (room.checkOutSoon) {
      const interval = setInterval(() => {
        setBlinking(prev => !prev);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [room.checkOutSoon]);

  // Handler for quick actions
  const handleQuickAction = (action: string) => {
    console.log(`ACTION: ${action}`, room.id);
    toast({
      title: `Action: ${action}`,
      description: `Performed ${action} on room ${room.number}`,
      variant: "default",
    });
  };

  // Border color based on status
  const getBorderColor = () => {
    switch (room.status) {
      case "occupied":
        return "border-green-500";
      case "vacant":
        return "border-red-500";
      case "cleaning":
        return "border-yellow-500";
      case "maintenance":
        return "border-purple-500";
      default:
        return "border-gray-300";
    }
  };

  // Status badge
  const getStatusBadge = () => {
    switch (room.status) {
      case "occupied":
        return <Badge className="bg-green-500">Occupied</Badge>;
      case "vacant":
        return <Badge className="bg-red-500">Vacant</Badge>;
      case "cleaning":
        return <Badge className="bg-yellow-500">Cleaning</Badge>;
      case "maintenance":
        return <Badge className="bg-purple-500">Maintenance</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className={`relative h-48 p-4 border-2 ${getBorderColor()} ${room.checkOutSoon && blinking ? 'shadow-lg shadow-amber-300 ring-2 ring-amber-300' : ''} ${room.needsAttention ? 'shadow-lg shadow-red-300 ring-2 ring-red-300' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="font-medium">{room.number}</div>
        {getStatusBadge()}
      </div>
      
      {room.status === "occupied" && room.guests && (
        <div className="mt-3 text-sm">
          {room.guests.map((guest, index) => (
            <div key={guest.id} className="mb-1">
              {index + 1}: {guest.name}({guest.gender})
            </div>
          ))}
          
          <div className="mt-2 text-xs">
            {room.checkInTime}<br />
            {room.checkOutDate}
          </div>
        </div>
      )}
      
      {room.status !== "occupied" && (
        <div className="flex flex-col h-20 justify-center items-center">
          <i className={`text-4xl ${room.status === "vacant" ? "ri-door-open-line text-red-500" : 
            room.status === "cleaning" ? "ri-brush-line text-yellow-500" : 
            "ri-tools-line text-purple-500"}`}></i>
        </div>
      )}
      
      {/* Quick action buttons */}
      <div className="absolute bottom-2 right-2 flex space-x-1">
        {room.status === "occupied" && (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => handleQuickAction("View Details")}
              title="View Details"
            >
              <i className="ri-eye-line text-xs"></i>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => handleQuickAction("Invoice")}
              title="Generate Invoice"
            >
              <i className="ri-bill-line text-xs"></i>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => handleQuickAction("Checkout")}
              title="Checkout"
            >
              <i className="ri-logout-box-line text-xs"></i>
            </Button>
          </>
        )}
        {room.status === "vacant" && (
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7" 
            onClick={() => handleQuickAction("Checkin")}
            title="Checkin"
          >
            <i className="ri-login-box-line text-xs"></i>
          </Button>
        )}
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7" 
          onClick={() => handleQuickAction("Edit")}
          title="Edit"
        >
          <i className="ri-pencil-line text-xs"></i>
        </Button>
      </div>
    </Card>
  );
};

export function RoomMonitoring() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<string>("grid");
  const [rooms, setRooms] = useState<Room[]>(sampleRooms);
  
  // Auto-refresh data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Refreshing room data...");
      // In a real app, this would be an API call
      // For now, we'll just use the sample data
      setRooms([...sampleRooms]);
      toast({
        title: "Data Refreshed",
        description: "Room data has been updated",
        variant: "default",
      });
    }, 60000);
    
    return () => clearInterval(interval);
  }, [toast]);
  
  // Filter rooms based on selected filter
  const filteredRooms = rooms.filter(room => {
    if (filter === "all") return true;
    if (filter === "occupied" && room.status === "occupied") return true;
    if (filter === "vacant" && room.status === "vacant") return true;
    if (filter === "cleaning" && room.status === "cleaning") return true;
    if (filter === "maintenance" && room.status === "maintenance") return true;
    if (filter === "checkout-soon" && room.checkOutSoon) return true;
    return false;
  });

  // Group rooms by type
  const deluxeRooms = filteredRooms.filter(room => room.type === "Deluxe Room");
  const suiteRooms = filteredRooms.filter(room => room.type === "Suite Room");
  const standardRooms = filteredRooms.filter(room => room.type === "Standard Room");

  // Stats for the summary
  const stats = {
    total: rooms.length,
    occupied: rooms.filter(r => r.status === "occupied").length,
    vacant: rooms.filter(r => r.status === "vacant").length,
    cleaning: rooms.filter(r => r.status === "cleaning").length,
    maintenance: rooms.filter(r => r.status === "maintenance").length,
    checkoutSoon: rooms.filter(r => r.checkOutSoon).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-semibold">Live Room Monitoring</h1>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <i className="ri-layout-grid-line mr-1"></i> Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <i className="ri-list-check mr-1"></i> List
          </Button>
        </div>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <div className="text-sm font-medium text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </Card>
        <Card className="p-4 text-center bg-green-50 dark:bg-green-950">
          <div className="text-sm font-medium text-muted-foreground">Occupied</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.occupied}</div>
        </Card>
        <Card className="p-4 text-center bg-red-50 dark:bg-red-950">
          <div className="text-sm font-medium text-muted-foreground">Vacant</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.vacant}</div>
        </Card>
        <Card className="p-4 text-center bg-yellow-50 dark:bg-yellow-950">
          <div className="text-sm font-medium text-muted-foreground">Cleaning</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.cleaning}</div>
        </Card>
        <Card className="p-4 text-center bg-purple-50 dark:bg-purple-950">
          <div className="text-sm font-medium text-muted-foreground">Maintenance</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.maintenance}</div>
        </Card>
        <Card className="p-4 text-center bg-amber-50 dark:bg-amber-950">
          <div className="text-sm font-medium text-muted-foreground">Checkout Soon</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.checkoutSoon}</div>
        </Card>
      </div>
      
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Rooms
        </Button>
        <Button
          variant={filter === "occupied" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("occupied")}
          className="border-green-500 hover:bg-green-100 dark:hover:bg-green-900"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Occupied
        </Button>
        <Button
          variant={filter === "vacant" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("vacant")}
          className="border-red-500 hover:bg-red-100 dark:hover:bg-red-900"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          Vacant
        </Button>
        <Button
          variant={filter === "cleaning" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("cleaning")}
          className="border-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900"
        >
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
          Cleaning
        </Button>
        <Button
          variant={filter === "maintenance" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("maintenance")}
          className="border-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900"
        >
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
          Maintenance
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
      </div>
      
      {/* Room listings */}
      {deluxeRooms.length > 0 && (
        <div>
          <h2 className="text-xl font-medium mb-4">Deluxe Room</h2>
          <div className={`grid ${viewMode === "grid" ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'} gap-4`}>
            {deluxeRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      )}
      
      {suiteRooms.length > 0 && (
        <div>
          <h2 className="text-xl font-medium mb-4">Suite Rooms</h2>
          <div className={`grid ${viewMode === "grid" ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'} gap-4`}>
            {suiteRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      )}
      
      {standardRooms.length > 0 && (
        <div>
          <h2 className="text-xl font-medium mb-4">Standard Rooms</h2>
          <div className={`grid ${viewMode === "grid" ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'} gap-4`}>
            {standardRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2"></div>
          <span>Vacant</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
          <span>Cleaning</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-500 mr-2"></div>
          <span>Maintenance</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-amber-500 mr-2"></div>
          <span>Checkout Soon (Blinking)</span>
        </div>
      </div>
    </div>
  );
}