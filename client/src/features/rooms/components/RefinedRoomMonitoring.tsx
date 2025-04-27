import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

// Room types and statuses
type RoomStatus = "vacant" | "occupied" | "maintenance" | "cleaning" | "reserved";
type RoomType = "standard" | "deluxe" | "suite" | "executive";
type FloorNumber = "1" | "2" | "3" | "4" | "5";

// Room information
interface RoomInfo {
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

// Room service to fetch room data
class RoomService {
  static async getRooms(): Promise<RoomInfo[]> {
    // In a real application, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    return sampleRooms;
  }
}

// Sample room data for initial load and testing
const sampleRooms: RoomInfo[] = [
  {
    id: "r101",
    number: "101",
    floor: "1",
    type: "deluxe",
    status: "occupied",
    guest: {
      name: "Amit Sharma",
      checkIn: "2024-04-25 14:30",
      checkOut: "2024-04-27 12:00",
      email: "amit@example.com",
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
      name: "Priya Patel",
      checkIn: "2024-04-26 13:45",
      checkOut: "2024-04-29 12:00",
      email: "priya@example.com",
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
    status: "vacant",
    lastCleaned: "2024-04-26 16:20"
  },
  {
    id: "r105",
    number: "105",
    floor: "1",
    type: "standard",
    status: "vacant",
    lastCleaned: "2024-04-26 15:10"
  },
  {
    id: "r201",
    number: "201",
    floor: "2",
    type: "suite",
    status: "occupied",
    guest: {
      name: "Rahul Kumar",
      checkIn: "2024-04-24 15:00",
      checkOut: "2024-04-28 12:00",
      email: "rahul@example.com",
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
      name: "Sneha Desai",
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
    status: "vacant",
    lastCleaned: "2024-04-26 14:15"
  },
  {
    id: "r301",
    number: "301",
    floor: "3",
    type: "executive",
    status: "occupied",
    guest: {
      name: "Vikram Singh",
      checkIn: "2024-04-23 16:15",
      checkOut: "2024-04-27 12:00",
      email: "vikram@example.com",
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
    status: "vacant",
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
    status: "vacant",
    lastCleaned: "2024-04-26 16:45"
  },
  {
    id: "r401",
    number: "401",
    floor: "4",
    type: "standard",
    status: "vacant",
    lastCleaned: "2024-04-26 16:00"
  },
  {
    id: "r402",
    number: "402",
    floor: "4",
    type: "standard",
    status: "vacant",
    lastCleaned: "2024-04-26 16:30"
  }
];

// Room card component with refined styling and interaction
const RoomCard = ({ 
  room, 
  onAction 
}: { 
  room: RoomInfo; 
  onAction: (action: string, room: RoomInfo) => void;
}) => {
  const [isAlertPulsing, setIsAlertPulsing] = useState(false);
  
  // Pulse animation for alert badges
  useEffect(() => {
    if (room.alerts?.checkoutSoon) {
      const interval = setInterval(() => {
        setIsAlertPulsing(prev => !prev);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [room.alerts]);
  
  // Get background color based on status
  const getCardBgColor = () => {
    switch(room.status) {
      case "vacant":
        return "bg-green-200 dark:bg-green-300/20 border-green-300 dark:border-green-600/30";
      case "occupied":
        return "bg-slate-200 dark:bg-slate-300/20 border-slate-300 dark:border-slate-600/30";
      case "maintenance":
        return "bg-red-200 dark:bg-red-300/20 border-red-300 dark:border-red-600/30";
      case "cleaning":
        return "bg-blue-200 dark:bg-blue-300/20 border-blue-300 dark:border-blue-600/30";
      case "reserved":
        return "bg-purple-200 dark:bg-purple-300/20 border-purple-300 dark:border-purple-600/30";
      default:
        return "bg-gray-200 dark:bg-gray-700";
    }
  };
  
  // Get status badge
  const getStatusBadge = () => {
    switch(room.status) {
      case "vacant":
        return <Badge className="bg-green-500">Vacant</Badge>;
      case "occupied":
        return <Badge className="bg-slate-500">Occupied</Badge>;
      case "maintenance":
        return <Badge className="bg-red-500">Maintenance</Badge>;
      case "cleaning":
        return <Badge className="bg-blue-500">Cleaning</Badge>;
      case "reserved":
        return <Badge className="bg-purple-500">Reserved</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`relative border rounded-md p-3 shadow-sm hover:shadow-md transition-all ${getCardBgColor()}`}
    >
      {/* Room Number and Type */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold">Room {room.number}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
            {room.type} Room
          </p>
        </div>
        <div>{getStatusBadge()}</div>
      </div>
      
      {/* Guest Info (if occupied) */}
      {room.status === "occupied" && room.guest && (
        <div className="mt-2 mb-2">
          <p className="text-sm font-medium">{room.guest.name}</p>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>In: {new Date(room.guest.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span>Out: {new Date(room.guest.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      )}
      
      {/* Reserved Info */}
      {room.status === "reserved" && room.guest && (
        <div className="mt-2 mb-2">
          <p className="text-sm font-medium">{room.guest.name}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Arriving: {new Date(room.guest.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      )}
      
      {/* Last Cleaned Info */}
      {(room.status === "vacant" || room.status === "cleaning" || room.status === "maintenance") && (
        <div className="mt-2 mb-2">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Last cleaned: {new Date(room.lastCleaned || "").toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      )}
      
      {/* Quick Action Buttons */}
      <div className="flex mt-2 pt-2 border-t border-gray-300 dark:border-gray-600 justify-between items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction('details', room);
                }}
              >
                <i className="ri-information-line"></i>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Details</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction('edit', room);
                }}
              >
                <i className="ri-edit-line"></i>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Room</p>
            </TooltipContent>
          </Tooltip>
          
          {room.status === "occupied" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction('invoice', room);
                  }}
                >
                  <i className="ri-bill-line"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate Invoice</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
      
      {/* Checkout Soon Alert */}
      {room.alerts?.checkoutSoon && (
        <div className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center`}>
          <span className={`absolute inline-flex h-full w-full rounded-full ${isAlertPulsing ? 'bg-amber-400' : 'bg-amber-300'} opacity-75`}></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </div>
      )}
    </motion.div>
  );
};

// Detail drawer/slide-over panel component
const RoomDetailDrawer = ({
  room,
  isOpen,
  onClose,
  onAction
}: {
  room: RoomInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string, room: RoomInfo) => void;
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const { toast } = useToast();
  
  if (!room) return null;
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  // Handle actions
  const handleAction = (action: string) => {
    if (room) {
      onAction(action, room);
      onClose();
      
      toast({
        title: `Room ${room.number}`,
        description: `${action.charAt(0).toUpperCase() + action.slice(1)} action performed`,
      });
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="text-left pb-4 border-b">
              <SheetTitle className="text-xl">Room {room.number}</SheetTitle>
              <SheetDescription>
                Floor {room.floor} · {room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room
              </SheetDescription>
            </SheetHeader>
            
            <Tabs defaultValue="details" className="w-full mt-6" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="guest">Guest</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="pt-4 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge className={
                      room.status === "vacant" ? "bg-green-500" :
                      room.status === "occupied" ? "bg-slate-500" :
                      room.status === "maintenance" ? "bg-red-500" :
                      room.status === "cleaning" ? "bg-blue-500" :
                      room.status === "reserved" ? "bg-purple-500" : ""
                    }>
                      {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                    </Badge>
                  </div>
                  
                  {room.lastCleaned && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Cleaned</span>
                      <span className="text-sm">{formatDate(room.lastCleaned)}</span>
                    </div>
                  )}
                  
                  {room.alerts && Object.values(room.alerts).some(alert => alert) && (
                    <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Active Alerts</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {room.alerts.checkoutSoon && (
                            <li className="flex text-sm items-center">
                              <i className="ri-time-line text-amber-600 mr-2"></i>
                              <span>Guest checkout approaching</span>
                            </li>
                          )}
                          {room.alerts.needsMaintenance && (
                            <li className="flex text-sm items-center">
                              <i className="ri-tools-line text-red-600 mr-2"></i>
                              <span>Maintenance required</span>
                            </li>
                          )}
                          {room.alerts.needsCleaning && (
                            <li className="flex text-sm items-center">
                              <i className="ri-brush-line text-blue-600 mr-2"></i>
                              <span>Cleaning required</span>
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="guest" className="pt-4 space-y-4">
                {room.guest ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl font-medium">
                        {room.guest.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{room.guest.name}</h3>
                        {room.status === "occupied" && <p className="text-sm text-muted-foreground">Currently staying</p>}
                        {room.status === "reserved" && <p className="text-sm text-muted-foreground">Upcoming reservation</p>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Check In</p>
                        <p className="font-medium">{formatDate(room.guest.checkIn)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Check Out</p>
                        <p className="font-medium">{formatDate(room.guest.checkOut)}</p>
                      </div>
                    </div>
                    
                    {(room.guest.email || room.guest.phone) && (
                      <div className="space-y-2 pt-2 border-t">
                        {room.guest.email && (
                          <div className="flex items-center">
                            <i className="ri-mail-line text-muted-foreground mr-2"></i>
                            <span className="text-sm">{room.guest.email}</span>
                          </div>
                        )}
                        {room.guest.phone && (
                          <div className="flex items-center">
                            <i className="ri-phone-line text-muted-foreground mr-2"></i>
                            <span className="text-sm">{room.guest.phone}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="pt-2 flex space-x-2">
                      {room.guest.email && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <i className="ri-mail-send-line mr-2"></i>
                          Email
                        </Button>
                      )}
                      {room.guest.phone && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <i className="ri-phone-line mr-2"></i>
                          Call
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <i className="ri-user-line text-4xl mb-2"></i>
                    <p>No guest information available</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="actions" className="pt-4 space-y-3">
                {room.status === "vacant" && (
                  <Button className="w-full" onClick={() => handleAction("newBooking")}>
                    <i className="ri-calendar-check-line mr-2"></i> New Booking
                  </Button>
                )}
                
                {room.status === "occupied" && (
                  <Button className="w-full" onClick={() => handleAction("checkout")}>
                    <i className="ri-logout-box-line mr-2"></i> Check Out Guest
                  </Button>
                )}
                
                {room.status === "reserved" && (
                  <Button className="w-full" onClick={() => handleAction("checkin")}>
                    <i className="ri-login-box-line mr-2"></i> Check In Guest
                  </Button>
                )}
                
                {room.status === "cleaning" && (
                  <Button className="w-full" onClick={() => handleAction("markClean")}>
                    <i className="ri-check-line mr-2"></i> Mark as Clean
                  </Button>
                )}
                
                {room.status === "maintenance" && (
                  <Button className="w-full" onClick={() => handleAction("markFixed")}>
                    <i className="ri-check-line mr-2"></i> Mark as Fixed
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleAction("edit")}
                >
                  <i className="ri-edit-line mr-2"></i> Edit Room Details
                </Button>
                
                {room.status === "occupied" && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleAction("invoice")}
                  >
                    <i className="ri-bill-line mr-2"></i> Generate Invoice
                  </Button>
                )}
                
                <Button 
                  variant={room.status === "maintenance" ? "default" : "outline"} 
                  className="w-full"
                  disabled={room.status === "maintenance"}
                  onClick={() => handleAction("maintenance")}
                >
                  <i className="ri-tools-line mr-2"></i> Request Maintenance
                </Button>
                
                <Button 
                  variant={room.status === "cleaning" ? "default" : "outline"} 
                  className="w-full"
                  disabled={room.status === "cleaning"}
                  onClick={() => handleAction("cleaning")}
                >
                  <i className="ri-brush-line mr-2"></i> Request Cleaning
                </Button>
              </TabsContent>
            </Tabs>
            
            <SheetFooter className="mt-6 flex-row space-x-2 justify-end">
              <Button variant="outline" onClick={onClose}>Close</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </AnimatePresence>
  );
};

// Main Room Monitoring Component
export function RefinedRoomMonitoring() {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<RoomInfo | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Fetch rooms data
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await RoomService.getRooms();
      setRooms(roomsData);
      setLastRefreshed(new Date());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms data:", error);
      toast({
        title: "Error",
        description: "Failed to load room data. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  
  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
    
    // Set up interval to refresh data every 60 seconds
    const intervalId = setInterval(() => {
      fetchRooms();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Check for alerts
  useEffect(() => {
    const checkoutSoonRooms = rooms.filter(room => room.alerts?.checkoutSoon);
    
    if (checkoutSoonRooms.length > 0) {
      toast({
        title: "Checkout Alert",
        description: `${checkoutSoonRooms.length} rooms are due for checkout soon`,
        variant: "destructive",
      });
    }
  }, [rooms]);
  
  // Group rooms by floor
  const roomsByFloor = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<string, RoomInfo[]>);
  
  // Handle room actions
  const handleRoomAction = (action: string, room: RoomInfo) => {
    console.log(`ACTION: ${action}`, room.id);
    
    // Based on the action, show different info or open different panels
    if (action === 'details') {
      setSelectedRoom(room);
      setIsDetailOpen(true);
    } else {
      toast({
        title: `Room ${room.number}`,
        description: `Action performed: ${action}`,
        variant: "default",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with stats and refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">Live Room Status</h2>
            {!loading && (
              <span className="text-xs text-muted-foreground">
                Last updated: {lastRefreshed.toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center text-sm">
              <span className="h-3 w-3 rounded-full bg-green-500 mr-1.5"></span>
              <span>Vacant ({rooms.filter(r => r.status === "vacant").length})</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="h-3 w-3 rounded-full bg-slate-500 mr-1.5"></span>
              <span>Occupied ({rooms.filter(r => r.status === "occupied").length})</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="h-3 w-3 rounded-full bg-amber-500 mr-1.5"></span>
              <span>Checkout Soon ({rooms.filter(r => r.alerts?.checkoutSoon).length})</span>
            </div>
          </div>
        </div>
        
        <Button
          onClick={fetchRooms}
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin mr-2">
              <i className="ri-loader-4-line"></i>
            </span>
          ) : (
            <i className="ri-refresh-line mr-2"></i>
          )}
          Refresh
        </Button>
      </div>
      
      {/* Room grid by floor */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(roomsByFloor)
            .sort(([floorA], [floorB]) => parseInt(floorA) - parseInt(floorB))
            .map(([floor, roomsOnFloor]) => (
              <div key={floor} className="space-y-4">
                <h3 className="text-lg font-medium">Floor {floor}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {roomsOnFloor
                    .sort((a, b) => parseInt(a.number) - parseInt(b.number))
                    .map(room => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        onAction={handleRoomAction}
                      />
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      )}
      
      {/* Room detail drawer */}
      <RoomDetailDrawer
        room={selectedRoom}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAction={handleRoomAction}
      />
    </div>
  );
}