import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Form schema with validation
const bookingFormSchema = z.object({
  // Guest Information
  guestName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  
  // ID Proof (required as per the task)
  idType: z.enum(["passport", "drivingLicense", "voterID", "aadharCard"]),
  idNumber: z.string().min(5, "ID number must be at least 5 characters"),
  
  // Booking Details
  roomType: z.enum(["deluxe", "suite", "standard"]),
  adults: z.coerce.number().min(1).max(4),
  children: z.coerce.number().min(0).max(3),
  checkInDate: z.string().min(1, "Please select a check-in date"),
  checkOutDate: z.string().min(1, "Please select a check-out date"),
  
  // Payment Information (required as per the task)
  paymentMethod: z.enum(["creditCard", "debitCard", "upi", "bankTransfer", "cash"]),
  cardNumber: z.string().optional(),
  cardHolderName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  
  // Additional Fields
  specialRequests: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and policies to proceed"
  }),
});

// The form input types based on the schema
type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewBookingModal({ isOpen, onClose }: NewBookingModalProps) {
  const { toast } = useToast();
  
  // Default form values
  const defaultValues: Partial<BookingFormValues> = {
    adults: 1,
    children: 0,
    termsAccepted: false,
  };
  
  // Setup form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
  });
  
  // Watch payment method to conditionally show card fields
  const paymentMethod = form.watch("paymentMethod");
  const needsCardDetails = paymentMethod === "creditCard" || paymentMethod === "debitCard";
  
  // Submit handler
  const onSubmit = (data: BookingFormValues) => {
    console.log("ACTION: Create New Booking", data);
    
    // In a real app, this would make an API call
    toast({
      title: "Booking Created",
      description: "The booking has been successfully created",
      variant: "default",
    });
    
    // Close modal and reset form
    form.reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
          <DialogDescription>
            Enter the guest information and booking details
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Guest Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Guest Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* ID Proof Section (Required as per the task) */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">ID Proof</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="idType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="drivingLicense">Driving License</SelectItem>
                          <SelectItem value="voterID">Voter ID</SelectItem>
                          <SelectItem value="aadharCard">Aadhar Card</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ID number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Booking Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="roomType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Room Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="deluxe">Deluxe Room</SelectItem>
                          <SelectItem value="suite">Suite Room</SelectItem>
                          <SelectItem value="standard">Standard Room</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="adults"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adults *</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="children"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Children</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="checkInDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="checkOutDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Payment Information (Required as per the task) */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Payment Method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="creditCard">Credit Card</SelectItem>
                          <SelectItem value="debitCard">Debit Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {needsCardDetails && (
                  <>
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="XXXX XXXX XXXX XXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cardHolderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Holder Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date *</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/YY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV *</FormLabel>
                            <FormControl>
                              <Input placeholder="123" type="password" maxLength={4} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Additional Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              
              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requests</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any special requests or requirements..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Cancellation Policy Section */}
            <Card className="bg-muted/40">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-2">Cancellation Policy</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Free cancellation up to 48 hours before check-in (by 12:00 PM local hotel time).</p>
                  <p>• Cancellations made within 48 hours of check-in will incur a charge of 1 night's stay.</p>
                  <p>• No-shows will be charged the full amount of the reservation.</p>
                  <p>• Early check-out will result in a charge for the entire reserved stay.</p>
                  <p>• Modifications to bookings are subject to availability and may incur rate changes.</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Terms and Conditions */}
            <div>
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I accept the terms and conditions, privacy policy, and cancellation policy
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create Booking</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}