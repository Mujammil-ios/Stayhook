import React, { useState, useEffect } from "react";
import { TextInput } from "../text-input";
import { DatePicker } from "../date-picker";
import { RadioGroup, RadioOption } from "../radio-group";
import { FileUpload } from "../file-upload";
import { Button } from "@/components/ui/button";
import { SelectInput, SelectOption } from "../select-input";
import { Validators, validateForm, getFieldError, ValidationErrors } from "@/lib/validators";
import { FieldGroup } from "../form-field";

// Gender options
const genderOptions: RadioOption[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

// Nationality options
const nationalityOptions: SelectOption[] = [
  { value: "india", label: "India" },
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "japan", label: "Japan" },
  { value: "china", label: "China" },
  { value: "other", label: "Other" },
];

interface GuestFormProps {
  onSubmit: (data: GuestFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<GuestFormData>;
  isLoading?: boolean;
}

export interface GuestFormData {
  name: string;
  aadharNumber: string;
  aadharImage: File[];
  mobileNumber: string;
  vehicleNumber: string;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  travelingFrom: string;
  travelingTo: string;
  gender: string;
  maleCount: string;
  femaleCount: string;
  childCount: string;
  email: string;
  address: string;
  nationality: string;
}

export function GuestForm({ 
  onSubmit, 
  onCancel, 
  initialData,
  isLoading = false 
}: GuestFormProps) {
  // Form state
  const [formData, setFormData] = useState<GuestFormData>({
    name: initialData?.name || "",
    aadharNumber: initialData?.aadharNumber || "",
    aadharImage: initialData?.aadharImage || [],
    mobileNumber: initialData?.mobileNumber || "",
    vehicleNumber: initialData?.vehicleNumber || "",
    checkInDate: initialData?.checkInDate,
    checkOutDate: initialData?.checkOutDate,
    travelingFrom: initialData?.travelingFrom || "",
    travelingTo: initialData?.travelingTo || "",
    gender: initialData?.gender || "male",
    maleCount: initialData?.maleCount || "0",
    femaleCount: initialData?.femaleCount || "0",
    childCount: initialData?.childCount || "0",
    email: initialData?.email || "",
    address: initialData?.address || "",
    nationality: initialData?.nationality || "india",
  });

  // Form validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Auto-fill triggered
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  // Validation rules
  const validationRules = {
    name: [
      Validators.required("Name is required"),
      Validators.minLength(2, "Name must be at least 2 characters"),
    ],
    aadharNumber: [
      Validators.pattern(/^\d{12}$/, "Aadhar number must be 12 digits"),
    ],
    mobileNumber: [
      Validators.required("Mobile number is required"),
      Validators.pattern(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
    ],
    vehicleNumber: [
      Validators.pattern(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/, "Please enter a valid vehicle number (e.g., MH02AB1234)"),
    ],
    checkInDate: [
      Validators.required("Check-in date is required"),
    ],
    checkOutDate: [
      Validators.required("Check-out date is required"),
    ],
    maleCount: [
      Validators.pattern(/^\d+$/, "Must be a number"),
    ],
    femaleCount: [
      Validators.pattern(/^\d+$/, "Must be a number"),
    ],
    childCount: [
      Validators.pattern(/^\d+$/, "Must be a number"),
    ],
    email: [
      Validators.email("Please enter a valid email address"),
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

  // Auto-fill on mobile number
  useEffect(() => {
    // Only trigger if user has entered a full mobile number and hasn't auto-filled yet
    if (formData.mobileNumber.length === 10 && !hasAutoFilled) {
      // Simulate API call for auto-fill
      if (formData.mobileNumber === "9876543210") {
        setTimeout(() => {
          // Mock auto-fill data
          setFormData(prev => ({
            ...prev,
            name: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            address: "123 Main Street, Mumbai, Maharashtra",
            aadharNumber: "123456789012",
          }));
          setHasAutoFilled(true);
          
          // Show toast or notification that data was auto-filled
          console.log("Auto-filled guest information based on mobile number");
        }, 500);
      }
    }
  }, [formData.mobileNumber, hasAutoFilled]);

  // Handle change for text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle change for select inputs
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle change for radio inputs
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle change for date inputs
  const handleDateChange = (name: string, value: Date | undefined) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    setFormData(prev => ({ ...prev, aadharImage: files }));
  };

  // Mark field as touched on blur
  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Handle live photo capture
  const handleCapturePhoto = () => {
    // This would typically involve accessing the webcam and capturing a photo
    console.log("Photo capture triggered");
    // In a real implementation, you would:
    // 1. Access the webcam
    // 2. Show a preview
    // 3. Capture the image
    // 4. Convert to a File object
    // 5. Add to the formData
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
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <FieldGroup>
        <TextInput
          id="name"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
          onBlur={() => handleBlur("name")}
          placeholder="Enter guest's full name"
          required
          error={getFieldError("name", errors)}
          icon="ri-user-line"
        />

        <TextInput
          id="mobileNumber"
          label="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
          onBlur={() => handleBlur("mobileNumber")}
          placeholder="Enter 10-digit mobile number"
          required
          error={getFieldError("mobileNumber", errors)}
          type="tel"
          icon="ri-phone-line"
          hint="Enter 9876543210 to see auto-fill demo"
        />
      </FieldGroup>

      <FieldGroup>
        <TextInput
          id="aadharNumber"
          label="Aadhar Number"
          value={formData.aadharNumber}
          onChange={handleChange}
          onBlur={() => handleBlur("aadharNumber")}
          placeholder="Enter 12-digit Aadhar number"
          error={getFieldError("aadharNumber", errors)}
          icon="ri-government-line"
        />

        <FileUpload
          id="aadharImage"
          label="Aadhar Card Image"
          value={formData.aadharImage}
          onChange={handleFileUpload}
          maxFiles={1}
          accept="image/*"
          hint="Upload a scanned copy or photo of Aadhar card"
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
          minDate={formData.checkInDate || new Date()}
        />
      </FieldGroup>

      <FieldGroup>
        <TextInput
          id="vehicleNumber"
          label="Vehicle Number"
          value={formData.vehicleNumber}
          onChange={handleChange}
          onBlur={() => handleBlur("vehicleNumber")}
          placeholder="Enter vehicle registration number"
          error={getFieldError("vehicleNumber", errors)}
          icon="ri-car-line"
        />

        <SelectInput
          id="nationality"
          label="Nationality"
          value={formData.nationality}
          onChange={(value) => handleSelectChange("nationality", value)}
          options={nationalityOptions}
          placeholder="Select nationality"
        />
      </FieldGroup>

      <FieldGroup>
        <TextInput
          id="travelingFrom"
          label="Traveling From"
          value={formData.travelingFrom}
          onChange={handleChange}
          placeholder="City/Town/Location"
          icon="ri-map-pin-line"
        />

        <TextInput
          id="travelingTo"
          label="Traveling To"
          value={formData.travelingTo}
          onChange={handleChange}
          placeholder="City/Town/Location"
          icon="ri-map-pin-line"
        />
      </FieldGroup>

      <div className="rounded-md border border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-800/50">
        <h3 className="text-sm font-medium mb-3">Guest Details</h3>
        
        <RadioGroup
          id="gender"
          label="Gender"
          value={formData.gender}
          onChange={(value) => handleRadioChange("gender", value)}
          options={genderOptions}
          inline
        />
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <TextInput
            id="maleCount"
            label="Male Guests"
            value={formData.maleCount}
            onChange={handleChange}
            onBlur={() => handleBlur("maleCount")}
            type="number"
            error={getFieldError("maleCount", errors)}
            icon="ri-men-line"
          />
          
          <TextInput
            id="femaleCount"
            label="Female Guests"
            value={formData.femaleCount}
            onChange={handleChange}
            onBlur={() => handleBlur("femaleCount")}
            type="number"
            error={getFieldError("femaleCount", errors)}
            icon="ri-women-line"
          />
          
          <TextInput
            id="childCount"
            label="Children"
            value={formData.childCount}
            onChange={handleChange}
            onBlur={() => handleBlur("childCount")}
            type="number"
            error={getFieldError("childCount", errors)}
            icon="ri-parent-line"
          />
        </div>
      </div>

      <FieldGroup>
        <TextInput
          id="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => handleBlur("email")}
          placeholder="Enter email address"
          error={getFieldError("email", errors)}
          type="email"
          icon="ri-mail-line"
        />

        <div>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-10 mt-6"
            onClick={handleCapturePhoto}
          >
            <i className="ri-camera-line mr-2"></i>
            Capture Live Photo
          </Button>
        </div>
      </FieldGroup>

      <TextInput
        id="address"
        label="Address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Enter full address"
        icon="ri-home-line"
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
            "Add Guest"
          )}
        </Button>
      </div>
    </form>
  );
}