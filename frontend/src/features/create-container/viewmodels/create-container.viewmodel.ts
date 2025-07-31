// Create Container ViewModel
// Manages state and coordinates between domain models and UI components

import { 
  CreateContainerDomainModel, 
  ContainerFormData, 
  ValidationError 
} from '../models/create-container.model';
import { 
  createContainerApiAdapter,
  CreateContainerResult,
  NameValidationApiResult
} from '../services/create-container-api.adapter';
import { Location, SeedType, Tenant } from '../../../types/containers';

export interface CreateContainerViewState {
  isLoading: boolean;
  isSubmitting: boolean;
  isValidatingName: boolean;
  isLoadingTenants: boolean;
  isLoadingSeedTypes: boolean;
  isLoadingContainers: boolean;
  showLocationFields: boolean;
  showVirtualSettings: boolean;
  showEcosystemSettings: boolean;
  submitButtonLabel: string;
  submitButtonDisabled: boolean;
  hasValidationErrors: boolean;
  nameValidationResult: NameValidationApiResult | null;
  seedTypeSearchQuery: string;
  filteredSeedTypes: SeedType[];
}

export interface CreateContainerActions {
  initializeForm: () => Promise<void>;
  updateFormField: <K extends keyof ContainerFormData>(field: K, value: ContainerFormData[K]) => void;
  updateLocation: (location: Partial<Location>) => void;
  updateEcosystemSettings: (settings: Partial<ContainerFormData['ecosystemSettings']>) => void;
  toggleContainerType: (type: 'physical' | 'virtual') => void;
  toggleEcosystemConnection: (connected: boolean) => void;
  addSeedType: (seedTypeId: number) => void;
  removeSeedType: (seedTypeId: number) => void;
  searchSeedTypes: (query: string) => Promise<void>;
  validateContainerName: (name: string) => Promise<void>;
  validateForm: () => void;
  resetForm: () => void;
  submitForm: () => Promise<CreateContainerResult>;
  handlePurposeChange: (purpose: 'development' | 'research' | 'production') => void;
}

export class CreateContainerViewModel {
  private domainModel: CreateContainerDomainModel;
  private viewState: CreateContainerViewState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.domainModel = CreateContainerDomainModel.createDefault();
    this.viewState = this.createInitialViewState();
  }

  private createInitialViewState(): CreateContainerViewState {
    return {
      isLoading: false,
      isSubmitting: false,
      isValidatingName: false,
      isLoadingTenants: false,
      isLoadingSeedTypes: false,
      isLoadingContainers: false,
      showLocationFields: this.domainModel.shouldShowLocation(),
      showVirtualSettings: this.domainModel.shouldShowVirtualSettings(),
      showEcosystemSettings: this.domainModel.shouldShowEcosystemSettings(),
      submitButtonLabel: this.domainModel.getSubmitButtonLabel(),
      submitButtonDisabled: !this.domainModel.isFormValid(),
      hasValidationErrors: false,
      nameValidationResult: null,
      seedTypeSearchQuery: '',
      filteredSeedTypes: []
    };
  }

  // Getters for UI binding
  get state(): CreateContainerViewState {
    return { ...this.viewState };
  }

  get formData(): ContainerFormData {
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

  // Actions
  getActions(): CreateContainerActions {
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
      validateContainerName: this.validateContainerName.bind(this),
      validateForm: this.validateForm.bind(this),
      resetForm: this.resetForm.bind(this),
      submitForm: this.submitForm.bind(this),
      handlePurposeChange: this.handlePurposeChange.bind(this)
    };
  }

  private async initializeForm(): Promise<void> {
    this.updateViewState({ isLoading: true });

    try {
      const { tenants, seedTypes, availableContainers, errors } = 
        await createContainerApiAdapter.preloadFormData();

      this.domainModel = this.domainModel
        .withTenants(tenants)
        .withSeedTypes(seedTypes)
        .withAvailableContainers(availableContainers);

      this.updateViewState({
        filteredSeedTypes: seedTypes,
        isLoading: false
      });

      if (errors.length > 0) {
        console.warn('Some data failed to load:', errors);
      }
    } catch {
      this.updateViewState({ isLoading: false });
      console.error('Failed to initialize form');
    }

    this.notifyListeners();
  }

  private updateFormField<K extends keyof ContainerFormData>(
    field: K, 
    value: ContainerFormData[K]
  ): void {
    this.domainModel = this.domainModel.withFormData({ [field]: value });
    this.updateDerivedViewState();
    this.notifyListeners();
  }

  private updateLocation(location: Partial<Location>): void {
    const currentLocation = this.domainModel.formData.location || { city: '', country: '', address: '' };
    const updatedLocation = { ...currentLocation, ...location };
    this.updateFormField('location', updatedLocation);
  }

  private updateEcosystemSettings(settings: Partial<ContainerFormData['ecosystemSettings']>): void {
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
      const result = await createContainerApiAdapter.searchSeedTypes(query);
      
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

  private async validateContainerName(name: string): Promise<void> {
    if (!name.trim()) {
      this.updateViewState({ nameValidationResult: null });
      return;
    }

    this.updateViewState({ isValidatingName: true });

    try {
      const result = await createContainerApiAdapter.validateContainerName(name);
      this.updateViewState({ 
        nameValidationResult: result,
        isValidatingName: false 
      });
    } catch {
      this.updateViewState({ 
        nameValidationResult: null,
        isValidatingName: false 
      });
    }

    this.notifyListeners();
  }

  private validateForm(): void {
    const validation = this.domainModel.validateForm();
    this.domainModel = this.domainModel.withValidationErrors(validation.errors);
    this.updateViewState({ 
      hasValidationErrors: !validation.isValid,
      submitButtonDisabled: !validation.isValid
    });
    this.notifyListeners();
  }

  private resetForm(): void {
    this.domainModel = CreateContainerDomainModel.createDefault()
      .withTenants(this.domainModel.availableTenants)
      .withSeedTypes(this.domainModel.availableSeedTypes)
      .withAvailableContainers(this.domainModel.availableContainers);
    
    this.updateViewState({
      ...this.createInitialViewState(),
      isLoading: false,
      filteredSeedTypes: this.domainModel.availableSeedTypes
    });
    
    this.notifyListeners();
  }

  private async submitForm(): Promise<CreateContainerResult> {
    this.updateViewState({ isSubmitting: true });

    try {
      const createRequest = this.domainModel.toCreateRequest();
      const result = await createContainerApiAdapter.createContainer(createRequest);
      
      this.updateViewState({ isSubmitting: false });
      
      if (result.success) {
        // Reset form on successful creation
        this.resetForm();
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
    
    // Auto-update ecosystem settings if connected
    if (this.domainModel.formData.ecosystemConnected) {
      const autoSettings = this.domainModel.getAutoSelectedEnvironments();
      this.updateFormField('ecosystemSettings', autoSettings);
    }
  }

  private updateDerivedViewState(): void {
    this.updateViewState({
      showLocationFields: this.domainModel.shouldShowLocation(),
      showVirtualSettings: this.domainModel.shouldShowVirtualSettings(),
      showEcosystemSettings: this.domainModel.shouldShowEcosystemSettings(),
      submitButtonLabel: this.domainModel.getSubmitButtonLabel(),
      submitButtonDisabled: !this.domainModel.isFormValid()
    });
  }

  private updateViewState(updates: Partial<CreateContainerViewState>): void {
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
}