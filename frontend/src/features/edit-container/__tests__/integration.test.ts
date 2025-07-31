// Edit Container Integration Tests
// Tests integration between different layers of the feature

import { describe, it, expect, beforeEach } from 'vitest';
import { EditContainerDomainModel } from '../models/edit-container.model';
import { EditContainerViewModel } from '../viewmodels/edit-container.viewmodel';
import { ContainerEditingDomain } from '../domain/container-editing.domain';

describe('Edit Container Integration', () => {
  let domainModel: EditContainerDomainModel;
  let viewModel: EditContainerViewModel;

  const mockContainerData = {
    id: 123,
    name: 'Test Container',
    tenant_id: 1,
    type: 'physical' as const,
    purpose: 'development' as const,
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

  beforeEach(() => {
    domainModel = EditContainerDomainModel.fromContainerData(
      mockContainerData,
      mockTenants,
      mockSeedTypes,
      []
    );
    viewModel = new EditContainerViewModel(123);
  });

  describe('Domain Model Integration', () => {
    it('should create domain model from container data', () => {
      expect(domainModel.formData.id).toBe(123);
      expect(domainModel.formData.name).toBe('Test Container');
      expect(domainModel.formData.type).toBe('physical');
      expect(domainModel.formData.seedTypes).toEqual([1, 2]);
      expect(domainModel.availableTenants).toEqual(mockTenants);
      expect(domainModel.availableSeedTypes).toEqual(mockSeedTypes);
    });

    it('should detect changes between current and original data', () => {
      const updatedModel = domainModel.withFormData({
        notes: 'Updated notes'
      });

      expect(updatedModel.hasChanges()).toBe(true);
      expect(updatedModel.getChangedFields()).toContain('notes');
    });

    it('should validate form data correctly', () => {
      const invalidModel = domainModel.withFormData({
        tenantId: null,
        seedTypes: []
      });

      const validation = invalidModel.validateForm();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toHaveLength(2);
      expect(validation.errors.some(e => e.field === 'tenantId')).toBe(true);
      expect(validation.errors.some(e => e.field === 'seedTypes')).toBe(true);
    });

    it('should handle readonly fields correctly', () => {
      expect(domainModel.isFieldReadonly('name')).toBe(true);
      expect(domainModel.isFieldReadonly('ecosystemConnected')).toBe(false);
    });

    it('should generate correct update request', () => {
      const updateRequest = domainModel.toUpdateRequest();
      
      expect(updateRequest).toMatchObject({
        tenant_id: 1,
        type: 'physical',
        purpose: 'development',
        seed_type_ids: [1, 2],
        notes: 'Test notes'
      });
    });
  });

  describe('Domain Logic Integration', () => {
    it('should validate business rules for container editing', () => {
      const originalData = domainModel.formData;
      const updatedData = { ...originalData, type: 'physical' as const };
      
      const errors = ContainerEditingDomain.validateContainerEdit(updatedData, originalData);
      
      // Should pass validation since no risky changes
      expect(errors).toHaveLength(0);
    });

    it('should detect high-risk modifications', () => {
      const originalData = domainModel.formData;
      const updatedData = { ...originalData, type: 'virtual' as const };
      
      const risk = ContainerEditingDomain.calculateModificationRisk(updatedData, originalData);
      expect(risk).toBe('high');
    });

    it('should generate change summary', () => {
      const originalData = domainModel.formData;
      const updatedData = { ...originalData, notes: 'Updated notes', tenantId: 2 };
      
      const summary = ContainerEditingDomain.generateChangeSummary(
        updatedData,
        originalData,
        mockSeedTypes
      );
      
      expect(summary).toHaveLength(2);
      expect(summary.find(s => s.field === 'notes')).toBeDefined();
      expect(summary.find(s => s.field === 'tenantId')).toBeDefined();
    });

    it('should identify unsafe ecosystem changes', () => {
      const originalData = { ...domainModel.formData, ecosystemConnected: true };
      const updatedData = { ...originalData, ecosystemConnected: false };
      
      const isUnsafe = ContainerEditingDomain.isEcosystemChangeUnsafe(updatedData, originalData);
      expect(isUnsafe).toBe(true);
    });

    it('should provide recommendations based on changes', () => {
      const originalData = domainModel.formData;
      const updatedData = { ...originalData, purpose: 'production' as const };
      
      const recommendations = ContainerEditingDomain.getRecommendedActions(updatedData, originalData);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0]).toContain('production');
    });
  });

  describe('ViewModel Integration', () => {
    it('should initialize with correct default state', () => {
      const state = viewModel.state;
      
      expect(state.isLoading).toBe(false);
      expect(state.isInitialized).toBe(false);
      expect(state.hasChanges).toBe(false);
      expect(state.submitButtonDisabled).toBe(true);
    });

    it('should provide all required actions', () => {
      const actions = viewModel.getActions();
      
      expect(actions.updateFormField).toBeDefined();
      expect(actions.toggleContainerType).toBeDefined();
      expect(actions.submitForm).toBeDefined();
      expect(actions.validateForm).toBeDefined();
      expect(actions.resetForm).toBeDefined();
    });

    it('should handle observer pattern correctly', () => {
      let notificationCount = 0;
      
      const unsubscribe = viewModel.subscribe(() => {
        notificationCount++;
      });
      
      // Should not notify initially
      expect(notificationCount).toBe(0);
      
      unsubscribe();
    });
  });

  describe('Cross-Layer Integration', () => {
    it('should maintain consistency between domain model and viewmodel', () => {
      // Create a viewmodel with the same data
      const actions = viewModel.getActions();
      
      // The viewmodel should reflect the same business logic as domain model
      expect(typeof actions.validateForm).toBe('function');
      expect(typeof actions.submitForm).toBe('function');
    });

    it('should handle complex field interactions', () => {
      const updatedModel = domainModel
        .withFormData({ type: 'virtual' })
        .withFormData({ copiedEnvironmentFrom: 456 })
        .withFormData({ roboticsSimulationEnabled: true });

      expect(updatedModel.shouldShowVirtualSettings()).toBe(true);
      expect(updatedModel.shouldShowLocation()).toBe(false);
      expect(updatedModel.formData.location).toBeNull();
    });

    it('should enforce business rules across all layers', () => {
      // Test that validation works consistently
      const invalidData = domainModel.withFormData({ 
        tenantId: null,
        seedTypes: [],
        type: 'physical',
        location: null
      });

      const domainValidation = invalidData.validateForm();
      const businessValidation = ContainerEditingDomain.validateContainerEdit(
        invalidData.formData,
        invalidData.originalFormData
      );

      expect(domainValidation.isValid).toBe(false);
      expect(businessValidation.length).toBeGreaterThan(0);
    });

    it('should handle ecosystem settings consistently', () => {
      const ecoModel = domainModel.withFormData({
        ecosystemConnected: true,
        purpose: 'production',
        ecosystemSettings: {
          fa: { environment: 'prod' },
          pya: { environment: 'stage' },
          aws: { environment: 'prod' },
          mbai: { environment: 'prod' }
        }
      });

      expect(ecoModel.shouldShowEcosystemSettings()).toBe(true);
      
      const autoSettings = ecoModel.getAutoSelectedEnvironments();
      expect(autoSettings.fa.environment).toBe('prod');
    });
  });
});