// Container Settings ViewModel - Manages settings form and environment links
import {
  ContainerSettingsState,
  ContainerSettingsForm,
  ContainerSettingsValidation,
  ContainerSettingsUpdateRequest,
} from '../types';
import { 
  ContainerInfo,
} from '../../../api/containerApiService';
import { EnvironmentLink } from '../../../types/containers';
import { containerDetailService } from '../services';
import { validateContainerSettings } from '../services/dataTransformers';

/**
 * ViewModel for container settings management
 */
export class ContainerSettingsViewModel {
  private state: ContainerSettingsState;
  private containerId: number;
  private originalSettings: ContainerSettingsUpdateRequest | null = null;
  private listeners: Set<() => void> = new Set();

  constructor(containerId: number, containerInfo?: ContainerInfo) {
    this.containerId = containerId;
    this.state = {
      settings: this.initializeSettings(containerInfo),
      environmentLinks: null,
      isEditMode: false,
      isSaving: false,
      hasChanges: false,
      validationErrors: {},
    };
  }

  // State Management

  /**
   * Initialize settings from container info
   */
  private initializeSettings(containerInfo?: ContainerInfo): ContainerSettingsUpdateRequest {
    if (!containerInfo) {
      return {
        tenant_id: 0,
        purpose: '',
        location: {},
        notes: '',
        shadow_service_enabled: false,
        robotics_simulation_enabled: false,
        ecosystem_connected: false,
        ecosystem_settings: {},
      };
    }

    return {
      tenant_id: containerInfo.tenant.id,
      purpose: '', // TODO: Get from container info if available
      location: containerInfo.location || {},
      notes: '', // TODO: Get from container info if available
      shadow_service_enabled: false, // TODO: Get from container settings
      robotics_simulation_enabled: false, // TODO: Get from container settings
      ecosystem_connected: false, // TODO: Get from container settings
      ecosystem_settings: {}, // TODO: Get from container settings
    };
  }

  /**
   * Load environment links
   */
  async loadEnvironmentLinks(): Promise<void> {
    try {
      // In a real implementation, this would come from the container detail service
      // For now, we'll use a placeholder
      const links: EnvironmentLink = {
        container_id: this.containerId,
        fa: {},
        pya: {},
        aws: {},
        mbai: {},
        fh: {},
      };

      this.setState({ environmentLinks: links });

    } catch (error) {
      console.error('Failed to load environment links:', error);
    }
  }

  /**
   * Toggle edit mode
   */
  toggleEditMode(): void {
    if (this.state.isEditMode) {
      // Exiting edit mode - check for unsaved changes
      if (this.state.hasChanges) {
        const shouldDiscard = window.confirm('You have unsaved changes. Discard them?');
        if (!shouldDiscard) return;
      }
      this.cancelEditing();
    } else {
      this.startEditing();
    }
  }

  /**
   * Start editing mode
   */
  startEditing(): void {
    this.originalSettings = { ...this.state.settings };
    this.setState({
      isEditMode: true,
      hasChanges: false,
      validationErrors: {},
    });
  }

  /**
   * Cancel editing and revert changes
   */
  cancelEditing(): void {
    if (this.originalSettings) {
      this.setState({
        settings: { ...this.originalSettings },
        isEditMode: false,
        hasChanges: false,
        validationErrors: {},
      });
    } else {
      this.setState({
        isEditMode: false,
        hasChanges: false,
        validationErrors: {},
      });
    }
  }

  /**
   * Update a setting field
   */
  updateSetting<K extends keyof ContainerSettingsUpdateRequest>(
    field: K,
    value: ContainerSettingsUpdateRequest[K]
  ): void {
    const newSettings = { ...this.state.settings, [field]: value };
    const hasChanges = this.originalSettings ? 
      JSON.stringify(newSettings) !== JSON.stringify(this.originalSettings) : 
      true;

    // Validate the updated settings
    const validation = validateContainerSettings(newSettings);
    const fieldErrors = { ...this.state.validationErrors };
    
    if (validation.errors[field]) {
      fieldErrors[field] = validation.errors[field];
    } else {
      delete fieldErrors[field];
    }

    this.setState({
      settings: newSettings,
      hasChanges,
      validationErrors: fieldErrors,
    });
  }

  /**
   * Save settings
   */
  async saveSettings(): Promise<boolean> {
    // Validate before saving
    const validation = this.validateCurrentSettings();
    if (!validation.isValid) {
      this.setState({ validationErrors: validation.errors });
      return false;
    }

    this.setState({ isSaving: true, validationErrors: {} });

    try {
      await containerDetailService.updateContainerSettings(
        this.containerId,
        this.state.settings
      );

      this.setState({
        isSaving: false,
        isEditMode: false,
        hasChanges: false,
      });

      this.originalSettings = { ...this.state.settings };
      return true;

    } catch (error: any) {
      this.setState({
        isSaving: false,
        validationErrors: { general: error.message || 'Failed to save settings' },
      });
      return false;
    }
  }

  /**
   * Update environment links
   */
  async updateEnvironmentLinks(links: Partial<EnvironmentLink>): Promise<boolean> {
    try {
      await containerDetailService.updateEnvironmentLinks(this.containerId, links);
      
      const updatedLinks = { ...this.state.environmentLinks, ...links } as EnvironmentLink;
      this.setState({ environmentLinks: updatedLinks });
      
      return true;

    } catch (error: any) {
      console.error('Failed to update environment links:', error);
      return false;
    }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Getters for UI Components

  /**
   * Get current settings for form display
   */
  getSettings(): ContainerSettingsUpdateRequest {
    return { ...this.state.settings };
  }

  /**
   * Get environment links for display
   */
  getEnvironmentLinks(): EnvironmentLink | null {
    return this.state.environmentLinks;
  }

  /**
   * Get edit mode state
   */
  isEditing(): boolean {
    return this.state.isEditMode;
  }

  /**
   * Check if currently saving
   */
  isSaving(): boolean {
    return this.state.isSaving;
  }

  /**
   * Check if there are unsaved changes
   */
  hasUnsavedChanges(): boolean {
    return this.state.hasChanges;
  }

  /**
   * Get validation errors
   */
  getValidationErrors(): Record<string, string> {
    return { ...this.state.validationErrors };
  }

  /**
   * Get form field props for easy binding
   */
  getFieldProps<K extends keyof ContainerSettingsUpdateRequest>(field: K) {
    return {
      value: this.state.settings[field],
      onChange: (value: ContainerSettingsUpdateRequest[K]) => this.updateSetting(field, value),
      error: this.state.validationErrors[field],
      disabled: !this.state.isEditMode || this.state.isSaving,
    };
  }

  /**
   * Get container info panel model
   */
  getContainerInfoModel() {
    const settings = this.state.settings;
    
    return {
      basicInfo: [
        { label: 'Tenant ID', value: settings.tenant_id, icon: '🏢' },
        { label: 'Purpose', value: settings.purpose || 'Not specified', icon: '🎯' },
        { label: 'Location', value: this.formatLocation(settings.location || {}), icon: '📍' },
        { label: 'Shadow Service', value: settings.shadow_service_enabled ? 'Enabled' : 'Disabled', icon: '🔄' },
        { label: 'Robotics Simulation', value: settings.robotics_simulation_enabled ? 'Enabled' : 'Disabled', icon: '🤖' },
        { label: 'Ecosystem Connected', value: settings.ecosystem_connected ? 'Yes' : 'No', icon: '🔗' },
      ],
      statusInfo: {
        text: this.state.hasChanges ? 'Modified' : 'Saved',
        variant: this.state.hasChanges ? 'warning' : 'active' as const,
      },
      sections: [
        {
          title: 'Notes',
          content: settings.notes || 'No notes available',
        },
        {
          title: 'Ecosystem Settings',
          content: Object.keys(settings.ecosystem_settings || {}).length > 0 
            ? JSON.stringify(settings.ecosystem_settings, null, 2)
            : 'No ecosystem settings configured',
        },
      ],
      isEditMode: this.state.isEditMode,
      onToggleEdit: () => this.toggleEditMode(),
      onSave: () => this.saveSettings(),
    };
  }

  /**
   * Get environment connectivity status
   */
  getEnvironmentStatus(): Array<{
    service: string;
    label: string;
    connected: boolean;
    lastSync?: string;
    config: any;
  }> {
    const links = this.state.environmentLinks;
    if (!links) return [];

    return [
      { service: 'fa', label: 'Farm Analytics', connected: !!links.fa && Object.keys(links.fa).length > 0, config: links.fa },
      { service: 'pya', label: 'Python Analytics', connected: !!links.pya && Object.keys(links.pya).length > 0, config: links.pya },
      { service: 'aws', label: 'AWS Services', connected: !!links.aws && Object.keys(links.aws).length > 0, config: links.aws },
      { service: 'mbai', label: 'MBAI Platform', connected: !!links.mbai && Object.keys(links.mbai).length > 0, config: links.mbai },
      { service: 'fh', label: 'Farm Hub', connected: !!links.fh && Object.keys(links.fh).length > 0, config: links.fh },
    ];
  }

  /**
   * Check if settings form is valid
   */
  isFormValid(): boolean {
    const validation = this.validateCurrentSettings();
    return validation.isValid;
  }

  /**
   * Get form actions model
   */
  getFormActions() {
    return {
      canSave: this.state.isEditMode && this.state.hasChanges && this.isFormValid() && !this.state.isSaving,
      canCancel: this.state.isEditMode && !this.state.isSaving,
      canEdit: !this.state.isEditMode,
      onSave: () => this.saveSettings(),
      onCancel: () => this.cancelEditing(),
      onEdit: () => this.startEditing(),
      isSaving: this.state.isSaving,
    };
  }

  // Private Methods

  private setState(updates: Partial<ContainerSettingsState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in ContainerSettingsViewModel listener:', error);
      }
    });
  }

  private validateCurrentSettings(): ContainerSettingsValidation {
    return validateContainerSettings(this.state.settings);
  }

  private formatLocation(location: Record<string, any>): string {
    if (!location || Object.keys(location).length === 0) {
      return 'Not specified';
    }

    if (location.city && location.country) {
      return `${location.city}, ${location.country}`;
    }

    if (location.address) {
      return location.address;
    }

    return JSON.stringify(location);
  }
}
