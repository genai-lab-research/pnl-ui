// Edit Container ViewModel
// Manages state and coordinates between domain models and UI components

import { 
  EditContainerDomainModel, 
  EditContainerFormData, 
  ValidationError 
} from '../models/edit-container.model';
import { 
  editContainerApiAdapter,
  UpdateContainerResult
} from '../services/edit-container-api.adapter';
import { Location, SeedType, Tenant } from '../../../types/containers';

export interface EditContainerViewState {
  isLoading: boolean;
  isSubmitting: boolean;
  isLoadingSeedTypes: boolean;
  isInitialized: boolean;
  showLocationFields: boolean;
  showVirtualSettings: boolean;
  showEcosystemSettings: boolean;
  submitButtonLabel: string;
  submitButtonDisabled: boolean;
  hasValidationErrors: boolean;
  hasChanges: boolean;
  seedTypeSearchQuery: string;
  filteredSeedTypes: SeedType[];
  loadError: string | null;
  modificationPermissions: {
    canModify: boolean;
    reason?: string;
  };
}

export interface EditContainerActions {
  initializeForm: (containerId: number) => Promise<void>;
  updateFormField: <K extends keyof EditContainerFormData>(field: K, value: EditContainerFormData[K]) => void;
  updateLocation: (location: Partial<Location>) => void;
  updateEcosystemSettings: (settings: Partial<EditContainerFormData['ecosystemSettings']>) => void;
  toggleContainerType: (type: 'physical' | 'virtual') => void;
  toggleEcosystemConnection: (connected: boolean) => void;
  addSeedType: (seedTypeId: number) => void;
  removeSeedType: (seedTypeId: number) => void;
  searchSeedTypes: (query: string) => Promise<void>;
  validateForm: () => void;
  resetForm: () => void;
  submitForm: () => Promise<UpdateContainerResult>;
  handlePurposeChange: (purpose: 'development' | 'research' | 'production') => void;
  cancelChanges: () => void;
}

export class EditContainerViewModel {
  private domainModel: EditContainerDomainModel;
  private viewState: EditContainerViewState;
  private listeners: Set<() => void> = new Set();
  private containerId: number;

  constructor(containerId: number) {
    this.containerId = containerId;
    this.domainModel = EditContainerDomainModel.createDefault(containerId);
    this.viewState = this.createInitialViewState();
  }

  private createInitialViewState(): EditContainerViewState {
    return {
      isLoading: false,
      isSubmitting: false,
      isLoadingSeedTypes: false,
      isInitialized: false,
      showLocationFields: this.domainModel.shouldShowLocation(),
      showVirtualSettings: this.domainModel.shouldShowVirtualSettings(),
      showEcosystemSettings: this.domainModel.shouldShowEcosystemSettings(),
      submitButtonLabel: this.domainModel.getSubmitButtonLabel(),
      submitButtonDisabled: !this.domainModel.isFormValid() || !this.domainModel.hasChanges(),
      hasValidationErrors: false,
      hasChanges: this.domainModel.hasChanges(),
      seedTypeSearchQuery: '',
      filteredSeedTypes: [],
      loadError: null,
      modificationPermissions: {
        canModify: true
      }
    };
  }

  // Getters for UI binding
  get state(): EditContainerViewState {
    return { ...this.viewState };
  }

  get formData(): EditContainerFormData {
    return { ...this.domainModel.formData };
  }

  get availableTenants(): Tenant[] {
    return [...this.domainModel.availableTenants];
  }

  get availableSeedTypes(): SeedType[] {
    return [...this.domainModel.availableSeedTypes];
  }

  get availableContainers(): Array<{ id: number; name: string }> {
    return [...this.domainModel.availableContainers];
  }

  get validationErrors(): ValidationError[] {
    return [...this.domainModel.validationErrors];
  }

  get selectedSeedTypesDisplay(): string {
    return this.domainModel.getSelectedSeedTypesDisplay();
  }

  get locationDisplay(): string {
    return this.domainModel.getLocationDisplay();
  }

  get changedFields(): Array<keyof EditContainerFormData> {
    return this.domainModel.getChangedFields();
  }

  // Actions
  getActions(): EditContainerActions {
    return {
      initializeForm: this.initializeForm.bind(this),
      updateFormField: this.updateFormField.bind(this),
      updateLocation: this.updateLocation.bind(this),
      updateEcosystemSettings: this.updateEcosystemSettings.bind(this),
      toggleContainerType: this.toggleContainerType.bind(this),
      toggleEcosystemConnection: this.toggleEcosystemConnection.bind(this),
      addSeedType: this.addSeedType.bind(this),
      removeSeedType: this.removeSeedType.bind(this),
      searchSeedTypes: this.searchSeedTypes.bind(this),
      validateForm: this.validateForm.bind(this),
      resetForm: this.resetForm.bind(this),
      submitForm: this.submitForm.bind(this),
      handlePurposeChange: this.handlePurposeChange.bind(this),
      cancelChanges: this.cancelChanges.bind(this)
    };
  }

  private async initializeForm(containerId: number): Promise<void> {
    this.updateViewState({ isLoading: true, loadError: null });

    try {
      // Check modification permissions first
      const permissionCheck = await editContainerApiAdapter.canModifyContainer(containerId);
      this.updateViewState({ modificationPermissions: permissionCheck });

      const { container, tenants, seedTypes, availableContainers, errors } = 
        await editContainerApiAdapter.preloadFormData(containerId);

      if (!container) {
        throw new Error('Container not found');
      }

      this.domainModel = EditContainerDomainModel.fromContainerData(
        {
          id: container.id,
          name: container.name,
          tenant_id: container.tenant_id,
          type: container.type,
          purpose: container.purpose,
          seed_type_ids: container.seed_types?.map(st => st.id) || [],
          location: container.location,
          notes: container.notes,
          shadow_service_enabled: container.shadow_service_enabled,
          copied_environment_from: container.copied_environment_from,
          robotics_simulation_enabled: container.robotics_simulation_enabled,
          ecosystem_connected: container.ecosystem_connected,
          ecosystem_settings: container.ecosystem_settings as {
            fa: { environment: 'alpha' | 'prod' };
            pya: { environment: 'dev' | 'test' | 'stage' };
            aws: { environment: 'dev' | 'prod' };
            mbai: { environment: 'prod' };
          }
        },
        tenants,
        seedTypes,
        availableContainers
      );

      this.updateViewState({
        filteredSeedTypes: seedTypes,
        isLoading: false,
        isInitialized: true,
        ...this.getDerivedViewState()
      });

      if (errors.length > 0) {
        console.warn('Some data failed to load:', errors);
      }
    } catch (error) {
      this.updateViewState({ 
        isLoading: false,
        loadError: error instanceof Error ? error.message : 'Failed to load container'
      });
    }

    this.notifyListeners();
  }

  private updateFormField<K extends keyof EditContainerFormData>(
    field: K, 
    value: EditContainerFormData[K]
  ): void {
    if (this.domainModel.isFieldReadonly(field as keyof EditContainerFormData['readonly'])) {
      return;
    }

    this.domainModel = this.domainModel.withFormData({ [field]: value });
    this.updateDerivedViewState();
    this.notifyListeners();
  }

  private updateLocation(location: Partial<Location>): void {
    const currentLocation = this.domainModel.formData.location || { city: '', country: '', address: '' };
    const updatedLocation = { ...currentLocation, ...location };
    this.updateFormField('location', updatedLocation);
  }

  private updateEcosystemSettings(settings: Partial<EditContainerFormData['ecosystemSettings']>): void {
    if (this.domainModel.isFieldReadonly('ecosystemConnected')) {
      return;
    }

    const currentSettings = this.domainModel.formData.ecosystemSettings;
    const updatedSettings = { ...currentSettings, ...settings };
    this.updateFormField('ecosystemSettings', updatedSettings);
  }

  private toggleContainerType(type: 'physical' | 'virtual'): void {
    this.updateFormField('type', type);
    
    // Reset type-specific fields
    if (type === 'virtual') {
      this.updateFormField('location', null);
    } else {
      this.updateFormField('copiedEnvironmentFrom', null);
      this.updateFormField('roboticsSimulationEnabled', false);
    }
  }

  private toggleEcosystemConnection(connected: boolean): void {
    if (this.domainModel.isFieldReadonly('ecosystemConnected')) {
      return;
    }

    this.updateFormField('ecosystemConnected', connected);
    
    if (connected) {
      // Auto-select environments based on purpose
      const autoSettings = this.domainModel.getAutoSelectedEnvironments();
      this.updateFormField('ecosystemSettings', autoSettings);
    }
  }

  private addSeedType(seedTypeId: number): void {
    const currentSeedTypes = this.domainModel.formData.seedTypes;
    if (!currentSeedTypes.includes(seedTypeId)) {
      this.updateFormField('seedTypes', [...currentSeedTypes, seedTypeId]);
    }
  }

  private removeSeedType(seedTypeId: number): void {
    const currentSeedTypes = this.domainModel.formData.seedTypes;
    this.updateFormField('seedTypes', currentSeedTypes.filter(id => id !== seedTypeId));
  }

  private async searchSeedTypes(query: string): Promise<void> {
    this.updateViewState({ 
      seedTypeSearchQuery: query,
      isLoadingSeedTypes: true 
    });

    try {
      const result = await editContainerApiAdapter.searchSeedTypes(query);
      
      if (result.error) {
        console.error('Failed to search seed types:', result.error);
        this.updateViewState({ 
          filteredSeedTypes: this.domainModel.availableSeedTypes,
          isLoadingSeedTypes: false 
        });
      } else {
        this.updateViewState({ 
          filteredSeedTypes: result.seedTypes,
          isLoadingSeedTypes: false 
        });
      }
    } catch {
      console.error('Seed type search error');
      this.updateViewState({ 
        filteredSeedTypes: this.domainModel.availableSeedTypes,
        isLoadingSeedTypes: false 
      });
    }

    this.notifyListeners();
  }

  private validateForm(): void {
    const validation = this.domainModel.validateForm();
    this.domainModel = this.domainModel.withValidationErrors(validation.errors);
    this.updateViewState({ 
      hasValidationErrors: !validation.isValid,
      submitButtonDisabled: !validation.isValid || !this.domainModel.hasChanges()
    });
    this.notifyListeners();
  }

  private resetForm(): void {
    // Reset to original form data
    this.domainModel = this.domainModel.withFormData({ ...this.domainModel.originalFormData });
    this.updateDerivedViewState();
    this.notifyListeners();
  }

  private cancelChanges(): void {
    this.resetForm();
  }

  private async submitForm(): Promise<UpdateContainerResult> {
    this.updateViewState({ isSubmitting: true });

    try {
      const updateRequest = this.domainModel.toUpdateRequest();
      const result = await editContainerApiAdapter.updateContainer(this.containerId, updateRequest);
      
      this.updateViewState({ isSubmitting: false });
      
      if (result.success && result.container) {
        // Update the original form data to reflect successful save
        this.domainModel = EditContainerDomainModel.fromContainerData(
          {
            id: result.container.id,
            name: result.container.name,
            tenant_id: result.container.tenant_id,
            type: result.container.type,
            purpose: result.container.purpose,
            seed_type_ids: result.container.seed_types?.map(st => st.id) || [],
            location: result.container.location,
            notes: result.container.notes,
            shadow_service_enabled: result.container.shadow_service_enabled,
            copied_environment_from: result.container.copied_environment_from,
            robotics_simulation_enabled: result.container.robotics_simulation_enabled,
            ecosystem_connected: result.container.ecosystem_connected,
            ecosystem_settings: result.container.ecosystem_settings as {
              fa: { environment: 'alpha' | 'prod' };
              pya: { environment: 'dev' | 'test' | 'stage' };
              aws: { environment: 'dev' | 'prod' };
              mbai: { environment: 'prod' };
            }
          },
          this.domainModel.availableTenants,
          this.domainModel.availableSeedTypes,
          this.domainModel.availableContainers
        );
        this.updateDerivedViewState();
      } else if (result.validationErrors) {
        // Update domain model with server validation errors
        this.domainModel = this.domainModel.withValidationErrors(result.validationErrors);
        this.updateViewState({ hasValidationErrors: true });
      }
      
      this.notifyListeners();
      return result;
    } catch (error) {
      this.updateViewState({ isSubmitting: false });
      this.notifyListeners();
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected error occurred'
      };
    }
  }

  private handlePurposeChange(purpose: 'development' | 'research' | 'production'): void {
    this.updateFormField('purpose', purpose);
    
    // Auto-update ecosystem settings if connected and not readonly
    if (this.domainModel.formData.ecosystemConnected && 
        !this.domainModel.isFieldReadonly('ecosystemConnected')) {
      const autoSettings = this.domainModel.getAutoSelectedEnvironments();
      this.updateFormField('ecosystemSettings', autoSettings);
    }
  }

  private getDerivedViewState(): Partial<EditContainerViewState> {
    return {
      showLocationFields: this.domainModel.shouldShowLocation(),
      showVirtualSettings: this.domainModel.shouldShowVirtualSettings(),
      showEcosystemSettings: this.domainModel.shouldShowEcosystemSettings(),
      submitButtonLabel: this.domainModel.getSubmitButtonLabel(),
      submitButtonDisabled: !this.domainModel.isFormValid() || !this.domainModel.hasChanges(),
      hasChanges: this.domainModel.hasChanges()
    };
  }

  private updateDerivedViewState(): void {
    this.updateViewState(this.getDerivedViewState());
  }

  private updateViewState(updates: Partial<EditContainerViewState>): void {
    this.viewState = { ...this.viewState, ...updates };
  }

  // Observer pattern for UI updates
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  // Utility methods for UI
  getValidationErrorsForField(field: string): ValidationError[] {
    return this.domainModel.getValidationErrorsForField(field);
  }

  hasValidationErrorsForField(field: string): boolean {
    return this.domainModel.hasValidationErrorsForField(field);
  }

  getSeedTypeOptions(): SeedType[] {
    return this.viewState.filteredSeedTypes;
  }

  getSelectedSeedTypes(): SeedType[] {
    return this.domainModel.formData.seedTypes
      .map(id => this.domainModel.availableSeedTypes.find(st => st.id === id))
      .filter((st): st is SeedType => st !== undefined);
  }

  getTenantName(tenantId: number | null): string {
    if (!tenantId) return '';
    const tenant = this.domainModel.availableTenants.find(t => t.id === tenantId);
    return tenant?.name || '';
  }

  getContainerName(containerId: number | null): string {
    if (!containerId) return '';
    const container = this.domainModel.availableContainers.find(c => c.id === containerId);
    return container?.name || '';
  }

  isFieldReadonly(fieldName: keyof EditContainerFormData['readonly']): boolean {
    return this.domainModel.isFieldReadonly(fieldName);
  }

  canModifyContainer(): boolean {
    return this.viewState.modificationPermissions.canModify;
  }

  getModificationReason(): string | undefined {
    return this.viewState.modificationPermissions.reason;
  }
}