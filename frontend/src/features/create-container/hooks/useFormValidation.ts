// Form Validation Hook
// Real-time form validation with field-level error handling

import { useState, useCallback, useEffect } from 'react';
import { ContainerFormData, ValidationError } from '../models/create-container.model';
import { CreateContainerDomainModel } from '../models/create-container.model';

export interface UseFormValidationReturn {
  validationErrors: ValidationError[];
  isFormValid: boolean;
  validateField: (field: keyof ContainerFormData, value: unknown) => ValidationError[];
  validateForm: (formData: ContainerFormData) => ValidationError[];
  getFieldErrors: (field: string) => ValidationError[];
  hasFieldErrors: (field: string) => boolean;
  clearFieldErrors: (field: string) => void;
  clearAllErrors: () => void;
  setValidationErrors: (errors: ValidationError[]) => void;
}

export function useFormValidation(
  initialFormData?: ContainerFormData
): UseFormValidationReturn {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const validateField = useCallback((
    field: keyof ContainerFormData, 
    value: unknown
  ): ValidationError[] => {
    const errors: ValidationError[] = [];

    switch (field) {
      case 'name':
        if (!value || !(typeof value === 'string') || !value.trim()) {
          errors.push({ field: 'name', message: 'Container name is required' });
        } else if (value.length < 3) {
          errors.push({ field: 'name', message: 'Container name must be at least 3 characters' });
        } else if (value.length > 50) {
          errors.push({ field: 'name', message: 'Container name must be less than 50 characters' });
        }
        break;

      case 'tenantId':
        if (!value) {
          errors.push({ field: 'tenantId', message: 'Tenant is required' });
        }
        break;

      case 'seedTypes':
        if (!value || !Array.isArray(value) || value.length === 0) {
          errors.push({ field: 'seedTypes', message: 'At least one seed type is required' });
        }
        break;

      case 'location':
        // Location validation is context-dependent (only for physical containers)
        // This would be handled by the full form validation
        break;

      default:
        break;
    }

    return errors;
  }, []);

  const validateForm = useCallback((formData: ContainerFormData): ValidationError[] => {
    // Use domain model for comprehensive validation
    const domainModel = new CreateContainerDomainModel(
      formData,
      [], // tenants not needed for validation
      [], // seed types not needed for validation
      [], // available containers not needed for basic validation
      []  // current errors
    );

    const validation = domainModel.validateForm();
    return validation.errors;
  }, []);

  const getFieldErrors = useCallback((field: string): ValidationError[] => {
    return validationErrors.filter(error => error.field === field);
  }, [validationErrors]);

  const hasFieldErrors = useCallback((field: string): boolean => {
    return getFieldErrors(field).length > 0;
  }, [getFieldErrors]);

  const clearFieldErrors = useCallback((field: string): void => {
    setValidationErrors(prev => prev.filter(error => error.field !== field));
  }, []);

  const clearAllErrors = useCallback((): void => {
    setValidationErrors([]);
  }, []);

  const updateValidationErrors = useCallback((errors: ValidationError[]): void => {
    setValidationErrors(errors);
  }, []);

  const isFormValid = validationErrors.length === 0;

  // Auto-validate initial form data if provided
  useEffect(() => {
    if (initialFormData) {
      const errors = validateForm(initialFormData);
      setValidationErrors(errors);
    }
  }, [initialFormData, validateForm]);

  return {
    validationErrors,
    isFormValid,
    validateField,
    validateForm,
    getFieldErrors,
    hasFieldErrors,
    clearFieldErrors,
    clearAllErrors,
    setValidationErrors: updateValidationErrors
  };
}