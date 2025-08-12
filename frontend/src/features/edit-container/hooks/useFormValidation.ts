// Form Validation Hook
// Handles form validation logic and error states

import { useMemo } from 'react';
import { ValidationError } from '../models/edit-container.model';

export interface UseFormValidationReturn {
  getFieldErrors: (fieldName: string) => string[];
  hasFieldErrors: (fieldName: string) => boolean;
  getFirstError: (fieldName: string) => string | undefined;
  isFieldValid: (fieldName: string) => boolean;
  getErrorMessage: (fieldName: string) => string | undefined;
  getErrorSeverity: (fieldName: string) => 'error' | 'warning' | undefined;
}

export function useFormValidation(
  validationErrors: ValidationError[]
): UseFormValidationReturn {
  const errorMap = useMemo(() => {
    const map = new Map<string, ValidationError[]>();
    
    validationErrors.forEach(error => {
      const existing = map.get(error.field) || [];
      map.set(error.field, [...existing, error]);
    });
    
    return map;
  }, [validationErrors]);

  const getFieldErrors = (fieldName: string): string[] => {
    const errors = errorMap.get(fieldName) || [];
    return errors.map(error => error.message);
  };

  const hasFieldErrors = (fieldName: string): boolean => {
    return (errorMap.get(fieldName) || []).length > 0;
  };

  const getFirstError = (fieldName: string): string | undefined => {
    const errors = errorMap.get(fieldName) || [];
    return errors.length > 0 ? errors[0].message : undefined;
  };

  const isFieldValid = (fieldName: string): boolean => {
    return !hasFieldErrors(fieldName);
  };

  const getErrorMessage = (fieldName: string): string | undefined => {
    return getFirstError(fieldName);
  };

  const getErrorSeverity = (fieldName: string): 'error' | 'warning' | undefined => {
    const errors = errorMap.get(fieldName) || [];
    if (errors.length === 0) return undefined;
    
    // All validation errors are treated as errors for now
    // Could be extended to support warnings based on error type
    return 'error';
  };

  return {
    getFieldErrors,
    hasFieldErrors,
    getFirstError,
    isFieldValid,
    getErrorMessage,
    getErrorSeverity
  };
}