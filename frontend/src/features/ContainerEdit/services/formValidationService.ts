import { ContainerEditFormData, ContainerEditFormErrors } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: ContainerEditFormErrors;
}

export class FormValidationService {
  /**
   * Validate the entire form
   */
  validateForm(formData: ContainerEditFormData): ValidationResult {
    const errors: ContainerEditFormErrors = {};

    // Validate tenant
    if (!formData.tenant_id) {
      errors.tenant_id = 'Tenant is required';
    }

    // Validate purpose  
    if (!formData.purpose) {
      errors.purpose = 'Purpose is required';
    }

    // Validate seed types
    if (!formData.seed_type_ids || formData.seed_type_ids.length === 0) {
      errors.seed_type_ids = 'At least one seed type is required';
    }

    // Validate location for physical containers
    if (formData.type === 'physical') {
      if (!formData.location?.city || !formData.location?.country || !formData.location?.address) {
        errors.location = 'Complete location information is required for physical containers';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Sanitize form data before submission
   */
  sanitizeFormData(formData: ContainerEditFormData): ContainerEditFormData {
    return {
      ...formData,
      name: formData.name.trim(),
      notes: formData.notes.trim(),
      location: formData.type === 'physical' ? {
        city: formData.location.city.trim(),
        country: formData.location.country.trim(),
        address: formData.location.address.trim()
      } : formData.location,
      // Reset virtual-specific fields for physical containers
      copied_environment_from: formData.type === 'physical' ? null : formData.copied_environment_from,
      robotics_simulation_enabled: formData.type === 'physical' ? false : formData.robotics_simulation_enabled
    };
  }

  /**
   * Validate individual field
   */
  validateField(fieldName: keyof ContainerEditFormData, value: any, formData?: ContainerEditFormData): string | undefined {
    switch (fieldName) {
      case 'tenant_id':
        return !value ? 'Tenant is required' : undefined;
      
      case 'purpose':
        return !value ? 'Purpose is required' : undefined;
      
      case 'seed_type_ids':
        return (!value || value.length === 0) ? 'At least one seed type is required' : undefined;
      
      case 'location':
        if (formData?.type === 'physical') {
          if (!value?.city || !value?.country || !value?.address) {
            return 'Complete location information is required for physical containers';
          }
        }
        return undefined;
      
      default:
        return undefined;
    }
  }
}

export const formValidationService = new FormValidationService();
