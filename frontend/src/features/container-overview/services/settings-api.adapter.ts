// API Adapter for Container Settings operations
// Handles settings updates and environment link management

import { ContainerApiService } from '../../../api/containerApiService';
import { 
  ContainerSettings,
  EnvironmentLinks,
  SettingsUpdateRequest,
  EnvironmentLinksUpdateRequest
} from '../models/settings.model';

export interface SettingsUpdateResponse {
  success: boolean;
  message: string;
  updated_at: string;
}

export class SettingsApiAdapter {
  private containerApiService: ContainerApiService;

  constructor(containerApiService?: ContainerApiService) {
    this.containerApiService = containerApiService || ContainerApiService.getInstance();
  }

  /**
   * Get current container settings
   */
  async getContainerSettings(containerId: number): Promise<ContainerSettings> {
    try {
      const container = await this.containerApiService.getContainer(containerId);
      
      // Transform Container type to ContainerSettings
      return {
        tenant_id: container.tenant_id,
        purpose: container.purpose,
        location: container.location,
        notes: container.notes,
        shadow_service_enabled: container.shadow_service_enabled,
        copied_environment_from: container.copied_environment_from,
        robotics_simulation_enabled: container.robotics_simulation_enabled,
        ecosystem_connected: container.ecosystem_connected,
        ecosystem_settings: container.ecosystem_settings
      };
    } catch (error) {
      console.error('Failed to fetch container settings:', error);
      throw new Error('Failed to load container settings');
    }
  }

  /**
   * Update container settings
   */
  async updateContainerSettings(
    containerId: number,
    updates: SettingsUpdateRequest
  ): Promise<SettingsUpdateResponse> {
    try {
      // Transform the request to match API expectations
      const apiRequest = {
        ...updates,
        location: updates.location as Record<string, any> | undefined,
        copied_environment_from: updates.copied_environment_from ?? undefined
      };
      const response = await this.containerApiService.updateContainerSettings(containerId, apiRequest);
      return response;
    } catch (error) {
      console.error('Failed to update container settings:', error);
      throw new Error('Failed to save container settings');
    }
  }

  /**
   * Get environment links for the container
   */
  async getEnvironmentLinks(containerId: number): Promise<EnvironmentLinks> {
    try {
      const response = await this.containerApiService.getEnvironmentLinks(containerId);
      return response;
    } catch (error) {
      console.error('Failed to fetch environment links:', error);
      throw new Error('Failed to load environment links');
    }
  }

  /**
   * Update environment links
   */
  async updateEnvironmentLinks(
    containerId: number,
    updates: EnvironmentLinksUpdateRequest
  ): Promise<SettingsUpdateResponse> {
    try {
      const response = await this.containerApiService.updateEnvironmentLinks(containerId, updates);
      
      return response;
    } catch (error) {
      console.error('Failed to update environment links:', error);
      throw new Error('Failed to save environment links');
    }
  }

  /**
   * Test connection to a specific environment service
   */
  async testEnvironmentConnection(
    containerId: number,
    serviceName: keyof Omit<EnvironmentLinks, 'container_id'>
  ): Promise<{
    connected: boolean;
    lastChecked: string;
    error?: string;
  }> {
    const endpoint = `/containers/${containerId}/environment-links/${serviceName}/test`;
    
    try {
      const response = await this.containerApiService['makeAuthenticatedRequest']<{
        connected: boolean;
        last_checked: string;
        error?: string;
      }>(endpoint, {
        method: 'POST'
      });
      
      return {
        connected: response.connected,
        lastChecked: response.last_checked,
        error: response.error
      };
    } catch (error) {
      console.error(`Failed to test ${serviceName} connection:`, error);
      return {
        connected: false,
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Connection test failed'
      };
    }
  }

  /**
   * Get available tenant options for settings
   */
  async getAvailableTenants(): Promise<Array<{ id: number; name: string }>> {
    try {
      const response = await this.containerApiService.getFilterOptions();
      return response.tenants;
    } catch (error) {
      console.error('Failed to fetch available tenants:', error);
      throw new Error('Failed to load tenant options');
    }
  }

  /**
   * Get available containers for copying environment from
   */
  async getAvailableContainersForCopy(
    currentContainerId: number
  ): Promise<Array<{ id: number; name: string; type: string }>> {
    try {
      const response = await this.containerApiService.getContainers({
        limit: 100 // Get a reasonable number of containers
      });
      
      // Filter out the current container
      return response.containers
        .filter((container: any) => container.id !== currentContainerId)
        .map((container: any) => ({
          id: container.id,
          name: container.name,
          type: container.type
        }));
    } catch (error) {
      console.error('Failed to fetch available containers:', error);
      throw new Error('Failed to load container options');
    }
  }

  /**
   * Validate settings before saving
   */
  async validateSettings(
    containerId: number,
    settings: SettingsUpdateRequest
  ): Promise<{
    valid: boolean;
    errors: Array<{ field: string; message: string }>;
  }> {
    // Client-side validation
    const errors: Array<{ field: string; message: string }> = [];

    if (settings.tenant_id !== undefined) {
      if (!settings.tenant_id || settings.tenant_id <= 0) {
        errors.push({ field: 'tenant_id', message: 'Valid tenant ID is required' });
      }
    }

    if (settings.purpose !== undefined) {
      if (!['development', 'research', 'production'].includes(settings.purpose)) {
        errors.push({ field: 'purpose', message: 'Purpose must be development, research, or production' });
      }
    }

    if (settings.location !== undefined && settings.location !== null) {
      if (!settings.location.city?.trim()) {
        errors.push({ field: 'location.city', message: 'City is required' });
      }
      if (!settings.location.country?.trim()) {
        errors.push({ field: 'location.country', message: 'Country is required' });
      }
      if (!settings.location.address?.trim()) {
        errors.push({ field: 'location.address', message: 'Address is required' });
      }
    }

    if (settings.notes !== undefined) {
      if (typeof settings.notes === 'string' && settings.notes.length > 1000) {
        errors.push({ field: 'notes', message: 'Notes cannot exceed 1000 characters' });
      }
    }

    // Server-side validation (optional)
    if (errors.length === 0) {
      try {
        // You could make a validation endpoint call here
        // const endpoint = `/containers/${containerId}/settings/validate`;
        // await this.containerApiService['makeAuthenticatedRequest'](endpoint, {
        //   method: 'POST',
        //   body: JSON.stringify(settings)
        // });
      } catch (error) {
        errors.push({ field: 'general', message: 'Server validation failed' });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get ecosystem health status
   */
  async getEcosystemHealth(containerId: number): Promise<{
    overall: 'healthy' | 'partial' | 'disconnected';
    services: Record<string, {
      connected: boolean;
      lastChecked: string;
      error?: string;
    }>;
  }> {
    try {
      const links = await this.getEnvironmentLinks(containerId);
      const services: Record<string, any> = {};
      
      // Test each service connection
      const serviceTests = await Promise.allSettled([
        this.testEnvironmentConnection(containerId, 'fa'),
        this.testEnvironmentConnection(containerId, 'pya'),
        this.testEnvironmentConnection(containerId, 'aws'),
        this.testEnvironmentConnection(containerId, 'mbai'),
        this.testEnvironmentConnection(containerId, 'fh')
      ]);

      const serviceNames = ['fa', 'pya', 'aws', 'mbai', 'fh'];
      serviceTests.forEach((result, index) => {
        const serviceName = serviceNames[index];
        if (result.status === 'fulfilled') {
          services[serviceName] = result.value;
        } else {
          services[serviceName] = {
            connected: false,
            lastChecked: new Date().toISOString(),
            error: 'Test failed'
          };
        }
      });

      // Calculate overall health
      const connectedServices = Object.values(services).filter(s => s.connected).length;
      const totalServices = Object.keys(services).length;
      
      let overall: 'healthy' | 'partial' | 'disconnected';
      if (connectedServices === 0) {
        overall = 'disconnected';
      } else if (connectedServices === totalServices) {
        overall = 'healthy';
      } else {
        overall = 'partial';
      }

      return {
        overall,
        services
      };
    } catch (error) {
      console.error('Failed to get ecosystem health:', error);
      throw new Error('Failed to check ecosystem health');
    }
  }

  /**
   * Handle API errors with user-friendly messages
   */
  private handleApiError(error: any, operation: string): never {
    if (error.message?.includes('401')) {
      throw new Error('Authentication required. Please log in again.');
    }
    if (error.message?.includes('403')) {
      throw new Error('You do not have permission to modify container settings.');
    }
    if (error.message?.includes('404')) {
      throw new Error('Container settings not found.');
    }
    if (error.message?.includes('422')) {
      throw new Error('Invalid settings data. Please check your input.');
    }
    
    console.error(`Settings ${operation} failed:`, error);
    throw new Error(`Failed to ${operation}. Please try again.`);
  }
}

// Export singleton instance
export const settingsApiAdapter = new SettingsApiAdapter();
