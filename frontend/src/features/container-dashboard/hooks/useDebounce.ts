// Debounce Hook
// Provides debounced values and callbacks for search functionality

import { useState, useEffect, useCallback, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): [T, () => void] {
  const timeoutRef = useRef<number | null>(null);

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [debouncedCallback, cancel];
}

export function useSearchDebounce(initialValue: string = '', delay: number = 300) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);
  const previousSearchTerm = useRef(initialValue);

  // Track if we're in a searching state
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearchTerm]);

  // Track if search term actually changed
  const hasSearchChanged = debouncedSearchTerm !== previousSearchTerm.current;
  
  useEffect(() => {
    if (hasSearchChanged) {
      previousSearchTerm.current = debouncedSearchTerm;
    }
  }, [debouncedSearchTerm, hasSearchChanged]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    isSearching,
    hasSearchChanged,
    clearSearch
  };
}

export function useAsyncDebounce<T>(
  asyncFunction: (value: T) => Promise<void>,
  delay: number = 300
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedAsyncCall = useCallback(
    async (value: T) => {
      // Cancel previous timeout
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const currentController = abortControllerRef.current;

      timeoutRef.current = window.setTimeout(async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          // Check if this request was cancelled
          if (currentController.signal.aborted) {
            return;
          }
          
          await asyncFunction(value);
        } catch (err) {
          if (!currentController.signal.aborted) {
            setError(err instanceof Error ? err.message : 'An error occurred');
          }
        } finally {
          if (!currentController.signal.aborted) {
            setIsLoading(false);
          }
        }
      }, delay);
    },
    [asyncFunction, delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    debouncedAsyncCall,
    isLoading,
    error,
    cancel
  };
}
