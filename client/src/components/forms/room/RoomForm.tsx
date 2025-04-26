import React, { useState, useEffect } from "react";
import { TextInput } from "../text-input";
import { SelectInput, SelectOption } from "../select-input";
import { MultiCheckbox, CheckboxOption } from "../multi-checkbox";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "../form-field";
import { Validators, validateForm, getFieldError, ValidationErrors } from "@/lib/validators";

// Room category options
const categoryOptions: SelectOption[] = [
  { value: "standard", label: "Standard" },
  { value: "deluxe", label: "Deluxe" },
  { value: "suite", label: "Suite" },
  { value: "executive", label: "Executive" },
  { value: "presidential", label: "Presidential Suite" },
];

// Room status options
const statusOptions: SelectOption[] = [
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "maintenance", label: "Under Maintenance" },
  { value: "reserved", label: "Reserved" },
];

// Floor options
const floorOptions: SelectOption[] = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: `Floor ${i + 1}`,
}));

// Amenities options
const amenitiesOptions: CheckboxOption[] = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "ac", label: "Air Conditioning" },
  { value: "tv", label: "Television" },
  { value: "minibar", label: "Mini Bar" },
  { value: "safe", label: "Room Safe" },
  { value: "bathtub", label: "Bathtub" },
  { value: "shower", label: "Shower" },
  { value: "coffeeMaker", label: "Coffee Maker" },
  { value: "workspace", label: "Work Desk" },
  { value: "hairdryer", label: "Hair Dryer" },
  { value: "breakfast", label: "Complimentary Breakfast" },
  { value: "roomService", label: "Room Service" },
];

export interface RoomFormData {
  roomNumber: string;
  category: string;
  floor: string;
  capacity: string;
  baseRate: string;
  status: string;
  amenities: string[];
  description: string;
}

interface RoomFormProps {
  onSubmit: (data: RoomFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<RoomFormData>;
  isLoading?: boolean;
}

export function RoomForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: RoomFormProps) {
  // Form state
  const [formData, setFormData] = useState<RoomFormData>({
    roomNumber: initialData?.roomNumber || "",
    category: initialData?.category || "standard",
    floor: initialData?.floor || "1",
    capacity: initialData?.capacity || "2",
    baseRate: initialData?.baseRate || "",
    status: initialData?.status || "available",
    amenities: initialData?.amenities || ["wifi", "ac", "tv"],
    description: initialData?.description || "",
  });

  // Form validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation rules
  const validationRules = {
    roomNumber: [
      Validators.required("Room number is required"),
      Validators.pattern(/^[0-9]{3,4}$/, "Room number must be 3-4 digits"),
    ],
    baseRate: [
      Validators.required("Base rate is required"),
      Validators.pattern(/^\d+(\.\d{1,2})?$/, "Enter a valid amount (e.g., 1999.99)"),
      Validators.min(0, "Rate cannot be negative"),
    ],
    capacity: [
      Validators.required("Capacity is required"),
      Validators.pattern(/^[1-9][0-9]*$/, "Must be a positive number"),
      Validators.max(10, "Maximum capacity is 10"),
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

  // Handle change for multi checkbox
  const handleMultiCheckboxChange = (selectedValues: string[]) => {
    setFormData(prev => ({ ...prev, amenities: selectedValues }));
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
      console.log("Room form submitted with data:", formData);
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
          placeholder="e.g., 101"
          required
          error={getFieldError("roomNumber", errors)}
          icon="ri-hotel-line"
        />

        <SelectInput
          id="category"
          label="Room Category"
          value={formData.category}
          onChange={(value) => handleSelectChange("category", value)}
          options={categoryOptions}
          required
        />
      </FieldGroup>

      <FieldGroup>
        <SelectInput
          id="floor"
          label="Floor"
          value={formData.floor}
          onChange={(value) => handleSelectChange("floor", value)}
          options={floorOptions}
          required
        />

        <TextInput
          id="capacity"
          label="Capacity"
          value={formData.capacity}
          onChange={handleChange}
          onBlur={() => handleBlur("capacity")}
          placeholder="Max number of guests"
          required
          error={getFieldError("capacity", errors)}
          type="number"
          icon="ri-user-line"
        />
      </FieldGroup>

      <FieldGroup>
        <TextInput
          id="baseRate"
          label="Base Rate (per night)"
          value={formData.baseRate}
          onChange={handleChange}
          onBlur={() => handleBlur("baseRate")}
          placeholder="e.g., 2999"
          required
          error={getFieldError("baseRate", errors)}
          type="text"
          icon="ri-money-dollar-circle-line"
        />

        <SelectInput
          id="status"
          label="Room Status"
          value={formData.status}
          onChange={(value) => handleSelectChange("status", value)}
          options={statusOptions}
          required
        />
      </FieldGroup>

      <TextInput
        id="description"
        label="Room Description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter room description"
        icon="ri-file-text-line"
      />

      <div className="space-y-2">
        <MultiCheckbox
          id="amenities"
          label="Room Amenities"
          options={amenitiesOptions}
          selectedValues={formData.amenities}
          onChange={handleMultiCheckboxChange}
          columns={3}
        />
      </div>

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
            "Save Room"
          )}
        </Button>
      </div>
    </form>
  );
}