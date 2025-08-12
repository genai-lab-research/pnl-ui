// Unsaved Changes Hook
// Handles unsaved changes detection and warnings

import { useEffect, useCallback } from 'react';

export interface UseUnsavedChangesReturn {
  confirmLeave: (message?: string) => boolean;
  warnUnsavedChanges: (callback: () => void, message?: string) => void;
}

export function useUnsavedChanges(
  hasUnsavedChanges: boolean,
  defaultMessage = 'You have unsaved changes. Are you sure you want to leave?'
): UseUnsavedChangesReturn {
  
  // Warn on page refresh/navigation
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = defaultMessage;
        return defaultMessage;
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [hasUnsavedChanges, defaultMessage]);

  const confirmLeave = useCallback((message?: string): boolean => {
    if (!hasUnsavedChanges) return true;
    
    return window.confirm(message || defaultMessage);
  }, [hasUnsavedChanges, defaultMessage]);

  const warnUnsavedChanges = useCallback((
    callback: () => void, 
    message?: string
  ): void => {
    if (hasUnsavedChanges) {
      if (confirmLeave(message)) {
        callback();
      }
    } else {
      callback();
    }
  }, [hasUnsavedChanges, confirmLeave]);

  return {
    confirmLeave,
    warnUnsavedChanges
  };
}