export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string | undefined>;
}

export interface NameValidationResponse {
  is_valid: boolean;
  suggestions: string[];
}

export interface ValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any, formData: any) => string | null;
}
