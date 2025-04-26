# HotelHub Management System

A modern, responsive Hotel Management System built with React and TypeScript, offering a comprehensive suite of management tools for hotel staff and administrators.

## Project Architecture

The HotelHub Management System follows a modular, feature-based architecture designed for maximum flexibility, maintainability, and developer productivity. The system is built with REST API readiness in mind, making it easy to integrate with any backend.

### Key Technologies

- **Frontend**: React with TypeScript
- **State Management**: React Query + Context API
- **Styling**: Tailwind CSS with custom utility classes
- **UI Components**: Custom component library with shadcn/ui
- **API Communication**: Centralized API service layer
- **Form Handling**: Custom form components with validation
- **Routing**: wouter for lightweight routing

## Folder Structure

```
/client
  /src
    /features                 # Feature-based modules
      /booking                # Booking & reservation features
      /room                   # Room management features
      /guest                  # Guest management features
      /staff                  # Staff management features
      /property               # Property management features
      /analytics              # Analytics and reporting features
    
    /shared                   # Shared code used across features
      /components             # Reusable UI components
      /hooks                  # Custom React hooks
      /services               # API services
      /utils                  # Utility functions
      /validation             # Form validation schemas
      /config.ts              # Application configuration
    
    /pages                    # Page components that combine features
    /assets                   # Static assets (images, fonts, etc.)
    /lib                      # Library code (may be refactored into shared)
    /App.tsx                  # Main application component
    /index.tsx                # Application entry point
```

## Naming Conventions

- **Components**: PascalCase (e.g., `RoomCard.tsx`, `BookingForm.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`, `useBooking.ts`)
- **Services**: camelCase (e.g., `roomService.ts`, `bookingService.ts`)
- **Filenames**: kebab-case (e.g., `room-card.tsx`, `booking-form.tsx`)
- **CSS Classes**: kebab-case (e.g., `card-header`, `form-field`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_ROOM_CAPACITY`, `DEFAULT_CURRENCY`)

## Adding New Features

### Adding a New Feature Module

1. Create a new directory under `/features` with your feature name (e.g., `/features/payments`)
2. Add the following structure to your feature:
   ```
   /payments
     /components        # Feature-specific components
     /hooks             # Feature-specific hooks
     /services          # Feature-specific services
     /types.ts          # TypeScript types for this feature
     /utils.ts          # Utility functions for this feature
     /index.ts          # Export public API of this feature
   ```
3. Export your feature's public API through the `index.ts` file

Example `index.ts` file:

```typescript
// Export components
export { default as PaymentForm } from './components/PaymentForm';
export { default as PaymentHistory } from './components/PaymentHistory';

// Export hooks
export { usePayments } from './hooks/usePayments';

// Export services
export { default as paymentService } from './services/paymentService';

// Export types
export type { Payment, PaymentMethod } from './types';
```

### Adding a New Page

1. Create a new page component in `/pages` (e.g., `/pages/payments.tsx`)
2. Import and use components from your feature module
3. Register the route in `App.tsx`

Example page:

```tsx
import { PaymentForm, PaymentHistory, usePayments } from '@/features/payments';

export default function PaymentsPage() {
  const { data, isLoading } = usePayments();
  
  return (
    <div className="page-container">
      <h1 className="section-title">Payments</h1>
      
      <div className="section">
        <PaymentForm />
      </div>
      
      <div className="section">
        <PaymentHistory payments={data} isLoading={isLoading} />
      </div>
    </div>
  );
}
```

### Adding a New API Endpoint

1. Add the endpoint to the appropriate service file in `/shared/services` or create a new service file if needed

Example:

```typescript
// in /shared/services/paymentService.ts

// Define endpoints
const ENDPOINTS = {
  ALL: '/payments',
  DETAIL: (id: number | string) => `/payments/${id}`,
  PROCESS: '/payments/process',
};

// Add methods to interact with the endpoints
class PaymentService {
  // Get all payments
  async getAll(): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>(ENDPOINTS.ALL);
  }
  
  // Get a single payment by ID
  async getById(id: number): Promise<ApiResponse<Payment>> {
    return apiClient.get<Payment>(ENDPOINTS.DETAIL(id));
  }
  
  // Process a new payment
  async process(paymentData: CreatePayment): Promise<ApiResponse<Payment>> {
    return apiClient.post<Payment>(ENDPOINTS.PROCESS, paymentData);
  }
}

// Export a singleton instance
export const paymentService = new PaymentService();
export default paymentService;
```

2. Use the service in your components or hooks

```typescript
// in /features/payments/hooks/usePayments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/shared/services';

export function usePayments() {
  const queryClient = useQueryClient();
  
  // Query for fetching payments
  const paymentsQuery = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentService.getAll(),
  });
  
  // Mutation for processing payments
  const processPayment = useMutation({
    mutationFn: paymentService.process,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
  
  return {
    data: paymentsQuery.data?.data || [],
    isLoading: paymentsQuery.isLoading,
    error: paymentsQuery.error,
    processPayment: processPayment.mutate,
    isProcessing: processPayment.isPending,
  };
}
```

## Using Shared Components

The system includes a set of reusable UI components that follow consistent patterns:

### Form Components

Form components are built on top of a centralized Form system that handles validation, state, and submission:

```tsx
import { Form } from '@/shared/components/Form';
import { bookingValidationSchema } from '@/shared/validation/booking.schema';

export function BookingForm({ onSubmit }) {
  const initialValues = {
    guestId: '',
    roomId: '',
    checkInDate: new Date(),
    checkOutDate: new Date(),
    // ...more fields
  };
  
  return (
    <Form
      initialValues={initialValues}
      validationSchema={bookingValidationSchema}
      onSubmit={onSubmit}
    >
      <Form.Section title="Guest Information">
        <Form.Select
          name="guestId"
          label="Select Guest"
          options={guestOptions}
          required
        />
        
        <Form.Select
          name="roomId"
          label="Select Room"
          options={roomOptions}
          required
        />
      </Form.Section>
      
      <Form.Section title="Booking Dates">
        <Form.Group>
          <Form.DatePicker
            name="checkInDate"
            label="Check-in Date"
            required
          />
          
          <Form.DatePicker
            name="checkOutDate"
            label="Check-out Date"
            required
          />
        </Form.Group>
      </Form.Section>
      
      <Form.Actions>
        <Form.Submit label="Create Booking" />
      </Form.Actions>
    </Form>
  );
}
```

### Notification System

Use the Notification component for consistent alerts and messages:

```tsx
import { Notification, showNotification } from '@/shared/components/Notification';

// Inline notification
<Notification 
  variant="success"
  title="Booking Confirmed"
  message="The booking has been successfully created."
  dismissible
  onDismiss={() => console.log('Dismissed')}
/>

// Toast notification (displayed in the top right)
showNotification({
  variant: 'success',
  title: 'Payment Processed',
  message: 'The payment has been successfully processed.',
  duration: 5000
});
```

## Using Utility Classes

The project includes custom utility classes for common UI patterns:

### Button Variants

```tsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-outline">Outline Button</button>
<button className="btn-ghost">Ghost Button</button>
<button className="btn-destructive">Destructive Button</button>
<button className="btn-success">Success Button</button>
```

### Card Variants

```tsx
<div className="card">
  <div className="p-4">Standard Card</div>
</div>

<div className="card-glass">
  <div className="p-4">Glass Card with Backdrop Blur</div>
</div>
```

### Form Field Styling

```tsx
<div className="form-field">
  <label className="form-label">Field Label</label>
  <input className="form-input" type="text" />
  <span className="form-error">Error message</span>
</div>
```

### Layout Containers

```tsx
<div className="page-container">
  <div className="section">
    <div className="section-header">
      <h2 className="section-title">Section Title</h2>
      <p className="section-description">Section description text</p>
    </div>
    
    <div className="card-grid">
      {/* Cards will be displayed in a responsive grid */}
    </div>
  </div>
</div>
```

## Environment Configuration

The application uses a centralized configuration system for environment variables and settings:

```typescript
// Import configuration
import config from '@/shared/config';

// Access configuration values
const apiUrl = config.API.BASE_URL;
const toastDuration = config.UI.TOAST_DURATION;
const isAnalyticsEnabled = config.FEATURES.ENABLE_ANALYTICS;
```

## API Integration

All API communication is handled through the service layer:

```typescript
// Using a service in a component
import { useQuery } from '@tanstack/react-query';
import { roomService } from '@/shared/services';

function RoomList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomService.getAll()
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading rooms</div>;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.data?.map(room => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
```

## Contributing

1. Follow the naming conventions and folder structure outlined in this document
2. Use the provided utility classes and components for consistent styling
3. Add proper TypeScript types for all components, hooks, and functions
4. Write meaningful comments for complex logic
5. Keep components small and focused on a single responsibility

## License

This project is proprietary software and all rights are reserved.