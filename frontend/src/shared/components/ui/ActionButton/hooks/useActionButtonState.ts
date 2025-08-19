import { useState, useCallback } from 'react';

/**
 * Custom hook for managing ActionButton state
 * Provides loading state management and click handling with debouncing
 */
export const useActionButtonState = (
  initialLoading = false,
  debounceMs = 300
) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string>('');
  const [lastClickTime, setLastClickTime] = useState(0);

  /**
   * Handle button click with debouncing to prevent double clicks
   */
  const handleClick = useCallback(
    async (onClick?: () => Promise<void> | void) => {
      const now = Date.now();
      if (now - lastClickTime < debounceMs) {
        return; // Prevent rapid clicks
      }
      
      setLastClickTime(now);
      setError('');
      
      if (!onClick) return;

      try {
        setLoading(true);
        await onClick();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
    [lastClickTime, debounceMs]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError('');
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError('');
    setLastClickTime(0);
  }, []);

  return {
    loading,
    error,
    handleClick,
    clearError,
    reset,
    setLoading,
  };
};
