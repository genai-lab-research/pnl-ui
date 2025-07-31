// Name Validation Hook
// Debounced hook for validating container names

import { useState, useEffect, useCallback, useRef } from 'react';
import { createContainerApiAdapter, NameValidationApiResult } from '../services/create-container-api.adapter';

export interface UseNameValidationReturn {
  isValidating: boolean;
  validationResult: NameValidationApiResult | null;
  validateName: (name: string) => void;
  clearValidation: () => void;
}

export function useNameValidation(debounceMs: number = 500): UseNameValidationReturn {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<NameValidationApiResult | null>(null);
  const debounceRef = useRef<number>();
  const currentNameRef = useRef<string>('');

  const validateName = useCallback(async (name: string) => {
    currentNameRef.current = name;

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Don't validate empty names
    if (!name.trim()) {
      setValidationResult(null);
      setIsValidating(false);
      return;
    }

    setIsValidating(true);

    // Debounce the validation
    debounceRef.current = window.setTimeout(async () => {
      // Check if name hasn't changed while we were waiting
      if (currentNameRef.current !== name) {
        return;
      }

      try {
        const result = await createContainerApiAdapter.validateContainerName(name);
        
        // Double-check the name hasn't changed
        if (currentNameRef.current === name) {
          setValidationResult(result);
          setIsValidating(false);
        }
      } catch (error) {
        console.error('Name validation error:', error);
        if (currentNameRef.current === name) {
          setValidationResult({
            isValid: false,
            suggestions: [],
            error: 'Validation failed'
          });
          setIsValidating(false);
        }
      }
    }, debounceMs);
  }, [debounceMs]);

  const clearValidation = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setIsValidating(false);
    setValidationResult(null);
    currentNameRef.current = '';
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    isValidating,
    validationResult,
    validateName,
    clearValidation
  };
}