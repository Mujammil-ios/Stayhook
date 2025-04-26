import React, { useState, useEffect } from "react";
import { TextInput } from "../text-input";
import { SelectInput, SelectOption } from "../select-input";
import { CheckboxInput } from "../checkbox-input";
import { MultiCheckbox, CheckboxOption } from "../multi-checkbox";
import { FileUpload } from "../file-upload";
import { Button } from "@/components/ui/button";
import { Validators, validateForm, getFieldError, ValidationErrors } from "@/lib/validators";
import { FieldGroup } from "../form-field";

// Define room categories
const roomCategoryOptions: SelectOption[] = [
  { value: "standard", label: "Standard" },
  { value: "deluxe", label: "Deluxe" },
  { value: "executive", label: "Executive" },
  { value: "suite", label: "Suite" },
  { value: "presidential", label: "Presidential Suite" },
];

// Define room status options
const roomStatusOptions: SelectOption[] = [
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "maintenance", label: "Maintenance" },
  { value: "cleaning", label: "Cleaning" },
];

// Define amenities options
const amenitiesOptions: CheckboxOption[] = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "ac", label: "Air Conditioning" },
  { value: "tv", label: "Television" },
  { value: "refrigerator", label: "Refrigerator" },
  { value: "safe", label: "In-room Safe" },
  { value: "minibar", label: "Mini Bar" },
  { value: "desk", label: "Work Desk" },
  { value: "bathtub", label: "Bathtub" },
  { value: "shower", label: "Shower" },
  { value: "hairdryer", label: "Hair Dryer" },
  { value: "balcony", label: "Balcony" },
  { value: "oceanview", label: "Ocean View" },
];

interface RoomFormProps {
  onSubmit: (data: RoomFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<RoomFormData>;
  isLoading?: boolean;
  isEditing?: boolean;
}

export interface RoomFormData {
  roomNumber: string;
  roomCategory: string;
  floorNumber: string;
  adultsCapacity: string;
  childrenCapacity: string;
  basePrice: string;
  hasSeasonalPricing: boolean;
  seasonalPrices: {
    summer: string;
    winter: string;
    holiday: string;
  };
  roomStatus: string;
  amenities: string[];
  photos: File[];
}

export function RoomForm({ 
  onSubmit, 
  onCancel, 
  initialData,
  isLoading = false,
  isEditing = false
}: RoomFormProps) {
  // Form state
  const [formData, setFormData] = useState<RoomFormData>({
    roomNumber: initialData?.roomNumber || "",
    roomCategory: initialData?.roomCategory || "",
    floorNumber: initialData?.floorNumber || "",
    adultsCapacity: initialData?.adultsCapacity || "2",
    childrenCapacity: initialData?.childrenCapacity || "0",
    basePrice: initialData?.basePrice || "",
    hasSeasonalPricing: initialData?.hasSeasonalPricing || false,
    seasonalPrices: initialData?.seasonalPrices || {
      summer: "",
      winter: "",
      holiday: ""
    },
    roomStatus: initialData?.roomStatus || "available",
    amenities: initialData?.amenities || [],
    photos: initialData?.photos || [],
  });

  // Form validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation rules
  const validationRules = {
    roomNumber: [
      Validators.required("Room number is required"),
      Validators.pattern(/^\d+$/, "Room number must be numeric"),
    ],
    roomCategory: [
      Validators.required("Room category is required"),
    ],
    floorNumber: [
      Validators.pattern(/^\d*$/, "Floor number must be numeric"),
    ],
    adultsCapacity: [
      Validators.required("Adults capacity is required"),
      Validators.pattern(/^\d+$/, "Must be a number"),
      Validators.min(1, "Minimum capacity is 1"),
    ],
    childrenCapacity: [
      Validators.pattern(/^\d*$/, "Must be a number"),
    ],
    basePrice: [
      Validators.required("Base price is required"),
      Validators.pattern(/^\d+(\.\d{1,2})?$/, "Enter a valid price (e.g., 99.99)"),
      Validators.min(0, "Price cannot be negative"),
    ],
    roomStatus: [
      Validators.required("Room status is required"),
    ],
    ...(formData.hasSeasonalPricing ? {
      'seasonalPrices.summer': [
        Validators.pattern(/^\d+(\.\d{1,2})?$/, "Enter a valid price (e.g., 99.99)"),
        Validators.min(0, "Price cannot be negative"),
      ],
      'seasonalPrices.winter': [
        Validators.pattern(/^\d+(\.\d{1,2})?$/, "Enter a valid price (e.g., 99.99)"),
        Validators.min(0, "Price cannot be negative"),
      ],
      'seasonalPrices.holiday': [
        Validators.pattern(/^\d+(\.\d{1,2})?$/, "Enter a valid price (e.g., 99.99)"),
        Validators.min(0, "Price cannot be negative"),
      ],
    } : {}),
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
  }, [formData, touched, validationRules]);

  // Handle change for text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof RoomFormData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle change for select inputs
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle change for checkbox inputs
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle change for multi checkbox
  const handleMultiCheckboxChange = (selectedValues: string[]) => {
    setFormData(prev => ({ ...prev, amenities: selectedValues }));
  };

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    setFormData(prev => ({ ...prev, photos: files }));
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

    // Submit if no errors
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <FieldGroup>
        <TextInput
          id="roomNumber"
          label="Room Number"
          value={formData.roomNumber}
          onChange={handleChange}
          onBlur={() => handleBlur("roomNumber")}
          placeholder="Enter room number"
          required
          error={getFieldError("roomNumber", errors)}
          icon="ri-door-line"
        />

        <SelectInput
          id="roomCategory"
          label="Room Category"
          value={formData.roomCategory}
          onChange={(value) => {
            handleSelectChange("roomCategory", value);
            handleBlur("roomCategory");
          }}
          options={roomCategoryOptions}
          placeholder="Select room category"
          required
          error={getFieldError("roomCategory", errors)}
        />
      </FieldGroup>

      <FieldGroup>
        <TextInput
          id="floorNumber"
          label="Floor Number"
          value={formData.floorNumber}
          onChange={handleChange}
          onBlur={() => handleBlur("floorNumber")}
          placeholder="Enter floor number"
          error={getFieldError("floorNumber", errors)}
          icon="ri-building-line"
        />

        <SelectInput
          id="roomStatus"
          label="Room Status"
          value={formData.roomStatus}
          onChange={(value) => {
            handleSelectChange("roomStatus", value);
            handleBlur("roomStatus");
          }}
          options={roomStatusOptions}
          placeholder="Select room status"
          required
          error={getFieldError("roomStatus", errors)}
        />
      </FieldGroup>

      <FieldGroup>
        <TextInput
          id="adultsCapacity"
          label="Adults Capacity"
          value={formData.adultsCapacity}
          onChange={handleChange}
          onBlur={() => handleBlur("adultsCapacity")}
          placeholder="Number of adults"
          required
          error={getFieldError("adultsCapacity", errors)}
          icon="ri-user-line"
          type="number"
        />

        <TextInput
          id="childrenCapacity"
          label="Children Capacity"
          value={formData.childrenCapacity}
          onChange={handleChange}
          onBlur={() => handleBlur("childrenCapacity")}
          placeholder="Number of children"
          error={getFieldError("childrenCapacity", errors)}
          icon="ri-user-smile-line"
          type="number"
        />
      </FieldGroup>

      <FieldGroup>
        <TextInput
          id="basePrice"
          label="Base Price"
          value={formData.basePrice}
          onChange={handleChange}
          onBlur={() => handleBlur("basePrice")}
          placeholder="Enter base price"
          required
          error={getFieldError("basePrice", errors)}
          icon="ri-money-dollar-circle-line"
        />

        <div className="self-end">
          <CheckboxInput
            id="hasSeasonalPricing"
            label="Enable seasonal pricing"
            checked={formData.hasSeasonalPricing}
            onChange={(checked) => handleCheckboxChange("hasSeasonalPricing", checked)}
          />
        </div>
      </FieldGroup>

      {formData.hasSeasonalPricing && (
        <div className="rounded-md border border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-800/50 animate-fadeIn">
          <h3 className="text-sm font-medium mb-3">Seasonal Pricing</h3>
          <FieldGroup>
            <TextInput
              id="seasonalPrices.summer"
              label="Summer Price"
              value={formData.seasonalPrices.summer}
              onChange={handleChange}
              onBlur={() => handleBlur("seasonalPrices.summer")}
              placeholder="Summer rate"
              error={getFieldError("seasonalPrices.summer", errors)}
              icon="ri-sun-line"
            />

            <TextInput
              id="seasonalPrices.winter"
              label="Winter Price"
              value={formData.seasonalPrices.winter}
              onChange={handleChange}
              onBlur={() => handleBlur("seasonalPrices.winter")}
              placeholder="Winter rate"
              error={getFieldError("seasonalPrices.winter", errors)}
              icon="ri-snowy-line"
            />

            <TextInput
              id="seasonalPrices.holiday"
              label="Holiday Price"
              value={formData.seasonalPrices.holiday}
              onChange={handleChange}
              onBlur={() => handleBlur("seasonalPrices.holiday")}
              placeholder="Holiday rate"
              error={getFieldError("seasonalPrices.holiday", errors)}
              icon="ri-calendar-event-line"
            />
          </FieldGroup>
        </div>
      )}

      <MultiCheckbox
        id="amenities"
        label="Room Amenities"
        options={amenitiesOptions}
        selectedValues={formData.amenities}
        onChange={handleMultiCheckboxChange}
        columns={2}
        hint="Select all amenities available in this room"
      />

      <FileUpload
        id="photos"
        label="Room Photos"
        value={formData.photos}
        onChange={handleFileUpload}
        maxFiles={20}
        accept="image/*"
        hint="Upload up to 20 photos of the room"
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
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEditing ? "Update Room" : "Create Room"
          )}
        </Button>
      </div>
    </form>
  );
}