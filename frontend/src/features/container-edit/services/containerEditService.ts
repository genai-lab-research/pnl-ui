import { Container } from '../../../types/containers';
import { containerApiService } from '../../../api/containerApiService';
import { seedTypeApiService } from '../../../api/seedTypeApiService';
import { getAllContainers, getContainerById } from '../../../api/containerService';
import { ContainerEditFormData, ContainerEditFormOptions } from '../types';
import { tokenStorage } from '../../../utils/tokenStorage';

export class ContainerEditService {
  private seedTypesCache: any[] | null = null;
  private seedTypesCacheTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get default form data for editing a container
   */
  getDefaultFormData(): Omit<ContainerEditFormData, 'container_id'> {
    return {
      name: '',
      tenant_id: null,
      type: 'physical',
      purpose: null,
      seed_type_ids: [],
      location: {
        city: '',
        country: '',
        address: ''
      },
      notes: '',
      shadow_service_enabled: false,
      copied_environment_from: null,
      robotics_simulation_enabled: false,
      ecosystem_connected: false,
      ecosystem_settings: {
        fa: null,
        pya: null,
        aws: null,
        mbai: 'prod'
      }
    };
  }

  /**
   * Populate form data from an existing container
   */
  populateFormFromContainer(container: Container): ContainerEditFormData {
    // Ensure ecosystem_settings are properly formatted as strings, not objects
    const normalizeEcosystemSettings = (settings: any) => {
      if (!settings) {
        return {
          fa: null as 'alpha' | 'prod' | null,
          pya: null as 'dev' | 'test' | 'stage' | null,
          aws: null as 'dev' | 'prod' | null,
          mbai: 'prod' as const
        };
      }
      
      return {
        fa: (typeof settings.fa === 'object' ? settings.fa?.environment || null : settings.fa) as 'alpha' | 'prod' | null,
        pya: (typeof settings.pya === 'object' ? settings.pya?.environment || null : settings.pya) as 'dev' | 'test' | 'stage' | null,
        aws: (typeof settings.aws === 'object' ? settings.aws?.environment || null : settings.aws) as 'dev' | 'prod' | null,
        mbai: 'prod' as const
      };
    };

    return {
      container_id: container.id,
      name: container.name,
      tenant_id: container.tenant_id,
      type: container.type as 'physical' | 'virtual',
      purpose: container.purpose as 'development' | 'research' | 'production',
      seed_type_ids: container.seed_types?.map(st => st.id) || [],
      location: container.location || {
        city: '',
        country: '',
        address: ''
      },
      notes: container.notes || '',
      shadow_service_enabled: container.shadow_service_enabled || false,
      copied_environment_from: container.copied_environment_from,
      robotics_simulation_enabled: container.robotics_simulation_enabled || false,
      ecosystem_connected: container.ecosystem_connected || false,
      original_ecosystem_connected: container.ecosystem_connected || false,
      ecosystem_settings: normalizeEcosystemSettings(container.ecosystem_settings)
    };
  }

  /**
   * Get cached seed types or fetch fresh data
   */
  private async getCachedSeedTypes() {
    const now = Date.now();
    if (this.seedTypesCache && (now - this.seedTypesCacheTime) < this.CACHE_DURATION) {
      console.log('🗂️ Using cached seed types');
      return this.seedTypesCache;
    }
    
    console.log('🔄 Fetching fresh seed types');
    this.seedTypesCache = await seedTypeApiService.getSeedTypes();
    this.seedTypesCacheTime = now;
    return this.seedTypesCache;
  }

  /**
   * Get virtual containers for the "Copy Environment" dropdown
   */
  private async getVirtualContainers(): Promise<Array<{ id: number; name: string }>> {
    try {
      const response = await getAllContainers({ type: 'virtual', limit: 100 });
      return response.containers.map(container => ({
        id: container.id,
        name: container.name
      }));
    } catch (error) {
      console.error('Failed to load virtual containers:', error);
      return [];
    }
  }

  /**
   * Load form options for editing
   */
  async loadFormOptions(): Promise<ContainerEditFormOptions> {
    try {
      console.log('🔄 Loading form options...');
      console.log('🔑 Current auth token:', tokenStorage.getAccessToken() ? 'Present' : 'Missing');
      
      // Fetch filter options, seed types, and virtual containers in parallel
      const [filterOptions, seedTypes, virtualContainers] = await Promise.all([
        containerApiService.getFilterOptions(),
        this.getCachedSeedTypes(),
        this.getVirtualContainers()
      ]);
      
      console.log('📦 Loaded form options:', {
        tenants: filterOptions.tenants?.length || 0,
        seedTypes: seedTypes?.length || 0,
        virtualContainers: virtualContainers?.length || 0
      });
      
      // Transform the filter options to match our form options structure
      return {
        tenants: filterOptions.tenants || [],
        purposes: [
          { value: 'development', label: 'Development' },
          { value: 'research', label: 'Research' },
          { value: 'production', label: 'Production' }
        ],
        seedTypes: seedTypes || [],
        virtualContainers: virtualContainers || []
      };
    } catch (error) {
      console.error('Failed to load form options:', error);
      throw new Error('Unable to load form options');
    }
  }

  /**
   * Clear seed types cache (useful when new seed types are added)
   */
  clearSeedTypesCache() {
    this.seedTypesCache = null;
    this.seedTypesCacheTime = 0;
    console.log('🗑️ Seed types cache cleared');
  }

  /**
   * Copy environment settings from an existing container
   */
  async copyEnvironmentFromContainer(containerId: number): Promise<Partial<ContainerEditFormData>> {
    try {
      const sourceContainer = await getContainerById(containerId);
      
      return {
        ecosystem_connected: sourceContainer.ecosystem_connected || false,
        ecosystem_settings: sourceContainer.ecosystem_settings ? {
          fa: (sourceContainer.ecosystem_settings as any)?.fa || null,
          pya: (sourceContainer.ecosystem_settings as any)?.pya || null,
          aws: (sourceContainer.ecosystem_settings as any)?.aws || null,
          mbai: 'prod' as const
        } : {
          fa: null,
          pya: null,
          aws: null,
          mbai: 'prod' as const
        },
        shadow_service_enabled: sourceContainer.shadow_service_enabled || false,
        robotics_simulation_enabled: sourceContainer.robotics_simulation_enabled || false
      };
    } catch (error) {
      console.error('Failed to copy environment from container:', error);
      throw new Error('Failed to copy environment settings');
    }
  }

  /**
   * Get environment settings based on purpose for ecosystem integration
   */
  getEnvironmentSettingsForPurpose(purpose: string) {
    switch (purpose.toLowerCase()) {
      case 'development':
        return {
          fa: 'alpha' as const,
          pya: 'dev' as const,
          aws: 'dev' as const,
          mbai: 'prod' as const
        };
      case 'research':
      case 'production':
        return {
          fa: 'prod' as const,
          pya: 'stage' as const,
          aws: 'prod' as const,
          mbai: 'prod' as const
        };
      default:
        return {
          fa: null,
          pya: null,
          aws: null,
          mbai: 'prod' as const
        };
    }
  }

  /**
   * Update an existing container
   */
  async updateContainer(formData: ContainerEditFormData): Promise<Container> {
    try {
      // Prepare the update payload excluding read-only fields like name
      const updatePayload = {
        tenant_id: formData.tenant_id,
        type: formData.type,
        purpose: formData.purpose,
        seed_type_ids: formData.seed_type_ids,
        location: formData.type === 'physical' ? formData.location : null,
        notes: formData.notes,
        shadow_service_enabled: formData.shadow_service_enabled,
        copied_environment_from: formData.type === 'virtual' ? formData.copied_environment_from : null,
        robotics_simulation_enabled: formData.type === 'virtual' ? formData.robotics_simulation_enabled : false,
        ecosystem_connected: formData.ecosystem_connected,
        ecosystem_settings: formData.ecosystem_connected ? formData.ecosystem_settings : null
      };

      console.log('📤 Sending API request to update container:', {
        containerId: formData.container_id,
        payload: updatePayload
      });

      const result = await containerApiService.updateContainer(formData.container_id, updatePayload);
      console.log('📥 API response received:', result);
      
      return result;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw new Error('Unable to update container');
    }
  }

  /**
   * Get container by ID for editing
   */
  async getContainer(id: number): Promise<Container> {
    try {
      return await containerApiService.getContainer(id);
    } catch (error) {
      console.error('Failed to get container:', error);
      throw new Error('Unable to fetch container details');
    }
  }
}

export const containerEditService = new ContainerEditService();
