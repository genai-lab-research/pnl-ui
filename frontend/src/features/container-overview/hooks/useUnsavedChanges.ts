// Custom hook for handling unsaved changes
// Provides warnings and prevention of accidental navigation

import { useEffect, useCallback, useRef } from 'react';

export interface UseUnsavedChangesOptions {
  hasUnsavedChanges: boolean;
  message?: string;
  onBeforeUnload?: () => boolean;
  onNavigateAway?: () => Promise<boolean>;
}

export interface UseUnsavedChangesResult {
  confirmNavigateAway: () => Promise<boolean>;
  clearUnsavedChanges: () => void;
  showWarning: (message?: string) => boolean;
}

export function useUnsavedChanges(options: UseUnsavedChangesOptions): UseUnsavedChangesResult {
  const {
    hasUnsavedChanges,
    message = 'You have unsaved changes. Are you sure you want to leave?',
    onBeforeUnload,
    onNavigateAway
  } = options;

  const messageRef = useRef(message);
  messageRef.current = message;

  // Handle browser tab/window close
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;

      // Call custom beforeUnload handler if provided
      if (onBeforeUnload && !onBeforeUnload()) {
        return;
      }

      // Show browser confirmation dialog
      event.preventDefault();
      event.returnValue = messageRef.current;
      return messageRef.current;
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, onBeforeUnload]);

  // Handle programmatic navigation
  const confirmNavigateAway = useCallback(async (): Promise<boolean> => {
    if (!hasUnsavedChanges) return true;

    // Call custom navigation handler if provided
    if (onNavigateAway) {
      return await onNavigateAway();
    }

    // Show confirmation dialog
    return window.confirm(messageRef.current);
  }, [hasUnsavedChanges, onNavigateAway]);

  // Clear unsaved changes (programmatically)
  const clearUnsavedChanges = useCallback(() => {
    // This would typically be handled by the component that manages the state
    // This function serves as a placeholder for components to implement
  }, []);

  // Show warning dialog
  const showWarning = useCallback((customMessage?: string): boolean => {
    return window.confirm(customMessage || messageRef.current);
  }, []);

  return {
    confirmNavigateAway,
    clearUnsavedChanges,
    showWarning
  };
}

// Hook for form-specific unsaved changes handling
export function useFormUnsavedChanges<T extends Record<string, any>>(
  originalValues: T,
  currentValues: T,
  options?: {
    message?: string;
    ignoreFields?: Array<keyof T>;
    onNavigateAway?: () => Promise<boolean>;
  }
) {
  const { ignoreFields = [], ...unsavedOptions } = options || {};

  // Check if values have changed
  const hasUnsavedChanges = Object.keys(currentValues).some(key => {
    if (ignoreFields.includes(key as keyof T)) return false;
    
    const original = originalValues[key];
    const current = currentValues[key];
    
    // Deep comparison for objects/arrays
    if (typeof original === 'object' && typeof current === 'object') {
      return JSON.stringify(original) !== JSON.stringify(current);
    }
    
    return original !== current;
  });

  const unsavedChangesResult = useUnsavedChanges({
    hasUnsavedChanges,
    ...unsavedOptions
  });

  // Get changed fields
  const getChangedFields = useCallback((): Array<keyof T> => {
    return Object.keys(currentValues).filter(key => {
      if (ignoreFields.includes(key as keyof T)) return false;
      
      const original = originalValues[key];
      const current = currentValues[key];
      
      if (typeof original === 'object' && typeof current === 'object') {
        return JSON.stringify(original) !== JSON.stringify(current);
      }
      
      return original !== current;
    }) as Array<keyof T>;
  }, [originalValues, currentValues, ignoreFields]);

  // Get change summary
  const getChangeSummary = useCallback(() => {
    const changedFields = getChangedFields();
    
    return {
      hasChanges: hasUnsavedChanges,
      changedFieldCount: changedFields.length,
      changedFields,
      changes: changedFields.reduce((acc, field) => {
        acc[field] = {
          from: originalValues[field],
          to: currentValues[field]
        };
        return acc;
      }, {} as Record<keyof T, { from: any; to: any }>)
    };
  }, [originalValues, currentValues, getChangedFields, hasUnsavedChanges]);

  return {
    ...unsavedChangesResult,
    hasUnsavedChanges,
    getChangedFields,
    getChangeSummary
  };
}

// Hook for auto-save functionality
export function useAutoSave<T>(
  data: T,
  saveFunction: (data: T) => Promise<void> | void,
  options?: {
    delay?: number; // in milliseconds
    enabled?: boolean;
    onSaveSuccess?: () => void;
    onSaveError?: (error: Error) => void;
  }
) {
  const {
    delay = 2000,
    enabled = true,
    onSaveSuccess,
    onSaveError
  } = options || {};

  const timeoutRef = useRef<number | null>(null);
  const lastSavedDataRef = useRef<string>('');
  const isSavingRef = useRef(false);

  const save = useCallback(async () => {
    if (isSavingRef.current) return;

    isSavingRef.current = true;
    try {
      const result = saveFunction(data);
      if (result instanceof Promise) {
        await result;
      }
      lastSavedDataRef.current = JSON.stringify(data);
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      if (onSaveError) {
        onSaveError(error instanceof Error ? error : new Error('Auto-save failed'));
      }
    } finally {
      isSavingRef.current = false;
    }
  }, [data, saveFunction, onSaveSuccess, onSaveError]);

  useEffect(() => {
    if (!enabled) return;

    const currentDataString = JSON.stringify(data);
    
    // Only auto-save if data has changed
    if (currentDataString !== lastSavedDataRef.current) {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(save, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, save, delay, enabled]);

  // Force save function
  const forceSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await save();
  }, [save]);

  return {
    forceSave,
    isSaving: isSavingRef.current
  };
}

// Hook for draft management
export function useDraftManager<T>(
  key: string,
  initialData: T,
  options?: {
    autoSaveInterval?: number;
    onDraftLoad?: (draft: T) => void;
    onDraftSave?: (draft: T) => void;
  }
) {
  const { autoSaveInterval = 5000, onDraftLoad, onDraftSave } = options || {};

  // Load draft from localStorage
  const loadDraft = useCallback((): T | null => {
    try {
      const draftString = localStorage.getItem(`draft-${key}`);
      if (draftString) {
        const draft = JSON.parse(draftString);
        if (onDraftLoad) {
          onDraftLoad(draft);
        }
        return draft;
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
    return null;
  }, [key, onDraftLoad]);

  // Save draft to localStorage
  const saveDraft = useCallback((data: T) => {
    try {
      localStorage.setItem(`draft-${key}`, JSON.stringify(data));
      if (onDraftSave) {
        onDraftSave(data);
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [key, onDraftSave]);

  // Clear draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(`draft-${key}`);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, [key]);

  // Check if draft exists
  const hasDraft = useCallback((): boolean => {
    return localStorage.getItem(`draft-${key}`) !== null;
  }, [key]);

  // Auto-save hook
  const { forceSave: forceSaveDraft } = useAutoSave(
    initialData,
    saveDraft,
    {
      delay: autoSaveInterval,
      enabled: true
    }
  );

  return {
    loadDraft,
    saveDraft,
    clearDraft,
    hasDraft,
    forceSaveDraft
  };
}
