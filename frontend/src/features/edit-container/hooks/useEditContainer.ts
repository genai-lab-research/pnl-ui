// Edit Container Hook
// Main hook for container editing functionality

import { useState, useEffect, useRef } from 'react';
import { 
  EditContainerViewModel, 
  EditContainerViewState, 
  EditContainerActions 
} from '../viewmodels/edit-container.viewmodel';
import { 
  EditContainerFormData, 
  ValidationError 
} from '../models/edit-container.model';
import { SeedType, Tenant } from '../../../types/containers';

export interface UseEditContainerReturn {
  // State
  state: EditContainerViewState;
  formData: EditContainerFormData;
  availableTenants: Tenant[];
  availableSeedTypes: SeedType[];
  availableContainers: Array<{ id: number; name: string }>;
  validationErrors: ValidationError[];
  
  // Computed properties
  selectedSeedTypesDisplay: string;
  locationDisplay: string;
  changedFields: Array<keyof EditContainerFormData>;
  
  // Actions
  actions: EditContainerActions;
  
  // Utility methods
  getValidationErrorsForField: (field: string) => ValidationError[];
  hasValidationErrorsForField: (field: string) => boolean;
  getSeedTypeOptions: () => SeedType[];
  getSelectedSeedTypes: () => SeedType[];
  getTenantName: (tenantId: number | null) => string;
  getContainerName: (containerId: number | null) => string;
  isFieldReadonly: (fieldName: keyof EditContainerFormData['readonly']) => boolean;
  canModifyContainer: () => boolean;
  getModificationReason: () => string | undefined;
}

export function useEditContainer(containerId: number): UseEditContainerReturn {
  // Use ref to maintain stable viewmodel instance
  const viewModelRef = useRef<EditContainerViewModel | null>(null);
  const [, forceUpdate] = useState({});

  // Initialize viewmodel
  if (!viewModelRef.current) {
    viewModelRef.current = new EditContainerViewModel(containerId);
  }

  const viewModel = viewModelRef.current;

  // Force re-render when viewmodel notifies of changes
  useEffect(() => {
    const unsubscribe = viewModel.subscribe(() => {
      forceUpdate({});
    });

    return unsubscribe;
  }, [viewModel]);

  // Initialize form data when component mounts
  useEffect(() => {
    viewModel.getActions().initializeForm(containerId);
  }, [viewModel, containerId]);

  return {
    // State
    state: viewModel.state,
    formData: viewModel.formData,
    availableTenants: viewModel.availableTenants,
    availableSeedTypes: viewModel.availableSeedTypes,
    availableContainers: viewModel.availableContainers,
    validationErrors: viewModel.validationErrors,
    
    // Computed properties
    selectedSeedTypesDisplay: viewModel.selectedSeedTypesDisplay,
    locationDisplay: viewModel.locationDisplay,
    changedFields: viewModel.changedFields,
    
    // Actions
    actions: viewModel.getActions(),
    
    // Utility methods
    getValidationErrorsForField: viewModel.getValidationErrorsForField.bind(viewModel),
    hasValidationErrorsForField: viewModel.hasValidationErrorsForField.bind(viewModel),
    getSeedTypeOptions: viewModel.getSeedTypeOptions.bind(viewModel),
    getSelectedSeedTypes: viewModel.getSelectedSeedTypes.bind(viewModel),
    getTenantName: viewModel.getTenantName.bind(viewModel),
    getContainerName: viewModel.getContainerName.bind(viewModel),
    isFieldReadonly: viewModel.isFieldReadonly.bind(viewModel),
    canModifyContainer: viewModel.canModifyContainer.bind(viewModel),
    getModificationReason: viewModel.getModificationReason.bind(viewModel)
  };
}