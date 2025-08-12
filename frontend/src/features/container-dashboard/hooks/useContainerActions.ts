// Container Actions Hook
// Provides container CRUD operations with optimistic updates

import { useState, useCallback } from 'react';
import { containerApiAdapter } from '../services';
import { ContainerDomainModel } from '../models';

export interface UseContainerActionsReturn {
  // State
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isShuttingDown: boolean;
  actionError: string | null;
  
  // Actions
  createContainer: (data: any) => Promise<{ success: boolean; container?: ContainerDomainModel; error?: string }>;
  updateContainer: (id: number, data: any) => Promise<{ success: boolean; container?: ContainerDomainModel; error?: string }>;
  deleteContainer: (id: number) => Promise<{ success: boolean; error?: string }>;
  shutdownContainer: (id: number, reason?: string) => Promise<{ success: boolean; error?: string }>;
  
  // Batch operations
  batchUpdateContainers: (updates: Array<{ id: number; data: any }>) => Promise<{
    successes: ContainerDomainModel[];
    failures: Array<{ id: number; error: string }>;
  }>;
  
  // Utility
  clearError: () => void;
  isAnyActionInProgress: () => boolean;
}

export function useContainerActions(): UseContainerActionsReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  
  const createContainer = useCallback(async (data: any) => {
    if (isCreating) {
      return { success: false, error: 'Create operation already in progress' };
    }
    
    try {
      setIsCreating(true);
      setActionError(null);
      
      const result = await containerApiAdapter.createContainer(data);
      
      if (!result.success) {
        setActionError(result.error || 'Failed to create container');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create container';
      setActionError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsCreating(false);
    }
  }, [isCreating]);
  
  const updateContainer = useCallback(async (id: number, data: any) => {
    if (isUpdating) {
      return { success: false, error: 'Update operation already in progress' };
    }
    
    try {
      setIsUpdating(true);
      setActionError(null);
      
      const result = await containerApiAdapter.updateContainer(id, data);
      
      if (!result.success) {
        setActionError(result.error || 'Failed to update container');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update container';
      setActionError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  }, [isUpdating]);
  
  const deleteContainer = useCallback(async (id: number) => {
    if (isDeleting) {
      return { success: false, error: 'Delete operation already in progress' };
    }
    
    try {
      setIsDeleting(true);
      setActionError(null);
      
      const result = await containerApiAdapter.deleteContainer(id);
      
      if (!result.success) {
        setActionError(result.error || 'Failed to delete container');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete container';
      setActionError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting]);
  
  const shutdownContainer = useCallback(async (id: number, reason?: string) => {
    if (isShuttingDown) {
      return { success: false, error: 'Shutdown operation already in progress' };
    }
    
    try {
      setIsShuttingDown(true);
      setActionError(null);
      
      const result = await containerApiAdapter.shutdownContainer(id, { reason });
      
      if (!result.success) {
        setActionError(result.error || 'Failed to shutdown container');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to shutdown container';
      setActionError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsShuttingDown(false);
    }
  }, [isShuttingDown]);
  
  const batchUpdateContainers = useCallback(async (updates: Array<{ id: number; data: any }>) => {
    try {
      setIsUpdating(true);
      setActionError(null);
      
      const result = await containerApiAdapter.batchUpdateContainers(updates);
      
      if (result.failures.length > 0) {
        const errorMessages = result.failures.map(f => `Container ${f.id}: ${f.error}`).join(', ');
        setActionError(`Some updates failed: ${errorMessages}`);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to batch update containers';
      setActionError(errorMessage);
      return { successes: [], failures: updates.map(u => ({ id: u.id, error: errorMessage })) };
    } finally {
      setIsUpdating(false);
    }
  }, []);
  
  const clearError = useCallback(() => {
    setActionError(null);
  }, []);
  
  const isAnyActionInProgress = useCallback(() => {
    return isCreating || isUpdating || isDeleting || isShuttingDown;
  }, [isCreating, isUpdating, isDeleting, isShuttingDown]);
  
  return {
    // State
    isCreating,
    isUpdating,
    isDeleting,
    isShuttingDown,
    actionError,
    
    // Actions
    createContainer,
    updateContainer,
    deleteContainer,
    shutdownContainer,
    
    // Batch operations
    batchUpdateContainers,
    
    // Utility
    clearError,
    isAnyActionInProgress
  };
}

// Specialized hook for container form operations
export function useContainerForm() {
  const [formData, setFormData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  const actions = useContainerActions();
  
  const validateForm = useCallback((data: any) => {
    const errors: Record<string, string> = {};
    
    if (!data.name?.trim()) {
      errors.name = 'Container name is required';
    }
    
    if (!data.tenant_id) {
      errors.tenant_id = 'Tenant is required';
    }
    
    if (!data.type) {
      errors.type = 'Container type is required';
    }
    
    if (!data.purpose) {
      errors.purpose = 'Purpose is required';
    }
    
    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    setIsFormValid(isValid);
    
    return isValid;
  }, []);
  
  const updateFormData = useCallback((data: any) => {
    setFormData(data);
    validateForm(data);
  }, [validateForm]);
  
  const submitForm = useCallback(async (data: any, containerId?: number) => {
    if (!validateForm(data)) {
      return { success: false, error: 'Please fix validation errors' };
    }
    
    if (containerId) {
      return actions.updateContainer(containerId, data);
    } else {
      return actions.createContainer(data);
    }
  }, [validateForm, actions]);
  
  const resetForm = useCallback(() => {
    setFormData(null);
    setValidationErrors({});
    setIsFormValid(false);
    actions.clearError();
  }, [actions]);
  
  return {
    ...actions,
    formData,
    validationErrors,
    isFormValid,
    updateFormData,
    submitForm,
    resetForm,
    validateForm
  };
}
