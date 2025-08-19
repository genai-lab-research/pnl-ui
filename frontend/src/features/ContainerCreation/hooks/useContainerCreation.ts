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

  const validateForm = useCallback((): boolean => {
    const validation = formValidationService.validateForm(formState.data);
    
    setFormState(prev => ({
      ...prev,
      errors: validation.errors
    }));

    return validation.isValid;
  }, [formState.data]);

  const submitForm = useCallback(async (formData: ContainerFormData): Promise<Container> => {
    try {
      setFormState(prev => ({ ...prev, submitting: true, errors: {} }));

      // Validate form
      const validation = formValidationService.validateForm(formData);
      if (!validation.isValid) {
        setFormState(prev => ({
          ...prev,
          submitting: false,
          errors: validation.errors
        }));
        throw new Error('Form validation failed');
      }

      // Sanitize and submit
      const sanitizedData = formValidationService.sanitizeFormData(formData);
      const result = await containerCreationService.createContainer(sanitizedData);

      setFormState(prev => ({ ...prev, submitting: false }));
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create container';
      setFormState(prev => ({
        ...prev,
        submitting: false,
        errors: { general: errorMessage }
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
    validateForm,
    submitForm,
    resetForm,
    loadFormOptions
  };
};
