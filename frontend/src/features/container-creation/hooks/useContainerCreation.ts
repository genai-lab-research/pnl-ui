import { useState, useEffect, useCallback } from 'react';
import { 
  ContainerFormState, 
  ContainerFormData, 
  ContainerFormOptions,
  ContainerFormErrors 
} from '../types';
import { 
  containerCreationService, 
  formValidationService 
} from '../services';
import { Container } from '../../../types/containers';
import { useAuthState } from '../../../context/AuthContext';

export const useContainerCreation = () => {
  const authState = useAuthState();
  const [formState, setFormState] = useState<ContainerFormState>({
    data: containerCreationService.getDefaultFormData(),
    errors: {},
    loading: true,
    submitting: false,
    options: {
      tenants: [],
      purposes: [],
      seedTypes: [],
      virtualContainers: []
    }
  });

  // Load form options when authenticated
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      loadFormOptions();
    }
  }, [authState.isAuthenticated, authState.isLoading]);

  const loadFormOptions = useCallback(async () => {
    try {
      setFormState(prev => ({ ...prev, loading: true, errors: {} }));
      const options = await containerCreationService.loadFormOptions();
      setFormState(prev => ({ 
        ...prev, 
        options, 
        loading: false 
      }));
    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        loading: false,
        errors: { 
          general: 'Failed to load form options. Please try again.' 
        }
      }));
    }
  }, []);

  const updateFormData = useCallback((updates: Partial<ContainerFormData>) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, ...updates },
      errors: { ...prev.errors, general: undefined } // Clear general errors when user makes changes
    }));
  }, []);

  const updateContainerType = useCallback((type: 'physical' | 'virtual') => {
    setFormState(prev => {
      const newData = { ...prev.data, type };
      
      // Reset virtual-specific fields when changing to physical
      if (type === 'physical') {
        newData.copied_environment_from = null;
        newData.robotics_simulation_enabled = false;
      }
      
      // Clear location errors when changing to virtual
      const newErrors = { ...prev.errors };
      if (type === 'virtual') {
        delete newErrors.location;
      }

      return {
        ...prev,
        data: newData,
        errors: newErrors
      };
    });
  }, []);

  const updateEcosystemSettings = useCallback((connected: boolean, purpose?: string) => {
    setFormState(prev => {
      let newEcosystemSettings = prev.data.ecosystem_settings;
      
      if (connected && purpose) {
        newEcosystemSettings = containerCreationService.getEnvironmentSettingsForPurpose(purpose);
      } else if (!connected) {
        newEcosystemSettings = {
          fa: null,
          pya: null,
          aws: null,
          mbai: 'prod'
        };
      }

      return {
        ...prev,
        data: {
          ...prev.data,
          ecosystem_connected: connected,
          ecosystem_settings: newEcosystemSettings
        }
      };
    });
  }, []);

  const copyEnvironmentFromContainer = useCallback(async (containerId: number) => {
    try {
      const environmentSettings = await containerCreationService.copyEnvironmentFromContainer(containerId);
      
      setFormState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          ...environmentSettings
        }
      }));
    } catch (error) {
      console.error('Failed to copy environment settings:', error);
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          general: 'Failed to copy environment settings from the selected container'
        }
      }));
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    const validation = formValidationService.validateForm(formState.data);
    
    setFormState(prev => ({
      ...prev,
      errors: validation.errors
    }));

    return validation.isValid;
  }, [formState.data]);

  const validateFormAsync = useCallback(async (): Promise<boolean> => {
    const validation = await formValidationService.validateFormAsync(formState.data);
    
    setFormState(prev => ({
      ...prev,
      errors: validation.errors
    }));

    return validation.isValid;
  }, [formState.data]);

  const submitForm = useCallback(async (formData: ContainerFormData): Promise<Container> => {
    try {
      setFormState(prev => ({ ...prev, submitting: true, errors: {} }));

      // Validate form (sync validation only - async validation disabled due to backend endpoint issues)
      const validation = formValidationService.validateForm(formData);
      if (!validation.isValid) {
        setFormState(prev => ({
          ...prev,
          submitting: false,
          errors: validation.errors
        }));
        // Don't throw error - let the validation errors show in the UI
        return Promise.reject(new Error('Please fix the validation errors above'));
      }

      // Sanitize and submit
      const sanitizedData = formValidationService.sanitizeFormData(formData);
      
      const result = await containerCreationService.createContainer(sanitizedData);

      setFormState(prev => ({ ...prev, submitting: false }));
      return result;

    } catch (error) {
      console.error('Container creation failed:', error);
      
      let errorMessage = 'Failed to create container';
      let fieldErrors: Record<string, string> = {};
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Parse backend validation errors for specific fields
        const msg = error.message.toLowerCase();
        if (msg.includes("already exists") && msg.includes('container')) {
          fieldErrors.name = 'A container with this name already exists. Please choose a different name.';
        } else if (msg.includes("invalid value") && msg.includes("name")) {
          fieldErrors.name = 'Invalid container name. Please use letters, numbers, spaces, hyphens, underscores, or apostrophes.';
        } else if (msg.includes('name')) {
          fieldErrors.name = 'Container name is invalid. Please adjust and try again.';
        }
      }
      
      setFormState(prev => ({
        ...prev,
        submitting: false,
        errors: Object.keys(fieldErrors).length > 0 ? fieldErrors : { general: errorMessage }
      }));
      
      throw error;
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      data: containerCreationService.getDefaultFormData(),
      errors: {}
    }));
  }, []);

  return {
    formState,
    updateFormData,
    updateContainerType,
    updateEcosystemSettings,
    copyEnvironmentFromContainer,
    validateForm,
    validateFormAsync,
    submitForm,
    resetForm,
    loadFormOptions
  };
};
