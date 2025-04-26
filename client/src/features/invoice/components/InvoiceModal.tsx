import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DownloadIcon, PrinterIcon, Share2Icon } from 'lucide-react';
import { Reservation } from '@/types';
import { invoiceService, Invoice } from '@/shared/services/invoiceService';

// Define the invoice form schema
const invoiceSchema = z.object({
  invoiceNumber: z.string(),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Invalid phone number'),
  customerAddress: z.string().optional(),
  roomDetails: z.object({
    roomNumber: z.string(),
    roomType: z.string(),
    rate: z.number().min(1, 'Rate must be greater than 0'),
  }),
  checkInDate: z.date(),
  checkOutDate: z.date(),
  nights: z.number().min(1),
  subTotal: z.number().min(0),
  taxDetails: z.object({
    gst: z.number().min(0),
    serviceCharge: z.number().optional(),
  }),
  discountAmount: z.number().optional(),
  discountReason: z.string().optional(),
  totalAmount: z.number().min(0),
  amountPaid: z.number().min(0),
  balanceDue: z.number().min(0),
  paymentStatus: z.enum(['paid', 'partial', 'unpaid']),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceModalProps {
  reservation: Reservation;
  onClose: () => void;
}

export function InvoiceModal({ reservation, onClose }: InvoiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  
  // Generate invoice number
  const generateInvoiceNumber = () => {
    const prefix = 'INV';
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${year}${month}-${randomNum}`;
  };
  
  // Calculate invoice details based on reservation
  const calculateInvoiceDetails = (res: Reservation) => {
    const checkInDate = new Date(res.checkInDate);
    const checkOutDate = new Date(res.checkOutDate);
    
    // Calculate number of nights
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // For demonstration, let's assume room rate is in totalAmount / nights
    const roomRate = res.totalAmount / nights;
    
    // Calculate subtotal (room rate × nights)
    const subTotal = roomRate * nights;
    
    // Calculate tax (18% GST)
    const gstRate = 0.18;
    const gstAmount = subTotal * gstRate;
    
    // Calculate total amount
    const totalAmount = subTotal + gstAmount;
    
    return {
      nights,
      roomRate,
      subTotal,
      gstAmount,
      totalAmount
    };
  };
  
  const invoiceDetails = calculateInvoiceDetails(reservation);
  
  // Initialize form with default values from reservation
  const methods = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: generateInvoiceNumber(),
      customerName: 'Guest Name',  // In a real app, this would come from the reservation
      customerEmail: 'guest@example.com',
      customerPhone: '',
      customerAddress: '',
      roomDetails: {
        roomNumber: reservation.roomId.toString(),
        roomType: 'Standard',  // This would come from room details in a real app
        rate: invoiceDetails.roomRate,
      },
      checkInDate: new Date(reservation.checkInDate),
      checkOutDate: new Date(reservation.checkOutDate),
      nights: invoiceDetails.nights,
      subTotal: invoiceDetails.subTotal,
      taxDetails: {
        gst: invoiceDetails.gstAmount,
        serviceCharge: 0,
      },
      discountAmount: 0,
      totalAmount: invoiceDetails.totalAmount,
      amountPaid: 0,
      balanceDue: invoiceDetails.totalAmount,
      paymentStatus: 'unpaid',
    }
  });
  
  // Handle form submission to create an invoice
  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const invoiceData = {
        reservationId: reservation.id,
        customerName: data.customerName,
        customerDetails: {
          email: data.customerEmail,
          phone: data.customerPhone,
          address: data.customerAddress,
        },
        roomDetails: {
          roomNumber: data.roomDetails.roomNumber,
          roomType: data.roomDetails.roomType,
          rate: data.roomDetails.rate,
        },
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        subTotal: data.subTotal,
        taxDetails: {
          gst: data.taxDetails.gst,
          serviceCharge: data.taxDetails.serviceCharge,
        },
        totalAmount: data.totalAmount,
        amountPaid: data.amountPaid,
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      };
      
      // Create the invoice
      const response = await invoiceService.create(invoiceData as any);
      
      if (response.success && response.data) {
        toast({
          title: 'Invoice created',
          description: `Invoice #${response.data.invoiceNumber} has been created successfully.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to create invoice',
          description: response.message || 'An error occurred while creating the invoice.',
        });
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred while creating the invoice.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle downloading the invoice PDF
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    
    try {
      const response = await invoiceService.generatePdf(reservation.id);
      
      if (response.success && response.data) {
        // Create a link and trigger download
        const link = document.createElement('a');
        link.href = response.data.url;
        link.setAttribute('download', `Invoice-${methods.getValues('invoiceNumber')}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: 'PDF Generated',
          description: 'Invoice PDF has been downloaded successfully.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to generate PDF',
          description: response.message || 'An error occurred while generating the PDF.',
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred while generating the PDF.',
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Handle printing the invoice
  const handlePrint = () => {
    window.print();
  };
  
  // Listen for changes in amount paid and update balance due
  useEffect(() => {
    const subscription = methods.watch((value, { name }) => {
      if (name === 'amountPaid' || name === 'totalAmount') {
        const totalAmount = value.totalAmount as number || 0;
        const amountPaid = value.amountPaid as number || 0;
        const balanceDue = totalAmount - amountPaid;
        
        // Update payment status based on amounts
        let paymentStatus: 'paid' | 'partial' | 'unpaid' = 'unpaid';
        if (amountPaid >= totalAmount) {
          paymentStatus = 'paid';
        } else if (amountPaid > 0) {
          paymentStatus = 'partial';
        }
        
        methods.setValue('balanceDue', balanceDue);
        methods.setValue('paymentStatus', paymentStatus);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [methods]);
  
  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50 p-4 print:p-0 print:bg-white">
      <Card className="w-full max-w-4xl mx-auto print:shadow-none print:border-none overflow-auto max-h-[90vh]">
        <CardHeader className="print:pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle className="text-2xl">Invoice</CardTitle>
              <CardDescription>
                Invoice #{methods.getValues('invoiceNumber')}
              </CardDescription>
            </div>
            <div className="flex items-center mt-4 md:mt-0 space-x-2 print:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-2">
                {/* Business Information */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Hotel Information</h3>
                  <p className="text-sm">Luxury Hotel & Resorts</p>
                  <p className="text-sm">123 Hospitality Lane</p>
                  <p className="text-sm">Mumbai, Maharashtra 400001</p>
                  <p className="text-sm">GSTIN: 27AABCL0123A1Z5</p>
                  <p className="text-sm">Phone: +91-22-12345678</p>
                </div>
                
                {/* Invoice Details */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Invoice Details</h3>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm font-medium">Invoice Number:</p>
                    <p className="text-sm">{methods.getValues('invoiceNumber')}</p>
                    
                    <p className="text-sm font-medium">Invoice Date:</p>
                    <p className="text-sm">{format(new Date(), 'dd MMM yyyy')}</p>
                    
                    <p className="text-sm font-medium">Booking ID:</p>
                    <p className="text-sm">{reservation.id}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Guest Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={methods.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guest Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={methods.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={methods.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={methods.control}
                    name="customerAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Stay Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Stay Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium">Check-in Date</p>
                    <p className="text-sm">{format(methods.getValues('checkInDate'), 'dd MMM yyyy')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Check-out Date</p>
                    <p className="text-sm">{format(methods.getValues('checkOutDate'), 'dd MMM yyyy')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Number of Nights</p>
                    <p className="text-sm">{methods.getValues('nights')}</p>
                  </div>
                  
                  <FormField
                    control={methods.control}
                    name="roomDetails.roomNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={methods.control}
                    name="roomDetails.roomType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Deluxe">Deluxe</SelectItem>
                            <SelectItem value="Suite">Suite</SelectItem>
                            <SelectItem value="Family">Family</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={methods.control}
                    name="roomDetails.rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate per Night (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              field.onChange(value);
                              
                              // Recalculate subtotal and total
                              const nights = methods.getValues('nights');
                              const subTotal = value * nights;
                              methods.setValue('subTotal', subTotal);
                              
                              const gstRate = 0.18;
                              const gstAmount = subTotal * gstRate;
                              methods.setValue('taxDetails.gst', gstAmount);
                              
                              const discountAmount = methods.getValues('discountAmount') || 0;
                              const totalAmount = subTotal + gstAmount - discountAmount;
                              methods.setValue('totalAmount', totalAmount);
                              
                              const amountPaid = methods.getValues('amountPaid') || 0;
                              methods.setValue('balanceDue', totalAmount - amountPaid);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Charges and Taxes */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Charges & Taxes</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">Room Charges ({methods.getValues('nights')} nights × ₹{methods.getValues('roomDetails.rate')})</p>
                    <p className="text-sm text-right">₹{methods.getValues('subTotal').toFixed(2)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2">
                    <p className="text-sm font-medium">GST (18%)</p>
                    <p className="text-sm text-right">₹{methods.getValues('taxDetails.gst').toFixed(2)}</p>
                  </div>
                  
                  <FormField
                    control={methods.control}
                    name="discountAmount"
                    render={({ field }) => (
                      <div className="grid grid-cols-2 items-center">
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormLabel className="text-sm font-medium">Discount</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              className="w-24" 
                              {...field} 
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                field.onChange(value);
                                
                                // Recalculate total
                                const subTotal = methods.getValues('subTotal');
                                const gstAmount = methods.getValues('taxDetails.gst');
                                const totalAmount = subTotal + gstAmount - value;
                                methods.setValue('totalAmount', totalAmount);
                                
                                const amountPaid = methods.getValues('amountPaid') || 0;
                                methods.setValue('balanceDue', totalAmount - amountPaid);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                        <p className="text-sm text-right">-₹{methods.getValues('discountAmount').toFixed(2)}</p>
                      </div>
                    )}
                  />
                  
                  <FormField
                    control={methods.control}
                    name="discountReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Reason</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-2" />
                  
                  <div className="grid grid-cols-2 font-bold">
                    <p className="text-base">Total Amount</p>
                    <p className="text-base text-right">₹{methods.getValues('totalAmount').toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={methods.control}
                    name="amountPaid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount Paid (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              field.onChange(value);
                              
                              const totalAmount = methods.getValues('totalAmount');
                              methods.setValue('balanceDue', totalAmount - value);
                              
                              // Update payment status
                              let paymentStatus: 'paid' | 'partial' | 'unpaid' = 'unpaid';
                              if (value >= totalAmount) {
                                paymentStatus = 'paid';
                              } else if (value > 0) {
                                paymentStatus = 'partial';
                              }
                              methods.setValue('paymentStatus', paymentStatus);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={methods.control}
                    name="balanceDue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Balance Due (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={methods.control}
                    name="paymentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="partial">Partially Paid</SelectItem>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={methods.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                            <SelectItem value="debit_card">Debit Card</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={methods.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes or special instructions"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2 text-sm print:hidden">
                <p className="font-medium">Terms & Conditions:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Invoice must be paid within 7 days of issue.</li>
                  <li>Payments can be made via cash, credit card, or bank transfer.</li>
                  <li>No refunds for cancellations made less than 24 hours before check-in.</li>
                  <li>This is a computer-generated invoice and does not require a signature.</li>
                </ul>
              </div>
              
              <CardFooter className="flex justify-between pt-6 px-0 print:hidden">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Invoice'}
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}