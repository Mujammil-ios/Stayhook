import React, { useState, useEffect } from "react";
import { TextInput } from "../text-input";
import { TextareaInput } from "../textarea-input";
import { SelectInput, SelectOption } from "../select-input";
import { CheckboxInput } from "../checkbox-input";
import { Button } from "@/components/ui/button";
import { Validators, validateForm, getFieldError, ValidationErrors } from "@/lib/validators";

// Property types options
const propertyTypeOptions: SelectOption[] = [
  { value: "hotel", label: "Hotel" },
  { value: "resort", label: "Resort" },
  { value: "motel", label: "Motel" },
  { value: "villa", label: "Villa" },
  { value: "apartment", label: "Serviced Apartment" },
  { value: "hostel", label: "Hostel" },
  { value: "guesthouse", label: "Guest House" },
];

interface PropertyStep1FormProps {
  onSubmit: (data: PropertyStep1Data) => void;
  onCancel?: () => void;
  initialData?: Partial<PropertyStep1Data>;
  isLoading?: boolean;
}

export interface PropertyStep1Data {
  propertyName: string;
  contactNumber: string;
  propertyType: string;
  description: string;
  hasGST: boolean;
  gstNumber: string;
}

export function PropertyStep1Form({ 
  onSubmit, 
  onCancel, 
  initialData,
  isLoading = false 
}: PropertyStep1FormProps) {
  // Form state
  const [formData, setFormData] = useState<PropertyStep1Data>({
    propertyName: initialData?.propertyName || "",
    contactNumber: initialData?.contactNumber || "",
    propertyType: initialData?.propertyType || "",
    description: initialData?.description || "",
    hasGST: initialData?.hasGST || false,
    gstNumber: initialData?.gstNumber || "",
  });

  // Form validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Update validation rules when GST checkbox changes
  const validationRules = {
    propertyName: [
      Validators.required("Property name is required"),
      Validators.maxLength(100, "Property name cannot exceed 100 characters"),
    ],
    contactNumber: [
      Validators.required("Contact number is required"),
      Validators.phone("Please enter a valid contact number"),
    ],
    propertyType: [
      Validators.required("Property type is required"),
    ],
    description: [
      Validators.maxLength(500, "Description cannot exceed 500 characters"),
    ],
    ...(formData.hasGST ? {
      gstNumber: [
        Validators.required("GST number is required"),
        Validators.gst("Please enter a valid GST number"),
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
  }, [formData, touched]);

  // Handle change for text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle change for select inputs
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle change for checkbox inputs
  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name === "hasGST" && !checked) {
      // Clear GST number when checkbox is unchecked
      setFormData(prev => ({ ...prev, [name]: checked, gstNumber: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: checked }));
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

    // Submit if no errors
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <TextInput
        id="propertyName"
        label="Property Name"
        value={formData.propertyName}
        onChange={handleChange}
        onBlur={() => handleBlur("propertyName")}
        placeholder="Enter property name"
        required
        error={getFieldError("propertyName", errors)}
        icon="ri-building-line"
      />

      <TextInput
        id="contactNumber"
        label="Contact Number"
        value={formData.contactNumber}
        onChange={handleChange}
        onBlur={() => handleBlur("contactNumber")}
        placeholder="Enter contact number"
        required
        error={getFieldError("contactNumber", errors)}
        type="tel"
        icon="ri-phone-line"
      />

      <SelectInput
        id="propertyType"
        label="Property Type"
        value={formData.propertyType}
        onChange={(value) => {
          handleSelectChange("propertyType", value);
          handleBlur("propertyType");
        }}
        options={propertyTypeOptions}
        placeholder="Select property type"
        required
        error={getFieldError("propertyType", errors)}
      />

      <TextareaInput
        id="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
        onBlur={() => handleBlur("description")}
        placeholder="Describe your property"
        hint="Briefly describe your property's features and unique selling points."
        maxLength={500}
      />

      <div className="space-y-4">
        <CheckboxInput
          id="hasGST"
          label="I have a GST number"
          checked={formData.hasGST}
          onChange={(checked) => handleCheckboxChange("hasGST", checked)}
        />

        {formData.hasGST && (
          <TextInput
            id="gstNumber"
            label="GST Number"
            value={formData.gstNumber}
            onChange={handleChange}
            onBlur={() => handleBlur("gstNumber")}
            placeholder="Enter GST number"
            required={formData.hasGST}
            error={getFieldError("gstNumber", errors)}
            hint="Format: 22AAAAA0000A1Z5"
            className="mt-3 animate-slideUp"
          />
        )}
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
              Processing...
            </>
          ) : (
            <>
              <i className="ri-arrow-right-line mr-2"></i>
              Next
            </>
          )}
        </Button>
      </div>
    </form>
  );
}