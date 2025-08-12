// Edit Container API Adapter
// Adapts backend APIs for container editing workflow

import { containerService, authService } from '../../../api';
import { tokenStorage } from '../../../utils/tokenStorage';
import { 
  Tenant, 
  SeedType, 
  Container 
} from '../../../types/containers';

export interface UpdateContainerResult {
  success: boolean;
  container?: Container;
  error?: string;
  validationErrors?: Array<{ field: string; message: string }>;
}

export interface LoadContainerResult {
  success: boolean;
  container?: Container;
  error?: string;
}

export interface TenantListResult {
  tenants: Tenant[];
  error?: string;
}

export interface SeedTypeListResult {
  seedTypes: SeedType[];
  error?: string;
}

export interface ContainerListResult {
  containers: Array<{ id: number; name: string }>;
  error?: string;
}

export interface UpdateContainerRequest {
  tenant_id: number;
  type: 'physical' | 'virtual';
  purpose: 'development' | 'research' | 'production';
  location: { city: string; country: string; address: string };
  notes: string;
  shadow_service_enabled: boolean;
  copied_environment_from?: number;
  robotics_simulation_enabled: boolean;
  ecosystem_settings: Record<string, unknown>;
  seed_type_ids: number[];
}

export class EditContainerApiAdapter {
  private static instance: EditContainerApiAdapter;

  private constructor() {}

  public static getInstance(): EditContainerApiAdapter {
    if (!EditContainerApiAdapter.instance) {
      EditContainerApiAdapter.instance = new EditContainerApiAdapter();
    }
    return EditContainerApiAdapter.instance;
  }

  /**
   * Load container by ID for editing
   */
  async loadContainer(containerId: number): Promise<LoadContainerResult> {
    try {
      await this.ensureAuthenticated();
      
      const container = await containerService.getContainer(containerId);
      
      return {
        success: true,
        container
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load container'
      };
    }
  }

  /**
   * Update an existing container
   */
  async updateContainer(containerId: number, data: UpdateContainerRequest): Promise<UpdateContainerResult> {
    try {
      await this.ensureAuthenticated();
      
      const response = await containerService.updateContainer(containerId, data);
      
      return {
        success: true,
        container: response
      };
    } catch (error) {
      // Handle validation errors from backend
      if (error instanceof Error && error.message.includes('validation')) {
        return {
          success: false,
          error: 'Validation failed',
          validationErrors: this.parseValidationErrors(error.message)
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update container'
      };
    }
  }

  /**
   * Fetch available tenants
   */
  async getTenants(): Promise<TenantListResult> {
    try {
      await this.ensureAuthenticated();
      
      const response = await fetch('/api/v1/tenants/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenStorage.getAccessToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tenants');
      }

      const tenants = await response.json() as Array<{ id: number; name: string }>;
      
      return {
        tenants: tenants.map((tenant) => ({
          id: tenant.id,
          name: tenant.name
        }))
      };
    } catch (error) {
      return {
        tenants: [],
        error: error instanceof Error ? error.message : 'Failed to fetch tenants'
      };
    }
  }

  /**
   * Fetch available seed types with search/filtering
   */
  async getSeedTypes(search?: string): Promise<SeedTypeListResult> {
    try {
      await this.ensureAuthenticated();
      
      const url = new URL('/api/v1/seed-types/', window.location.origin);
      if (search) {
        url.searchParams.set('search', search);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenStorage.getAccessToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch seed types');
      }

      const seedTypes = await response.json() as Array<{
        id: number;
        name: string;
        variety: string;
        supplier: string;
        batch_id: string;
      }>;
      
      return {
        seedTypes: seedTypes.map((seedType) => ({
          id: seedType.id,
          name: seedType.name,
          variety: seedType.variety,
          supplier: seedType.supplier,
          batch_id: seedType.batch_id
        }))
      };
    } catch (error) {
      return {
        seedTypes: [],
        error: error instanceof Error ? error.message : 'Failed to fetch seed types'
      };
    }
  }

  /**
   * Search seed types with debounced query
   */
  async searchSeedTypes(query: string): Promise<SeedTypeListResult> {
    if (!query.trim()) {
      return this.getSeedTypes();
    }
    
    return this.getSeedTypes(query.trim());
  }

  /**
   * Fetch available containers for environment copying (excluding current container)
   */
  async getAvailableContainersForCopy(excludeId: number): Promise<ContainerListResult> {
    try {
      await this.ensureAuthenticated();
      
      const response = await containerService.getContainers({
        status: 'active'
      });
      
      return {
        containers: response.containers
          .filter(container => container.id !== excludeId)
          .map(container => ({
            id: container.id,
            name: container.name
          }))
      };
    } catch (error) {
      return {
        containers: [],
        error: error instanceof Error ? error.message : 'Failed to fetch available containers'
      };
    }
  }

  /**
   * Preload all required data for the edit container form
   */
  async preloadFormData(containerId: number): Promise<{
    container?: Container;
    tenants: Tenant[];
    seedTypes: SeedType[];
    availableContainers: Array<{ id: number; name: string }>;
    errors: string[];
  }> {
    const [containerResult, tenantsResult, seedTypesResult, containersResult] = await Promise.all([
      this.loadContainer(containerId),
      this.getTenants(),
      this.getSeedTypes(),
      this.getAvailableContainersForCopy(containerId)
    ]);

    const errors: string[] = [];
    if (containerResult.error) errors.push(containerResult.error);
    if (tenantsResult.error) errors.push(tenantsResult.error);
    if (seedTypesResult.error) errors.push(seedTypesResult.error);
    if (containersResult.error) errors.push(containersResult.error);

    return {
      container: containerResult.container,
      tenants: tenantsResult.tenants,
      seedTypes: seedTypesResult.seedTypes,
      availableContainers: containersResult.containers,
      errors
    };
  }

  /**
   * Check if the service is authenticated
   */
  isAuthenticated(): boolean {
    return authService.isAuthenticated();
  }

  /**
   * Ensure authentication is valid
   */
  private async ensureAuthenticated(): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }
  }

  /**
   * Parse validation errors from backend response
   */
  private parseValidationErrors(errorMessage: string): Array<{ field: string; message: string }> {
    const errors: Array<{ field: string; message: string }> = [];
    
    if (errorMessage.includes('tenant')) {
      errors.push({ field: 'tenant', message: 'Invalid tenant selection' });
    }
    
    if (errorMessage.includes('seed_types')) {
      errors.push({ field: 'seedTypes', message: 'Invalid seed type selection' });
    }
    
    if (errorMessage.includes('location')) {
      errors.push({ field: 'location', message: 'Location information is invalid' });
    }

    if (errorMessage.includes('purpose')) {
      errors.push({ field: 'purpose', message: 'Invalid purpose selection' });
    }

    return errors.length > 0 ? errors : [{ field: 'general', message: 'Validation failed' }];
  }

  /**
   * Check if container can be modified
   */
  async canModifyContainer(containerId: number): Promise<{ canModify: boolean; reason?: string }> {
    try {
      await this.ensureAuthenticated();
      
      const response = await fetch(`/api/v1/containers/${containerId}/can-modify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenStorage.getAccessToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check container modification permissions');
      }

      const result = await response.json();
      
      return {
        canModify: result.can_modify,
        reason: result.reason
      };
    } catch (error) {
      console.error('Error checking container modification permissions:', error);
      return {
        canModify: true // Default to allowing modification if check fails
      };
    }
  }

  /**
   * Get container modification history
   */
  async getModificationHistory(containerId: number): Promise<Array<{
    id: string;
    timestamp: string;
    user: string;
    changes: Array<{ field: string; oldValue: unknown; newValue: unknown }>;
  }>> {
    try {
      await this.ensureAuthenticated();
      
      const response = await fetch(`/api/v1/containers/${containerId}/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenStorage.getAccessToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch modification history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching modification history:', error);
      return [];
    }
  }
}

export const editContainerApiAdapter = EditContainerApiAdapter.getInstance();