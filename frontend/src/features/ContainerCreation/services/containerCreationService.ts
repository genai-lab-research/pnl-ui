import { 
  createNewContainer,
  getAllContainers
} from '../../../api/containerService';
import { getAllTenants } from '../../../api/tenantService';
import { getAllSeedTypes } from '../../../api/seedTypeService';
import { validateContainerName } from '../../../api/validationService';
import { 
  ContainerFormData, 
  ContainerFormOptions,
  NameValidationResponse 
} from '../types';
import { CreateContainerRequest, Container } from '../../../types/containers';

export class ContainerCreationService {
  private static instance: ContainerCreationService;

  private constructor() {}

  public static getInstance(): ContainerCreationService {
    if (!ContainerCreationService.instance) {
      ContainerCreationService.instance = new ContainerCreationService();
    }
    return ContainerCreationService.instance;
  }

  /**
   * Load all options needed for the container creation form
   */
  public async loadFormOptions(): Promise<ContainerFormOptions> {
    try {
      const [tenants, seedTypes, virtualContainers] = await Promise.all([
        getAllTenants(),
        getAllSeedTypes(),
        this.getVirtualContainers()
      ]);

      const purposes = [
        { value: 'development', label: 'Development' },
        { value: 'research', label: 'Research' },
        { value: 'production', label: 'Production' }
      ];

      return {
        tenants,
        purposes,
        seedTypes,
        virtualContainers
      };
    } catch (error) {
      console.error('Failed to load form options:', error);
      throw new Error('Failed to load form data');
    }
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
   * Validate container name uniqueness
   */
  public async validateName(name: string): Promise<NameValidationResponse> {
    if (!name.trim()) {
      return {
        is_valid: false,
        suggestions: []
      };
    }

    try {
      return await validateContainerName({ name: name.trim() });
    } catch (error) {
      console.error('Name validation failed:', error);
      return {
        is_valid: false,
        suggestions: []
      };
    }
  }

  /**
   * Create a new container
   */
  public async createContainer(formData: ContainerFormData): Promise<Container> {
    try {
      // Transform form data to API format
      const createRequest: CreateContainerRequest = {
        name: formData.name.trim(),
        tenant_id: formData.tenant_id!,
        type: formData.type,
        purpose: formData.purpose!,
        location: formData.location,
        notes: formData.notes.trim(),
        shadow_service_enabled: formData.shadow_service_enabled,
        copied_environment_from: formData.copied_environment_from || undefined,
        robotics_simulation_enabled: formData.robotics_simulation_enabled,
        ecosystem_connected: formData.ecosystem_connected,
        ecosystem_settings: formData.ecosystem_settings as any,
        status: 'created',
        seed_type_ids: formData.seed_type_ids
      };

      return await createNewContainer(createRequest);
    } catch (error) {
      console.error('Container creation failed:', error);
      throw error;
    }
  }

  /**
   * Get default form data
   */
  public getDefaultFormData(): ContainerFormData {
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
   * Get environment settings based on purpose
   */
  public getEnvironmentSettingsForPurpose(purpose: string): ContainerFormData['ecosystem_settings'] {
    const baseSettings = {
      fa: null as 'alpha' | 'prod' | null,
      pya: null as 'dev' | 'test' | 'stage' | null,
      aws: null as 'dev' | 'prod' | null,
      mbai: 'prod' as const
    };

    switch (purpose) {
      case 'development':
        return {
          ...baseSettings,
          fa: 'alpha',
          pya: 'dev',
          aws: 'dev'
        };
      case 'research':
      case 'production':
        return {
          ...baseSettings,
          fa: 'prod',
          pya: 'stage',
          aws: 'prod'
        };
      default:
        return baseSettings;
    }
  }
}

// Export singleton instance
export const containerCreationService = ContainerCreationService.getInstance();
