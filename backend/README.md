# Hotel Management SaaS - Supabase Service Layer

This directory contains the service layer for interacting with Supabase in the Hotel Management SaaS platform.

## Environment Setup

Before using this service layer, you need to set up the following environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

## Architecture

The service layer follows a modular design with:

- **`supabaseBase.ts`**: Abstract base class for all Supabase services
- **`supabaseClient.ts`**: Simple export of the raw Supabase client
- **Service modules**: One module per database table, located in the `services/` directory
- **Utility modules**: Helper functions for pagination and filtering

## Service Pattern

Each service follows a consistent pattern:

1. **Interfaces**: 
   - Data model interface (e.g., `Property`)
   - Input type for creation (e.g., `CreatePropertyInput`)
   - Filters interface (e.g., `PropertyFilters`)

2. **Common Methods**:
   - `create(input)`: Create a new record
   - `getById(id)`: Get a record by ID
   - `list(filters, page, limit)`: List records with pagination
   - `updateById(id, payload)`: Update a record
   - `deleteById(id)`: Delete a record
   - Service-specific methods as needed

3. **RBAC Annotations**:
   - Each method includes JSDoc comments with RBAC (Role-Based Access Control) information
   - These annotations indicate which user roles can access each method

## Usage Example

```typescript
import propertiesService from './services/propertiesService';

// Create a property
const newProperty = await propertiesService.create({
  name: 'Seaside Resort',
  type: 'resort',
  description: 'Beautiful beachfront resort',
  address: '123 Beach Road',
  city: 'Beachville',
  state: 'Florida',
  country: 'USA',
  zip_code: '12345',
  owner_id: '123-456'
});

// Get a property
const property = await propertiesService.getById('property-id');

// List properties with filters
const { data: properties, count } = await propertiesService.list(
  { 
    type: 'resort',
    status: 'active'
  },
  1,  // page number
  10  // limit per page
);

// Update a property
const updatedProperty = await propertiesService.updateById(
  'property-id',
  { 
    name: 'Updated Resort Name',
    description: 'Updated description'
  }
);

// Delete a property
await propertiesService.deleteById('property-id');
```

## Available Services

The following service modules are available:

- `rolesService`: Manage user roles
- `usersService`: Manage users (admins, property owners, staff)
- `propertiesService`: Manage properties
- `roomsService`: Manage rooms
- `roomAmenitiesService`: Manage room amenities
- `customersService`: Manage customers (guests)
- More modules (see the `services/` directory)

## Error Handling

All services include consistent error handling:

```typescript
try {
  const property = await propertiesService.getById('property-id');
  // Success path
} catch (error) {
  // Error is typed as SupabaseError
  console.error('Error fetching property:', error);
  // Handle error appropriately
}
```

## Advanced Features

- **Pagination**: Automatic handling of pagination using `from` and `to` range parameters
- **Filtering**: Flexible filtering system to query records by various criteria
- **Type Safety**: Full TypeScript support for all operations
- **Relationships**: Methods for managing relationships between entities