/**
 * Validation Data Models
 * Based on p2_routing.md specifications for validation endpoints
 */

// Name validation types
export interface NameValidationRequest {
  name: string;
}

export interface NameValidationResponse {
  is_valid: boolean;
  suggestions: string[];
  reason?: string;
  conflict_type?: 'duplicate' | 'reserved' | 'invalid_format' | 'too_long' | 'too_short';
}

// Generic validation response structure
export interface ValidationResponse<T = any> {
  is_valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  data?: T;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: any;
}

// Specific validation types for different entities
export interface ContainerValidationResponse extends ValidationResponse {
  name_suggestions?: string[];
  location_validation?: LocationValidation;
  seed_type_validation?: SeedTypeValidation[];
}

export interface LocationValidation {
  is_valid: boolean;
  city_valid: boolean;
  country_valid: boolean;
  address_valid: boolean;
  suggested_locations?: string[];
}

export interface SeedTypeValidation {
  seed_type_id: number;
  is_valid: boolean;
  is_available: boolean;
  stock_level?: number;
  compatibility_score?: number;
}

// Validation rules configuration
export interface ValidationRules {
  name: {
    min_length: number;
    max_length: number;
    allowed_characters: string;
    reserved_names: string[];
  };
  location: {
    required_fields: string[];
    address_format?: string;
  };
  seed_types: {
    max_types_per_container: number;
    compatibility_check: boolean;
  };
}

// Bulk validation for multiple items
export interface BulkValidationRequest<T> {
  items: T[];
  validation_type: string;
  strict_mode?: boolean;
}

export interface BulkValidationResponse<T> {
  total_items: number;
  valid_items: number;
  invalid_items: number;
  results: Array<{
    index: number;
    item: T;
    validation: ValidationResponse;
  }>;
  summary: {
    common_errors: string[];
    suggestions: string[];
  };
}

// Real-time validation status
export interface ValidationStatus {
  field: string;
  status: 'valid' | 'invalid' | 'pending' | 'unknown';
  message?: string;
  timestamp: string;
}

// Validation cache entry
export interface ValidationCacheEntry {
  key: string;
  result: ValidationResponse;
  expires_at: string;
  created_at: string;
}
