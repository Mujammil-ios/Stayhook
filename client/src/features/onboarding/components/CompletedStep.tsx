/**
 * CompletedStep Component
 * 
 * Final step in the onboarding process that shows a summary and completion button
 */

import { useOnboarding } from '../hooks/useOnboarding';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Hotel, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { BusinessBasicsFormData, PropertyConfigFormData, PolicyFormData } from '../types/index';

interface CompletedStepProps {
  onFinish: () => void;
}

export function CompletedStep({ onFinish }: CompletedStepProps) {
  const { formState } = useOnboarding();
  
  const { businessBasics, propertyConfig, policies } = formState;
  
  // Truncate long text
  const truncate = (text: string, length = 100) => {
    if (!text) return '';
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };
  
  // Format property address
  const formatAddress = (data: BusinessBasicsFormData) => {
    const parts = [
      data.addressStreet,
      data.addressSecondary,
      data.addressCity,
      data.addressState,
      data.addressPostalCode,
      data.addressCountry
    ].filter(Boolean);
    
    return parts.join(', ');
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Setup Almost Complete!</h2>
        <p className="mt-2 text-muted-foreground">
          Review your property details below and click "Complete Setup" when you're ready.
        </p>
      </div>
      
      {/* Property Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Hotel className="mr-2 h-5 w-5" />
            Property Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{businessBasics.propertyName || 'Your Property'}</h3>
            <p className="text-sm text-muted-foreground">{businessBasics.propertyType}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{formatAddress(businessBasics)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{businessBasics.contactPhone}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{businessBasics.contactEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Property Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Property Configuration</CardTitle>
          <CardDescription>
            Your property has {propertyConfig.amenities.length} amenities and {propertyConfig.roomTypes.length} room types.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Amenities */}
          <div>
            <h3 className="text-sm font-medium mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-1.5">
              {propertyConfig.amenities.map((amenity, i) => (
                <span 
                  key={i} 
                  className="inline-block px-2.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                >
                  {amenity}
                </span>
              ))}
              {propertyConfig.amenities.length === 0 && (
                <p className="text-sm text-muted-foreground">No amenities added</p>
              )}
            </div>
          </div>
          
          {/* Room Types */}
          <div>
            <h3 className="text-sm font-medium mb-2">Room Types</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {propertyConfig.roomTypes.map((room, i) => (
                <div 
                  key={i} 
                  className="p-3 rounded-md border bg-card"
                >
                  <p className="font-medium">{room.name}</p>
                  <p className="text-xs text-muted-foreground">Capacity: {room.capacity} | Rate: {room.baseRate}</p>
                  <p className="text-xs text-muted-foreground mt-1">{truncate(room.description, 50)}</p>
                </div>
              ))}
              {propertyConfig.roomTypes.length === 0 && (
                <p className="text-sm text-muted-foreground">No room types added</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Policies Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Policies</CardTitle>
          <CardDescription>
            You have set up {policies.length} {policies.length === 1 ? 'policy' : 'policies'}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((policy, i) => (
              <div key={i} className="p-3 rounded-md border bg-card">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{policy.name}</p>
                  {policy.isActive ? (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{truncate(policy.description, 100)}</p>
                <p className="text-xs text-muted-foreground mt-2">{policy.rules.length} rules defined</p>
              </div>
            ))}
            {policies.length === 0 && (
              <p className="text-sm text-muted-foreground">No policies added</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex flex-col items-center">
          <p className="text-sm text-center mb-4">
            By completing the setup, your property will be configured with all the information above.
            <br />
            You can always edit these details later from the settings menu.
          </p>
          <Button onClick={onFinish} size="lg" className="min-w-[200px]">
            Complete Setup
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}