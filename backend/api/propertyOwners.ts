import { PropertyOwnerService } from '../services/PropertyOwnerService';
import { CreatePropertyOwner, UpdatePropertyOwner } from '../services/PropertyOwnerService';

const propertyOwnerService = new PropertyOwnerService();

export async function createPropertyOwner(data: CreatePropertyOwner) {
  try {
    const owner = await propertyOwnerService.createOwner(data);
    return { success: true, data: owner };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getPropertyOwner(id: string) {
  try {
    const owner = await propertyOwnerService.getOwnerById(id);
    return { success: true, data: owner };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updatePropertyOwner(id: string, data: UpdatePropertyOwner) {
  try {
    const owner = await propertyOwnerService.updateOwner(id, data);
    return { success: true, data: owner };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deletePropertyOwner(id: string) {
  try {
    await propertyOwnerService.deleteOwner(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getAllPropertyOwners() {
  try {
    const owners = await propertyOwnerService.getAllOwners();
    return { success: true, data: owners };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 