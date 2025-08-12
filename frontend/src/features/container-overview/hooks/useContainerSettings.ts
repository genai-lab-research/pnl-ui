// Custom hook for Container Settings logic
// Manages settings editing, validation, and environment links

import { useState, useEffect, useCallback, useRef } from 'react';
import { SettingsViewModel, SettingsState } from '../viewmodels/settings.viewmodel';
import { ContainerSettings, EnvironmentLinks, SettingsValidationError } from '../models/settings.model';

export interface UseContainerSettingsOptions {
  containerId: number;
  onSaveSuccess?: () => void;
  onSaveError?: (error: string) => void;
  onValidationError?: (errors: SettingsValidationError[]) => void;
}

export interface UseContainerSettingsResult {
  // State
  state: SettingsState;
  
  // Actions
  refreshData: () => Promise<void>;
  enterEditMode: () => void;
  exitEditMode: () => void;
  toggleEditMode: () => void;
  updateSetting: <K extends keyof ContainerSettings>(field: K, value: ContainerSettings[K]) => void;
  updateLocation: (location: ContainerSettings['location']) => void;
  updateNotes: (notes: string) => void;
  updatePurpose: (purpose: ContainerSettings['purpose']) => void;
  toggleShadowService: () => void;
  toggleRoboticsSimulation: () => void;
  toggleEcosystemConnection: () => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
  updateEnvironmentLink: (service: keyof Omit<EnvironmentLinks, 'container_id'>, config: Record<string, any>) => void;
  saveEnvironmentLinks: () => Promise<void>;
  testEnvironmentConnection: (service: keyof Omit<EnvironmentLinks, 'container_id'>) => Promise<{ connected: boolean; error?: string }>;
  
  // Data access
  settings: ContainerSettings | null;
  environmentLinks: EnvironmentLinks | null;
  validationErrors: SettingsValidationError[];
  
  // UI helpers
  purposeOptions: Array<{ value: ContainerSettings['purpose']; label: string }>;
  locationDisplayString: string;
  formattedSettings: ReturnType<SettingsViewModel['getFormattedSettings']>;
  connectedServices: string[];
  ecosystemHealthStatus: 'healthy' | 'partial' | 'disconnected';
  ecosystemHealthColor: 'success' | 'warning' | 'error';
  serviceDisplayInfo: ReturnType<SettingsViewModel['getServiceDisplayInfo']>;
  getFieldError: (field: string) => string | null;
  
  // State checks
  hasUnsavedChanges: boolean;
  isInEditMode: boolean;
  isSaving: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
  canEditSettings: boolean;
  canManageEcosystem: boolean;
}

export function useContainerSettings(options: UseContainerSettingsOptions): UseContainerSettingsResult {
  const { containerId, onSaveSuccess, onSaveError, onValidationError } = options;

  const viewModelRef = useRef<SettingsViewModel | null>(null);
  const [state, setState] = useState<SettingsState>({
    settings: null,
    originalSettings: null,
    environmentLinks: null,
    isEditMode: false,
    isSaving: false,
    hasUnsavedChanges: false,
    validationErrors: [],
    isLoading: true,
    error: null,
    permissions: { canEdit: true, canManage: true }
  });

  // Initialize ViewModel
  useEffect(() => {
    const viewModel = new SettingsViewModel(containerId);
    viewModelRef.current = viewModel;

    // Set up state change listener
    viewModel.setStateChangeListener((newState) => {
      setState(newState);
      
      // Trigger validation error callback if there are errors
      if (onValidationError && newState.validationErrors.length > 0) {
        onValidationError(newState.validationErrors);
      }
    });

    // Initialize data
    viewModel.initialize().catch((error) => {
      console.error('Failed to initialize container settings:', error);
      if (onSaveError) {
        onSaveError(error.message);
      }
    });

    // Cleanup on unmount
    return () => {
      viewModel.destroy();
    };
  }, [containerId]); // FIXED: Only depend on containerId to prevent re-initialization

  // Actions
  const refreshData = useCallback(async () => {
    if (viewModelRef.current) {
      await viewModelRef.current.refreshData();
    }
  }, []);

  const enterEditMode = useCallback(() => {
    if (viewModelRef.current) {
      viewModelRef.current.enterEditMode();
    }
  }, []);

  const exitEditMode = useCallback(() => {
    if (viewModelRef.current) {
      viewModelRef.current.exitEditMode();
    }
  }, []);

  const toggleEditMode = useCallback(() => {
    if (viewModelRef.current) {
      viewModelRef.current.toggleEditMode();
    }
  }, []);

  const updateSetting = useCallback(<K extends keyof ContainerSettings>(
    field: K, 
    value: ContainerSettings[K]
  ) => {
    if (viewModelRef.current) {
      viewModelRef.current.updateSetting(field, value);
    }
  }, []);

  const updateLocation = useCallback((location: ContainerSettings['location']) => {
    if (viewModelRef.current) {
      viewModelRef.current.updateLocation(location);
    }
  }, []);

  const updateNotes = useCallback((notes: string) => {
    if (viewModelRef.current) {
      viewModelRef.current.updateNotes(notes);
    }
  }, []);

  const updatePurpose = useCallback((purpose: ContainerSettings['purpose']) => {
    if (viewModelRef.current) {
      viewModelRef.current.updatePurpose(purpose);
    }
  }, []);

  const toggleShadowService = useCallback(() => {
    if (viewModelRef.current) {
      viewModelRef.current.toggleShadowService();
    }
  }, []);

  const toggleRoboticsSimulation = useCallback(() => {
    if (viewModelRef.current) {
      viewModelRef.current.toggleRoboticsSimulation();
    }
  }, []);

  const toggleEcosystemConnection = useCallback(() => {
    if (viewModelRef.current) {
      viewModelRef.current.toggleEcosystemConnection();
    }
  }, []);

  const saveSettings = useCallback(async () => {
    if (viewModelRef.current) {
      try {
        await viewModelRef.current.saveSettings();
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      } catch (error) {
        console.error('Failed to save settings:', error);
        if (onSaveError) {
          onSaveError(error instanceof Error ? error.message : 'Failed to save settings');
        }
      }
    }
  }, [onSaveSuccess, onSaveError]);

  const resetSettings = useCallback(() => {
    if (viewModelRef.current) {
      viewModelRef.current.resetSettings();
    }
  }, []);

  const updateEnvironmentLink = useCallback((
    service: keyof Omit<EnvironmentLinks, 'container_id'>,
    config: Record<string, any>
  ) => {
    if (viewModelRef.current) {
      viewModelRef.current.updateEnvironmentLink(service, config);
    }
  }, []);

  const saveEnvironmentLinks = useCallback(async () => {
    if (viewModelRef.current) {
      try {
        await viewModelRef.current.saveEnvironmentLinks();
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      } catch (error) {
        console.error('Failed to save environment links:', error);
        if (onSaveError) {
          onSaveError(error instanceof Error ? error.message : 'Failed to save environment links');
        }
      }
    }
  }, [onSaveSuccess, onSaveError]);

  const testEnvironmentConnection = useCallback(async (
    service: keyof Omit<EnvironmentLinks, 'container_id'>
  ) => {
    if (viewModelRef.current) {
      return await viewModelRef.current.testEnvironmentConnection(service);
    }
    return { connected: false, error: 'ViewModel not initialized' };
  }, []);

  // Data access
  const settings = viewModelRef.current?.getSettings() || null;
  const environmentLinks = viewModelRef.current?.getEnvironmentLinks() || null;
  const validationErrors = viewModelRef.current?.getValidationErrors() || [];

  // UI helpers
  const purposeOptions = viewModelRef.current?.getPurposeOptions() || [];
  const locationDisplayString = viewModelRef.current?.getLocationDisplayString() || '';
  const formattedSettings = viewModelRef.current?.getFormattedSettings() || null;
  const connectedServices = viewModelRef.current?.getConnectedServices() || [];
  const ecosystemHealthStatus = viewModelRef.current?.getEcosystemHealthStatus() || 'disconnected';
  const ecosystemHealthColor = viewModelRef.current?.getEcosystemHealthColor() || 'error';
  const serviceDisplayInfo = viewModelRef.current?.getServiceDisplayInfo() || [];

  const getFieldError = useCallback((field: string) => {
    return viewModelRef.current?.getFieldError(field) || null;
  }, [validationErrors]);

  // State checks
  const hasUnsavedChanges = viewModelRef.current?.hasUnsavedChanges() || false;
  const isInEditMode = viewModelRef.current?.isInEditMode() || false;
  const isSaving = viewModelRef.current?.isSaving() || false;
  const isLoading = state.isLoading;
  const hasError = viewModelRef.current?.hasError() || false;
  const errorMessage = viewModelRef.current?.getErrorMessage() || null;
  const canEditSettings = viewModelRef.current?.canEditSettings() || false;
  const canManageEcosystem = viewModelRef.current?.canManageEcosystem() || false;

  return {
    // State
    state,
    
    // Actions
    refreshData,
    enterEditMode,
    exitEditMode,
    toggleEditMode,
    updateSetting,
    updateLocation,
    updateNotes,
    updatePurpose,
    toggleShadowService,
    toggleRoboticsSimulation,
    toggleEcosystemConnection,
    saveSettings,
    resetSettings,
    updateEnvironmentLink,
    saveEnvironmentLinks,
    testEnvironmentConnection,
    
    // Data access
    settings,
    environmentLinks,
    validationErrors,
    
    // UI helpers
    purposeOptions,
    locationDisplayString,
    formattedSettings,
    connectedServices,
    ecosystemHealthStatus,
    ecosystemHealthColor,
    serviceDisplayInfo,
    getFieldError,
    
    // State checks
    hasUnsavedChanges,
    isInEditMode,
    isSaving,
    isLoading,
    hasError,
    errorMessage,
    canEditSettings,
    canManageEcosystem
  };
}

// Hook for settings form validation
export function useSettingsValidation(
  settings: ContainerSettings | null,
  validationErrors: SettingsValidationError[]
) {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setIsValid(validationErrors.length === 0);
  }, [validationErrors]);

  const getFieldErrors = useCallback((field: string) => {
    return validationErrors
      .filter(error => error.field === field || error.field.startsWith(`${field}.`))
      .map(error => error.message);
  }, [validationErrors]);

  const hasFieldError = useCallback((field: string) => {
    return getFieldErrors(field).length > 0;
  }, [getFieldErrors]);

  const getFirstFieldError = useCallback((field: string) => {
    const errors = getFieldErrors(field);
    return errors.length > 0 ? errors[0] : null;
  }, [getFieldErrors]);

  return {
    isValid,
    getFieldErrors,
    hasFieldError,
    getFirstFieldError
  };
}

// Hook for ecosystem service management
export function useEcosystemServices(
  environmentLinks: EnvironmentLinks | null,
  onServiceUpdate: (service: string, config: Record<string, any>) => void,
  onConnectionTest: (service: string) => Promise<{ connected: boolean; error?: string }>
) {
  const [testResults, setTestResults] = useState<Record<string, { connected: boolean; error?: string; testing: boolean }>>({});

  const testService = useCallback(async (service: string) => {
    setTestResults(prev => ({
      ...prev,
      [service]: { ...prev[service], testing: true }
    }));

    try {
      const result = await onConnectionTest(service);
      setTestResults(prev => ({
        ...prev,
        [service]: { ...result, testing: false }
      }));
      return result;
    } catch (error) {
      const errorResult = { connected: false, error: 'Test failed', testing: false };
      setTestResults(prev => ({
        ...prev,
        [service]: errorResult
      }));
      return errorResult;
    }
  }, [onConnectionTest]);

  const testAllServices = useCallback(async () => {
    if (!environmentLinks) return;

    const services = ['fa', 'pya', 'aws', 'mbai', 'fh'];
    const promises = services.map(service => testService(service));
    
    await Promise.all(promises);
  }, [environmentLinks, testService]);

  const getServiceStatus = useCallback((service: string) => {
    return testResults[service] || { connected: false, testing: false };
  }, [testResults]);

  return {
    testResults,
    testService,
    testAllServices,
    getServiceStatus
  };
}
