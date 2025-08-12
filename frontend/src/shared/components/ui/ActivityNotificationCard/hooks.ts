import { useState, useCallback } from 'react';
import { ActivityNotificationCardProps } from './types';

/**
 * Hook for managing activity notification card interactions
 */
export const useActivityNotificationCard = (
  initialProps?: Partial<ActivityNotificationCardProps>
) => {
  const [loading, setLoading] = useState(initialProps?.loading || false);
  const [error, setError] = useState<string | undefined>(initialProps?.error);

  const setLoadingState = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
    if (isLoading) {
      setError(undefined);
    }
  }, []);

  const setErrorState = useCallback((errorMessage?: string) => {
    setError(errorMessage);
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  return {
    loading,
    error,
    setLoadingState,
    setErrorState,
    clearError,
  };
};