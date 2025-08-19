import { useState, useCallback, useRef } from 'react';
import { containerCreationService } from '../services';

export const useNameValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const timeoutRef = useRef<number | null>(null);

  const validateName = useCallback(async (name: string) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't validate empty names
    if (!name.trim()) {
      setIsValid(null);
      setSuggestions([]);
      setError(null);
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const result = await containerCreationService.validateName(name);
      setIsValid(result.is_valid);
      setSuggestions(result.suggestions || []);
      
      if (!result.is_valid && result.suggestions.length === 0) {
        setError('This name is already taken');
      }
    } catch (err) {
      setError('Unable to validate name');
      setIsValid(false);
      setSuggestions([]);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const validateNameDebounced = useCallback((name: string, delay = 500) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      validateName(name);
    }, delay);
  }, [validateName]);

  const resetValidation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsValidating(false);
    setIsValid(null);
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    isValidating,
    isValid,
    suggestions,
    error,
    validateName,
    validateNameDebounced,
    resetValidation
  };
};
