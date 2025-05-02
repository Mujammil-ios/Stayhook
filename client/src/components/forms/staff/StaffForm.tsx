import React, { useState, useEffect } from "react";
import { TextInput } from "../text-input";
import { SelectInput, SelectOption } from "../select-input";
import { MultiCheckbox, CheckboxOption } from "../multi-checkbox";
import { DatePicker } from "../date-picker";
import { FileUpload } from "../file-upload";
import { Button } from "@/components/ui/button";
import { Validators, validateForm, getFieldError, ValidationErrors } from "@/lib/validators";
import { FieldGroup } from "../form-field";

// Staff designation options
const designationOptions: SelectOption[] = [
  { value: "manager", label: "Manager" },
  { value: "receptionist", label: "Receptionist" },
  { value: "housekeeper", label: "Housekeeper" },
  { value: "chef", label: "Chef" },
  { value: "waiter", label: "Waiter/Waitress" },
  { value: "bellboy", label: "Bellboy" },
  { value: "maintenance", label: "Maintenance Staff" },
  { value: "security", label: "Security Personnel" },
];

// Permission options
const permissionOptions: CheckboxOption[] = [
  { value: "view_bookings", label: "View Bookings" },
  { value: "manage_bookings", label: "Manage Bookings" },
  { value: "view_rooms", label: "View Rooms" },
  { value: "manage_rooms", label: "Manage Rooms" },
  { value: "view_guests", label: "View Guests" },
  { value: "manage_guests", label: "Manage Guests" },
  { value: "view_staff", label: "View Staff" },
  { value: "manage_staff", label: "Manage Staff" },
  { value: "view_finances", label: "View Finances" },
  { value: "manage_finances", label: "Manage Finances" },
  { value: "access_reports", label: "Access Reports" },
  { value: "system_settings", label: "System Settings" },
];

interface StaffFormProps {
  onSubmit: (data: StaffFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<StaffFormData>;
  isLoading?: boolean;
}

export interface StaffFormData {
  staffId: string;
  name: string;
  designation: string;
  joiningDate: Date | undefined;
  phone: string;
  email: string;
  address: string;
  salary: string;
  permissions: string[];
  photo: File[];
}

export function StaffForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false
}: StaffFormProps) {
  // Generate a staff ID for new staff members
  const generateStaffId = () => {
    const prefix = "EMP";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  };

  // Form state
  const [formData, setFormData] = useState<StaffFormData>({
    staffId: initialData?.staffId || generateStaffId(),
    name: initialData?.name || "",
    designation: initialData?.designation || "",
    joiningDate: initialData?.joiningDate,
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    salary: initialData?.salary || "",
    permissions: initialData?.permissions || [],
    photo: initialData?.photo || [],
  });

  // Form validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Set default permissions based on designation
  useEffect(() => {
    if (formData.designation && formData.permissions.length === 0) {
      let defaultPermissions: string[] = [];

      switch (formData.designation) {
        case "manager":
          defaultPermissions = [
            "view_bookings", "manage_bookings",
            "view_rooms", "manage_rooms",
            "view_guests", "manage_guests",
            "view_staff", "manage_staff",
            "view_finances", "manage_finances",
            "access_reports", "system_settings"
          ];
          break;
        case "receptionist":
          defaultPermissions = [
            "view_bookings", "manage_bookings",
            "view_rooms",
            "view_guests", "manage_guests"
          ];
          break;
        case "housekeeper":
          defaultPermissions = [
            "view_rooms"
          ];
          break;
        default:
          defaultPermissions = ["view_bookings"];
      }

      setFormData(prev => ({
        ...prev,
        permissions: defaultPermissions
      }));
    }
  }, [formData.designation]);

  // Validation rules
  const validationRules = {
    name: [
      Validators.required("Name is required"),
      Validators.minLength(2, "Name must be at least 2 characters"),
    ],
    designation: [
      Validators.required("Designation is required"),
    ],
    joiningDate: [
      Validators.required("Joining date is required"),
    ],
    phone: [
      Validators.required("Phone number is required"),
      Validators.pattern(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),
    ],
    email: [
      Validators.email("Please enter a valid email address"),
    ],
    salary: [
      Validators.required("Salary is required"),
      Validators.pattern(/^\d+(\.\d{1,2})?$/, "Enter a valid amount (e.g., 25000.00)"),
      Validators.min(0, "Salary cannot be negative"),
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
    setFormData(prev => ({ ...prev, permissions: selectedValues }));
  };

  // Handle change for date inputs
  const handleDateChange = (name: string, value: Date | undefined) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    setFormData(prev => ({ ...prev, photo: files }));
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
    <div className="pt-4 pb-4 sm:pt-6 sm:pb-6 px-4 sm:px-6 max-h-screen overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
        <FieldGroup>
          <TextInput
            id="staffId"
            label="Staff ID"
            value={formData.staffId}
            onChange={() => { }} // Read-only
            placeholder="Auto-generated ID"
            disabled
            icon="ri-user-3-line"
            hint="ID is automatically generated"
          />

          <FileUpload
            id="photo"
            label="Staff Photo"
            value={formData.photo}
            onChange={handleFileUpload}
            maxFiles={1}
            accept="image/*"
            hint="Upload a profile photo"
          />
        </FieldGroup>

        <FieldGroup>
          <TextInput
            id="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
            placeholder="Enter staff member's full name"
            required
            error={getFieldError("name", errors)}
            icon="ri-user-line"
          />

          <SelectInput
            id="designation"
            label="Designation"
            value={formData.designation}
            onChange={(value) => {
              handleSelectChange("designation", value);
              handleBlur("designation");
            }}
            options={designationOptions}
            placeholder="Select designation"
            required
            error={getFieldError("designation", errors)}
          />
        </FieldGroup>

        <FieldGroup>
          <DatePicker
            id="joiningDate"
            label="Joining Date"
            value={formData.joiningDate}
            onChange={(date) => handleDateChange("joiningDate", date)}
            required
            error={getFieldError("joiningDate", errors)}
          />

          <TextInput
            id="salary"
            label="Monthly Salary"
            value={formData.salary}
            onChange={handleChange}
            onBlur={() => handleBlur("salary")}
            placeholder="Enter monthly salary"
            required
            error={getFieldError("salary", errors)}
            icon="ri-money-dollar-circle-line"
          />
        </FieldGroup>

        <FieldGroup>
          <TextInput
            id="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => handleBlur("phone")}
            placeholder="Enter phone number"
            required
            error={getFieldError("phone", errors)}
            type="tel"
            icon="ri-phone-line"
          />

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
        </FieldGroup>

        <TextInput
          id="address"
          label="Address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter full address"
          icon="ri-home-line"
        />

        <div className="rounded-md border border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-800/50">
          <h3 className="text-sm font-medium mb-3">System Permissions</h3>
          <MultiCheckbox
            id="permissions"
            label="Access Permissions"
            options={permissionOptions}
            selectedValues={formData.permissions}
            onChange={handleMultiCheckboxChange}
            columns={2}
            hint="Select the permissions for this staff member"
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
              "Add Staff Member"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}