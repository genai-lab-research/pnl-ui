// Create Container Dataflow Tests
// Integration tests for container creation workflow

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CreateContainerViewModel } from '../viewmodels/create-container.viewmodel';
import { ContainerCreationDomain } from '../domain/container-creation.domain';
import { ContainerFormData } from '../models/create-container.model';
import { createContainerApiAdapter } from '../services/create-container-api.adapter';

// Mock the API adapter
vi.mock('../services/create-container-api.adapter', () => ({
  createContainerApiAdapter: {
    preloadFormData: vi.fn(),
    createContainer: vi.fn(),
    validateContainerName: vi.fn(),
    searchSeedTypes: vi.fn()
  }
}));

describe('Create Container Dataflow Tests', () => {
  let viewModel: CreateContainerViewModel;
  const mockApiAdapter = createContainerApiAdapter as {
    preloadFormData: ReturnType<typeof vi.fn>;
    createContainer: ReturnType<typeof vi.fn>;
    validateContainerName: ReturnType<typeof vi.fn>;
    searchSeedTypes: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    viewModel = new CreateContainerViewModel();
    vi.clearAllMocks();
    
    // Setup default API responses
    mockApiAdapter.preloadFormData.mockResolvedValue({
      tenants: [
        { id: 1, name: 'Tenant A' },
        { id: 2, name: 'Tenant B' }
      ],
      seedTypes: [
        { id: 1, name: 'Lettuce', variety: 'Iceberg', supplier: 'SupplierA', batch_id: 'B001' },
        { id: 2, name: 'Tomato', variety: 'Cherry', supplier: 'SupplierB', batch_id: 'B002' }
      ],
      availableContainers: [
        { id: 1, name: 'container-1' },
        { id: 2, name: 'container-2' }
      ],
      errors: []
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Form Initialization Flow', () => {
    it('should initialize form with default values and load data', async () => {
      const actions = viewModel.getActions();
      
      expect(viewModel.state.isLoading).toBe(false);
      expect(viewModel.formData.type).toBe('physical');
      expect(viewModel.formData.purpose).toBe('development');
      
      await actions.initializeForm();
      
      expect(mockApiAdapter.preloadFormData).toHaveBeenCalledOnce();
      expect(viewModel.availableTenants).toHaveLength(2);
      expect(viewModel.availableSeedTypes).toHaveLength(2);
      expect(viewModel.state.isLoading).toBe(false);
    });

    it('should handle initialization errors gracefully', async () => {
      mockApiAdapter.preloadFormData.mockRejectedValue(new Error('Network error'));
      
      const actions = viewModel.getActions();
      await actions.initializeForm();
      
      expect(viewModel.state.isLoading).toBe(false);
      expect(viewModel.availableTenants).toHaveLength(0);
    });
  });

  describe('Container Type Toggle Flow', () => {
    it('should toggle from physical to virtual and update form state', async () => {
      const actions = viewModel.getActions();
      await actions.initializeForm();
      
      // Initial state - physical
      expect(viewModel.formData.type).toBe('physical');
      expect(viewModel.state.showLocationFields).toBe(true);
      expect(viewModel.state.showVirtualSettings).toBe(false);
      
      // Toggle to virtual
      actions.toggleContainerType('virtual');
      
      expect(viewModel.formData.type).toBe('virtual');
      expect(viewModel.state.showLocationFields).toBe(false);
      expect(viewModel.state.showVirtualSettings).toBe(true);
      expect(viewModel.formData.location).toBeNull();
    });

    it('should toggle from virtual to physical and clear virtual-specific fields', async () => {
      const actions = viewModel.getActions();
      await actions.initializeForm();
      
      // Set to virtual first
      actions.toggleContainerType('virtual');
      actions.updateFormField('copiedEnvironmentFrom', 1);
      actions.updateFormField('roboticsSimulationEnabled', true);
      
      // Toggle back to physical
      actions.toggleContainerType('physical');
      
      expect(viewModel.formData.type).toBe('physical');
      expect(viewModel.formData.copiedEnvironmentFrom).toBeNull();
      expect(viewModel.formData.roboticsSimulationEnabled).toBe(false);
    });
  });

  describe('Ecosystem Connection Flow', () => {
    it('should auto-select environment settings when ecosystem is connected', async () => {
      const actions = viewModel.getActions();
      await actions.initializeForm();
      
      // Set purpose first
      actions.updateFormField('purpose', 'production');
      
      // Toggle ecosystem connection
      actions.toggleEcosystemConnection(true);
      
      expect(viewModel.formData.ecosystemConnected).toBe(true);
      expect(viewModel.state.showEcosystemSettings).toBe(true);
      expect(viewModel.formData.ecosystemSettings.fa.environment).toBe('prod');
      expect(viewModel.formData.ecosystemSettings.aws.environment).toBe('prod');
      expect(viewModel.state.submitButtonLabel).toBe('Create and Connect');
    });

    it('should update environment settings when purpose changes', async () => {
      const actions = viewModel.getActions();
      await actions.initializeForm();
      
      // Enable ecosystem connection
      actions.toggleEcosystemConnection(true);
      
      // Change to development purpose
      actions.handlePurposeChange('development');
      
      expect(viewModel.formData.ecosystemSettings.fa.environment).toBe('alpha');
      expect(viewModel.formData.ecosystemSettings.aws.environment).toBe('dev');
      
      // Change to production purpose
      actions.handlePurposeChange('production');
      
      expect(viewModel.formData.ecosystemSettings.fa.environment).toBe('prod');
      expect(viewModel.formData.ecosystemSettings.aws.environment).toBe('prod');
    });
  });

  describe('Seed Type Management Flow', () => {
    it('should add and remove seed types correctly', async () => {
      const actions = viewModel.getActions();
      await actions.initializeForm();
      
      expect(viewModel.formData.seedTypes).toHaveLength(0);
      
      // Add seed type
      actions.addSeedType(1);
      expect(viewModel.formData.seedTypes).toEqual([1]);
      
      // Add another seed type
      actions.addSeedType(2);
      expect(viewModel.formData.seedTypes).toEqual([1, 2]);
      
      // Remove seed type
      actions.removeSeedType(1);
      expect(viewModel.formData.seedTypes).toEqual([2]);
    });

    it('should not add duplicate seed types', async () => {
      const actions = viewModel.getActions();
      await actions.initializeForm();
      
      actions.addSeedType(1);
      actions.addSeedType(1); // Duplicate
      
      expect(viewModel.formData.seedTypes).toEqual([1]);
    });
  });

  describe('Form Validation Flow', () => {
    it('should validate required fields correctly', async () => {
      const actions = viewModel.getActions();
      await actions.initializeForm();
      
      // Empty form should have validation errors
      actions.validateForm();
      
      expect(viewModel.state.hasValidationErrors).toBe(true);
      expect(viewModel.state.submitButtonDisabled).toBe(true);
      
      const errors = viewModel.validationErrors;
      expect(errors.some(e => e.field === 'name')).toBe(true);
      expect(errors.some(e => e.field === 'tenantId')).toBe(true);
      expect(errors.some(e => e.field === 'seedTypes')).toBe(true);
    });

    it('should validate location for physical containers', async () => {
      const actions = viewModel.getActions();
      await actions.initializeForm();
      
      // Set valid base fields but no location
      actions.updateFormField('name', 'test-container');
      actions.updateFormField('tenantId', 1);
      actions.addSeedType(1);
      
      actions.validateForm();
      
      const locationErrors = viewModel.validationErrors.filter(e => e.field === 'location');
      expect(locationErrors.length).toBeGreaterThan(0);
    });

    it('should pass validation with complete valid form', async () => {
      const actions = viewModel.getActions();
      await actions.initializeForm();
      
      // Fill out complete form
      actions.updateFormField('name', 'test-container');
      actions.updateFormField('tenantId', 1);
      actions.addSeedType(1);
      actions.updateLocation({
        city: 'San Francisco',
        country: 'USA',
        address: '123 Test St'
      });
      
      actions.validateForm();
      
      expect(viewModel.state.hasValidationErrors).toBe(false);
      expect(viewModel.state.submitButtonDisabled).toBe(false);
    });
  });

  describe('Form Submission Flow', () => {
    it('should submit valid form successfully', async () => {
      mockApiAdapter.createContainer.mockResolvedValue({
        success: true,
        container: { id: 123, name: 'test-container' }
      });
      
      const actions = viewModel.getActions();
      await actions.initializeForm();
      
      // Fill out complete form
      actions.updateFormField('name', 'test-container');
      actions.updateFormField('tenantId', 1);
      actions.addSeedType(1);
      actions.updateLocation({
        city: 'San Francisco',
        country: 'USA',
        address: '123 Test St'
      });
      
      const result = await actions.submitForm();
      
      expect(result.success).toBe(true);
      expect(mockApiAdapter.createContainer).toHaveBeenCalledOnce();
      
      // Form should be reset after successful submission
      expect(viewModel.formData.name).toBe('');
      expect(viewModel.formData.tenantId).toBeNull();
    });

    it('should handle submission validation errors', async () => {
      mockApiAdapter.createContainer.mockResolvedValue({
        success: false,
        error: 'Validation failed',
        validationErrors: [
          { field: 'name', message: 'Name already exists' }
        ]
      });
      
      const actions = viewModel.getActions();
      await actions.initializeForm();
      
      // Fill out form
      actions.updateFormField('name', 'existing-container');
      actions.updateFormField('tenantId', 1);
      actions.addSeedType(1);
      actions.updateLocation({
        city: 'San Francisco',
        country: 'USA',
        address: '123 Test St'
      });
      
      const result = await actions.submitForm();
      
      expect(result.success).toBe(false);
      expect(viewModel.state.hasValidationErrors).toBe(true);
      expect(viewModel.hasValidationErrorsForField('name')).toBe(true);
    });
  });
});

describe('Domain Logic Integration Tests', () => {
  describe('Container Creation Domain Rules', () => {
    it('should generate correct environment settings for different purposes', () => {
      const devSettings = ContainerCreationDomain.getEnvironmentSettingsForPurpose('development');
      expect(devSettings.fa).toBe('alpha');
      expect(devSettings.aws).toBe('dev');
      
      const prodSettings = ContainerCreationDomain.getEnvironmentSettingsForPurpose('production');
      expect(prodSettings.fa).toBe('prod');
      expect(prodSettings.aws).toBe('prod');
    });

    it('should validate container configurations correctly', () => {
      const validConfig = {
        name: 'test-container',
        tenantId: 1,
        type: 'physical' as const,
        purpose: 'development' as const,
        seedTypes: [1, 2],
        location: { city: 'SF', country: 'USA', address: '123 Test St' },
        notes: '',
        shadowServiceEnabled: false,
        copiedEnvironmentFrom: null,
        roboticsSimulationEnabled: false,
        ecosystemConnected: false,
        ecosystemSettings: {
          fa: { environment: 'alpha' as const },
          pya: { environment: 'dev' as const },
          aws: { environment: 'dev' as const },
          mbai: { environment: 'prod' as const }
        }
      };
      
      const validation = ContainerCreationDomain.isValidContainerConfiguration(validConfig);
      expect(validation.isValid).toBe(true);
      expect(validation.issues).toHaveLength(0);
    });

    it('should calculate setup time based on configuration', () => {
      const baseConfig = {
        type: 'virtual' as const,
        purpose: 'development' as const,
        seedTypes: [1],
        roboticsSimulationEnabled: false,
        ecosystemConnected: false
      };
      
      const baseTime = ContainerCreationDomain.calculateEstimatedSetupTime(baseConfig as ContainerFormData);
      expect(baseTime).toBe(30); // Base time
      
      const complexConfig = {
        ...baseConfig,
        type: 'physical' as const,
        roboticsSimulationEnabled: true,
        ecosystemConnected: true,
        seedTypes: [1, 2, 3, 4, 5] // 5 seed types
      };
      
      const complexTime = ContainerCreationDomain.calculateEstimatedSetupTime(complexConfig as ContainerFormData);
      expect(complexTime).toBeGreaterThan(baseTime);
    });
  });
});