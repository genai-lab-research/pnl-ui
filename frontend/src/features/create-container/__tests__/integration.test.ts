// Create Container Integration Tests
// End-to-end tests for the create container workflow

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCreateContainer } from '../hooks/useCreateContainer';
import { useNameValidation } from '../hooks/useNameValidation';
import { useSeedTypeSearch } from '../hooks/useSeedTypeSearch';
import { createContainerApiAdapter } from '../services/create-container-api.adapter';

// Mock API adapter
vi.mock('../services/create-container-api.adapter', () => ({
  createContainerApiAdapter: {
    preloadFormData: vi.fn(),
    createContainer: vi.fn(),
    validateContainerName: vi.fn(),
    searchSeedTypes: vi.fn()
  }
}));

describe('Create Container Integration Tests', () => {
  const mockApiAdapter = createContainerApiAdapter as {
    preloadFormData: ReturnType<typeof vi.fn>;
    createContainer: ReturnType<typeof vi.fn>;
    validateContainerName: ReturnType<typeof vi.fn>;
    searchSeedTypes: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default API responses
    mockApiAdapter.preloadFormData.mockResolvedValue({
      tenants: [
        { id: 1, name: 'Farm Alpha' },
        { id: 2, name: 'Farm Beta' }
      ],
      seedTypes: [
        { id: 1, name: 'Lettuce', variety: 'Butterhead', supplier: 'Seeds Inc', batch_id: 'L001' },
        { id: 2, name: 'Spinach', variety: 'Baby', supplier: 'Green Co', batch_id: 'S001' },
        { id: 3, name: 'Kale', variety: 'Curly', supplier: 'Organic Seeds', batch_id: 'K001' }
      ],
      availableContainers: [
        { id: 10, name: 'production-container-1' },
        { id: 11, name: 'test-environment' }
      ],
      errors: []
    });

    mockApiAdapter.validateContainerName.mockResolvedValue({
      isValid: true,
      suggestions: []
    });

    mockApiAdapter.searchSeedTypes.mockResolvedValue({
      seedTypes: [
        { id: 1, name: 'Lettuce', variety: 'Butterhead', supplier: 'Seeds Inc', batch_id: 'L001' }
      ],
      error: null
    });

    mockApiAdapter.createContainer.mockResolvedValue({
      success: true,
      container: {
        id: 999,
        name: 'new-container',
        type: 'physical',
        status: 'created'
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Complete Container Creation Flow', () => {
    it('should handle full physical container creation workflow', async () => {
      const { result } = renderHook(() => useCreateContainer());

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.availableTenants).toHaveLength(2);
      expect(result.current.availableSeedTypes).toHaveLength(3);

      // Fill out form step by step
      await act(async () => {
        result.current.updateField('name', 'my-physical-farm');
      });

      await act(async () => {
        result.current.updateField('tenantId', 1);
      });

      await act(async () => {
        result.current.updateField('purpose', 'production');
      });

      await act(async () => {
        result.current.addSeedType(1);
        result.current.addSeedType(2);
      });

      await act(async () => {
        result.current.updateLocation({
          city: 'Portland',
          country: 'USA',
          address: '1234 Farm Road'
        });
      });

      // Validate form state
      expect(result.current.formData.name).toBe('my-physical-farm');
      expect(result.current.formData.tenantId).toBe(1);
      expect(result.current.formData.type).toBe('physical');
      expect(result.current.formData.purpose).toBe('production');
      expect(result.current.formData.seedTypes).toEqual([1, 2]);
      expect(result.current.showLocationFields).toBe(true);
      expect(result.current.selectedSeedTypesDisplay).toBe('Lettuce +1 more');

      // Submit form
      let submitResult;
      await act(async () => {
        submitResult = await result.current.submitForm();
      });

      expect(submitResult.success).toBe(true);
      expect(mockApiAdapter.createContainer).toHaveBeenCalledWith({
        name: 'my-physical-farm',
        tenant_id: 1,
        type: 'physical',
        purpose: 'production',
        location: {
          city: 'Portland',
          country: 'USA',
          address: '1234 Farm Road'
        },
        notes: '',
        shadow_service_enabled: false,
        copied_environment_from: null,
        robotics_simulation_enabled: false,
        ecosystem_connected: false,
        ecosystem_settings: expect.any(Object),
        seed_type_ids: [1, 2]
      });

      // Form should be reset after successful submission
      expect(result.current.formData.name).toBe('');
      expect(result.current.formData.tenantId).toBeNull();
    });

    it('should handle virtual container with ecosystem connection', async () => {
      const { result } = renderHook(() => useCreateContainer());

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Configure virtual container
      await act(async () => {
        result.current.updateField('name', 'virtual-research-container');
        result.current.updateField('tenantId', 2);
        result.current.updateField('purpose', 'research');
        result.current.toggleContainerType('virtual');
      });

      expect(result.current.formData.type).toBe('virtual');
      expect(result.current.showLocationFields).toBe(false);
      expect(result.current.showVirtualSettings).toBe(true);

      // Configure virtual-specific settings
      await act(async () => {
        result.current.updateField('copiedEnvironmentFrom', 10);
        result.current.updateField('roboticsSimulationEnabled', true);
      });

      // Enable ecosystem connection
      await act(async () => {
        result.current.toggleEcosystemConnection(true);
      });

      expect(result.current.showEcosystemSettings).toBe(true);
      expect(result.current.submitButtonLabel).toBe('Create and Connect');
      expect(result.current.formData.ecosystemSettings.fa.environment).toBe('prod');
      expect(result.current.formData.ecosystemSettings.pya.environment).toBe('test');

      // Add seed types
      await act(async () => {
        result.current.addSeedType(3);
      });

      // Submit
      let submitResult;
      await act(async () => {
        submitResult = await result.current.submitForm();
      });

      expect(submitResult.success).toBe(true);
      expect(mockApiAdapter.createContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'virtual',
          purpose: 'research',
          copied_environment_from: 10,
          robotics_simulation_enabled: true,
          ecosystem_connected: true,
          ecosystem_settings: expect.objectContaining({
            fa: { environment: 'prod' },
            pya: { environment: 'test' }
          })
        })
      );
    });

    it('should handle form validation errors gracefully', async () => {
      const { result } = renderHook(() => useCreateContainer());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Try to submit incomplete form
      await act(async () => {
        result.current.validateForm();
      });

      expect(result.current.hasFieldErrors('name')).toBe(true);
      expect(result.current.hasFieldErrors('tenantId')).toBe(true);
      expect(result.current.hasFieldErrors('seedTypes')).toBe(true);
      expect(result.current.submitButtonDisabled).toBe(true);

      // Fill required fields one by one and check validation
      await act(async () => {
        result.current.updateField('name', 'test');
        result.current.validateForm();
      });

      expect(result.current.hasFieldErrors('name')).toBe(false);
      expect(result.current.hasFieldErrors('tenantId')).toBe(true);

      await act(async () => {
        result.current.updateField('tenantId', 1);
        result.current.validateForm();
      });

      expect(result.current.hasFieldErrors('tenantId')).toBe(false);
      expect(result.current.hasFieldErrors('seedTypes')).toBe(true);

      await act(async () => {
        result.current.addSeedType(1);
        result.current.validateForm();
      });

      expect(result.current.hasFieldErrors('seedTypes')).toBe(false);
      // Still need location for physical container
      expect(result.current.hasFieldErrors('location')).toBe(true);
    });
  });

  describe('Name Validation Integration', () => {
    it('should validate container names with debouncing', async () => {
      const { result } = renderHook(() => useNameValidation(100));

      // Start validation
      await act(async () => {
        result.current.validateName('test-container');
      });

      expect(result.current.isValidating).toBe(true);

      // Wait for debounce
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      expect(result.current.isValidating).toBe(false);
      expect(result.current.validationResult?.isValid).toBe(true);
      expect(mockApiAdapter.validateContainerName).toHaveBeenCalledWith('test-container');
    });

    it('should handle name validation with suggestions', async () => {
      mockApiAdapter.validateContainerName.mockResolvedValue({
        isValid: false,
        suggestions: ['my-container-1', 'my-container-2', 'my-container-dev']
      });

      const { result } = renderHook(() => useNameValidation(50));

      await act(async () => {
        result.current.validateName('my-container');
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.validationResult?.isValid).toBe(false);
      expect(result.current.validationResult?.suggestions).toEqual([
        'my-container-1',
        'my-container-2', 
        'my-container-dev'
      ]);
    });
  });

  describe('Seed Type Search Integration', () => {
    it('should search seed types with autocomplete', async () => {
      const mockOnSelect = vi.fn();
      const { result } = renderHook(() => useSeedTypeSearch(100, mockOnSelect));

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.searchResults).toBeDefined();

      // Perform search
      await act(async () => {
        result.current.setSearchQuery('lettuce');
      });

      expect(result.current.isSearching).toBe(true);

      // Wait for debounce
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      expect(result.current.isSearching).toBe(false);
      expect(mockApiAdapter.searchSeedTypes).toHaveBeenCalledWith('lettuce');
      expect(result.current.searchResults).toHaveLength(1);
      expect(result.current.searchResults[0].name).toBe('Lettuce');
    });

    it('should handle seed type selection', async () => {
      const mockOnSelect = vi.fn();
      const { result } = renderHook(() => useSeedTypeSearch(50, mockOnSelect));

      const mockSeedType = {
        id: 1,
        name: 'Lettuce',
        variety: 'Butterhead',
        supplier: 'Seeds Inc',
        batch_id: 'L001'
      };

      await act(async () => {
        result.current.selectSeedType(mockSeedType);
      });

      expect(mockOnSelect).toHaveBeenCalledWith(mockSeedType);
      expect(result.current.searchQuery).toBe('');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API failures gracefully', async () => {
      mockApiAdapter.preloadFormData.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useCreateContainer());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.availableTenants).toHaveLength(0);
      expect(result.current.availableSeedTypes).toHaveLength(0);
    });

    it('should handle submission failures with server validation errors', async () => {
      mockApiAdapter.createContainer.mockResolvedValue({
        success: false,
        error: 'Validation failed',
        validationErrors: [
          { field: 'name', message: 'Container name already exists' },
          { field: 'seedTypes', message: 'Invalid seed type selection' }
        ]
      });

      const { result } = renderHook(() => useCreateContainer());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Fill out form
      await act(async () => {
        result.current.updateField('name', 'existing-container');
        result.current.updateField('tenantId', 1);
        result.current.addSeedType(999); // Invalid seed type
        result.current.updateLocation({
          city: 'Test City',
          country: 'Test Country',
          address: 'Test Address'
        });
      });

      let submitResult;
      await act(async () => {
        submitResult = await result.current.submitForm();
      });

      expect(submitResult.success).toBe(false);
      expect(result.current.hasFieldErrors('name')).toBe(true);
      expect(result.current.hasFieldErrors('seedTypes')).toBe(true);
      expect(result.current.getFieldErrors('name')[0].message).toBe('Container name already exists');
    });
  });
});