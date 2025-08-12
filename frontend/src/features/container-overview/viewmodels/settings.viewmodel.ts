// ViewModel for Container Settings management
// Handles settings editing, validation, and environment links

import { 
  ContainerSettingsModel, 
  ContainerSettings,
  EnvironmentLinks,
  SettingsUpdateRequest,
  SettingsValidationError
} from '../models/settings.model';
import { settingsApiAdapter } from '../services/settings-api.adapter';

export interface SettingsState {
  settings: ContainerSettings | null;
  originalSettings: ContainerSettings | null;
  environmentLinks: EnvironmentLinks | null;
  isEditMode: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  validationErrors: SettingsValidationError[];
  isLoading: boolean;
  error: string | null;
  permissions: {
    canEdit: boolean;
    canManage: boolean;
  };
}

export class SettingsViewModel {
  private model: ContainerSettingsModel;
  private containerId: number;
  private onStateChange?: (state: SettingsState) => void;

  constructor(containerId: number) {
    this.containerId = containerId;
    this.model = new ContainerSettingsModel();
  }

  // State management
  public setStateChangeListener(callback: (state: SettingsState) => void): void {
    this.onStateChange = callback;
  }

  public getState(): SettingsState {
    return {
      settings: this.model.getSettings(),
      originalSettings: this.model.getOriginalSettings(),
      environmentLinks: this.model.getEnvironmentLinks(),
      isEditMode: this.model.isInEditMode(),
      isSaving: this.model.isSavingSettings(),
      hasUnsavedChanges: this.model.hasUnsavedChanges(),
      validationErrors: this.model.getValidationErrors(),
      isLoading: false, // Managed by this viewmodel
      error: null, // Managed by this viewmodel
      permissions: {
        canEdit: true, // Would be determined by user permissions
        canManage: true
      }
    };
  }

  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }

  // Core operations
  public async initialize(): Promise<void> {
    try {
      this.notifyStateChange(); // Set loading state

      const [settings, environmentLinks] = await Promise.all([
        settingsApiAdapter.getContainerSettings(this.containerId),
        settingsApiAdapter.getEnvironmentLinks(this.containerId)
      ]);

      this.model.setSettings(settings);
      this.model.setEnvironmentLinks(environmentLinks);
      
      this.notifyStateChange();

    } catch (error) {
      console.error('Failed to initialize settings:', error);
      this.notifyStateChange();
    }
  }

  public async refreshData(): Promise<void> {
    await this.initialize();
  }

  // Edit mode management
  public enterEditMode(): void {
    this.model.setEditMode(true);
    this.notifyStateChange();
  }

  public exitEditMode(): void {
    this.model.setEditMode(false);
    this.notifyStateChange();
  }

  public toggleEditMode(): void {
    if (this.model.isInEditMode()) {
      this.exitEditMode();
    } else {
      this.enterEditMode();
    }
  }

  // Settings modification
  public updateSetting<K extends keyof ContainerSettings>(
    field: K, 
    value: ContainerSettings[K]
  ): void {
    this.model.updateSetting(field, value);
    this.notifyStateChange();
  }

  public updateLocation(location: ContainerSettings['location']): void {
    this.updateSetting('location', location);
  }

  public updateNotes(notes: string): void {
    this.updateSetting('notes', notes);
  }

  public updatePurpose(purpose: ContainerSettings['purpose']): void {
    this.updateSetting('purpose', purpose);
  }

  public toggleShadowService(): void {
    const currentSettings = this.model.getSettings();
    if (currentSettings) {
      this.updateSetting('shadow_service_enabled', !currentSettings.shadow_service_enabled);
    }
  }

  public toggleRoboticsSimulation(): void {
    const currentSettings = this.model.getSettings();
    if (currentSettings) {
      this.updateSetting('robotics_simulation_enabled', !currentSettings.robotics_simulation_enabled);
    }
  }

  public toggleEcosystemConnection(): void {
    const currentSettings = this.model.getSettings();
    if (currentSettings) {
      this.updateSetting('ecosystem_connected', !currentSettings.ecosystem_connected);
    }
  }

  // Settings validation and saving
  public validateSettings(): boolean {
    return this.model.validateSettings();
  }

  public getValidationErrors(): SettingsValidationError[] {
    return this.model.getValidationErrors();
  }

  public getFieldError(field: string): string | null {
    return this.model.getFieldError(field);
  }

  public async saveSettings(): Promise<void> {
    try {
      // Validate before saving
      if (!this.validateSettings()) {
        throw new Error('Please fix validation errors before saving');
      }

      this.model.setSaving(true);
      this.notifyStateChange();

      const changes = this.model.getChanges();
      await settingsApiAdapter.updateContainerSettings(this.containerId, changes);

      this.model.confirmSave(); // This updates original settings and exits edit mode
      this.notifyStateChange();

    } catch (error) {
      console.error('Failed to save settings:', error);
      this.model.setSaving(false);
      this.notifyStateChange();
      throw error;
    }
  }

  public resetSettings(): void {
    this.model.resetToOriginal();
    this.notifyStateChange();
  }

  // Environment links management
  public updateEnvironmentLink(
    service: keyof Omit<EnvironmentLinks, 'container_id'>,
    config: Record<string, any>
  ): void {
    this.model.updateEnvironmentLink(service, config);
    this.notifyStateChange();
  }

  public async saveEnvironmentLinks(): Promise<void> {
    try {
      this.model.setSaving(true);
      this.notifyStateChange();

      const changes = this.model.getEnvironmentLinkChanges();
      await settingsApiAdapter.updateEnvironmentLinks(this.containerId, changes);

      this.notifyStateChange();

    } catch (error) {
      console.error('Failed to save environment links:', error);
      this.model.setSaving(false);
      this.notifyStateChange();
      throw error;
    }
  }

  public async testEnvironmentConnection(
    service: keyof Omit<EnvironmentLinks, 'container_id'>
  ): Promise<{ connected: boolean; error?: string }> {
    try {
      const result = await settingsApiAdapter.testEnvironmentConnection(this.containerId, service);
      return {
        connected: result.connected,
        error: result.error
      };
    } catch (error) {
      console.error(`Failed to test ${service} connection:`, error);
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Connection test failed'
      };
    }
  }

  // Data access methods
  public getSettings(): ContainerSettings | null {
    return this.model.getSettings();
  }

  public getEnvironmentLinks(): EnvironmentLinks | null {
    return this.model.getEnvironmentLinks();
  }

  public hasUnsavedChanges(): boolean {
    return this.model.hasUnsavedChanges();
  }

  public isInEditMode(): boolean {
    return this.model.isInEditMode();
  }

  public isSaving(): boolean {
    return this.model.isSavingSettings();
  }

  // UI data transformation
  public getPurposeOptions(): Array<{ value: ContainerSettings['purpose']; label: string }> {
    return [
      { value: 'development', label: 'Development' },
      { value: 'research', label: 'Research' },
      { value: 'production', label: 'Production' }
    ];
  }

  public getLocationDisplayString(): string {
    const settings = this.model.getSettings();
    const location = settings?.location;
    
    if (!location) return 'No location set';
    
    return `${location.city}, ${location.country}`;
  }

  public getFormattedSettings() {
    const settings = this.model.getSettings();
    if (!settings) return null;

    return {
      purpose: {
        value: settings.purpose,
        label: this.getPurposeOptions().find(opt => opt.value === settings.purpose)?.label || settings.purpose
      },
      location: settings.location ? {
        display: this.getLocationDisplayString(),
        city: settings.location.city,
        country: settings.location.country,
        address: settings.location.address
      } : null,
      notes: settings.notes || 'No notes',
      features: {
        shadowService: {
          enabled: settings.shadow_service_enabled,
          label: 'Shadow Service'
        },
        roboticsSimulation: {
          enabled: settings.robotics_simulation_enabled,
          label: 'Robotics Simulation'
        },
        ecosystemConnection: {
          enabled: settings.ecosystem_connected,
          label: 'Ecosystem Connected'
        }
      }
    };
  }

  // Environment links UI data
  public getConnectedServices(): string[] {
    return this.model.getConnectedServices();
  }

  public isEcosystemServiceConnected(service: keyof Omit<EnvironmentLinks, 'container_id'>): boolean {
    return this.model.isEcosystemServiceConnected(service);
  }

  public getEcosystemHealthStatus(): 'healthy' | 'partial' | 'disconnected' {
    return this.model.getEcosystemHealthStatus();
  }

  public getEcosystemHealthColor(): 'success' | 'warning' | 'error' {
    const status = this.getEcosystemHealthStatus();
    switch (status) {
      case 'healthy':
        return 'success';
      case 'partial':
        return 'warning';
      case 'disconnected':
        return 'error';
    }
  }

  public getServiceDisplayInfo() {
    const links = this.model.getEnvironmentLinks();
    if (!links) return [];

    return [
      { key: 'fa', name: 'Farm Automation', connected: this.isEcosystemServiceConnected('fa') },
      { key: 'pya', name: 'Python Analytics', connected: this.isEcosystemServiceConnected('pya') },
      { key: 'aws', name: 'AWS Services', connected: this.isEcosystemServiceConnected('aws') },
      { key: 'mbai', name: 'ML/AI Services', connected: this.isEcosystemServiceConnected('mbai') },
      { key: 'fh', name: 'Farm Hub', connected: this.isEcosystemServiceConnected('fh') }
    ];
  }

  // Dropdown options (for UI components)
  public async getTenantOptions(): Promise<Array<{ id: number; name: string }>> {
    try {
      return await settingsApiAdapter.getAvailableTenants();
    } catch (error) {
      console.error('Failed to get tenant options:', error);
      return [];
    }
  }

  public async getContainerCopyOptions(): Promise<Array<{ id: number; name: string; type: string }>> {
    try {
      return await settingsApiAdapter.getAvailableContainersForCopy(this.containerId);
    } catch (error) {
      console.error('Failed to get container copy options:', error);
      return [];
    }
  }

  // Permissions
  public canEditSettings(): boolean {
    return true; // Would be determined by user permissions
  }

  public canManageEcosystem(): boolean {
    return true; // Would be determined by user permissions
  }

  // Error handling
  public hasError(): boolean {
    return false; // Error state would be managed here
  }

  public getErrorMessage(): string | null {
    return null; // Error message would be managed here
  }

  // Loading state
  public isLoading(): boolean {
    return false; // Loading state would be managed here
  }

  // Cleanup
  public destroy(): void {
    this.onStateChange = undefined;
  }
}
