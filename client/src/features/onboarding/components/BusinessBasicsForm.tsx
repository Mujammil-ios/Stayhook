/**
 * Business Basics Form
 * 
 * Form for collecting business and property information during onboarding
 */

import { useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useOnboarding } from '../hooks/useOnboarding';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { BusinessBasicsFormData } from '../types/index';

// Form validation schema
const formSchema = z.object({
  propertyName: z.string().min(2, "Property name must be at least 2 characters"),
  propertyType: z.string().min(1, "Please select a property type"),
  businessRegistration: z.string().optional(),
  taxId: z.string().optional(),
  gstNumber: z.string().optional(),
  currency: z.string().default("USD"),
  
  // Address fields
  addressStreet: z.string().min(1, "Street address is required"),
  addressSecondary: z.string().optional(),
  addressCity: z.string().min(1, "City is required"),
  addressState: z.string().min(1, "State/Province is required"),
  addressCountry: z.string().min(1, "Country is required"),
  addressPostalCode: z.string().min(1, "Postal/Zip code is required"),
  
  // Contact fields
  contactPhone: z.string().min(6, "Phone number is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactWebsite: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  contactFax: z.string().optional()
});

export function BusinessBasicsForm() {
  const { formState, updateBusinessBasics } = useOnboarding();
  
  // Property types
  const propertyTypes = [
    { label: 'Hotel', value: 'Hotel' },
    { label: 'Motel', value: 'Motel' },
    { label: 'Resort', value: 'Resort' },
    { label: 'Hostel', value: 'Hostel' },
    { label: 'Boutique Hotel', value: 'Boutique Hotel' },
    { label: 'Bed & Breakfast', value: 'Bed & Breakfast' },
    { label: 'Vacation Rental', value: 'Vacation Rental' },
    { label: 'Apartment Hotel', value: 'Apartment Hotel' },
    { label: 'Guest House', value: 'Guest House' },
    { label: 'Lodge', value: 'Lodge' },
    { label: 'Other', value: 'Other' }
  ];
  
  // Currency options
  const currencies = [
    { label: 'US Dollar (USD)', value: 'USD' },
    { label: 'Euro (EUR)', value: 'EUR' },
    { label: 'British Pound (GBP)', value: 'GBP' },
    { label: 'Japanese Yen (JPY)', value: 'JPY' },
    { label: 'Canadian Dollar (CAD)', value: 'CAD' },
    { label: 'Australian Dollar (AUD)', value: 'AUD' },
    { label: 'Swiss Franc (CHF)', value: 'CHF' },
    { label: 'Chinese Yuan (CNY)', value: 'CNY' },
    { label: 'Indian Rupee (INR)', value: 'INR' },
    { label: 'Brazilian Real (BRL)', value: 'BRL' }
  ];
  
  // Form setup
  const form = useForm<BusinessBasicsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formState.businessBasics,
    mode: 'onChange'
  });
  
  // Automatically update context when form values change
  const onFormChange = form.handleSubmit((data) => {
    updateBusinessBasics(data);
  });
  
  return (
    <form onChange={onFormChange} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Property Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="propertyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Grand Hotel" {...field} />
                </FormControl>
                <FormDescription>
                  The official name of your property as it will appear to guests
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type*</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The category that best describes your property
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="businessRegistration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Registration</FormLabel>
                  <FormControl>
                    <Input placeholder="Registration number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your business registration or license number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Tax ID" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your tax identification number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="gstNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST/VAT Number</FormLabel>
                  <FormControl>
                    <Input placeholder="GST/VAT number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your GST, VAT, or sales tax number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Currency*</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The primary currency for your property
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="addressStreet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address*</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="addressSecondary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apartment, Suite, Unit, etc.</FormLabel>
                <FormControl>
                  <Input placeholder="Suite 101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="addressCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City*</FormLabel>
                  <FormControl>
                    <Input placeholder="San Francisco" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="addressState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province*</FormLabel>
                  <FormControl>
                    <Input placeholder="California" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="addressCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country*</FormLabel>
                  <FormControl>
                    <Input placeholder="United States" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="addressPostalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal/ZIP Code*</FormLabel>
                  <FormControl>
                    <Input placeholder="94105" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number*</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your primary business phone number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address*</FormLabel>
                  <FormControl>
                    <Input placeholder="info@yourbusiness.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your primary business email address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.yourbusiness.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your property's website URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactFax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fax Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4568" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your fax number (if applicable)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}