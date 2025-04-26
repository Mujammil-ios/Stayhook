import React, { useState, useEffect } from "react";
import { TextInput } from "../text-input";
import { SelectInput, SelectOption } from "../select-input";
import { DatePicker } from "../date-picker";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../file-upload";
import { FieldGroup } from "../form-field";
import { Validators, validateForm, getFieldError, ValidationErrors } from "@/lib/validators";

// ID proof type options
const idProofTypeOptions: SelectOption[] = [
  { value: "passport", label: "Passport" },
  { value: "drivingLicense", label: "Driving License" },
  { value: "nationalId", label: "National ID" },
  { value: "voterCard", label: "Voter Card" },
  { value: "other", label: "Other" },
];

export interface GuestFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idProofType: string;
  idProofFiles: File[];
  vehicleNumber?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  checkInDate: Date;
  checkOutDate: Date;
  specialRequests?: string;
}

interface GuestFormProps {
  onSubmit: (data: GuestFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<GuestFormData>;
  isLoading?: boolean;
}

export function GuestForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: GuestFormProps) {
  // Set default dates if not provided
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // Form state
  const [formData, setFormData] = useState<GuestFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    idProofType: initialData?.idProofType || "passport",
    idProofFiles: initialData?.idProofFiles || [],
    vehicleNumber: initialData?.vehicleNumber || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    postalCode: initialData?.postalCode || "",
    country: initialData?.country || "India",
    checkInDate: initialData?.checkInDate || today,
    checkOutDate: initialData?.checkOutDate || tomorrow,
    specialRequests: initialData?.specialRequests || "",
  });

  // Form validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation rules
  const validationRules = {
    firstName: [
      Validators.required("First name is required"),
      Validators.pattern(/^[a-zA-Z ]+$/, "Only alphabets are allowed"),
    ],
    lastName: [
      Validators.required("Last name is required"),
      Validators.pattern(/^[a-zA-Z ]+$/, "Only alphabets are allowed"),
    ],
    email: [
      Validators.required("Email is required"),
      Validators.email("Please enter a valid email address"),
    ],
    phone: [
      Validators.required("Phone number is required"),
      Validators.pattern(/^[0-9]{10,15}$/, "Please enter a valid phone number"),
    ],
    address: [
      Validators.required("Address is required"),
    ],
    city: [
      Validators.required("City is required"),
      Validators.pattern(/^[a-zA-Z ]+$/, "Only alphabets are allowed"),
    ],
    state: [
      Validators.required("State is required"),
    ],
    postalCode: [
      Validators.required("Postal code is required"),
      Validators.pattern(/^[a-zA-Z0-9 -]{5,10}$/, "Please enter a valid postal code"),
    ],
    country: [
      Validators.required("Country is required"),
    ],
  };

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

  // Handle change for file upload
  const handleFileChange = (files: File[]) => {
    setFormData(prev => ({ ...prev, idProofFiles: files }));
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
      console.log("Guest form submitted with data:", formData);
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <h3 className="text-lg font-medium mb-4">Personal Information</h3>
      
      <FieldGroup>
        <TextInput
          id="firstName"
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={() => handleBlur("firstName")}
          placeholder="Enter first name"
          required
          error={getFieldError("firstName", errors)}
          icon="ri-user-line"
        />

        <TextInput
          id="lastName"
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={() => handleBlur("lastName")}
          placeholder="Enter last name"
          required
          error={getFieldError("lastName", errors)}
          icon="ri-user-line"
        />
      </FieldGroup>

      <FieldGroup>
        <TextInput
          id="email"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => handleBlur("email")}
          placeholder="Enter email address"
          required
          error={getFieldError("email", errors)}
          icon="ri-mail-line"
        />

        <TextInput
          id="phone"
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={() => handleBlur("phone")}
          placeholder="Enter phone number"
          required
          error={getFieldError("phone", errors)}
          icon="ri-phone-line"
        />
      </FieldGroup>

      <div className="space-y-4">
        <h4 className="font-medium">ID Proof</h4>
        <FieldGroup>
          <SelectInput
            id="idProofType"
            label="ID Type"
            value={formData.idProofType}
            onChange={(value) => handleSelectChange("idProofType", value)}
            options={idProofTypeOptions}
            required
          />
          
          <TextInput
            id="vehicleNumber"
            label="Vehicle Number (if any)"
            name="vehicleNumber"
            value={formData.vehicleNumber || ""}
            onChange={handleChange}
            placeholder="Enter vehicle number"
            icon="ri-car-line"
          />
        </FieldGroup>

        <FileUpload
          id="idProofFiles"
          label="Upload ID Proof"
          value={formData.idProofFiles}
          onChange={handleFileChange}
          accept="image/*,.pdf"
          maxFiles={2}
          hint="Please upload a scanned copy of your ID (max 2 files)"
        />
      </div>

      <h3 className="text-lg font-medium mt-8 mb-4">Address Information</h3>
      
      <TextInput
        id="address"
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        onBlur={() => handleBlur("address")}
        placeholder="Enter street address"
        required
        error={getFieldError("address", errors)}
        icon="ri-home-6-line"
      />

      <FieldGroup>
        <TextInput
          id="city"
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          onBlur={() => handleBlur("city")}
          placeholder="Enter city"
          required
          error={getFieldError("city", errors)}
          icon="ri-building-line"
        />

        <TextInput
          id="state"
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          onBlur={() => handleBlur("state")}
          placeholder="Enter state/province"
          required
          error={getFieldError("state", errors)}
          icon="ri-map-pin-line"
        />
      </FieldGroup>

      <FieldGroup>
        <TextInput
          id="postalCode"
          label="Postal Code"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          onBlur={() => handleBlur("postalCode")}
          placeholder="Enter postal/zip code"
          required
          error={getFieldError("postalCode", errors)}
          icon="ri-mail-line"
        />

        <TextInput
          id="country"
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          onBlur={() => handleBlur("country")}
          placeholder="Enter country"
          required
          error={getFieldError("country", errors)}
          icon="ri-earth-line"
        />
      </FieldGroup>

      <h3 className="text-lg font-medium mt-8 mb-4">Stay Information</h3>
      
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
              Saving...
            </>
          ) : (
            "Register Guest"
          )}
        </Button>
      </div>
    </form>
  );
}