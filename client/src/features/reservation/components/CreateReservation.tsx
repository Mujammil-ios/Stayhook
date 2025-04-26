import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'wouter';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { format } from 'date-fns';
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { useReservation, ReservationFormData } from '../hooks/useReservation';
import { InvoiceModal } from '../../invoice/components/InvoiceModal';
import { cn } from '@/lib/utils';

// Validation schema for the reservation form
const reservationSchema = z.object({
  // Customer details
  customerName: z.string().min(3, "Name must be at least 3 characters"),
  aadharNo: z.string().min(12, "Aadhar number must be 12 digits").max(12),
  mobileNo: z.string().min(10, "Mobile number must be at least 10 digits"),
  vehicleNo: z.string().optional(),
  
  // Dates
  checkInDate: z.date({
    required_error: "Check-in date is required",
  }),
  checkOutDate: z.date({
    required_error: "Check-out date is required",
  }),
  
  // Travel details
  travellingFrom: z.string().min(2, "Origin location is required"),
  travellingTo: z.string().min(2, "Destination is required"),
  
  // Guest counts
  maleCount: z.number().min(0).default(0),
  femaleCount: z.number().min(0).default(0),
  childCount: z.number().min(0).default(0),
  
  // Additional details
  address: z.string().min(5, "Address is required"),
  nationality: z.string().min(2, "Nationality is required"),
  
  // Room details
  roomId: z.number(),
  roomType: z.string(),
  roomRate: z.number().min(1, "Room rate must be greater than 0"),
  
  // Additional guests (array with validation for each guest)
  additionalGuests: z.array(
    z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      idNumber: z.string().min(1, "ID is required"),
      mobileNo: z.string().min(10, "Mobile number must be at least 10 digits")
    })
  ).optional().default([]),
});

export default function CreateReservation() {
  const { isSubmitting, createdReservation, step, createReservation } = useReservation();
  const [aadharImage, setAadharImage] = useState<File | null>(null);
  const [customerPhoto, setCustomerPhoto] = useState<File | null>(null);
  const navigate = useNavigate();
  
  // Initialize form with default values
  const methods = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      customerName: '',
      aadharNo: '',
      mobileNo: '',
      vehicleNo: '',
      checkInDate: new Date(),
      checkOutDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      travellingFrom: '',
      travellingTo: '',
      maleCount: 0,
      femaleCount: 0,
      childCount: 0,
      address: '',
      nationality: 'Indian',
      roomId: 0,
      roomType: '',
      roomRate: 0,
      additionalGuests: []
    }
  });
  
  // Handle form submission
  const onSubmit = async (data: ReservationFormData) => {
    // Add the file uploads to the form data
    if (aadharImage) {
      data.aadharImage = aadharImage;
    }
    
    if (customerPhoto) {
      data.customerPhoto = customerPhoto;
    }
    
    // Create the reservation
    await createReservation(data);
  };
  
  // Handle adding a new additional guest
  const addGuest = () => {
    const currentGuests = methods.getValues('additionalGuests') || [];
    if (currentGuests.length < 3) {
      methods.setValue('additionalGuests', [
        ...currentGuests,
        { name: '', idNumber: '', mobileNo: '' }
      ]);
    }
  };
  
  // Handle removing an additional guest
  const removeGuest = (index: number) => {
    const currentGuests = methods.getValues('additionalGuests') || [];
    const updatedGuests = currentGuests.filter((_, i) => i !== index);
    methods.setValue('additionalGuests', updatedGuests);
  };
  
  // Handle file uploads
  const handleAadharImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAadharImage(e.target.files[0]);
    }
  };
  
  const handleCustomerPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomerPhoto(e.target.files[0]);
    }
  };
  
  return (
    <>
      {step === 'reservation' ? (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Reservation</CardTitle>
            <CardDescription>Enter guest details to create a new reservation</CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={methods.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={methods.control}
                      name="mobileNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="10-digit mobile number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={methods.control}
                      name="aadharNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhar Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="12-digit Aadhar number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormItem>
                      <FormLabel>Aadhar Card Image</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={handleAadharImageChange}
                        />
                      </FormControl>
                      <FormDescription>Upload a copy of the Aadhar card</FormDescription>
                    </FormItem>
                    
                    <FormField
                      control={methods.control}
                      name="vehicleNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Vehicle registration number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormItem>
                      <FormLabel>Customer Photo (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={handleCustomerPhotoChange}
                        />
                      </FormControl>
                      <FormDescription>Take a live photo of the customer</FormDescription>
                    </FormItem>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Stay Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={methods.control}
                      name="checkInDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Check-in Date*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={methods.control}
                      name="checkOutDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Check-out Date*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => 
                                  date < methods.getValues('checkInDate') ||
                                  date < new Date()
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={methods.control}
                      name="roomType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type*</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Set a default room rate based on room type
                              const rates: Record<string, number> = {
                                "standard": 1000,
                                "deluxe": 1500,
                                "suite": 2500,
                                "family": 2000,
                              };
                              methods.setValue('roomRate', rates[value] || 0);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select room type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="deluxe">Deluxe</SelectItem>
                              <SelectItem value="suite">Suite</SelectItem>
                              <SelectItem value="family">Family</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={methods.control}
                      name="roomRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Rate (₹)*</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={methods.control}
                      name="roomId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Number*</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select room number" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="101">101</SelectItem>
                              <SelectItem value="102">102</SelectItem>
                              <SelectItem value="103">103</SelectItem>
                              <SelectItem value="201">201</SelectItem>
                              <SelectItem value="202">202</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Travel Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={methods.control}
                      name="travellingFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Travelling From*</FormLabel>
                          <FormControl>
                            <Input placeholder="City/Location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={methods.control}
                      name="travellingTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Travelling To*</FormLabel>
                          <FormControl>
                            <Input placeholder="City/Location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Guest Count</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={methods.control}
                      name="maleCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Male</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={methods.control}
                      name="femaleCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Female</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={methods.control}
                      name="childCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Children</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={methods.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                          <FormLabel>Address*</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter complete address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={methods.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality*</FormLabel>
                          <FormControl>
                            <Input placeholder="Country of citizenship" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Additional Guests</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addGuest}
                      disabled={methods.getValues('additionalGuests')?.length >= 3}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Guest
                    </Button>
                  </div>
                  
                  {(methods.getValues('additionalGuests') || []).map((_, index) => (
                    <div key={index} className="border rounded-md p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Guest {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGuest(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={methods.control}
                          name={`additionalGuests.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name*</FormLabel>
                              <FormControl>
                                <Input placeholder="Full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={methods.control}
                          name={`additionalGuests.${index}.idNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID Number*</FormLabel>
                              <FormControl>
                                <Input placeholder="Aadhar/Passport No." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={methods.control}
                          name={`additionalGuests.${index}.mobileNo`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mobile No.*</FormLabel>
                              <FormControl>
                                <Input placeholder="10-digit mobile number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {(methods.getValues('additionalGuests')?.length === 0) && (
                    <div className="text-center text-muted-foreground py-4">
                      No additional guests added. Click "Add Guest" to include more guests.
                    </div>
                  )}
                </div>
                
                <CardFooter className="flex justify-between pt-6 px-0">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/reservations')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Reservation'}
                  </Button>
                </CardFooter>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      ) : (
        <InvoiceModal 
          reservation={createdReservation!} 
          onClose={() => navigate('/reservations')} 
        />
      )}
    </>
  );
}