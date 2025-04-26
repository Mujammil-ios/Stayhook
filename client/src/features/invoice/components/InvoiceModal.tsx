import React from 'react';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Reservation } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { PrinterIcon, DownloadIcon, MailIcon, CheckIcon } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

export function InvoiceModal({ isOpen, onClose, reservation }: InvoiceModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('preview');

  if (!reservation) {
    return null;
  }

  // Calculate stay duration
  const checkInDate = new Date(reservation.checkInDate);
  const checkOutDate = new Date(reservation.checkOutDate);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate costs
  const roomTotal = reservation.roomRate * nights;
  const taxRate = 0.18; // 18% GST
  const taxAmount = roomTotal * taxRate;
  const grandTotal = roomTotal + taxAmount;

  // Handle actions
  const handlePrint = () => {
    toast({
      title: 'Print Requested',
      description: 'Sending invoice to printer...',
    });
    // In a real app, would trigger print functionality
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: 'Download Started',
      description: 'Your invoice is being downloaded...',
    });
    // In a real app, would generate PDF and trigger download
  };

  const handleEmail = () => {
    toast({
      title: 'Email Sent',
      description: 'Invoice has been emailed to the guest.',
    });
    // In a real app, would send email with invoice
  };

  const handleConfirm = () => {
    toast({
      title: 'Invoice Confirmed',
      description: 'Invoice has been confirmed and reservation is complete.',
      variant: 'success',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Reservation Invoice</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="preview">Invoice Preview</TabsTrigger>
            <TabsTrigger value="details">Payment Details</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <Card className="bg-white dark:bg-neutral-900 border-0 shadow-none">
              <CardHeader className="flex flex-row justify-between items-start pb-2">
                <div>
                  <CardTitle className="text-xl">INVOICE</CardTitle>
                  <CardDescription>
                    #{reservation.id.toString().padStart(6, '0')}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold">Hotel Management System</h3>
                  <p className="text-sm text-muted-foreground">123 Hotel Street, City</p>
                  <p className="text-sm text-muted-foreground">contact@hotelmanagement.com</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Guest Information</h4>
                    <p className="text-sm">{reservation.customerName}</p>
                    <p className="text-sm">{reservation.address}</p>
                    <p className="text-sm">
                      {reservation.mobileNo} {reservation.email ? `| ${reservation.email}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-sm font-semibold mb-1">Reservation Details</h4>
                    <p className="text-sm">
                      Check-in: {format(checkInDate, 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm">
                      Check-out: {format(checkOutDate, 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm">Room: {reservation.roomType} (#{reservation.roomId})</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-2">Charges Summary</h4>
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs border-b">
                        <th className="text-left py-2">Item</th>
                        <th className="text-right py-2">Rate</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">{reservation.roomType} Room</td>
                        <td className="text-right py-2">₹{reservation.roomRate.toFixed(2)}</td>
                        <td className="text-right py-2">{nights} night(s)</td>
                        <td className="text-right py-2">₹{roomTotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="text-right py-2 font-medium">Subtotal</td>
                        <td className="text-right py-2">₹{roomTotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="text-right py-2 font-medium">GST (18%)</td>
                        <td className="text-right py-2">₹{taxAmount.toFixed(2)}</td>
                      </tr>
                      <tr className="border-t border-t-2">
                        <td colSpan={3} className="text-right py-2 font-bold">Grand Total</td>
                        <td className="text-right py-2 font-bold">₹{grandTotal.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md p-4 mt-4">
                  <h4 className="text-sm font-semibold mb-2">Terms & Conditions</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Check-in time: 12:00 PM, Check-out time: 11:00 AM</li>
                    <li>• Late check-out will incur additional charges</li>
                    <li>• All damages to hotel property will be charged</li>
                    <li>• No refunds for early check-out</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Review and confirm payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Payment Method</h4>
                    <div className="p-3 border rounded-md bg-neutral-50 dark:bg-neutral-900">
                      <p className="text-sm font-medium">Cash Payment</p>
                      <p className="text-xs text-muted-foreground">Paid at property</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Payment Status</h4>
                    <div className="p-3 border rounded-md bg-neutral-50 dark:bg-neutral-900">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">Paid in Full</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Payment received: {format(new Date(), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Payment Summary</h4>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="py-2">Room Charges</td>
                        <td className="text-right py-2">₹{roomTotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="py-2">Tax (18% GST)</td>
                        <td className="text-right py-2">₹{taxAmount.toFixed(2)}</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-2 font-bold">Total Charged</td>
                        <td className="text-right py-2 font-bold">₹{grandTotal.toFixed(2)}</td>
                      </tr>
                      <tr className="border-t border-dashed">
                        <td className="py-2 text-green-600 font-medium">Amount Paid</td>
                        <td className="text-right py-2 text-green-600 font-medium">₹{grandTotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold">Balance Due</td>
                        <td className="text-right py-2 font-bold">₹0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1 flex-wrap">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1">
              <PrinterIcon className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="flex-1">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleEmail} className="flex-1">
              <MailIcon className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>
          <Button onClick={handleConfirm} size="sm" className="flex-1">
            <CheckIcon className="mr-2 h-4 w-4" />
            Confirm Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}