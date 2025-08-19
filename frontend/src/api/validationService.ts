/**
 * Validation Service
 * Handles all validation related API operations
 * Based on p2_routing.md specifications
 */

import { BaseApiService } from './baseApiService';
import { 
  NameValidationRequest,
  NameValidationResponse,
  ValidationResponse,
  ContainerValidationResponse,
  BulkValidationRequest,
  BulkValidationResponse,
  ValidationStatus
} from '../types/validation';
import { ApiError } from './index';

export class ValidationService extends BaseApiService {
  private static instance: ValidationService;

  private constructor(baseURL: string = '/api/v1') {
    super(baseURL);
  }

  public static getInstance(baseURL?: string): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService(baseURL);
    }
    return ValidationService.instance;
  }

  /**
   * Validate container name uniqueness
   */
  public async validateContainerName(nameRequest: NameValidationRequest): Promise<NameValidationResponse> {
    try {
      const response = await this.makeAuthenticatedRequest<NameValidationResponse>('/containers/validate-name', {
        method: 'POST',
        body: JSON.stringify(nameRequest),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to validate container name');
    }
  }

  /**
   * Validate complete container data before creation/update
   */
  public async validateContainerData(
    containerData: Record<string, any>,
    containerId?: number
  ): Promise<ContainerValidationResponse> {
    try {
      const requestBody = {
        container_data: containerData,
        container_id: containerId
      };

      const response = await this.makeAuthenticatedRequest<ContainerValidationResponse>('/containers/validate', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to validate container data');
    }
  }

  /**
   * Validate tenant name uniqueness
   */
  public async validateTenantName(nameRequest: NameValidationRequest): Promise<NameValidationResponse> {
    try {
      const response = await this.makeAuthenticatedRequest<NameValidationResponse>('/tenants/validate-name', {
        method: 'POST',
        body: JSON.stringify(nameRequest),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to validate tenant name');
    }
  }

  /**
   * Validate seed type data
   */
  public async validateSeedTypeData(seedTypeData: Record<string, any>): Promise<ValidationResponse> {
    try {
      const response = await this.makeAuthenticatedRequest<ValidationResponse>('/seed-types/validate', {
        method: 'POST',
        body: JSON.stringify({ seed_type_data: seedTypeData }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to validate seed type data');
    }
  }

  /**
   * Validate device configuration
   */
  public async validateDeviceConfig(deviceData: Record<string, any>): Promise<ValidationResponse> {
    try {
      const response = await this.makeAuthenticatedRequest<ValidationResponse>('/devices/validate', {
        method: 'POST',
        body: JSON.stringify({ device_data: deviceData }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to validate device configuration');
    }
  }

  /**
   * Validate RFID tag uniqueness (for trays/panels)
   */
  public async validateRFIDTag(
    rfidTag: string,
    entityType: 'tray' | 'panel',
    entityId?: number
  ): Promise<{ is_valid: boolean; is_unique: boolean; current_owner?: string; suggestions?: string[] }> {
    try {
      const requestBody = {
        rfid_tag: rfidTag,
        entity_type: entityType,
        entity_id: entityId
      };

      const response = await this.makeAuthenticatedRequest<{ 
        is_valid: boolean; 
        is_unique: boolean; 
        current_owner?: string; 
        suggestions?: string[] 
      }>('/rfid/validate', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to validate RFID tag');
    }
  }

  /**
   * Validate crop data before creation/update
   */
  public async validateCropData(cropData: Record<string, any>): Promise<ValidationResponse> {
    try {
      const response = await this.makeAuthenticatedRequest<ValidationResponse>('/crops/validate', {
        method: 'POST',
        body: JSON.stringify({ crop_data: cropData }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to validate crop data');
    }
  }

  /**
   * Validate location data format
   */
  public async validateLocation(locationData: Record<string, any>): Promise<{
    is_valid: boolean;
    normalized_location?: Record<string, any>;
    errors: string[];
    suggestions?: Record<string, any>;
  }> {
    try {
      const response = await this.makeAuthenticatedRequest<{
        is_valid: boolean;
        normalized_location?: Record<string, any>;
        errors: string[];
        suggestions?: Record<string, any>;
      }>('/locations/validate', {
        method: 'POST',
        body: JSON.stringify({ location_data: locationData }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to validate location data');
    }
  }

  /**
   * Bulk validation for multiple items
   */
  public async bulkValidate<T>(
    validationRequest: BulkValidationRequest<T>
  ): Promise<BulkValidationResponse<T>> {
    try {
      const response = await this.makeAuthenticatedRequest<BulkValidationResponse<T>>('/validation/bulk', {
        method: 'POST',
        body: JSON.stringify(validationRequest),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to perform bulk validation');
    }
  }

  /**
   * Real-time field validation (for forms)
   */
  public async validateField(
    entityType: 'container' | 'tenant' | 'seed_type' | 'device' | 'crop' | 'tray' | 'panel',
    fieldName: string,
    fieldValue: any,
    context?: Record<string, any>
  ): Promise<ValidationStatus> {
    try {
      const requestBody = {
        entity_type: entityType,
        field_name: fieldName,
        field_value: fieldValue,
        context: context || {}
      };

      const response = await this.makeAuthenticatedRequest<ValidationStatus>('/validation/field', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to validate field');
    }
  }

  /**
   * Get validation rules for an entity type
   */
  public async getValidationRules(
    entityType: 'container' | 'tenant' | 'seed_type' | 'device' | 'crop' | 'tray' | 'panel'
  ): Promise<{
    entity_type: string;
    rules: Record<string, {
      required: boolean;
      type: string;
      constraints?: Record<string, any>;
      validation_pattern?: string;
      error_messages?: Record<string, string>;
    }>;
    dependencies?: Record<string, string[]>;
  }> {
    try {
      const response = await this.makeAuthenticatedRequest<{
        entity_type: string;
        rules: Record<string, {
          required: boolean;
          type: string;
          constraints?: Record<string, any>;
          validation_pattern?: string;
          error_messages?: Record<string, string>;
        }>;
        dependencies?: Record<string, string[]>;
      }>(`/validation/rules/${entityType}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch validation rules for ${entityType}`);
    }
  }

  /**
   * Check data consistency across related entities
   */
  public async validateDataConsistency(
    primaryEntity: { type: string; id: number },
    relatedEntities: Array<{ type: string; id: number; relationship: string }>
  ): Promise<{
    is_consistent: boolean;
    inconsistencies: Array<{
      entity_type: string;
      entity_id: number;
      field: string;
      issue: string;
      severity: 'warning' | 'error';
    }>;
    auto_fix_available: boolean;
    suggested_fixes?: Array<{
      entity_type: string;
      entity_id: number;
      field: string;
      current_value: any;
      suggested_value: any;
    }>;
  }> {
    try {
      const requestBody = {
        primary_entity: primaryEntity,
        related_entities: relatedEntities
      };

      const response = await this.makeAuthenticatedRequest<{
        is_consistent: boolean;
        inconsistencies: Array<{
          entity_type: string;
          entity_id: number;
          field: string;
          issue: string;
          severity: 'warning' | 'error';
        }>;
        auto_fix_available: boolean;
        suggested_fixes?: Array<{
          entity_type: string;
          entity_id: number;
          field: string;
          current_value: any;
          suggested_value: any;
        }>;
      }>('/validation/consistency', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to validate data consistency');
    }
  }

  /**
   * Generate name suggestions based on existing data
   */
  public async generateNameSuggestions(
    entityType: 'container' | 'tenant' | 'seed_type',
    baseName: string,
    count = 5
  ): Promise<{ suggestions: string[] }> {
    try {
      const requestBody = {
        entity_type: entityType,
        base_name: baseName,
        count
      };

      const response = await this.makeAuthenticatedRequest<{ suggestions: string[] }>('/validation/name-suggestions', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to generate name suggestions');
    }
  }
}

// Create and export singleton instance
export const validationService = ValidationService.getInstance();

// Export utility functions for easier usage
export const validateContainerName = (nameRequest: NameValidationRequest): Promise<NameValidationResponse> => 
  validationService.validateContainerName(nameRequest);

export const validateContainerData = (
  containerData: Record<string, any>,
  containerId?: number
): Promise<ContainerValidationResponse> => 
  validationService.validateContainerData(containerData, containerId);

export const validateTenantName = (nameRequest: NameValidationRequest): Promise<NameValidationResponse> => 
  validationService.validateTenantName(nameRequest);

export const validateSeedTypeData = (seedTypeData: Record<string, any>): Promise<ValidationResponse> => 
  validationService.validateSeedTypeData(seedTypeData);

export const validateDeviceConfig = (deviceData: Record<string, any>): Promise<ValidationResponse> => 
  validationService.validateDeviceConfig(deviceData);

export const validateRFIDTag = (
  rfidTag: string,
  entityType: 'tray' | 'panel',
  entityId?: number
): Promise<{ is_valid: boolean; is_unique: boolean; current_owner?: string; suggestions?: string[] }> => 
  validationService.validateRFIDTag(rfidTag, entityType, entityId);

export const validateCropData = (cropData: Record<string, any>): Promise<ValidationResponse> => 
  validationService.validateCropData(cropData);

export const validateLocation = (locationData: Record<string, any>): Promise<{
  is_valid: boolean;
  normalized_location?: Record<string, any>;
  errors: string[];
  suggestions?: Record<string, any>;
}> => 
  validationService.validateLocation(locationData);

export const bulkValidate = <T>(
  validationRequest: BulkValidationRequest<T>
): Promise<BulkValidationResponse<T>> => 
  validationService.bulkValidate(validationRequest);

export const validateField = (
  entityType: 'container' | 'tenant' | 'seed_type' | 'device' | 'crop' | 'tray' | 'panel',
  fieldName: string,
  fieldValue: any,
  context?: Record<string, any>
): Promise<ValidationStatus> => 
  validationService.validateField(entityType, fieldName, fieldValue, context);

export const getValidationRules = (
  entityType: 'container' | 'tenant' | 'seed_type' | 'device' | 'crop' | 'tray' | 'panel'
): Promise<{
  entity_type: string;
  rules: Record<string, {
    required: boolean;
    type: string;
    constraints?: Record<string, any>;
    validation_pattern?: string;
    error_messages?: Record<string, string>;
  }>;
  dependencies?: Record<string, string[]>;
}> => 
  validationService.getValidationRules(entityType);

export const validateDataConsistency = (
  primaryEntity: { type: string; id: number },
  relatedEntities: Array<{ type: string; id: number; relationship: string }>
): Promise<{
  is_consistent: boolean;
  inconsistencies: Array<{
    entity_type: string;
    entity_id: number;
    field: string;
    issue: string;
    severity: 'warning' | 'error';
  }>;
  auto_fix_available: boolean;
  suggested_fixes?: Array<{
    entity_type: string;
    entity_id: number;
    field: string;
    current_value: any;
    suggested_value: any;
  }>;
}> => 
  validationService.validateDataConsistency(primaryEntity, relatedEntities);

export const generateNameSuggestions = (
  entityType: 'container' | 'tenant' | 'seed_type',
  baseName: string,
  count = 5
): Promise<{ suggestions: string[] }> => 
  validationService.generateNameSuggestions(entityType, baseName, count);
