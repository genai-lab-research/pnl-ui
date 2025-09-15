import { ContainerFormData, ContainerFormErrors, ValidationResult } from '../types';
import { validateContainerName } from '../../../api/validationService';

export class FormValidationService {
  private static instance: FormValidationService;

  private constructor() {}

  public static getInstance(): FormValidationService {
    if (!FormValidationService.instance) {
      FormValidationService.instance = new FormValidationService();
    }
    return FormValidationService.instance;
  }

  /**
   * Validate the entire form (synchronous validation only)
   */
  public validateForm(formData: ContainerFormData): ValidationResult {
    const errors: ContainerFormErrors = {};

    // Container name validation
    if (!formData.name?.trim()) {
      errors.name = 'Container name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Container name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Container name must not exceed 100 characters';
    } else if (!/^[a-zA-Z0-9\s'\-_]+$/.test(formData.name.trim())) {
      errors.name = "Container name can include letters, numbers, spaces, hyphens, underscores, and apostrophes";
    }

    // Tenant validation
    if (!formData.tenant_id) {
      errors.tenant_id = 'Please select a tenant';
    }

    // Purpose validation
    if (!formData.purpose) {
      errors.purpose = 'Please select a purpose';
    }

    // Seed types validation
    if (!formData.seed_type_ids || formData.seed_type_ids.length === 0) {
      errors.seed_type_ids = 'Please select at least one seed type';
    }

    // Location validation for physical containers
    if (formData.type === 'physical') {
      if (!formData.location?.city?.trim()) {
        errors.location = 'City is required for physical containers';
      } else if (!formData.location?.country?.trim()) {
        errors.location = 'Country is required for physical containers';
      } else if (!formData.location?.address?.trim()) {
        errors.location = 'Address is required for physical containers';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors as Record<string, string | undefined>
    };
  }

  /**
   * Validate the entire form including async validations (name uniqueness, etc.)
   */
  public async validateFormAsync(formData: ContainerFormData): Promise<ValidationResult> {
    // First run synchronous validations
    const syncValidation = this.validateForm(formData);
    
    // If sync validation failed, return early
    if (!syncValidation.isValid) {
      return syncValidation;
    }

    const errors: ContainerFormErrors = {};

    // Validate name uniqueness (graceful fallback if endpoint not available)
    if (formData.name?.trim()) {
      try {
        const nameValidation = await validateContainerName({ name: formData.name.trim() });
        if (!nameValidation.is_valid) {
          errors.name = nameValidation.reason || 'This container name is already taken';
        }
      } catch (error) {
        console.warn('Name validation endpoint not available, skipping uniqueness check:', error);
        // Gracefully continue without name uniqueness validation
        // The backend will still catch duplicate names and return appropriate errors
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors as Record<string, string | undefined>
    };
  }

  /**
   * Validate a specific field
   */
  public validateField(fieldName: keyof ContainerFormData, value: any, formData: ContainerFormData): string | null {
    switch (fieldName) {
      case 'name':
        if (typeof value !== 'string' || !value.trim()) {
          return 'Container name is required';
        }
        if (value.trim().length < 2) {
          return 'Container name must be at least 2 characters';
        }
        if (value.trim().length > 100) {
          return 'Container name must not exceed 100 characters';
        }
        if (!/^[a-zA-Z0-9\s\-_]+$/.test(value.trim())) {
          return 'Container name can only contain letters, numbers, spaces, hyphens, and underscores';
        }
        break;

      case 'tenant_id':
        if (!value) {
          return 'Please select a tenant';
        }
        break;

      case 'purpose':
        if (!value) {
          return 'Please select a purpose';
        }
        break;

      case 'seed_type_ids':
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return 'Please select at least one seed type';
        }
        break;

      case 'location':
        if (formData.type === 'physical' && typeof value === 'object' && value !== null) {
          const location = value as { city?: string; country?: string; address?: string };
          if (!location.city?.trim()) {
            return 'City is required for physical containers';
          }
          if (!location.country?.trim()) {
            return 'Country is required for physical containers';
          }
          if (!location.address?.trim()) {
            return 'Address is required for physical containers';
          }
        }
        break;

      default:
        break;
    }

    return null;
  }

  /**
   * Check if the form has any changes from default
   */
  public hasChanges(formData: ContainerFormData, defaultData: ContainerFormData): boolean {
    return JSON.stringify(formData) !== JSON.stringify(defaultData);
  }

  /**
   * Sanitize form data before submission
   */
  public sanitizeFormData(formData: ContainerFormData): ContainerFormData {
    return {
      ...formData,
      name: formData.name?.trim() || '',
      notes: formData.notes?.trim() || '',
      location: formData.type === 'physical' ? {
        city: formData.location?.city?.trim() || '',
        country: formData.location?.country?.trim() || '',
        address: formData.location?.address?.trim() || ''
      } : formData.location
    };
  }
}

// Export singleton instance
export const formValidationService = FormValidationService.getInstance();
