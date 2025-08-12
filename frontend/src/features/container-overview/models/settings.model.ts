// Domain models for container settings management
// Handles settings data, validation, and environment links

export interface ContainerSettings {
  tenant_id: number;
  purpose: 'development' | 'research' | 'production';
  location: {
    city: string;
    country: string;
    address: string;
  } | null;
  notes: string;
  shadow_service_enabled: boolean;
  copied_environment_from: number | null;
  robotics_simulation_enabled: boolean;
  ecosystem_connected: boolean;
  ecosystem_settings: Record<string, unknown>;
}

export interface EnvironmentLinks {
  container_id: number;
  fa: Record<string, unknown>; // Farm Automation
  pya: Record<string, unknown>; // Python Analytics
  aws: Record<string, unknown>; // AWS Services
  mbai: Record<string, unknown>; // Machine Learning/AI
  fh: Record<string, unknown>; // Farm Hub
}

export interface SettingsUpdateRequest {
  tenant_id?: number;
  purpose?: 'development' | 'research' | 'production';
  location?: {
    city: string;
    country: string;
    address: string;
  } | null;
  notes?: string;
  shadow_service_enabled?: boolean;
  copied_environment_from?: number | null;
  robotics_simulation_enabled?: boolean;
  ecosystem_connected?: boolean;
  ecosystem_settings?: Record<string, unknown>;
}

export interface EnvironmentLinksUpdateRequest {
  fa?: Record<string, unknown>;
  pya?: Record<string, unknown>;
  aws?: Record<string, unknown>;
  mbai?: Record<string, unknown>;
  fh?: Record<string, unknown>;
}

export interface SettingsValidationError {
  field: string;
  message: string;
}

// Domain logic for settings management
export class ContainerSettingsModel {
  private originalSettings: ContainerSettings | null = null;
  private currentSettings: ContainerSettings | null = null;
  private environmentLinks: EnvironmentLinks | null = null;
  private isEditMode = false;
  private validationErrors: SettingsValidationError[] = [];
  private isSaving = false;

  public setSettings(settings: ContainerSettings): void {
    this.originalSettings = { ...settings };
    this.currentSettings = { ...settings };
  }

  public getSettings(): ContainerSettings | null {
    return this.currentSettings;
  }

  public getOriginalSettings(): ContainerSettings | null {
    return this.originalSettings;
  }

  public setEnvironmentLinks(links: EnvironmentLinks): void {
    this.environmentLinks = links;
  }

  public getEnvironmentLinks(): EnvironmentLinks | null {
    return this.environmentLinks;
  }

  public setEditMode(enabled: boolean): void {
    this.isEditMode = enabled;
    if (!enabled) {
      // Reset to original settings when canceling edit
      this.currentSettings = this.originalSettings ? { ...this.originalSettings } : null;
      this.validationErrors = [];
    }
  }

  public isInEditMode(): boolean {
    return this.isEditMode;
  }

  public setSaving(saving: boolean): void {
    this.isSaving = saving;
  }

  public isSavingSettings(): boolean {
    return this.isSaving;
  }

  // Update specific setting field
  public updateSetting<K extends keyof ContainerSettings>(
    field: K, 
    value: ContainerSettings[K]
  ): void {
    if (this.currentSettings) {
      this.currentSettings[field] = value;
      this.validateField(field);
    }
  }

  // Check if settings have been modified
  public hasUnsavedChanges(): boolean {
    if (!this.originalSettings || !this.currentSettings) return false;
    
    return JSON.stringify(this.originalSettings) !== JSON.stringify(this.currentSettings);
  }

  // Get changes for API update
  public getChanges(): SettingsUpdateRequest {
    if (!this.originalSettings || !this.currentSettings) return {};
    
    const changes: SettingsUpdateRequest = {};
    
    (Object.keys(this.currentSettings) as Array<keyof ContainerSettings>).forEach(key => {
      if (JSON.stringify(this.originalSettings![key]) !== JSON.stringify(this.currentSettings![key])) {
        (changes as any)[key] = this.currentSettings![key];
      }
    });
    
    return changes;
  }

  // Validation methods
  public validateSettings(): boolean {
    this.validationErrors = [];
    
    if (!this.currentSettings) return false;

    this.validateField('tenant_id');
    this.validateField('purpose');
    this.validateField('location');
    this.validateField('notes');

    return this.validationErrors.length === 0;
  }

  private validateField(field: keyof ContainerSettings): void {
    if (!this.currentSettings) return;

    // Remove existing errors for this field
    this.validationErrors = this.validationErrors.filter(error => error.field !== field);

    const value = this.currentSettings[field];

    switch (field) {
      case 'tenant_id':
        if (!value || (typeof value === 'number' && value <= 0)) {
          this.validationErrors.push({
            field,
            message: 'Tenant ID is required and must be a positive number'
          });
        }
        break;

      case 'purpose':
        if (!value || !['development', 'research', 'production'].includes(value as string)) {
          this.validationErrors.push({
            field,
            message: 'Purpose must be development, research, or production'
          });
        }
        break;

      case 'location':
        if (value && typeof value === 'object') {
          const location = value as { city: string; country: string; address: string };
          if (!location.city?.trim()) {
            this.validationErrors.push({
              field: 'location.city',
              message: 'City is required'
            });
          }
          if (!location.country?.trim()) {
            this.validationErrors.push({
              field: 'location.country',
              message: 'Country is required'
            });
          }
          if (!location.address?.trim()) {
            this.validationErrors.push({
              field: 'location.address',
              message: 'Address is required'
            });
          }
        }
        break;

      case 'notes':
        if (typeof value === 'string' && value.length > 1000) {
          this.validationErrors.push({
            field,
            message: 'Notes cannot exceed 1000 characters'
          });
        }
        break;
    }
  }

  public getValidationErrors(): SettingsValidationError[] {
    return this.validationErrors;
  }

  public getFieldError(field: string): string | null {
    const error = this.validationErrors.find(err => err.field === field);
    return error?.message || null;
  }

  // Environment links management
  public updateEnvironmentLink(
    service: keyof Omit<EnvironmentLinks, 'container_id'>,
    config: Record<string, unknown>
  ): void {
    if (this.environmentLinks) {
      this.environmentLinks[service] = config;
    }
  }

  public getEnvironmentLinkChanges(): EnvironmentLinksUpdateRequest {
    // For simplicity, return all links as changes
    // In a real app, you might track original vs current state
    if (!this.environmentLinks) return {};
    
    const { container_id: _containerId, ...links } = this.environmentLinks;
    return links;
  }

  // Business logic for ecosystem connectivity
  public isEcosystemServiceConnected(service: keyof Omit<EnvironmentLinks, 'container_id'>): boolean {
    const links = this.environmentLinks;
    if (!links) return false;
    
    const serviceConfig = links[service];
    return Boolean(serviceConfig && Object.keys(serviceConfig).length > 0);
  }

  public getConnectedServices(): string[] {
    if (!this.environmentLinks) return [];
    
    return Object.keys(this.environmentLinks)
      .filter(key => key !== 'container_id')
      .filter(service => 
        this.isEcosystemServiceConnected(service as keyof Omit<EnvironmentLinks, 'container_id'>)
      );
  }

  public getEcosystemHealthStatus(): 'healthy' | 'partial' | 'disconnected' {
    const connectedServices = this.getConnectedServices();
    const totalServices = 5; // fa, pya, aws, mbai, fh
    
    if (connectedServices.length === 0) return 'disconnected';
    if (connectedServices.length === totalServices) return 'healthy';
    return 'partial';
  }

  // Reset settings to original state
  public resetToOriginal(): void {
    if (this.originalSettings) {
      this.currentSettings = { ...this.originalSettings };
      this.validationErrors = [];
    }
  }

  // Confirm save (updates original settings)
  public confirmSave(): void {
    if (this.currentSettings) {
      this.originalSettings = { ...this.currentSettings };
      this.isEditMode = false;
      this.validationErrors = [];
    }
  }
}
