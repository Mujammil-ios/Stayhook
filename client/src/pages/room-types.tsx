import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { roomDistribution } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define a RoomTypeModel as per requirements
interface RoomTypeExtended {
  id?: number;
  type: string;
  total: number;
  occupied: number;
  percentage: number;
  description: string;
  priceRange: [number, number];
  amenities: string[];
  image: string;
  maxOccupancy: number;
}

const RoomTypeModel = {
  getAll: async (): Promise<RoomTypeExtended[]> => {
    // Simulate API call with delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const roomTypes = roomDistribution.map((room) => ({
          ...room,
          description: `${room.type} room with ${room.total} total units, featuring modern amenities and comfortable furnishings.`,
          priceRange: room.type === "Standard" ? [89, 129] as [number, number] : 
                    room.type === "Deluxe" ? [139, 199] as [number, number] : 
                    room.type === "Suite" ? [229, 359] as [number, number] : [379, 599] as [number, number],
          amenities: room.type === "Standard" ? ["Free Wi-Fi", "TV", "Air Conditioning"] :
                    room.type === "Deluxe" ? ["Free Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Room Service"] :
                    room.type === "Suite" ? ["Free Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Room Service", "Separate Living Area", "Bathtub"] :
                    ["Free Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Room Service", "Separate Living Area", "Bathtub", "Private Balcony", "Jacuzzi"],
          image: `https://via.placeholder.com/300x200?text=${room.type.replace(' ', '+')}+Room`,
          maxOccupancy: room.type === "Standard" ? 2 : 
                        room.type === "Deluxe" ? 3 : 
                        room.type === "Suite" ? 4 : 6
        }));
        console.log(`[RoomTypeModel] Successfully fetched ${roomTypes.length} room types`);
        resolve(roomTypes);
      }, 500);
    });
  }
};

export default function RoomTypes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 600]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [roomTypes, setRoomTypes] = useState<RoomTypeExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch room types on component mount
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const types = await RoomTypeModel.getAll();
        console.log(`[RoomTypes] Successfully loaded ${types.length} room types`);
        setRoomTypes(types);
      } catch (err) {
        console.error('[RoomTypes] Error fetching room types:', err);
        setError('Failed to load room types. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoomTypes();
  }, []);
  
  // Filtered rooms based on search, price range, and type
  const filteredRooms = useMemo(() => {
    if (!roomTypes || roomTypes.length === 0) return [];
    
    return roomTypes.filter((room) => {
      try {
        // Filter by search query
        const matchesSearch = room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            room.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Filter by price range
        const matchesPrice = room.priceRange[0] <= priceRange[1] && room.priceRange[1] >= priceRange[0];
        
        // Filter by room type
        const matchesType = selectedType === "all" || room.type === selectedType;
        
        return matchesSearch && matchesPrice && matchesType;
      } catch (err) {
        console.error('[RoomTypes] Error filtering room:', err);
        return false;
      }
    });
  }, [roomTypes, searchQuery, priceRange, selectedType]);
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Room Types</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            View and filter all available room types
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="self-start">
          <Link href="/" className="flex items-center">
            <i className="ri-arrow-left-line mr-2 text-lg"></i>
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      {/* Filters Section */}
      <Card className="glass mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search Filter */}
            <div>
              <Label htmlFor="search">Search Rooms</Label>
              <div className="relative mt-1.5">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <i className="ri-search-line text-neutral-400"></i>
                </span>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by name or feature..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div>
              <div className="flex justify-between">
                <Label htmlFor="price-range">Price Range</Label>
                <span className="text-sm font-medium">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <div className="mt-3 px-2">
                <Slider
                  id="price-range"
                  defaultValue={[50, 600]}
                  min={50}
                  max={600}
                  step={10}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="mt-1"
                />
              </div>
            </div>
            
            {/* Room Type Filter */}
            <div>
              <Label htmlFor="room-type">Room Type</Label>
              <Select 
                value={selectedType} 
                onValueChange={setSelectedType}
              >
                <SelectTrigger id="room-type" className="mt-1.5">
                  <SelectValue placeholder="Select Room Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {roomTypes.map((room: RoomTypeExtended) => (
                    <SelectItem key={room.type} value={room.type}>
                      {room.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setSearchQuery("");
                setPriceRange([50, 600]);
                setSelectedType("all");
              }}
              className="mr-2"
            >
              Reset Filters
            </Button>
            <Badge className="self-center ml-2 bg-primary py-1 px-3">
              {filteredRooms.length} Room Type{filteredRooms.length !== 1 && "s"}
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Room Types Grid */}
      <div className="card-grid mb-10">
        {isLoading ? (
          // Loading state
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3"></div>
            <h3 className="text-lg font-semibold mb-1">Loading Room Types...</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
              Please wait while we fetch the available room types.
            </p>
          </div>
        ) : error ? (
          // Error state
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <i className="ri-error-warning-line text-4xl text-destructive mb-3"></i>
            <h3 className="text-lg font-semibold mb-1">Failed to Load Room Types</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
              {error}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setIsLoading(true);
                setError(null);
                RoomTypeModel.getAll()
                  .then(types => {
                    setRoomTypes(types);
                    setIsLoading(false);
                  })
                  .catch(err => {
                    console.error('[RoomTypes] Error on retry:', err);
                    setError('Failed to load room types. Please try again later.');
                    setIsLoading(false);
                  });
              }}
            >
              <i className="ri-refresh-line mr-2"></i>
              Retry
            </Button>
          </div>
        ) : filteredRooms.length > 0 ? (
          // Success state with data
          filteredRooms.map((room: RoomTypeExtended) => (
            <Card key={room.type} className="glass overflow-hidden hover-lift hover-shadow transition-all duration-300">
              <div className="aspect-video bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                <i className="ri-hotel-bed-line text-4xl text-neutral-400 dark:text-neutral-500"></i>
              </div>
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{room.type}</h3>
                  <Badge className={
                    room.percentage < 50 ? "bg-green-500" : 
                    room.percentage < 75 ? "bg-amber-500" : 
                    "bg-red-500"
                  }>
                    {room.percentage}% Occupied
                  </Badge>
                </div>
                
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  {room.description}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-sm font-medium">Price Range:</span>
                    <div className="font-semibold text-primary">${room.priceRange[0]} - ${room.priceRange[1]}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">Availability:</span>
                    <div className="font-semibold">
                      {room.total - room.occupied} of {room.total} available
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm font-medium">Max Occupancy:</span>
                  <div className="flex mt-1">
                    {[...Array(room.maxOccupancy)].map((_, i) => (
                      <i key={i} className="ri-user-line text-neutral-500 mr-1"></i>
                    ))}
                  </div>
                </div>
                
                <div className="mb-3">
                  <span className="text-sm font-medium">Amenities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {room.amenities.map((amenity: string) => (
                      <Badge key={amenity} variant="outline" className="font-normal">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" className="mr-2">
                    <i className="ri-edit-line mr-1"></i> Edit
                  </Button>
                  <Button>
                    <i className="ri-calendar-line mr-1"></i> Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Empty state
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
            <i className="ri-search-line text-4xl text-neutral-400 mb-3"></i>
            <h3 className="text-lg font-semibold mb-1">No Room Types Found</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
              {searchQuery || selectedType !== 'all' || (priceRange[0] !== 50 || priceRange[1] !== 600)
                ? 'Try adjusting your filters or search query to find room types.'
                : 'There are no room types available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}