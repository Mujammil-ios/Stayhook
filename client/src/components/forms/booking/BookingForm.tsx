import React, { useState, useEffect } from "react";
import { TextInput } from "../text-input";
import { SelectInput, SelectOption } from "../select-input";
import { CheckboxInput } from "../checkbox-input";
import { DatePicker } from "../date-picker";
import { Button } from "@/components/ui/button";
import { Validators, validateForm, getFieldError, ValidationErrors } from "@/lib/validators";
import { FieldGroup } from "../form-field";

// Mock guest data for dropdown
const guestOptions: SelectOption[] = [
  { value: "1", label: "Rahul Sharma (9876543210)" },
  { value: "2", label: "Priya Patel (9876543211)" },
  { value: "3", label: "Amit Kumar (9876543212)" },
];

// Mock room data for dropdown
const roomOptions: SelectOption[] = [
  { value: "101", label: "Room 101 - Standard (Available)" },
  { value: "102", label: "Room 102 - Deluxe (Available)" },
  { value: "103", label: "Room 103 - Suite (Available)" },
  { value: "104", label: "Room 104 - Standard (Occupied)" },
  { value: "105", label: "Room 105 - Deluxe (Maintenance)" },
];

// Payment method options
const paymentMethodOptions: SelectOption[] = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Credit/Debit Card" },
  { value: "upi", label: "UPI" },
  { value: "netbanking", label: "Net Banking" },
  { value: "wallet", label: "Digital Wallet" },
];

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<BookingFormData>;
  isLoading?: boolean;
}

export interface BookingFormData {
  guestId: string;
  roomId: string;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  numberOfGuests: string;
  basePrice: string;
  overridePrice: boolean;
  customPrice: string;
  discountCode: string;
  paymentMethod: string;
  advancePayment: string;
  termsAccepted: boolean;
  notes: string;
}

export function BookingForm({ 
  onSubmit, 
  onCancel, 
  initialData,
  isLoading = false 
}: BookingFormProps) {
  // Form state
  const [formData, setFormData] = useState<BookingFormData>({
    guestId: initialData?.guestId || "",
    roomId: initialData?.roomId || "",
    checkInDate: initialData?.checkInDate,
    checkOutDate: initialData?.checkOutDate,
    numberOfGuests: initialData?.numberOfGuests || "1",
    basePrice: initialData?.basePrice || "2000",
    overridePrice: initialData?.overridePrice || false,
    customPrice: initialData?.customPrice || "",
    discountCode: initialData?.discountCode || "",
    paymentMethod: initialData?.paymentMethod || "cash",
    advancePayment: initialData?.advancePayment || "0",
    termsAccepted: initialData?.termsAccepted || false,
    notes: initialData?.notes || "",
  });

  // Calculated price details
  const [priceDetails, setPriceDetails] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    nights: 0,
  });

  // Form validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation rules
  const validationRules = {
    guestId: [
      Validators.required("Please select a guest"),
    ],
    roomId: [
      Validators.required("Please select a room"),
    ],
    checkInDate: [
      Validators.required("Check-in date is required"),
    ],
    checkOutDate: [
      Validators.required("Check-out date is required"),
    ],
    numberOfGuests: [
      Validators.required("Number of guests is required"),
      Validators.pattern(/^\d+$/, "Must be a number"),
      Validators.min(1, "Minimum 1 guest required"),
    ],
    advancePayment: [
      Validators.pattern(/^\d+(\.\d{1,2})?$/, "Enter a valid amount (e.g., 500.00)"),
    ],
    ...(formData.overridePrice ? {
      customPrice: [
        Validators.required("Custom price is required when override is enabled"),
        Validators.pattern(/^\d+(\.\d{1,2})?$/, "Enter a valid amount (e.g., 1999.99)"),
        Validators.min(0, "Price cannot be negative"),
      ],
    } : {}),
    termsAccepted: [
      Validators.custom((value) => Boolean(value), "You must accept the terms and conditions"),
    ],
  };

  // Calculate total based on inputs
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      // Calculate number of nights
      const nights = Math.max(
        1,
        Math.ceil(
          (formData.checkOutDate.getTime() - formData.checkInDate.getTime()) / 
          (1000 * 60 * 60 * 24)
        )
      );
      
      // Base price or custom price
      const baseAmount = formData.overridePrice && formData.customPrice
        ? parseFloat(formData.customPrice)
        : parseFloat(formData.basePrice);
      
      // Calculate subtotal (price * nights)
      const subtotal = baseAmount * nights;
      
      // Apply discount if any
      let discount = 0;
      if (formData.discountCode === "WELCOME10") {
        discount = subtotal * 0.1; // 10% discount
      } else if (formData.discountCode === "SUMMER20") {
        discount = subtotal * 0.2; // 20% discount
      }
      
      // Calculate tax (assuming 18% GST)
      const tax = (subtotal - discount) * 0.18;
      
      // Calculate total
      const total = subtotal - discount + tax;
      
      setPriceDetails({
        subtotal,
        discount,
        tax,
        total,
        nights,
      });
    }
  }, [
    formData.checkInDate,
    formData.checkOutDate,
    formData.basePrice,
    formData.overridePrice,
    formData.customPrice,
    formData.discountCode,
  ]);

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
  }, [formData, touched, validationRules]);

  // Handle change for text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle change for select inputs
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // When room is selected, update base price
    if (name === "roomId") {
      // In a real app, this would fetch the price from the server
      // Here we're just simulating it
      const priceMap: Record<string, string> = {
        "101": "2000",
        "102": "3500",
        "103": "5000",
        "104": "2000",
        "105": "3500",
      };
      setFormData(prev => ({ 
        ...prev, 
        basePrice: priceMap[value] || "2000" 
      }));
    }
  };

  // Handle change for checkbox inputs
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle change for date inputs
  const handleDateChange = (name: string, value: Date | undefined) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Apply discount code
  const handleApplyDiscount = () => {
    // In a real app, you would validate the code against an API
    const validCodes = ["WELCOME10", "SUMMER20"];
    
    if (validCodes.includes(formData.discountCode)) {
      toast({
        message: `Discount code "${formData.discountCode}" applied successfully!`,
        type: "success"
      });
    } else {
      toast({
        message: "Invalid discount code",
        type: "error"
      });
    }
  };

  // Simple toast function for the demo
  const toast = ({ message, type }: { message: string; type: string }) => {
    console.log(`[${type}] ${message}`);
    // In a real app, this would use the toast system
  };

  // Mark field as touched on blur
  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
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

    // Submit if no errors
    if (Object.keys(validationErrors).length === 0) {
      onSubmit({
        ...formData,
        // Include calculated values for reference
        calculatedTotal: priceDetails.total.toString(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <FieldGroup>
        <SelectInput
          id="guestId"
          label="Select Guest"
          value={formData.guestId}
          onChange={(value) => {
            handleSelectChange("guestId", value);
            handleBlur("guestId");
          }}
          options={guestOptions}
          placeholder="Select a guest"
          required
          error={getFieldError("guestId", errors)}
        />

        <Button 
          type="button" 
          variant="outline" 
          className="self-end h-10"
          onClick={() => console.log("Add new guest clicked")}
        >
          <i className="ri-user-add-line mr-2"></i>
          Add New Guest
        </Button>
      </FieldGroup>

      <FieldGroup>
        <SelectInput
          id="roomId"
          label="Select Room"
          value={formData.roomId}
          onChange={(value) => {
            handleSelectChange("roomId", value);
            handleBlur("roomId");
          }}
          options={roomOptions}
          placeholder="Select a room"
          required
          error={getFieldError("roomId", errors)}
        />

        <TextInput
          id="numberOfGuests"
          label="Number of Guests"
          value={formData.numberOfGuests}
          onChange={handleChange}
          onBlur={() => handleBlur("numberOfGuests")}
          placeholder="Enter number of guests"
          required
          error={getFieldError("numberOfGuests", errors)}
          type="number"
          icon="ri-user-line"
        />
      </FieldGroup>

      <FieldGroup>
        <DatePicker
          id="checkInDate"
          label="Check-in Date"
          value={formData.checkInDate}
          onChange={(date) => handleDateChange("checkInDate", date)}
          required
          error={getFieldError("checkInDate", errors)}
          minDate={new Date()}
        />

        <DatePicker
          id="checkOutDate"
          label="Check-out Date"
          value={formData.checkOutDate}
          onChange={(date) => handleDateChange("checkOutDate", date)}
          required
          error={getFieldError("checkOutDate", errors)}
          minDate={formData.checkInDate 
            ? new Date(formData.checkInDate.getTime() + 86400000) // +1 day
            : new Date(Date.now() + 86400000)
          }
        />
      </FieldGroup>

      <div className="rounded-md border border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-800/50">
        <h3 className="text-sm font-medium mb-4">Price Details</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {formData.basePrice ? formatCurrency(parseFloat(formData.basePrice)) : "₹0"} × {priceDetails.nights} night{priceDetails.nights !== 1 ? 's' : ''}
            </span>
            <span className="text-sm font-medium">{formatCurrency(priceDetails.subtotal)}</span>
          </div>
          
          {priceDetails.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Discount</span>
              <span className="text-sm font-medium text-green-600">-{formatCurrency(priceDetails.discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Taxes (18% GST)</span>
            <span className="text-sm font-medium">{formatCurrency(priceDetails.tax)}</span>
          </div>
          
          <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-700 pt-2 mt-2">
            <span className="text-sm font-medium">Total</span>
            <span className="text-base font-bold">{formatCurrency(priceDetails.total)}</span>
          </div>
        </div>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-grow">
            <TextInput
              id="discountCode"
              label="Discount Code"
              value={formData.discountCode}
              onChange={handleChange}
              placeholder="Enter discount code"
              icon="ri-coupon-line"
              hint="Try WELCOME10 or SUMMER20"
            />
          </div>
          <div className="self-end">
            <Button 
              type="button" 
              variant="secondary" 
              className="h-10"
              onClick={handleApplyDiscount}
              disabled={!formData.discountCode}
            >
              Apply
            </Button>
          </div>
        </div>
        
        <CheckboxInput
          id="overridePrice"
          label="Override price"
          checked={formData.overridePrice}
          onChange={(checked) => handleCheckboxChange("overridePrice", checked)}
        />
        
        {formData.overridePrice && (
          <div className="mt-3 animate-fadeIn">
            <TextInput
              id="customPrice"
              label="Custom Price (per night)"
              value={formData.customPrice}
              onChange={handleChange}
              onBlur={() => handleBlur("customPrice")}
              placeholder="Enter custom price"
              required={formData.overridePrice}
              error={getFieldError("customPrice", errors)}
              icon="ri-money-dollar-circle-line"
            />
          </div>
        )}
      </div>

      <FieldGroup>
        <SelectInput
          id="paymentMethod"
          label="Payment Method"
          value={formData.paymentMethod}
          onChange={(value) => handleSelectChange("paymentMethod", value)}
          options={paymentMethodOptions}
          placeholder="Select payment method"
        />
        
        <TextInput
          id="advancePayment"
          label="Advance Payment"
          value={formData.advancePayment}
          onChange={handleChange}
          onBlur={() => handleBlur("advancePayment")}
          placeholder="Enter advance amount"
          error={getFieldError("advancePayment", errors)}
          icon="ri-wallet-3-line"
        />
      </FieldGroup>

      <TextInput
        id="notes"
        label="Additional Notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Enter any special requests or notes"
        icon="ri-sticky-note-line"
      />

      <CheckboxInput
        id="termsAccepted"
        label="I confirm that all the information provided is correct and agree to the booking terms & conditions"
        checked={formData.termsAccepted}
        onChange={(checked) => handleCheckboxChange("termsAccepted", checked)}
        required
        error={getFieldError("termsAccepted", errors)}
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
              Confirming...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </form>
  );
}