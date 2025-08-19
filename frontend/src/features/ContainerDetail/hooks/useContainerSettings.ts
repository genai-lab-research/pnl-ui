// Container Settings Hook - Manages settings form and environment links
import { useState, useEffect, useCallback, useRef } from 'react';
import { ContainerSettingsViewModel } from '../viewmodels';
import { ContainerSettingsUpdateRequest } from '../../../api/containerApiService';
import { ContainerInfo } from '../../../api/containerApiService';

/**
 * Hook for container settings management
 */
export function useContainerSettings(
  containerId: number,
  containerInfo?: ContainerInfo
) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const viewModelRef = useRef<ContainerSettingsViewModel | null>(null);

  // Initialize ViewModel
  useEffect(() => {
    const viewModel = new ContainerSettingsViewModel(containerId, containerInfo);
    viewModelRef.current = viewModel;

    // Subscribe to changes
    const unsubscribe = viewModel.subscribe(() => {
      setRefreshKey(prev => prev + 1);
    });

    // Load environment links
    viewModel.loadEnvironmentLinks().finally(() => {
      setIsInitialized(true);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      viewModelRef.current = null;
    };
  }, [containerId]);

  // Update when container info changes
  useEffect(() => {
    if (containerInfo && viewModelRef.current) {
      // Re-initialize with new container info
      const viewModel = new ContainerSettingsViewModel(containerId, containerInfo);
      const oldViewModel = viewModelRef.current;
      
      viewModelRef.current = viewModel;
      
      // Transfer state if needed
      if (oldViewModel?.isEditing()) {
        viewModel.startEditing();
      }
      
      // Subscribe to new view model
      const unsubscribe = viewModel.subscribe(() => {
        setRefreshKey(prev => prev + 1);
      });

      // Load environment links
      viewModel.loadEnvironmentLinks();

      return () => {
        unsubscribe();
      };
    }
  }, [containerInfo, containerId]);

  // Actions
  const toggleEditMode = useCallback(() => {
    viewModelRef.current?.toggleEditMode();
  }, []);

  const startEditing = useCallback(() => {
    viewModelRef.current?.startEditing();
  }, []);

  const cancelEditing = useCallback(() => {
    viewModelRef.current?.cancelEditing();
  }, []);

  const updateSetting = useCallback(<K extends keyof ContainerSettingsUpdateRequest>(
    field: K,
    value: ContainerSettingsUpdateRequest[K]
  ) => {
    viewModelRef.current?.updateSetting(field, value);
  }, []);

  const saveSettings = useCallback(async (): Promise<boolean> => {
    return await viewModelRef.current?.saveSettings() || false;
  }, []);

  const updateEnvironmentLinks = useCallback(async (links: any): Promise<boolean> => {
    return await viewModelRef.current?.updateEnvironmentLinks(links) || false;
  }, []);

  // Getters
  const getSettings = useCallback(() => {
    return viewModelRef.current?.getSettings() || {};
  }, [refreshKey]);

  const getEnvironmentLinks = useCallback(() => {
    return viewModelRef.current?.getEnvironmentLinks() || null;
  }, [refreshKey]);

  const isEditing = useCallback(() => {
    return viewModelRef.current?.isEditing() || false;
  }, [refreshKey]);

  const isSaving = useCallback(() => {
    return viewModelRef.current?.isSaving() || false;
  }, [refreshKey]);

  const hasUnsavedChanges = useCallback(() => {
    return viewModelRef.current?.hasUnsavedChanges() || false;
  }, [refreshKey]);

  const getValidationErrors = useCallback(() => {
    return viewModelRef.current?.getValidationErrors() || {};
  }, [refreshKey]);

  const getContainerInfoModel = useCallback(() => {
    return viewModelRef.current?.getContainerInfoModel() || null;
  }, [refreshKey]);

  const getEnvironmentStatus = useCallback(() => {
    return viewModelRef.current?.getEnvironmentStatus() || [];
  }, [refreshKey]);

  const isFormValid = useCallback(() => {
    return viewModelRef.current?.isFormValid() || false;
  }, [refreshKey]);

  const getFormActions = useCallback(() => {
    return viewModelRef.current?.getFormActions() || {
      canSave: false,
      canCancel: false,
      canEdit: false,
      onSave: async () => false,
      onCancel: () => {},
      onEdit: () => {},
      isSaving: false,
    };
  }, [refreshKey]);

  // Field props generators for easy form binding
  const getFieldProps = useCallback(<K extends keyof ContainerSettingsUpdateRequest>(field: K) => {
    return viewModelRef.current?.getFieldProps(field) || {
      value: '',
      onChange: () => {},
      error: '',
      disabled: true,
    };
  }, [refreshKey]);

  // Convenience field getters
  const tenantFieldProps = getFieldProps('tenant_id');
  const purposeFieldProps = getFieldProps('purpose');
  const locationFieldProps = getFieldProps('location');
  const notesFieldProps = getFieldProps('notes');
  const shadowServiceFieldProps = getFieldProps('shadow_service_enabled');
  const roboticsFieldProps = getFieldProps('robotics_simulation_enabled');
  const ecosystemFieldProps = getFieldProps('ecosystem_connected');
  const ecosystemSettingsFieldProps = getFieldProps('ecosystem_settings');

  // Environment link management
  const connectService = useCallback(async (service: string, config: any) => {
    const currentLinks = getEnvironmentLinks();
    if (currentLinks) {
      const updatedLinks = { ...currentLinks, [service]: config };
      return await updateEnvironmentLinks(updatedLinks);
    }
    return false;
  }, [getEnvironmentLinks, updateEnvironmentLinks]);

  const disconnectService = useCallback(async (service: string) => {
    const currentLinks = getEnvironmentLinks();
    if (currentLinks) {
      const updatedLinks = { ...currentLinks, [service]: {} };
      return await updateEnvironmentLinks(updatedLinks);
    }
    return false;
  }, [getEnvironmentLinks, updateEnvironmentLinks]);

  // Form validation helpers
  const validateField = useCallback((field: keyof ContainerSettingsUpdateRequest) => {
    const errors = getValidationErrors();
    return errors[field] || null;
  }, [getValidationErrors]);

  const hasFieldError = useCallback((field: keyof ContainerSettingsUpdateRequest) => {
    return !!validateField(field);
  }, [validateField]);

  return {
    // State
    isInitialized,
    
    // Actions
    toggleEditMode,
    startEditing,
    cancelEditing,
    updateSetting,
    saveSettings,
    updateEnvironmentLinks,
    connectService,
    disconnectService,
    
    // Data
    settings: getSettings(),
    environmentLinks: getEnvironmentLinks(),
    containerInfoModel: getContainerInfoModel(),
    environmentStatus: getEnvironmentStatus(),
    validationErrors: getValidationErrors(),
    formActions: getFormActions(),
    
    // Field props for form binding
    fieldProps: {
      tenant_id: tenantFieldProps,
      purpose: purposeFieldProps,
      location: locationFieldProps,
      notes: notesFieldProps,
      shadow_service_enabled: shadowServiceFieldProps,
      robotics_simulation_enabled: roboticsFieldProps,
      ecosystem_connected: ecosystemFieldProps,
      ecosystem_settings: ecosystemSettingsFieldProps,
    },
    
    // State flags
    isEditing: isEditing(),
    isSaving: isSaving(),
    hasUnsavedChanges: hasUnsavedChanges(),
    isFormValid: isFormValid(),
    
    // Validation helpers
    validateField,
    hasFieldError,
    hasValidationErrors: Object.keys(getValidationErrors()).length > 0,
    
    // Environment status
    hasEnvironmentLinks: getEnvironmentLinks() !== null,
    connectedServices: getEnvironmentStatus().filter(s => s.connected).length,
    totalServices: getEnvironmentStatus().length,
    
    // Utility
    canSave: getFormActions().canSave,
    canCancel: getFormActions().canCancel,
    canEdit: getFormActions().canEdit && !isSaving(),
    shouldShowUnsavedWarning: hasUnsavedChanges() && !isSaving(),
  };
}
