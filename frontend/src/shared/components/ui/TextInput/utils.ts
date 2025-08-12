/**
 * Utility functions for TextInput component
 */

/**
 * Generates a unique ID for input elements
 * @param prefix - Prefix for the ID (default: 'text-input')
 * @returns A unique identifier string
 */
export const generateInputId = (prefix: string = 'text-input'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validates input value based on constraints
 * @param value - Input value to validate
 * @param constraints - Validation constraints
 * @returns Validation error message or null if valid
 */
export interface ValidationConstraints {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  type?: 'email' | 'tel' | 'url';
}

export const validateInput = (
  value: string | undefined,
  constraints: ValidationConstraints
): string | null => {
  const trimmedValue = value?.trim() || '';

  // Required validation
  if (constraints.required && !trimmedValue) {
    return 'This field is required';
  }

  // Skip other validations if empty and not required
  if (!trimmedValue && !constraints.required) {
    return null;
  }

  // Minimum length validation
  if (constraints.minLength && trimmedValue.length < constraints.minLength) {
    return `Must be at least ${constraints.minLength} characters`;
  }

  // Maximum length validation
  if (constraints.maxLength && trimmedValue.length > constraints.maxLength) {
    return `Must be no more than ${constraints.maxLength} characters`;
  }

  // Pattern validation
  if (constraints.pattern && !constraints.pattern.test(trimmedValue)) {
    return 'Invalid format';
  }

  // Type-specific validation
  switch (constraints.type) {
    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedValue)) {
        return 'Please enter a valid email address';
      }
      break;
    }
    case 'tel': {
      const phoneRegex = /^[+]?[0-9\-()s]+$/;
      if (!phoneRegex.test(trimmedValue)) {
        return 'Please enter a valid phone number';
      }
      break;
    }
    case 'url': {
      try {
        new URL(trimmedValue);
      } catch {
        return 'Please enter a valid URL';
      }
      break;
    }
  }

  return null;
};

/**
 * Formats input value based on type
 * @param value - Raw input value
 * @param type - Input type
 * @returns Formatted value
 */
export const formatInputValue = (
  value: string,
  type: string
): string => {
  switch (type) {
    case 'tel': {
      // Simple phone number formatting (US format)
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    
    case 'email': {
      // Convert to lowercase for consistency
      return value.toLowerCase();
    }
    
    default:
      return value;
  }
};

/**
 * Gets appropriate autocomplete attribute based on input type and name
 * @param type - Input type
 * @param name - Input name
 * @returns Appropriate autocomplete value
 */
export const getAutoCompleteValue = (
  type?: string,
  name?: string
): string | undefined => {
  if (type === 'email' || name?.includes('email')) return 'email';
  if (type === 'password' || name?.includes('password')) return 'current-password';
  if (name?.includes('phone') || name?.includes('tel')) return 'tel';
  if (name?.includes('address')) return 'address-line1';
  if (name?.includes('city')) return 'address-level2';
  if (name?.includes('state')) return 'address-level1';
  if (name?.includes('zip') || name?.includes('postal')) return 'postal-code';
  if (name?.includes('country')) return 'country-name';
  if (name?.includes('name')) {
    if (name.includes('first') || name.includes('given')) return 'given-name';
    if (name.includes('last') || name.includes('family')) return 'family-name';
    return 'name';
  }
  
  return undefined;
};