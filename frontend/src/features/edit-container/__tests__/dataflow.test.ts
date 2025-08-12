// Edit Container Dataflow Tests
// Tests the complete data flow from API to ViewModel to Hooks

import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditContainer } from '../hooks/useEditContainer';
import { editContainerApiAdapter } from '../services/edit-container-api.adapter';

// Mock the API adapter
vi.mock('../services/edit-container-api.adapter');

const mockApiAdapter = editContainerApiAdapter as {
  preloadFormData: Mock;
  updateContainer: Mock;
  canModifyContainer: Mock;
  searchSeedTypes: Mock;
  loadContainer: Mock;
};

describe('Edit Container Dataflow', () => {
  const mockContainerId = 123;
  const mockContainerData = {
    id: 123,
    name: 'Test Container',
    tenant_id: 1,
    type: 'physical',
    purpose: 'development',
    seed_type_ids: [1, 2],
    location: { city: 'Test City', country: 'Test Country', address: '123 Test St' },
    notes: 'Test notes',
    shadow_service_enabled: false,
    copied_environment_from: null,
    robotics_simulation_enabled: false,
    ecosystem_connected: false,
    ecosystem_settings: {
      fa: { environment: 'alpha' },
      pya: { environment: 'dev' },
      aws: { environment: 'dev' },
      mbai: { environment: 'prod' }
    }
  };

  const mockTenants = [
    { id: 1, name: 'Tenant 1' },
    { id: 2, name: 'Tenant 2' }
  ];

  const mockSeedTypes = [
    { id: 1, name: 'Lettuce', variety: 'Romaine', supplier: 'Seeds Inc', batch_id: 'L001' },
    { id: 2, name: 'Tomato', variety: 'Cherry', supplier: 'Seeds Inc', batch_id: 'T001' }
  ];

  const mockAvailableContainers = [
    { id: 456, name: 'Other Container' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockApiAdapter.preloadFormData.mockResolvedValue({
      container: mockContainerData,
      tenants: mockTenants,
      seedTypes: mockSeedTypes,
      availableContainers: mockAvailableContainers,
      errors: []
    });

    mockApiAdapter.canModifyContainer.mockResolvedValue({
      canModify: true
    });

    mockApiAdapter.updateContainer.mockResolvedValue({
      success: true,
      container: mockContainerData
    });

    mockApiAdapter.searchSeedTypes.mockResolvedValue({
      seedTypes: mockSeedTypes
    });
  });

  it('should initialize with container data and dependencies', async () => {
    const { result } = renderHook(() => useEditContainer(mockContainerId));

    // Initially loading
    expect(result.current.state.isLoading).toBe(true);
    expect(result.current.state.isInitialized).toBe(false);

    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(mockApiAdapter.preloadFormData).toHaveBeenCalledWith(mockContainerId);
    expect(mockApiAdapter.canModifyContainer).toHaveBeenCalledWith(mockContainerId);
    
    expect(result.current.state.isLoading).toBe(false);
    expect(result.current.state.isInitialized).toBe(true);
    expect(result.current.formData.name).toBe('Test Container');
    expect(result.current.availableTenants).toEqual(mockTenants);
    expect(result.current.availableSeedTypes).toEqual(mockSeedTypes);
  });

  it('should handle form field updates correctly', async () => {
    const { result } = renderHook(() => useEditContainer(mockContainerId));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Update tenant
    act(() => {
      result.current.actions.updateFormField('tenantId', 2);
    });

    expect(result.current.formData.tenantId).toBe(2);
    expect(result.current.state.hasChanges).toBe(true);
    expect(result.current.changedFields).toContain('tenantId');
  });

  it('should handle container type toggle with field resets', async () => {
    const { result } = renderHook(() => useEditContainer(mockContainerId));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Toggle to virtual
    act(() => {
      result.current.actions.toggleContainerType('virtual');
    });

    expect(result.current.formData.type).toBe('virtual');
    expect(result.current.formData.location).toBeNull();
    expect(result.current.state.showLocationFields).toBe(false);
    expect(result.current.state.showVirtualSettings).toBe(true);
  });

  it('should handle seed type selection', async () => {
    const { result } = renderHook(() => useEditContainer(mockContainerId));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Add a seed type
    act(() => {
      result.current.actions.addSeedType(3);
    });

    expect(result.current.formData.seedTypes).toContain(3);
    expect(result.current.state.hasChanges).toBe(true);

    // Remove a seed type
    act(() => {
      result.current.actions.removeSeedType(1);
    });

    expect(result.current.formData.seedTypes).not.toContain(1);
  });

  it('should handle ecosystem connection toggle', async () => {
    const { result } = renderHook(() => useEditContainer(mockContainerId));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Enable ecosystem connection
    act(() => {
      result.current.actions.toggleEcosystemConnection(true);
    });

    expect(result.current.formData.ecosystemConnected).toBe(true);
    expect(result.current.state.showEcosystemSettings).toBe(true);
  });

  it('should perform seed type search', async () => {
    const { result } = renderHook(() => useEditContainer(mockContainerId));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Perform search
    await act(async () => {
      await result.current.actions.searchSeedTypes('lettuce');
    });

    expect(mockApiAdapter.searchSeedTypes).toHaveBeenCalledWith('lettuce');
  });

  it('should validate form before submission', async () => {
    const { result } = renderHook(() => useEditContainer(mockContainerId));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Remove required field
    act(() => {
      result.current.actions.updateFormField('tenantId', null);
    });

    // Validate form
    act(() => {
      result.current.actions.validateForm();
    });

    expect(result.current.state.hasValidationErrors).toBe(true);
    expect(result.current.state.submitButtonDisabled).toBe(true);
    expect(result.current.validationErrors.some(e => e.field === 'tenantId')).toBe(true);
  });

  it('should submit form with valid data', async () => {
    const { result } = renderHook(() => useEditContainer(mockContainerId));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Make a change
    act(() => {
      result.current.actions.updateFormField('notes', 'Updated notes');
    });

    // Submit form
    let submitResult;
    await act(async () => {
      submitResult = await result.current.actions.submitForm();
    });

    expect(mockApiAdapter.updateContainer).toHaveBeenCalledWith(
      mockContainerId,
      expect.objectContaining({
        notes: 'Updated notes'
      })
    );
    expect(submitResult.success).toBe(true);
  });

  it('should reset form to original values', async () => {
    const { result } = renderHook(() => useEditContainer(mockContainerId));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Make changes
    act(() => {
      result.current.actions.updateFormField('notes', 'Changed notes');
      result.current.actions.updateFormField('tenantId', 2);
    });

    expect(result.current.state.hasChanges).toBe(true);

    // Reset form
    act(() => {
      result.current.actions.resetForm();
    });

    expect(result.current.formData.notes).toBe(mockContainerData.notes);
    expect(result.current.formData.tenantId).toBe(mockContainerData.tenant_id);
    expect(result.current.state.hasChanges).toBe(false);
  });

  it('should handle location updates for physical containers', async () => {
    const { result } = renderHook(() => useEditContainer(mockContainerId));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Update location
    act(() => {
      result.current.actions.updateLocation({ city: 'New City' });
    });

    expect(result.current.formData.location?.city).toBe('New City');
    expect(result.current.formData.location?.country).toBe('Test Country'); // Preserved
    expect(result.current.state.hasChanges).toBe(true);
  });

  it('should handle ecosystem settings updates', async () => {
    const { result } = renderHook(() => useEditContainer(mockContainerId));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Enable ecosystem connection first
    act(() => {
      result.current.actions.toggleEcosystemConnection(true);
    });

    // Update ecosystem settings
    act(() => {
      result.current.actions.updateEcosystemSettings({
        fa: { environment: 'prod' }
      });
    });

    expect(result.current.formData.ecosystemSettings.fa.environment).toBe('prod');
    expect(result.current.state.hasChanges).toBe(true);
  });

  it('should handle purpose change with auto environment selection', async () => {
    const { result } = renderHook(() => useEditContainer(mockContainerId));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Enable ecosystem connection
    act(() => {
      result.current.actions.toggleEcosystemConnection(true);
    });

    // Change purpose to production
    act(() => {
      result.current.actions.handlePurposeChange('production');
    });

    expect(result.current.formData.purpose).toBe('production');
    expect(result.current.formData.ecosystemSettings.fa.environment).toBe('prod');
    expect(result.current.formData.ecosystemSettings.aws.environment).toBe('prod');
  });

  it('should handle API errors gracefully', async () => {
    mockApiAdapter.preloadFormData.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useEditContainer(mockContainerId));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.state.isLoading).toBe(false);
    expect(result.current.state.loadError).toBe('API Error');
  });
});