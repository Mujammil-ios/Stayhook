import { useState } from "react";
import { roomsData } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Rooms = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [floorFilter, setFloorFilter] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "occupied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "maintenance":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-300";
    }
  };

  const filteredRooms = roomsData.filter(room => {
    // Filter by status
    if (filter !== "all" && room.status !== filter) return false;
    
    // Filter by floor
    if (floorFilter !== "all" && room.floor !== parseInt(floorFilter)) return false;
    
    // Filter by search term (room number or category)
    if (searchTerm && 
        !room.number.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !room.category.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const roomsByFloor = filteredRooms.reduce((acc, room) => {
    const floor = room.floor.toString();
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(room);
    return acc;
  }, {} as Record<string, typeof roomsData>);

  const floors = Object.keys(roomsByFloor).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div>
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Room Management</h1>
        <div className="mt-3 sm:mt-0">
          <Button>
            <i className="ri-add-line mr-2"></i>
            Add New Room
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="flex">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex">
          <Select value={floorFilter} onValueChange={setFloorFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              {Array.from(new Set(roomsData.map(room => room.floor))).sort().map(floor => (
                <SelectItem key={floor} value={floor.toString()}>Floor {floor}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
            <Input
              type="text"
              placeholder="Search by room number or type..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="floor">Floor View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="glass overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="text-xl font-semibold">{room.number}</div>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getStatusColor(room.status))}
                      >
                        {room.status}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-neutral-500">{room.category}</div>
                    <div className="mt-1 text-sm">${room.baseRate}/night</div>
                  </div>
                  <div className="bg-neutral-100 dark:bg-neutral-800 p-2 flex justify-between text-xs">
                    <span>Floor {room.floor}</span>
                    <span>Capacity: {room.capacity}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card className="glass">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                      <th className="text-left p-4 font-medium">Room</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Floor</th>
                      <th className="text-left p-4 font-medium">Rate</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRooms.map((room) => (
                      <tr key={room.id} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="p-4">
                          <div className="font-medium">{room.number}</div>
                        </td>
                        <td className="p-4">{room.category}</td>
                        <td className="p-4">{room.floor}</td>
                        <td className="p-4">${room.baseRate}</td>
                        <td className="p-4">
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getStatusColor(room.status))}
                          >
                            {room.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button className="text-primary hover:text-primary-600 tooltip" data-tooltip="View">
                              <i className="ri-eye-line"></i>
                            </button>
                            <button className="text-primary hover:text-primary-600 tooltip" data-tooltip="Edit">
                              <i className="ri-pencil-line"></i>
                            </button>
                            <button className="text-primary hover:text-primary-600 tooltip" data-tooltip="Maintenance">
                              <i className="ri-tools-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="floor">
          <div className="space-y-6">
            {floors.map((floor) => (
              <Card key={floor} className="glass">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Floor {floor}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {roomsByFloor[floor].map((room) => (
                      <div 
                        key={room.id} 
                        className={cn(
                          "p-3 rounded-md text-center hover:shadow-md transition-shadow cursor-pointer",
                          room.status === "available" && "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800",
                          room.status === "occupied" && "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800",
                          room.status === "maintenance" && "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800"
                        )}
                      >
                        <div className="text-lg font-medium">{room.number}</div>
                        <div className="text-xs mt-1 truncate">{room.category}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rooms;
