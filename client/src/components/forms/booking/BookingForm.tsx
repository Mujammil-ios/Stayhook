import React, { useState, useEffect } from "react";
import { TextInput } from "../text-input";
import { SelectInput, SelectOption } from "../select-input";
import { DatePicker } from "../date-picker";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "../form-field";
import { Validators, validateForm, getFieldError, ValidationErrors } from "@/lib/validators";
import { roomsData, guestsData } from "@/lib/data";

// Room options - dynamic based on data
const roomOptions: SelectOption[] = roomsData
  .filter(room => room.status === "available")
  .map(room => ({
    value: room.id.toString(),
    label: `Room ${room.number} (${room.category}) - $${room.baseRate}/night`
  }));

// Guest options - dynamic based on data
const guestOptions: SelectOption[] = guestsData.map(guest => ({
  value: guest.id.toString(),
  label: `${guest.firstName} ${guest.lastName}`
}));

// Payment method options
const paymentMethodOptions: SelectOption[] = [
  { value: "creditCard", label: "Credit Card" },
  { value: "debitCard", label: "Debit Card" },
  { value: "upi", label: "UPI" },
  { value: "netBanking", label: "Net Banking" },
  { value: "cash", label: "Cash" },
];

// Status options
const statusOptions: SelectOption[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checkedIn", label: "Checked In" },
  { value: "checkedOut", label: "Checked Out" },
  { value: "cancelled", label: "Cancelled" },
];

export interface BookingFormData {
  guestId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  adults: string;
  children: string;
  paymentMethod: string;
  totalAmount: string;
  taxRate: string;
  amountPaid: string;
  bookingStatus: string;
  specialRequests?: string;
}

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<BookingFormData>;
  isLoading?: boolean;
}

export function BookingForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: BookingFormProps) {
  // Set default dates if not provided
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // Form state
  const [formData, setFormData] = useState<BookingFormData>({
    guestId: initialData?.guestId || "",
    roomId: initialData?.roomId || "",
    checkInDate: initialData?.checkInDate || today,
    checkOutDate: initialData?.checkOutDate || tomorrow,
    adults: initialData?.adults || "1",
    children: initialData?.children || "0",
    paymentMethod: initialData?.paymentMethod || "creditCard",
    totalAmount: initialData?.totalAmount || "",
    taxRate: initialData?.taxRate || "18",
    amountPaid: initialData?.amountPaid || "0",
    bookingStatus: initialData?.bookingStatus || "pending",
    specialRequests: initialData?.specialRequests || "",
  });

  // Calculate stay duration and total amount
  const [stayDuration, setStayDuration] = useState(1);
  const [baseAmount, setBaseAmount] = useState(0);

  // Form validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation rules
  const validationRules = {
    guestId: [
      Validators.required("Guest selection is required"),
    ],
    roomId: [
      Validators.required("Room selection is required"),
    ],
    adults: [
      Validators.required("Number of adults is required"),
      Validators.pattern(/^[1-9][0-9]*$/, "Must be a positive number"),
      Validators.max(10, "Maximum 10 adults allowed"),
    ],
    children: [
      Validators.pattern(/^[0-9]*$/, "Must be a non-negative number"),
      Validators.max(6, "Maximum 6 children allowed"),
    ],
    totalAmount: [
      Validators.required("Total amount is required"),
      Validators.pattern(/^\d+(\.\d{1,2})?$/, "Enter a valid amount (e.g., 1999.99)"),
    ],
    amountPaid: [
      Validators.required("Amount paid is required"),
      Validators.pattern(/^\d+(\.\d{1,2})?$/, "Enter a valid amount (e.g., 1999.99)"),
    ],
  };

  // Update stay duration and base amount when dates or room changes
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setStayDuration(diffDays || 1);
      
      if (formData.roomId) {
        const room = roomsData.find(r => r.id.toString() === formData.roomId);
        if (room) {
          const baseRate = parseFloat(room.baseRate.toString());
          const calculatedBaseAmount = baseRate * diffDays;
          setBaseAmount(calculatedBaseAmount);
          
          // Calculate total amount with tax
          const taxRate = parseFloat(formData.taxRate) || 0;
          const taxAmount = (calculatedBaseAmount * taxRate) / 100;
          const totalAmount = (calculatedBaseAmount + taxAmount).toFixed(2);
          
          setFormData(prev => ({
            ...prev,
            totalAmount: totalAmount
          }));
        }
      }
    }
  }, [formData.checkInDate, formData.checkOutDate, formData.roomId, formData.taxRate]);

  // Validate on change
  useEffect(() => {
    const validationErrors = validateForm(formData, validationRules);
    
    // Only show errors for fields that have been touched
    const filteredErrors: ValidationErrors = {};
    Object.keys(validationErrors).forEach(field => {
      if (touched[field]) {
        filteredErrors[field] = validationErrors[field];
      }
    });
    
    setErrors(filteredErrors);
  }, [formData, touched]);

  // Handle change for text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle change for select inputs
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle change for date picker
  const handleDateChange = (name: string, value: Date | undefined) => {
    if (value) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Mark field as touched on blur
  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(validationRules).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const validationErrors = validateForm(formData, validationRules);
    setErrors(validationErrors);

    // If no errors, submit the form
    if (Object.keys(validationErrors).length === 0) {
      console.log("Booking form submitted with data:", formData);
      onSubmit(formData);
    }
  };

  // Get room rate
  const getRoomRate = () => {
    if (formData.roomId) {
      const room = roomsData.find(r => r.id.toString() === formData.roomId);
      return room ? `₹${room.baseRate}/night` : "Select a room";
    }
    return "Select a room";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <h3 className="text-lg font-medium mb-4">Booking Information</h3>

      <FieldGroup>
        <SelectInput
          id="guestId"
          label="Select Guest"
          value={formData.guestId}
          onChange={(value) => handleSelectChange("guestId", value)}
          options={guestOptions}
          required
          error={getFieldError("guestId", errors)}
        />

        <SelectInput
          id="roomId"
          label="Select Room"
          value={formData.roomId}
          onChange={(value) => handleSelectChange("roomId", value)}
          options={roomOptions}
          required
          error={getFieldError("roomId", errors)}
        />
      </FieldGroup>

      <FieldGroup>
        <DatePicker
          id="checkInDate"
          label="Check-in Date"
          value={formData.checkInDate}
          onChange={(date) => handleDateChange("checkInDate", date)}
          required
          minDate={new Date()}
        />

        <DatePicker
          id="checkOutDate"
          label="Check-out Date"
          value={formData.checkOutDate}
          onChange={(date) => handleDateChange("checkOutDate", date)}
          required
          minDate={formData.checkInDate}
        />
      </FieldGroup>

      <FieldGroup>
        <TextInput
          id="adults"
          label="Number of Adults"
          name="adults"
          value={formData.adults}
          onChange={handleChange}
          onBlur={() => handleBlur("adults")}
          placeholder="Enter number of adults"
          type="number"
          required
          error={getFieldError("adults", errors)}
          icon="ri-user-line"
        />

        <TextInput
          id="children"
          label="Number of Children"
          name="children"
          value={formData.children}
          onChange={handleChange}
          onBlur={() => handleBlur("children")}
          placeholder="Enter number of children"
          type="number"
          error={getFieldError("children", errors)}
          icon="ri-user-line"
        />
      </FieldGroup>

      <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-md space-y-3">
        <h4 className="font-medium">Booking Summary</h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-500">Stay Duration</p>
            <p className="font-medium">{stayDuration} night(s)</p>
          </div>
          
          <div>
            <p className="text-sm text-neutral-500">Room Rate</p>
            <p className="font-medium">{getRoomRate()}</p>
          </div>
          
          <div>
            <p className="text-sm text-neutral-500">Base Amount</p>
            <p className="font-medium">₹{baseAmount.toFixed(2)}</p>
          </div>
          
          <div>
            <p className="text-sm text-neutral-500">Tax Rate</p>
            <div className="flex items-center">
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                className="w-16 h-8 rounded-md border border-input bg-background px-2 text-sm mr-2"
                min="0"
                max="100"
              />
              <span>%</span>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium mt-6 mb-4">Payment Details</h3>
      
      <FieldGroup>
        <SelectInput
          id="paymentMethod"
          label="Payment Method"
          value={formData.paymentMethod}
          onChange={(value) => handleSelectChange("paymentMethod", value)}
          options={paymentMethodOptions}
          required
        />

        <SelectInput
          id="bookingStatus"
          label="Booking Status"
          value={formData.bookingStatus}
          onChange={(value) => handleSelectChange("bookingStatus", value)}
          options={statusOptions}
          required
        />
      </FieldGroup>

      <FieldGroup>
        <TextInput
          id="totalAmount"
          label="Total Amount (₹)"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          onBlur={() => handleBlur("totalAmount")}
          placeholder="Enter total amount"
          required
          error={getFieldError("totalAmount", errors)}
          icon="ri-money-dollar-circle-line"
        />

        <TextInput
          id="amountPaid"
          label="Amount Paid (₹)"
          name="amountPaid"
          value={formData.amountPaid}
          onChange={handleChange}
          onBlur={() => handleBlur("amountPaid")}
          placeholder="Enter amount paid"
          required
          error={getFieldError("amountPaid", errors)}
          icon="ri-money-dollar-circle-line"
        />
      </FieldGroup>

      <TextInput
        id="specialRequests"
        label="Special Requests"
        name="specialRequests"
        value={formData.specialRequests || ""}
        onChange={handleChange}
        placeholder="Enter any special requests or requirements"
        icon="ri-file-list-3-line"
      />

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <i className="ri-loader-4-line animate-spin mr-2"></i>
              Processing...
            </>
          ) : (
            "Create Booking"
          )}
        </Button>
      </div>
    </form>
  );
}