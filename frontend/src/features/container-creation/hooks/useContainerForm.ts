import { useState, useCallback } from 'react';
import { ContainerFormData, ContainerFormErrors } from '../types';
import { formValidationService } from '../services';

export const useContainerForm = (initialData: ContainerFormData) => {
  const [formData, setFormData] = useState<ContainerFormData>(initialData);
  const [errors, setErrors] = useState<ContainerFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const updateField = useCallback(<K extends keyof ContainerFormData>(
    field: K,
    value: ContainerFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field as keyof ContainerFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const updateFieldAndValidate = useCallback(<K extends keyof ContainerFormData>(
    field: K,
    value: ContainerFormData[K]
  ) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Validate the field
    const fieldError = formValidationService.validateField(field, value, newFormData);
    setErrors(prev => ({ ...prev, [field]: fieldError || undefined }));
  }, [formData]);

  const markFieldTouched = useCallback((field: keyof ContainerFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateAllFields = useCallback(() => {
    const validation = formValidationService.validateForm(formData);
    setErrors(validation.errors);
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);
    
    return validation.isValid;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  const hasErrors = Object.values(errors).some(error => !!error);
  const isFieldTouched = (field: keyof ContainerFormData) => touched[field] || false;
  const getFieldError = (field: keyof ContainerFormData) => errors[field as keyof ContainerFormErrors];

  return {
    formData,
    errors,
    touched,
    hasErrors,
    updateField,
    updateFieldAndValidate,
    markFieldTouched,
    validateAllFields,
    resetForm,
    isFieldTouched,
    getFieldError
  };
};
