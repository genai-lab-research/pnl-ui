export * from './container';
export * from './metrics';

// Common API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ErrorResponse {
  detail: string | Array<{
    type: string;
    loc: string[];
    msg: string;
    input: unknown;
  }>;
}

// Filter options response types
export interface FilterOptions {
  tenants: Array<{
    id: number;
    name: string;
  }>;
  purposes: string[];
  statuses: string[];
  container_types: string[];
}

// Loading and error state types
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: string;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// Form state types
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormState<T> {
  values: T;
  errors: FormErrors;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}