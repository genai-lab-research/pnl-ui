import { useState, useEffect, useCallback } from 'react';
import { 
  ContainerEditFormState, 
  ContainerEditFormData, 
  ContainerEditFormOptions,
  ContainerEditFormErrors 
} from '../types';
import { 
  containerEditService, 
  formValidationService 
} from '../services';
import { Container } from '../../../types/containers';
import { useAuth } from '../../../context/AuthContext';

export const useContainerEdit = (containerId?: number) => {
  const { authState } = useAuth();
  const [formState, setFormState] = useState<ContainerEditFormState>({
    data: {
      ...containerEditService.getDefaultFormData(),
      container_id: containerId || 0
    },
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

  const loadContainerAndOptions = useCallback(async (id: number) => {
    try {
      setFormState(prev => ({ ...prev, loading: true, errors: {} }));
      
      // Load both container data and form options in parallel
      const [container, options] = await Promise.all([
        containerEditService.getContainer(id),
        containerEditService.loadFormOptions()
      ]);

      const formData = containerEditService.populateFormFromContainer(container);
      
      setFormState(prev => ({ 
        ...prev, 
        data: formData,
        options, 
        loading: false 
      }));
    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        loading: false,
        errors: { 
          general: 'Failed to load container details. Please try again.' 
        }
      }));
    }
  }, []);

  const loadFormOptions = useCallback(async () => {
    try {
      setFormState(prev => ({ ...prev, loading: true, errors: {} }));
      const options = await containerEditService.loadFormOptions();
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

  // Load container data and form options only after authentication
  useEffect(() => {
    // Wait for authentication to complete before making API calls
    if (!authState.isAuthenticated || authState.isLoading) {
      console.log('⏳ Waiting for authentication...', {
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading
      });
      return;
    }

    console.log('✅ Authentication ready, loading form options...');
    if (containerId) {
      loadContainerAndOptions(containerId);
    } else {
      loadFormOptions();
    }
  }, [containerId, authState.isAuthenticated, authState.isLoading, loadContainerAndOptions, loadFormOptions]);

  const updateFormData = useCallback((updates: Partial<ContainerEditFormData>) => {
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
      
      // Only allow changing if not already connected to ecosystem
      if (!prev.data.original_ecosystem_connected) {
        if (connected && purpose) {
          newEcosystemSettings = containerEditService.getEnvironmentSettingsForPurpose(purpose);
        } else if (!connected) {
          newEcosystemSettings = {
            fa: null,
            pya: null,
            aws: null,
            mbai: 'prod'
          };
        }
      }

      return {
        ...prev,
        data: {
          ...prev.data,
          ecosystem_connected: prev.data.original_ecosystem_connected ? prev.data.original_ecosystem_connected : connected,
          ecosystem_settings: newEcosystemSettings
        }
      };
    });
  }, []);

  const copyEnvironmentFromContainer = useCallback(async (containerId: number) => {
    try {
      const environmentSettings = await containerEditService.copyEnvironmentFromContainer(containerId);
      
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

  const submitForm = useCallback(async (formData: ContainerEditFormData): Promise<Container> => {
    try {
      console.log('🚀 Starting container update...', { containerId: formData.container_id, formData });
      setFormState(prev => ({ ...prev, submitting: true, errors: {} }));

      // Validate form
      const validation = formValidationService.validateForm(formData);
      console.log('📋 Form validation result:', validation);
      
      if (!validation.isValid) {
        console.log('❌ Form validation failed:', validation.errors);
        setFormState(prev => ({
          ...prev,
          submitting: false,
          errors: validation.errors
        }));
        throw new Error('Form validation failed');
      }

      // Sanitize and submit
      const sanitizedData = formValidationService.sanitizeFormData(formData);
      console.log('🧹 Sanitized data:', sanitizedData);
      
      const result = await containerEditService.updateContainer(sanitizedData);
      console.log('✅ Container update successful:', result);

      setFormState(prev => ({ ...prev, submitting: false }));
      return result;

    } catch (error) {
      console.error('❌ Container update failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update container';
      setFormState(prev => ({
        ...prev,
        submitting: false,
        errors: { general: errorMessage }
      }));
      throw error;
    }
  }, []);

  const resetForm = useCallback((containerId?: number) => {
    if (containerId) {
      loadContainerAndOptions(containerId);
    } else {
      setFormState(prev => ({
        ...prev,
        data: {
          ...containerEditService.getDefaultFormData(),
          container_id: prev.data.container_id
        },
        errors: {}
      }));
    }
  }, [loadContainerAndOptions]);

  return {
    formState,
    updateFormData,
    updateContainerType,
    updateEcosystemSettings,
    copyEnvironmentFromContainer,
    validateForm,
    submitForm,
    resetForm,
    loadContainerAndOptions,
    loadFormOptions
  };
};
