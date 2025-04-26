/**
 * PropertyConfigForm Component
 * 
 * Form for configuring property amenities, photos, and room types
 */

import { useState } from 'react';
import { useOnboarding } from '../hooks/useOnboarding';
import { RoomType, PropertyConfigFormData } from '../types/index';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2, Upload, Image, ChevronsUpDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Common amenities for hotels
const COMMON_AMENITIES = [
  "Wi-Fi", "Parking", "Pool", "Restaurant", "Bar", "Gym", 
  "Spa", "Room Service", "Airport Shuttle", "Business Center",
  "Concierge", "Laundry Service", "Pet Friendly", "24-Hour Front Desk",
  "Air Conditioning", "Breakfast", "Conference Room", "Babysitting"
];

// Form validation schemas
const roomTypeSchema = z.object({
  name: z.string().min(1, "Room type name is required"),
  description: z.string().min(10, "Please provide a more detailed description"),
  capacity: z.coerce.number().int().positive("Capacity must be a positive number"),
  baseRate: z.coerce.number().positive("Base rate must be a positive number"),
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
  photos: z.array(z.instanceof(File)).optional(),
});

const formSchema = z.object({
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
  photos: z.array(z.instanceof(File)).optional(),
  roomTypes: z.array(roomTypeSchema).min(1, "At least one room type is required"),
});

export function PropertyConfigForm() {
  const { formState, updatePropertyConfig } = useOnboarding();
  const [amenityInput, setAmenityInput] = useState('');
  
  // Form setup
  const form = useForm<PropertyConfigFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formState.propertyConfig,
    mode: 'onChange'
  });
  
  // Extract current values for easier access
  const amenities = form.watch('amenities') || [];
  const roomTypes = form.watch('roomTypes') || [];
  const photos = form.watch('photos') || [];
  
  // Handlers for amenities
  const handleAddAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      const updatedAmenities = [...amenities, amenityInput.trim()];
      form.setValue('amenities', updatedAmenities);
      updatePropertyConfig({
        ...formState.propertyConfig,
        amenities: updatedAmenities
      });
      setAmenityInput('');
    }
  };
  
  const handleDeleteAmenity = (amenity: string) => {
    const updatedAmenities = amenities.filter(a => a !== amenity);
    form.setValue('amenities', updatedAmenities);
    updatePropertyConfig({
      ...formState.propertyConfig,
      amenities: updatedAmenities
    });
  };
  
  const handleSelectCommonAmenity = (amenity: string) => {
    if (!amenities.includes(amenity)) {
      const updatedAmenities = [...amenities, amenity];
      form.setValue('amenities', updatedAmenities);
      updatePropertyConfig({
        ...formState.propertyConfig,
        amenities: updatedAmenities
      });
    }
  };
  
  // Handlers for photos
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = [...photos, ...Array.from(e.target.files)];
      form.setValue('photos', newPhotos);
      updatePropertyConfig({
        ...formState.propertyConfig,
        photos: newPhotos
      });
    }
  };
  
  const handleDeletePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    form.setValue('photos', updatedPhotos);
    updatePropertyConfig({
      ...formState.propertyConfig,
      photos: updatedPhotos
    });
  };
  
  // Handlers for room types
  const handleAddRoomType = () => {
    const newRoomType: RoomType = {
      name: '',
      description: '',
      capacity: 1,
      baseRate: 0,
      amenities: [],
      photos: []
    };
    
    const updatedRoomTypes = [...roomTypes, newRoomType];
    form.setValue('roomTypes', updatedRoomTypes);
    updatePropertyConfig({
      ...formState.propertyConfig,
      roomTypes: updatedRoomTypes
    });
  };
  
  const handleUpdateRoomType = (index: number, field: keyof RoomType, value: any) => {
    const updatedRoomTypes = [...roomTypes];
    updatedRoomTypes[index] = {
      ...updatedRoomTypes[index],
      [field]: value
    };
    
    form.setValue('roomTypes', updatedRoomTypes);
    updatePropertyConfig({
      ...formState.propertyConfig,
      roomTypes: updatedRoomTypes
    });
  };
  
  const handleDeleteRoomType = (index: number) => {
    const updatedRoomTypes = roomTypes.filter((_, i) => i !== index);
    form.setValue('roomTypes', updatedRoomTypes);
    updatePropertyConfig({
      ...formState.propertyConfig,
      roomTypes: updatedRoomTypes
    });
  };
  
  const handleRoomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, roomIndex: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const updatedRoomTypes = [...roomTypes];
      updatedRoomTypes[roomIndex] = {
        ...updatedRoomTypes[roomIndex],
        photos: [...updatedRoomTypes[roomIndex].photos, ...Array.from(e.target.files)]
      };
      
      form.setValue('roomTypes', updatedRoomTypes);
      updatePropertyConfig({
        ...formState.propertyConfig,
        roomTypes: updatedRoomTypes
      });
    }
  };
  
  const handleDeleteRoomPhoto = (roomIndex: number, photoIndex: number) => {
    const updatedRoomTypes = [...roomTypes];
    updatedRoomTypes[roomIndex] = {
      ...updatedRoomTypes[roomIndex],
      photos: updatedRoomTypes[roomIndex].photos.filter((_, i) => i !== photoIndex)
    };
    
    form.setValue('roomTypes', updatedRoomTypes);
    updatePropertyConfig({
      ...formState.propertyConfig,
      roomTypes: updatedRoomTypes
    });
  };
  
  const handleToggleRoomAmenity = (roomIndex: number, amenity: string) => {
    const updatedRoomTypes = [...roomTypes];
    const roomType = updatedRoomTypes[roomIndex];
    
    if (roomType.amenities.includes(amenity)) {
      roomType.amenities = roomType.amenities.filter(a => a !== amenity);
    } else {
      roomType.amenities = [...roomType.amenities, amenity];
    }
    
    form.setValue('roomTypes', updatedRoomTypes);
    updatePropertyConfig({
      ...formState.propertyConfig,
      roomTypes: updatedRoomTypes
    });
  };
  
  return (
    <form className="space-y-8">
      {/* Property Amenities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Property Amenities</CardTitle>
          <CardDescription>Add amenities that are available throughout your property</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {amenities.map((amenity) => (
                <Badge 
                  key={amenity}
                  className="px-3 py-1 flex items-center gap-1"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleDeleteAmenity(amenity)}
                    className="ml-1 text-sm"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {amenities.length === 0 && (
                <p className="text-sm text-muted-foreground">No amenities added yet</p>
              )}
            </div>
            
            {/* Add Custom Amenity */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter amenity name"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddAmenity}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            {/* Common Amenities */}
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Common Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {COMMON_AMENITIES.map((amenity) => (
                  <Badge 
                    key={amenity}
                    variant={amenities.includes(amenity) ? "default" : "outline"}
                    className="px-3 py-1 cursor-pointer"
                    onClick={() => handleSelectCommonAmenity(amenity)}
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Property Photos Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Property Photos</CardTitle>
          <CardDescription>Upload photos of your property</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Photo Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {photos.map((photo, index) => (
                <div 
                  key={index} 
                  className="relative group aspect-square bg-muted rounded-md overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(index)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {/* Add Photo Button */}
              <label className="cursor-pointer aspect-square bg-muted hover:bg-muted/80 rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Upload Photos</span>
              </label>
            </div>
            
            {photos.length === 0 && (
              <div className="text-center py-8 bg-muted rounded-md border-2 border-dashed border-border">
                <Image className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <h3 className="font-medium">No Photos Uploaded</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload photos to showcase your property to potential guests
                </p>
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button type="button" variant="secondary">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Room Types Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Room Types</CardTitle>
            <CardDescription>Configure the different types of rooms available at your property</CardDescription>
          </div>
          <Button 
            type="button" 
            onClick={handleAddRoomType}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Room Type
          </Button>
        </CardHeader>
        <CardContent>
          {roomTypes.length === 0 ? (
            <div className="text-center py-8 bg-muted rounded-md border-2 border-dashed border-border">
              <h3 className="font-medium">No Room Types Added</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add room types to make them available for booking
              </p>
              <Button 
                type="button" 
                onClick={handleAddRoomType}
                variant="secondary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Room Type
              </Button>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {roomTypes.map((roomType, index) => (
                <AccordionItem 
                  key={index} 
                  value={`room-type-${index}`}
                  className="border rounded-lg p-1"
                >
                  <div className="flex items-center justify-between">
                    <AccordionTrigger className="py-2 px-4 hover:no-underline">
                      <span>
                        {roomType.name || `Room Type ${index + 1}`}
                      </span>
                    </AccordionTrigger>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoomType(index);
                      }}
                      className="text-destructive hover:text-destructive mr-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    <div className="space-y-4">
                      {/* Room Name */}
                      <div>
                        <FormLabel>Room Type Name*</FormLabel>
                        <Input
                          placeholder="e.g. Standard Double, Deluxe Suite"
                          value={roomType.name}
                          onChange={(e) => handleUpdateRoomType(index, 'name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      {/* Room Description */}
                      <div>
                        <FormLabel>Description*</FormLabel>
                        <Textarea
                          placeholder="Describe the features and amenities of this room type"
                          value={roomType.description}
                          onChange={(e) => handleUpdateRoomType(index, 'description', e.target.value)}
                          className="mt-1 resize-none"
                          rows={3}
                        />
                      </div>
                      
                      {/* Room Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <FormLabel>Capacity*</FormLabel>
                          <Input
                            type="number"
                            min="1"
                            placeholder="2"
                            value={roomType.capacity || ''}
                            onChange={(e) => handleUpdateRoomType(index, 'capacity', Number(e.target.value))}
                            className="mt-1"
                          />
                          <FormDescription>Maximum number of guests</FormDescription>
                        </div>
                        
                        <div>
                          <FormLabel>Base Rate*</FormLabel>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="99.99"
                            value={roomType.baseRate || ''}
                            onChange={(e) => handleUpdateRoomType(index, 'baseRate', Number(e.target.value))}
                            className="mt-1"
                          />
                          <FormDescription>Starting price per night</FormDescription>
                        </div>
                      </div>
                      
                      {/* Room Amenities */}
                      <div>
                        <FormLabel>Room Amenities</FormLabel>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {amenities.map((amenity) => (
                            <Badge
                              key={amenity}
                              variant={roomType.amenities.includes(amenity) ? "default" : "outline"}
                              className="px-3 py-1 cursor-pointer"
                              onClick={() => handleToggleRoomAmenity(index, amenity)}
                            >
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <FormDescription className="mt-2">
                          Select the amenities that are available in this room type
                        </FormDescription>
                      </div>
                      
                      {/* Room Photos */}
                      <div>
                        <FormLabel>Room Photos</FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                          {roomType.photos.map((photo, photoIndex) => (
                            <div
                              key={photoIndex}
                              className="relative group aspect-video bg-muted rounded-md overflow-hidden"
                            >
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`Room ${index + 1} photo ${photoIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteRoomPhoto(index, photoIndex)}
                                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          
                          {/* Add Room Photo Button */}
                          <label className="cursor-pointer aspect-video bg-muted hover:bg-muted/80 rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleRoomPhotoUpload(e, index)}
                              className="hidden"
                            />
                            <Upload className="h-5 w-5 mb-1 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Upload</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </form>
  );
}