// Edit Container Domain Models
// Domain logic for container editing workflow

import { Location, SeedType, Tenant } from '../../../types/containers';

export interface EditContainerFormData {
  id: number;
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
  readonly: {
    name: boolean;
    ecosystemConnected: boolean;
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

export interface EditContainerLoadResult {
  success: boolean;
  formData?: EditContainerFormData;
  error?: string;
}

export class EditContainerDomainModel {
  constructor(
    public readonly formData: EditContainerFormData,
    public readonly originalFormData: EditContainerFormData,
    public readonly availableTenants: Tenant[],
    public readonly availableSeedTypes: SeedType[],
    public readonly availableContainers: Array<{ id: number; name: string }>,
    public readonly validationErrors: ValidationError[]
  ) {}

  static createDefault(containerId: number): EditContainerDomainModel {
    const defaultFormData: EditContainerFormData = {
      id: containerId,
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
      },
      readonly: {
        name: true,
        ecosystemConnected: false
      }
    };

    return new EditContainerDomainModel(
      defaultFormData,
      { ...defaultFormData },
      [],
      [],
      [],
      []
    );
  }

  static fromContainerData(
    containerData: {
      id: number;
      name: string;
      tenant_id: number;
      type: 'physical' | 'virtual';
      purpose: 'development' | 'research' | 'production';
      seed_type_ids?: number[];
      location?: Location | null;
      notes?: string;
      shadow_service_enabled?: boolean;
      copied_environment_from?: number | null;
      robotics_simulation_enabled?: boolean;
      ecosystem_connected?: boolean;
      ecosystem_settings?: {
        fa: { environment: 'alpha' | 'prod' };
        pya: { environment: 'dev' | 'test' | 'stage' };
        aws: { environment: 'dev' | 'prod' };
        mbai: { environment: 'prod' };
      };
    },
    tenants: Tenant[],
    seedTypes: SeedType[],
    availableContainers: Array<{ id: number; name: string }>
  ): EditContainerDomainModel {
    const formData: EditContainerFormData = {
      id: containerData.id,
      name: containerData.name,
      tenantId: containerData.tenant_id,
      type: containerData.type,
      purpose: containerData.purpose,
      seedTypes: containerData.seed_type_ids || [],
      location: containerData.location || null,
      notes: containerData.notes || '',
      shadowServiceEnabled: containerData.shadow_service_enabled || false,
      copiedEnvironmentFrom: containerData.copied_environment_from || null,
      roboticsSimulationEnabled: containerData.robotics_simulation_enabled || false,
      ecosystemConnected: containerData.ecosystem_connected || false,
      ecosystemSettings: containerData.ecosystem_settings || {
        fa: { environment: 'alpha' },
        pya: { environment: 'dev' },
        aws: { environment: 'dev' },
        mbai: { environment: 'prod' }
      },
      readonly: {
        name: true,
        ecosystemConnected: containerData.ecosystem_connected || false
      }
    };

    return new EditContainerDomainModel(
      formData,
      { ...formData },
      tenants,
      seedTypes,
      availableContainers,
      []
    );
  }

  withFormData(formData: Partial<EditContainerFormData>): EditContainerDomainModel {
    return new EditContainerDomainModel(
      { ...this.formData, ...formData },
      this.originalFormData,
      this.availableTenants,
      this.availableSeedTypes,
      this.availableContainers,
      this.validationErrors
    );
  }

  withTenants(tenants: Tenant[]): EditContainerDomainModel {
    return new EditContainerDomainModel(
      this.formData,
      this.originalFormData,
      tenants,
      this.availableSeedTypes,
      this.availableContainers,
      this.validationErrors
    );
  }

  withSeedTypes(seedTypes: SeedType[]): EditContainerDomainModel {
    return new EditContainerDomainModel(
      this.formData,
      this.originalFormData,
      this.availableTenants,
      seedTypes,
      this.availableContainers,
      this.validationErrors
    );
  }

  withAvailableContainers(containers: Array<{ id: number; name: string }>): EditContainerDomainModel {
    return new EditContainerDomainModel(
      this.formData,
      this.originalFormData,
      this.availableTenants,
      this.availableSeedTypes,
      containers,
      this.validationErrors
    );
  }

  withValidationErrors(errors: ValidationError[]): EditContainerDomainModel {
    return new EditContainerDomainModel(
      this.formData,
      this.originalFormData,
      this.availableTenants,
      this.availableSeedTypes,
      this.availableContainers,
      errors
    );
  }

  // Domain business logic
  validateForm(): FormValidationResult {
    const errors: ValidationError[] = [];

    if (!this.formData.tenantId) {
      errors.push({ field: 'tenantId', message: 'Tenant is required' });
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

  hasChanges(): boolean {
    return JSON.stringify(this.formData) !== JSON.stringify(this.originalFormData);
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

  isFieldReadonly(fieldName: keyof EditContainerFormData['readonly']): boolean {
    return this.formData.readonly[fieldName];
  }

  getAutoSelectedEnvironments(): EditContainerFormData['ecosystemSettings'] {
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
    if (!this.hasChanges()) {
      return 'No Changes';
    }
    return 'Save Changes';
  }

  toUpdateRequest() {
    const validation = this.validateForm();
    if (!validation.isValid) {
      throw new Error(`Form validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    return {
      tenant_id: this.formData.tenantId!,
      type: this.formData.type,
      purpose: this.formData.purpose,
      location: this.formData.location || { city: '', country: '', address: '' },
      notes: this.formData.notes.trim(),
      shadow_service_enabled: this.formData.shadowServiceEnabled,
      copied_environment_from: this.formData.copiedEnvironmentFrom || undefined,
      robotics_simulation_enabled: this.formData.roboticsSimulationEnabled,
      ecosystem_settings: this.formData.ecosystemSettings as Record<string, unknown>,
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
    
    const { city, country } = this.formData.location;
    const parts = [city, country].filter(p => p.trim()).join(', ');
    return parts || 'Incomplete location';
  }

  getChangedFields(): Array<keyof EditContainerFormData> {
    const changedFields: Array<keyof EditContainerFormData> = [];
    
    (Object.keys(this.formData) as Array<keyof EditContainerFormData>).forEach(key => {
      if (key === 'readonly') return;
      
      const currentValue = this.formData[key];
      const originalValue = this.originalFormData[key];
      
      if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
        changedFields.push(key);
      }
    });
    
    return changedFields;
  }
}