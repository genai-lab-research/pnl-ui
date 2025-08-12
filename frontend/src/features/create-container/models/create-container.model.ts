// Create Container Domain Models
// Domain logic for container creation workflow

import { Location, SeedType, Tenant } from '../../../types/containers';

export interface ContainerFormData {
  name: string;
  tenantId: number | null;
  type: 'physical' | 'virtual';
  purpose: 'development' | 'research' | 'production';
  seedTypes: number[];
  location: Location | null;
  notes: string;
  shadowServiceEnabled: boolean;
  copiedEnvironmentFrom: number | null;
  roboticsSimulationEnabled: boolean;
  ecosystemConnected: boolean;
  ecosystemSettings: {
    fa: { environment: 'alpha' | 'prod' };
    pya: { environment: 'dev' | 'test' | 'stage' };
    aws: { environment: 'dev' | 'prod' };
    mbai: { environment: 'prod' };
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface NameValidationResult {
  isValid: boolean;
  suggestions: string[];
}

export class CreateContainerDomainModel {
  constructor(
    public readonly formData: ContainerFormData,
    public readonly availableTenants: Tenant[],
    public readonly availableSeedTypes: SeedType[],
    public readonly availableContainers: Array<{ id: number; name: string }>,
    public readonly validationErrors: ValidationError[]
  ) {}

  static createDefault(): CreateContainerDomainModel {
    const defaultFormData: ContainerFormData = {
      name: '',
      tenantId: null,
      type: 'physical',
      purpose: 'development',
      seedTypes: [],
      location: null,
      notes: '',
      shadowServiceEnabled: false,
      copiedEnvironmentFrom: null,
      roboticsSimulationEnabled: false,
      ecosystemConnected: false,
      ecosystemSettings: {
        fa: { environment: 'alpha' },
        pya: { environment: 'dev' },
        aws: { environment: 'dev' },
        mbai: { environment: 'prod' }
      }
    };

    return new CreateContainerDomainModel(
      defaultFormData,
      [],
      [],
      [],
      []
    );
  }

  withFormData(formData: Partial<ContainerFormData>): CreateContainerDomainModel {
    return new CreateContainerDomainModel(
      { ...this.formData, ...formData },
      this.availableTenants,
      this.availableSeedTypes,
      this.availableContainers,
      this.validationErrors
    );
  }

  withTenants(tenants: Tenant[]): CreateContainerDomainModel {
    return new CreateContainerDomainModel(
      this.formData,
      tenants,
      this.availableSeedTypes,
      this.availableContainers,
      this.validationErrors
    );
  }

  withSeedTypes(seedTypes: SeedType[]): CreateContainerDomainModel {
    return new CreateContainerDomainModel(
      this.formData,
      this.availableTenants,
      seedTypes,
      this.availableContainers,
      this.validationErrors
    );
  }

  withAvailableContainers(containers: Array<{ id: number; name: string }>): CreateContainerDomainModel {
    return new CreateContainerDomainModel(
      this.formData,
      this.availableTenants,
      this.availableSeedTypes,
      containers,
      this.validationErrors
    );
  }

  withValidationErrors(errors: ValidationError[]): CreateContainerDomainModel {
    return new CreateContainerDomainModel(
      this.formData,
      this.availableTenants,
      this.availableSeedTypes,
      this.availableContainers,
      errors
    );
  }

  // Domain business logic
  validateForm(): FormValidationResult {
    const errors: ValidationError[] = [];

    if (!this.formData.name.trim()) {
      errors.push({ field: 'name', message: 'Container name is required' });
    } else if (this.formData.name.length < 3) {
      errors.push({ field: 'name', message: 'Container name must be at least 3 characters' });
    } else if (this.formData.name.length > 50) {
      errors.push({ field: 'name', message: 'Container name must be less than 50 characters' });
    }

    if (!this.formData.tenantId) {
      errors.push({ field: 'tenantId', message: 'Tenant is required' });
    }

    if (!this.formData.purpose) {
      errors.push({ field: 'purpose', message: 'Purpose is required' });
    }

    if (this.formData.seedTypes.length === 0) {
      errors.push({ field: 'seedTypes', message: 'At least one seed type is required' });
    }

    if (this.formData.type === 'physical' && !this.formData.location) {
      errors.push({ field: 'location', message: 'Location is required for physical containers' });
    }

    if (this.formData.type === 'physical' && this.formData.location) {
      if (!this.formData.location.city.trim()) {
        errors.push({ field: 'location.city', message: 'City is required' });
      }
      if (!this.formData.location.country.trim()) {
        errors.push({ field: 'location.country', message: 'Country is required' });
      }
      if (!this.formData.location.address.trim()) {
        errors.push({ field: 'location.address', message: 'Address is required' });
      }
    }

    if (this.formData.type === 'virtual' && this.formData.copiedEnvironmentFrom && 
        !this.availableContainers.find(c => c.id === this.formData.copiedEnvironmentFrom)) {
      errors.push({ field: 'copiedEnvironmentFrom', message: 'Selected environment container is not available' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isFormValid(): boolean {
    return this.validateForm().isValid;
  }

  getValidationErrorsForField(fieldName: string): ValidationError[] {
    return this.validationErrors.filter(error => error.field === fieldName);
  }

  hasValidationErrorsForField(fieldName: string): boolean {
    return this.getValidationErrorsForField(fieldName).length > 0;
  }

  isPhysicalContainer(): boolean {
    return this.formData.type === 'physical';
  }

  isVirtualContainer(): boolean {
    return this.formData.type === 'virtual';
  }

  shouldShowLocation(): boolean {
    return this.isPhysicalContainer();
  }

  shouldShowVirtualSettings(): boolean {
    return this.isVirtualContainer();
  }

  shouldShowEcosystemSettings(): boolean {
    return this.formData.ecosystemConnected;
  }

  getAutoSelectedEnvironments(): CreateContainerDomainModel['formData']['ecosystemSettings'] {
    const baseSettings = {
      fa: { environment: 'alpha' as const },
      pya: { environment: 'dev' as const },
      aws: { environment: 'dev' as const },
      mbai: { environment: 'prod' as const }
    };

    if (this.formData.purpose === 'development') {
      return {
        ...baseSettings,
        pya: { environment: 'dev' },
        aws: { environment: 'dev' }
      };
    } else if (this.formData.purpose === 'research' || this.formData.purpose === 'production') {
      return {
        ...baseSettings,
        fa: { environment: 'prod' },
        pya: { environment: 'stage' },
        aws: { environment: 'prod' }
      };
    }

    return baseSettings;
  }

  getSubmitButtonLabel(): string {
    if (this.formData.ecosystemConnected) {
      return 'Create and Connect';
    }
    return 'Create Container';
  }

  toCreateRequest() {
    const validation = this.validateForm();
    if (!validation.isValid) {
      throw new Error(`Form validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    return {
      name: this.formData.name.trim(),
      tenant_id: this.formData.tenantId!,
      type: this.formData.type,
      purpose: this.formData.purpose,
      location: this.formData.location || { city: '', country: '', address: '' },
      notes: this.formData.notes.trim(),
      shadow_service_enabled: this.formData.shadowServiceEnabled,
      copied_environment_from: this.formData.copiedEnvironmentFrom || undefined,
      robotics_simulation_enabled: this.formData.roboticsSimulationEnabled,
      ecosystem_connected: this.formData.ecosystemConnected,
      ecosystem_settings: this.formData.ecosystemSettings as Record<string, any>,
      status: 'created' as const,
      seed_type_ids: this.formData.seedTypes
    };
  }

  getSelectedSeedTypesDisplay(): string {
    if (this.formData.seedTypes.length === 0) return 'No seed types selected';
    
    const seedTypeNames = this.formData.seedTypes
      .map(id => this.availableSeedTypes.find(st => st.id === id)?.name)
      .filter(Boolean);
    
    if (seedTypeNames.length === 0) return 'No seed types selected';
    if (seedTypeNames.length === 1) return seedTypeNames[0]!;
    return `${seedTypeNames[0]} +${seedTypeNames.length - 1} more`;
  }

  getLocationDisplay(): string {
    if (!this.formData.location) return 'No location set';
    
    const { address, city, country } = this.formData.location;
    const parts = [address, city, country].filter(p => p.trim()).join(', ');
    return parts || 'Incomplete location';
  }
}