/**
 * Validation Service Tests
 * Tests for all validation related API operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ValidationService } from '../validationService';
import { NameValidationRequest, NameValidationResponse, ValidationResponse } from '../../types/validation';
import { ApiError } from '../index';

// Mock fetch globally
global.fetch = vi.fn();

describe('ValidationService', () => {
  let validationService: ValidationService;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    validationService = ValidationService.getInstance('/api/v1');
    mockFetch = vi.mocked(global.fetch);
    mockFetch.mockClear();
  });

  describe('validateContainerName', () => {
    it('should validate a unique container name', async () => {
      const nameRequest: NameValidationRequest = {
        name: 'Container Alpha'
      };

      const mockResponse: NameValidationResponse = {
        is_valid: true,
        suggestions: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await validationService.validateContainerName(nameRequest);

      expect(result).toEqual(mockResponse);
      expect(result.is_valid).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/containers/validate-name',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(nameRequest),
        })
      );
    });

    it('should return suggestions for invalid names', async () => {
      const nameRequest: NameValidationRequest = {
        name: 'Container 1'
      };

      const mockResponse: NameValidationResponse = {
        is_valid: false,
        suggestions: ['Container Alpha', 'Container Beta', 'Container One'],
        reason: 'Name already exists',
        conflict_type: 'duplicate'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await validationService.validateContainerName(nameRequest);

      expect(result).toEqual(mockResponse);
      expect(result.is_valid).toBe(false);
      expect(result.suggestions).toHaveLength(3);
      expect(result.conflict_type).toBe('duplicate');
    });
  });

  describe('validateContainerData', () => {
    it('should validate complete container data', async () => {
      const containerData = {
        name: 'Test Container',
        tenant_id: 1,
        type: 'physical',
        purpose: 'production',
        location: {
          city: 'San Francisco',
          country: 'USA',
          address: '123 Farm St'
        }
      };

      const mockResponse = {
        is_valid: true,
        errors: [],
        warnings: [],
        name_suggestions: [],
        location_validation: {
          is_valid: true,
          city_valid: true,
          country_valid: true,
          address_valid: true
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await validationService.validateContainerData(containerData);

      expect(result.is_valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/containers/validate',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            container_data: containerData,
            container_id: undefined
          }),
        })
      );
    });

    it('should return validation errors for invalid data', async () => {
      const invalidContainerData = {
        name: '', // Empty name should be invalid
        tenant_id: 'invalid', // Should be number
        type: 'invalid_type'
      };

      const mockResponse = {
        is_valid: false,
        errors: [
          {
            field: 'name',
            message: 'Name is required',
            code: 'required',
            value: ''
          },
          {
            field: 'tenant_id',
            message: 'Must be a valid number',
            code: 'type_error',
            value: 'invalid'
          },
          {
            field: 'type',
            message: 'Must be either physical or virtual',
            code: 'value_error',
            value: 'invalid_type'
          }
        ],
        warnings: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await validationService.validateContainerData(invalidContainerData);

      expect(result.is_valid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors[0].field).toBe('name');
      expect(result.errors[1].field).toBe('tenant_id');
      expect(result.errors[2].field).toBe('type');
    });
  });

  describe('validateRFIDTag', () => {
    it('should validate unique RFID tag', async () => {
      const rfidTag = 'RFID123456789';
      const entityType = 'tray';

      const mockResponse = {
        is_valid: true,
        is_unique: true,
        suggestions: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await validationService.validateRFIDTag(rfidTag, entityType);

      expect(result.is_valid).toBe(true);
      expect(result.is_unique).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/rfid/validate',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            rfid_tag: rfidTag,
            entity_type: entityType,
            entity_id: undefined
          }),
        })
      );
    });

    it('should handle duplicate RFID tags', async () => {
      const rfidTag = 'RFID987654321';
      const entityType = 'panel';

      const mockResponse = {
        is_valid: false,
        is_unique: false,
        current_owner: 'Panel #5 in Container Alpha',
        suggestions: ['RFID987654322', 'RFID987654323']
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await validationService.validateRFIDTag(rfidTag, entityType);

      expect(result.is_valid).toBe(false);
      expect(result.is_unique).toBe(false);
      expect(result.current_owner).toBeDefined();
      expect(result.suggestions).toHaveLength(2);
    });
  });

  describe('validateField', () => {
    it('should validate individual field values', async () => {
      const mockResponse = {
        field: 'name',
        status: 'valid' as const,
        message: 'Name is available',
        timestamp: new Date().toISOString()
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await validationService.validateField(
        'container',
        'name',
        'Valid Container Name'
      );

      expect(result.status).toBe('valid');
      expect(result.field).toBe('name');
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/validation/field',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            entity_type: 'container',
            field_name: 'name',
            field_value: 'Valid Container Name',
            context: {}
          }),
        })
      );
    });

    it('should handle invalid field values', async () => {
      const mockResponse = {
        field: 'tenant_id',
        status: 'invalid' as const,
        message: 'Tenant does not exist',
        timestamp: new Date().toISOString()
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await validationService.validateField(
        'container',
        'tenant_id',
        999
      );

      expect(result.status).toBe('invalid');
      expect(result.message).toContain('does not exist');
    });
  });

  describe('getValidationRules', () => {
    it('should fetch validation rules for entity type', async () => {
      const mockRules = {
        entity_type: 'container',
        rules: {
          name: {
            required: true,
            type: 'string',
            constraints: {
              min_length: 3,
              max_length: 100
            },
            validation_pattern: '^[a-zA-Z0-9\\s\\-_]+$',
            error_messages: {
              required: 'Container name is required',
              min_length: 'Name must be at least 3 characters',
              pattern: 'Name contains invalid characters'
            }
          },
          tenant_id: {
            required: true,
            type: 'integer',
            constraints: {
              min: 1
            }
          }
        },
        dependencies: {
          type: ['purpose'],
          location: ['city', 'country']
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRules,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await validationService.getValidationRules('container');

      expect(result.entity_type).toBe('container');
      expect(result.rules.name).toBeDefined();
      expect(result.rules.name.required).toBe(true);
      expect(result.dependencies).toBeDefined();
    });
  });

  describe('bulkValidate', () => {
    it('should validate multiple items at once', async () => {
      const bulkRequest = {
        items: [
          { name: 'Container 1', tenant_id: 1 },
          { name: 'Container 2', tenant_id: 2 },
          { name: '', tenant_id: 1 } // Invalid item
        ],
        validation_type: 'container',
        strict_mode: true
      };

      const mockResponse = {
        total_items: 3,
        valid_items: 2,
        invalid_items: 1,
        results: [
          {
            index: 0,
            item: { name: 'Container 1', tenant_id: 1 },
            validation: { is_valid: true, errors: [], warnings: [] }
          },
          {
            index: 1,
            item: { name: 'Container 2', tenant_id: 2 },
            validation: { is_valid: true, errors: [], warnings: [] }
          },
          {
            index: 2,
            item: { name: '', tenant_id: 1 },
            validation: {
              is_valid: false,
              errors: [{ field: 'name', message: 'Name is required', code: 'required' }],
              warnings: []
            }
          }
        ],
        summary: {
          common_errors: ['Name is required'],
          suggestions: ['Ensure all containers have valid names']
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await validationService.bulkValidate(bulkRequest);

      expect(result.total_items).toBe(3);
      expect(result.valid_items).toBe(2);
      expect(result.invalid_items).toBe(1);
      expect(result.results).toHaveLength(3);
    });
  });

  describe('generateNameSuggestions', () => {
    it('should generate name suggestions', async () => {
      const baseName = 'Farm';
      const entityType = 'container';

      const mockResponse = {
        suggestions: [
          'Farm Alpha',
          'Farm Beta',
          'Farm Gamma',
          'Farm Delta',
          'Farm Epsilon'
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      const result = await validationService.generateNameSuggestions(entityType, baseName);

      expect(result.suggestions).toHaveLength(5);
      expect(result.suggestions.every(name => name.includes('Farm'))).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/validation/name-suggestions',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            entity_type: entityType,
            base_name: baseName,
            count: 5
          }),
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle validation service errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ detail: 'Validation service unavailable' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response);

      await expect(validationService.validateContainerName({ name: 'test' }))
        .rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(validationService.validateContainerName({ name: 'test' }))
        .rejects.toThrow(ApiError);
    });
  });
});
