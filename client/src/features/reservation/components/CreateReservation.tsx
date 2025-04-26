import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import { CalendarIcon, PlusCircleIcon, XCircleIcon, Users2Icon, BedIcon, CreditCardIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { useToast } from '@/hooks/use-toast';
import { useReservation, ReservationFormData } from '../hooks/useReservation';
import { InvoiceModal } from '../../invoice/components/InvoiceModal';

// Create a schema for form validation
const reservationSchema = z.object({
  customerName: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  aadharNo: z.string().min(12, { message: 'Aadhar number must be at least 12 characters' }),
  mobileNo: z.string().min(10, { message: 'Mobile number must be at least 10 characters' }),
  vehicleNo: z.string().optional(),
  checkInDate: z.date({
    required_error: 'Check-in date is required',
  }),
  checkOutDate: z.date({
    required_error: 'Check-out date is required',
  }),
  travellingFrom: z.string().min(2, { message: 'Please specify where the guest is travelling from' }),
  travellingTo: z.string().min(2, { message: 'Please specify where the guest is travelling to' }),
  maleCount: z.coerce.number().min(0),
  femaleCount: z.coerce.number().min(0),
  childCount: z.coerce.number().min(0),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  nationality: z.string().min(2, { message: 'Nationality is required' }),
  roomId: z.coerce.number().min(1, { message: 'Room selection is required' }),
  roomType: z.string().min(1, { message: 'Room type is required' }),
  roomRate: z.coerce.number().min(1, { message: 'Room rate is required' }),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  additionalGuests: z.array(
    z.object({
      name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
      idNumber: z.string().min(5, { message: 'ID number must be at least 5 characters' }),
      mobileNo: z.string().min(10, { message: 'Mobile number must be at least 10 characters' }),
    })
  ).optional(),
});

// Form component for creating a reservation
export function CreateReservation() {
  const [activeTab, setActiveTab] = useState('guest-details');
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  
  // Reservation hook for managing the reservation creation process
  const {
    isSubmitting,
    createdReservation,
    isInvoiceModalOpen,
    createReservation,
    closeInvoiceModal,
    resetForm
  } = useReservation();

  // Sample room data (would be fetched from an API in a real implementation)
  const roomOptions = [
    { id: 101, type: 'Standard Single', rate: 1500 },
    { id: 102, type: 'Standard Double', rate: 2500 },
    { id: 103, type: 'Deluxe Single', rate: 3000 },
    { id: 104, type: 'Deluxe Double', rate: 4000 },
    { id: 201, type: 'Suite', rate: 6000 },
  ];

  // Initialize form with default values
  const form = useForm<ReservationFormData>({
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
      maleCount: 1,
      femaleCount: 0,
      childCount: 0,
      address: '',
      nationality: 'Indian',
      roomId: 0,
      roomType: '',
      roomRate: 0,
      email: '',
      additionalGuests: [],
    },
  });

  // Handle form submission
  const onSubmit = async (data: ReservationFormData) => {
    // Additional validation
    if (data.maleCount + data.femaleCount < 1) {
      toast({
        title: 'Validation Error',
        description: 'At least one adult guest is required.',
        variant: 'destructive',
      });
      return;
    }

    if (data.checkOutDate < data.checkInDate) {
      toast({
        title: 'Validation Error',
        description: 'Check-out date must be after check-in date.',
        variant: 'destructive',
      });
      return;
    }

    // Create the reservation
    try {
      const result = await createReservation(data);
      if (result) {
        // Success is handled in the useReservation hook
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to create reservation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle additional guest functionality
  const [additionalGuests, setAdditionalGuests] = useState<{ name: string; idNumber: string; mobileNo: string }[]>([]);

  const addGuest = () => {
    setAdditionalGuests([...additionalGuests, { name: '', idNumber: '', mobileNo: '' }]);
  };

  const removeGuest = (index: number) => {
    const newGuests = [...additionalGuests];
    newGuests.splice(index, 1);
    setAdditionalGuests(newGuests);
    form.setValue('additionalGuests', newGuests);
  };

  const updateGuest = (index: number, field: string, value: string) => {
    const newGuests = [...additionalGuests];
    newGuests[index] = { ...newGuests[index], [field]: value };
    setAdditionalGuests(newGuests);
    form.setValue('additionalGuests', newGuests);
  };

  // Handle room selection
  const handleRoomSelect = (roomId: string) => {
    const room = roomOptions.find(r => r.id === parseInt(roomId));
    if (room) {
      form.setValue('roomId', room.id);
      form.setValue('roomType', room.type);
      form.setValue('roomRate', room.rate);
    }
  };

  // Calculate total guests
  const totalGuests = (form.watch('maleCount') || 0) + (form.watch('femaleCount') || 0) + (form.watch('childCount') || 0);

  // Calculate total nights
  const checkInDate = form.watch('checkInDate');
  const checkOutDate = form.watch('checkOutDate');
  const totalNights = checkInDate && checkOutDate ? 
    Math.max(1, Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))) : 1;

  // Calculate total cost
  const roomRate = form.watch('roomRate') || 0;
  const totalCost = roomRate * totalNights;

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Reservation</h1>
          <p className="text-muted-foreground">Create a new guest reservation</p>
        </div>
        <Button variant="outline" onClick={() => setLocation('/reservations')}>
          Back to Reservations
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="guest-details">Guest Details</TabsTrigger>
              <TabsTrigger value="booking-details">Booking Details</TabsTrigger>
              <TabsTrigger value="room-selection">Room & Payment</TabsTrigger>
            </TabsList>

            {/* Guest Details Tab */}
            <TabsContent value="guest-details" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Primary Guest Information</CardTitle>
                  <CardDescription>Enter the details of the primary guest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter full name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="email@example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mobileNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter mobile number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aadharNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhar Number*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter Aadhar number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address*</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter full address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality*</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select nationality" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Indian">Indian</SelectItem>
                              <SelectItem value="Foreign">Foreign</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehicleNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Number (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter vehicle number if any" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div></div>
                  <Button type="button" onClick={() => setActiveTab('booking-details')}>
                    Continue to Booking Details
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Booking Details Tab */}
            <TabsContent value="booking-details" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Stay Information</CardTitle>
                  <CardDescription>Specify the travel and stay details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="checkInDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Check-in Date*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
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
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
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
                      control={form.control}
                      name="checkOutDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Check-out Date*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
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
                                disabled={(date) => {
                                  const checkIn = form.getValues().checkInDate;
                                  return checkIn && date < checkIn;
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="travellingFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Travelling From*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter origin" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="travellingTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Travelling To*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter destination" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="maleCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adult Males*</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              min="0" 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="femaleCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adult Females*</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              min="0"
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="childCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Children*</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              min="0"
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Additional Guests</h4>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        onClick={addGuest}
                        className="flex items-center gap-1"
                      >
                        <PlusCircleIcon className="h-4 w-4" />
                        Add Guest
                      </Button>
                    </div>

                    {additionalGuests.map((guest, index) => (
                      <div key={index} className="border rounded-md p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Guest {index + 1}</h4>
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => removeGuest(index)}
                            className="h-8 w-8 p-0"
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <FormLabel className="text-xs">Name</FormLabel>
                            <Input 
                              value={guest.name} 
                              onChange={e => updateGuest(index, 'name', e.target.value)}
                              placeholder="Guest name" 
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <FormLabel className="text-xs">ID Number</FormLabel>
                            <Input 
                              value={guest.idNumber} 
                              onChange={e => updateGuest(index, 'idNumber', e.target.value)}
                              placeholder="ID number" 
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <FormLabel className="text-xs">Mobile Number</FormLabel>
                            <Input 
                              value={guest.mobileNo} 
                              onChange={e => updateGuest(index, 'mobileNo', e.target.value)}
                              placeholder="Mobile number" 
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('guest-details')}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('room-selection')}>
                    Continue to Room Selection
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Room Selection Tab */}
            <TabsContent value="room-selection" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Room Selection & Payment</CardTitle>
                  <CardDescription>Select a room and review the booking details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="roomId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Room*</FormLabel>
                          <Select
                            onValueChange={(value) => handleRoomSelect(value)}
                            defaultValue={field.value ? field.value.toString() : undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a room" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roomOptions.map((room) => (
                                <SelectItem key={room.id} value={room.id.toString()}>
                                  Room {room.id} - {room.type} (₹{room.rate}/night)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Booking Summary</h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                        <Users2Icon className="h-5 w-5 mb-2" />
                        <div className="text-sm font-medium">{totalGuests} Guests</div>
                        <div className="text-xs text-muted-foreground">
                          {form.watch('maleCount') || 0} M, {form.watch('femaleCount') || 0} F, {form.watch('childCount') || 0} Children
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                        <BedIcon className="h-5 w-5 mb-2" />
                        <div className="text-sm font-medium">{form.watch('roomType') || 'No Room Selected'}</div>
                        <div className="text-xs text-muted-foreground">
                          {form.watch('roomId') ? `Room ${form.watch('roomId')}` : 'Please select a room'}
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                        <CalendarIcon className="h-5 w-5 mb-2" />
                        <div className="text-sm font-medium">{totalNights} {totalNights === 1 ? 'Night' : 'Nights'}</div>
                        <div className="text-xs text-muted-foreground">
                          {checkInDate && format(checkInDate, 'PP')} - {checkOutDate && format(checkOutDate, 'PP')}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between py-2">
                        <span>Room Charges</span>
                        <span>₹{roomRate} x {totalNights} nights</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between py-2 font-medium">
                        <span>Total Amount</span>
                        <span>₹{totalCost}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        <p>* Taxes and additional charges will be calculated at checkout</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('booking-details')}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                    {isSubmitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <CreditCardIcon className="h-4 w-4" />
                        Complete Reservation
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>

      {/* Invoice Modal */}
      <InvoiceModal 
        isOpen={isInvoiceModalOpen} 
        onClose={closeInvoiceModal} 
        reservation={createdReservation} 
      />
    </div>
  );
}