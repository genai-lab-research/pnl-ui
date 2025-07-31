// Create Container Hook
// Main hook for managing create container form state and actions

import { useState, useEffect, useCallback, useRef } from 'react';
import { CreateContainerViewModel } from '../viewmodels/create-container.viewmodel';
import { ContainerFormData, ValidationError } from '../models/create-container.model';
import { CreateContainerResult } from '../services/create-container-api.adapter';
import { SeedType, Tenant, Location } from '../../../types/containers';

export interface UseCreateContainerReturn {
  // State
  isLoading: boolean;
  isSubmitting: boolean;
  formData: ContainerFormData;
  validationErrors: ValidationError[];
  availableTenants: Tenant[];
  availableSeedTypes: SeedType[];
  availableContainers: Array<{ id: number; name: string }>;
  
  // UI state
  showLocationFields: boolean;
  showVirtualSettings: boolean;
  showEcosystemSettings: boolean;
  submitButtonLabel: string;
  submitButtonDisabled: boolean;
  
  // Display helpers
  selectedSeedTypesDisplay: string;
  locationDisplay: string;
  
  // Actions
  updateField: <K extends keyof ContainerFormData>(field: K, value: ContainerFormData[K]) => void;
  updateLocation: (location: Partial<Location>) => void;
  toggleContainerType: (type: 'physical' | 'virtual') => void;
  toggleEcosystemConnection: (connected: boolean) => void;
  addSeedType: (seedTypeId: number) => void;
  removeSeedType: (seedTypeId: number) => void;
  validateForm: () => void;
  resetForm: () => void;
  submitForm: () => Promise<CreateContainerResult>;
  
  // Validation helpers
  getFieldErrors: (field: string) => ValidationError[];
  hasFieldErrors: (field: string) => boolean;
  getSelectedSeedTypes: () => SeedType[];
  getTenantName: (tenantId: number | null) => string;
  getContainerName: (containerId: number | null) => string;
}

export function useCreateContainer(): UseCreateContainerReturn {
  const viewModelRef = useRef<CreateContainerViewModel>();
  const [, forceUpdate] = useState({});

  // Initialize ViewModel
  if (!viewModelRef.current) {
    viewModelRef.current = new CreateContainerViewModel();
  }

  const viewModel = viewModelRef.current;

  // Force re-render when ViewModel state changes
  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  // Subscribe to ViewModel changes
  useEffect(() => {
    const unsubscribe = viewModel.subscribe(triggerUpdate);
    return unsubscribe;
  }, [viewModel, triggerUpdate]);

  // Initialize form data on mount
  useEffect(() => {
    const actions = viewModel.getActions();
    actions.initializeForm();
  }, [viewModel]);

  const actions = viewModel.getActions();

  return {
    // State
    isLoading: viewModel.state.isLoading,
    isSubmitting: viewModel.state.isSubmitting,
    formData: viewModel.formData,
    validationErrors: viewModel.validationErrors,
    availableTenants: viewModel.availableTenants,
    availableSeedTypes: viewModel.availableSeedTypes,
    availableContainers: viewModel.availableContainers,
    
    // UI state
    showLocationFields: viewModel.state.showLocationFields,
    showVirtualSettings: viewModel.state.showVirtualSettings,
    showEcosystemSettings: viewModel.state.showEcosystemSettings,
    submitButtonLabel: viewModel.state.submitButtonLabel,
    submitButtonDisabled: viewModel.state.submitButtonDisabled,
    
    // Display helpers
    selectedSeedTypesDisplay: viewModel.selectedSeedTypesDisplay,
    locationDisplay: viewModel.locationDisplay,
    
    // Actions
    updateField: actions.updateFormField,
    updateLocation: actions.updateLocation,
    toggleContainerType: actions.toggleContainerType,
    toggleEcosystemConnection: actions.toggleEcosystemConnection,
    addSeedType: actions.addSeedType,
    removeSeedType: actions.removeSeedType,
    validateForm: actions.validateForm,
    resetForm: actions.resetForm,
    submitForm: actions.submitForm,
    
    // Validation helpers
    getFieldErrors: viewModel.getValidationErrorsForField.bind(viewModel),
    hasFieldErrors: viewModel.hasValidationErrorsForField.bind(viewModel),
    getSelectedSeedTypes: viewModel.getSelectedSeedTypes.bind(viewModel),
    getTenantName: viewModel.getTenantName.bind(viewModel),
    getContainerName: viewModel.getContainerName.bind(viewModel)
  };
}