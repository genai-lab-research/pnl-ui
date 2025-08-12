// Create Container API Adapter
// Adapts backend APIs for container creation workflow

import { containerService, authService } from '../../../api';
import { tokenStorage } from '../../../utils/tokenStorage';
import { 
  Tenant, 
  SeedType, 
  CreateContainerRequest,
  Container 
} from '../../../types/containers';
import { NameValidationResult } from '../models/create-container.model';

export interface CreateContainerResult {
  success: boolean;
  container?: Container;
  error?: string;
  validationErrors?: Array<{ field: string; message: string }>;
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

export interface NameValidationApiResult {
  isValid: boolean;
  suggestions: string[];
  error?: string;
}

export class CreateContainerApiAdapter {
  private static instance: CreateContainerApiAdapter;

  private constructor() {}

  public static getInstance(): CreateContainerApiAdapter {
    if (!CreateContainerApiAdapter.instance) {
      CreateContainerApiAdapter.instance = new CreateContainerApiAdapter();
    }
    return CreateContainerApiAdapter.instance;
  }

  /**
   * Create a new container
   */
  async createContainer(data: CreateContainerRequest): Promise<CreateContainerResult> {
    try {
      await this.ensureAuthenticated();
      
      const response = await containerService.createContainer(data);
      
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
        error: error instanceof Error ? error.message : 'Failed to create container'
      };
    }
  }

  /**
   * Validate container name uniqueness
   */
  async validateContainerName(name: string): Promise<NameValidationApiResult> {
    try {
      await this.ensureAuthenticated();
      
      const response = await fetch('/api/v1/containers/validate-name', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenStorage.getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });

      if (!response.ok) {
        throw new Error('Failed to validate container name');
      }

      const result = await response.json();
      
      return {
        isValid: result.is_valid,
        suggestions: result.suggestions || []
      };
    } catch (error) {
      return {
        isValid: false,
        suggestions: [],
        error: error instanceof Error ? error.message : 'Failed to validate container name'
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
   * Fetch available containers for environment copying (virtual containers only)
   */
  async getAvailableContainersForCopy(): Promise<ContainerListResult> {
    try {
      await this.ensureAuthenticated();
      
      const response = await containerService.getContainers({
        status: 'active'
      });
      
      return {
        containers: response.containers.map(container => ({
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
   * Preload all required data for the create container form
   */
  async preloadFormData(): Promise<{
    tenants: Tenant[];
    seedTypes: SeedType[];
    availableContainers: Array<{ id: number; name: string }>;
    errors: string[];
  }> {
    const [tenantsResult, seedTypesResult, containersResult] = await Promise.all([
      this.getTenants(),
      this.getSeedTypes(),
      this.getAvailableContainersForCopy()
    ]);

    const errors: string[] = [];
    if (tenantsResult.error) errors.push(tenantsResult.error);
    if (seedTypesResult.error) errors.push(seedTypesResult.error);
    if (containersResult.error) errors.push(containersResult.error);

    return {
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
    // Simple parsing - in a real app this would be more sophisticated
    const errors: Array<{ field: string; message: string }> = [];
    
    if (errorMessage.includes('name')) {
      errors.push({ field: 'name', message: 'Container name is invalid or already exists' });
    }
    
    if (errorMessage.includes('tenant')) {
      errors.push({ field: 'tenant', message: 'Invalid tenant selection' });
    }
    
    if (errorMessage.includes('seed_types')) {
      errors.push({ field: 'seedTypes', message: 'Invalid seed type selection' });
    }
    
    if (errorMessage.includes('location')) {
      errors.push({ field: 'location', message: 'Location information is invalid' });
    }

    return errors.length > 0 ? errors : [{ field: 'general', message: 'Validation failed' }];
  }

  /**
   * Generate suggested container name based on pattern
   */
  generateSuggestedName(baseName: string, existingNames: string[]): string {
    if (!existingNames.includes(baseName)) {
      return baseName;
    }

    let counter = 1;
    let suggestedName = `${baseName}-${counter}`;
    
    while (existingNames.includes(suggestedName) && counter < 100) {
      counter++;
      suggestedName = `${baseName}-${counter}`;
    }
    
    return suggestedName;
  }

  /**
   * Batch validate multiple container names
   */
  async batchValidateNames(names: string[]): Promise<Record<string, NameValidationResult>> {
    const results: Record<string, NameValidationResult> = {};
    
    const validationPromises = names.map(async (name) => {
      const result = await this.validateContainerName(name);
      return { name, result };
    });

    const validationResults = await Promise.allSettled(validationPromises);
    
    validationResults.forEach((result, index) => {
      const name = names[index];
      if (result.status === 'fulfilled') {
        results[name] = {
          isValid: result.value.result.isValid,
          suggestions: result.value.result.suggestions
        };
      } else {
        results[name] = {
          isValid: false,
          suggestions: []
        };
      }
    });

    return results;
  }
}

export const createContainerApiAdapter = CreateContainerApiAdapter.getInstance();