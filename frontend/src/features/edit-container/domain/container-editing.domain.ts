// Container Editing Domain Logic
// Pure business logic for container editing operations

import { EditContainerFormData, ValidationError } from '../models/edit-container.model';
import { Location, SeedType } from '../../../types/containers';

export class ContainerEditingDomain {
  /**
   * Validate container editing business rules
   */
  static validateContainerEdit(
    formData: EditContainerFormData,
    originalData: EditContainerFormData
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Business rule: Cannot change container type if it has active crops
    if (formData.type !== originalData.type) {
      // This would typically check with backend for active crops
      // For now, we'll assume virtual containers can't be changed to physical
      if (originalData.type === 'virtual' && formData.type === 'physical') {
        errors.push({
          field: 'type',
          message: 'Cannot change virtual container to physical - active crops detected'
        });
      }
    }

    // Business rule: Physical containers must have valid location
    if (formData.type === 'physical') {
      if (!formData.location || !ContainerEditingDomain.isValidLocation(formData.location)) {
        errors.push({
          field: 'location',
          message: 'Physical containers require a complete location'
        });
      }
    }

    // Business rule: Production containers need minimum seed types
    if (formData.purpose === 'production' && formData.seedTypes.length < 1) {
      errors.push({
        field: 'seedTypes',
        message: 'Production containers must have at least one seed type'
      });
    }

    // Business rule: Development containers can't use prod environments initially
    if (formData.purpose === 'development' && formData.ecosystemConnected) {
      const prodEnvs = ['prod', 'stage'];
      const hasProdEnv = prodEnvs.some(env => 
        formData.ecosystemSettings.fa.environment === env ||
        formData.ecosystemSettings.pya.environment === env ||
        formData.ecosystemSettings.aws.environment === env
      );
      
      if (hasProdEnv) {
        errors.push({
          field: 'ecosystemSettings',
          message: 'Development containers should use dev/test environments'
        });
      }
    }

    return errors;
  }

  /**
   * Check if location data is valid and complete
   */
  static isValidLocation(location: Location): boolean {
    return !!(
      location.city?.trim() &&
      location.country?.trim() &&
      location.address?.trim()
    );
  }

  /**
   * Calculate container modification risk level
   */
  static calculateModificationRisk(
    formData: EditContainerFormData,
    originalData: EditContainerFormData
  ): 'low' | 'medium' | 'high' {
    const changedFields = ContainerEditingDomain.getChangedFields(formData, originalData);
    
    const highRiskFields = ['type', 'purpose', 'ecosystemConnected'];
    const mediumRiskFields = ['tenantId', 'seedTypes', 'location'];
    
    if (changedFields.some(field => highRiskFields.includes(field))) {
      return 'high';
    }
    
    if (changedFields.some(field => mediumRiskFields.includes(field))) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Get list of changed fields between current and original data
   */
  static getChangedFields(
    current: EditContainerFormData,
    original: EditContainerFormData
  ): string[] {
    const changes: string[] = [];
    
    // Check each field for changes
    if (current.tenantId !== original.tenantId) changes.push('tenantId');
    if (current.type !== original.type) changes.push('type');
    if (current.purpose !== original.purpose) changes.push('purpose');
    if (JSON.stringify(current.seedTypes) !== JSON.stringify(original.seedTypes)) {
      changes.push('seedTypes');
    }
    if (JSON.stringify(current.location) !== JSON.stringify(original.location)) {
      changes.push('location');
    }
    if (current.notes !== original.notes) changes.push('notes');
    if (current.shadowServiceEnabled !== original.shadowServiceEnabled) {
      changes.push('shadowServiceEnabled');
    }
    if (current.copiedEnvironmentFrom !== original.copiedEnvironmentFrom) {
      changes.push('copiedEnvironmentFrom');
    }
    if (current.roboticsSimulationEnabled !== original.roboticsSimulationEnabled) {
      changes.push('roboticsSimulationEnabled');
    }
    if (current.ecosystemConnected !== original.ecosystemConnected) {
      changes.push('ecosystemConnected');
    }
    if (JSON.stringify(current.ecosystemSettings) !== JSON.stringify(original.ecosystemSettings)) {
      changes.push('ecosystemSettings');
    }
    
    return changes;
  }

  /**
   * Generate change summary for audit trail
   */
  static generateChangeSummary(
    current: EditContainerFormData,
    original: EditContainerFormData,
    availableSeedTypes: SeedType[]
  ): Array<{ field: string; oldValue: unknown; newValue: unknown; displayName: string }> {
    const changes = ContainerEditingDomain.getChangedFields(current, original);
    
    return changes.map(field => {
      let oldValue: unknown;
      let newValue: unknown;
      let displayName = field;
      
      // Get values using proper type access
      switch (field) {
        case 'seedTypes':
          oldValue = ContainerEditingDomain.formatSeedTypesList(original.seedTypes, availableSeedTypes);
          newValue = ContainerEditingDomain.formatSeedTypesList(current.seedTypes, availableSeedTypes);
          displayName = 'Seed Types';
          break;
        case 'tenantId':
          oldValue = original.tenantId;
          newValue = current.tenantId;
          displayName = 'Tenant';
          break;
        case 'type':
          oldValue = original.type;
          newValue = current.type;
          displayName = 'Container Type';
          break;
        case 'purpose':
          oldValue = original.purpose;
          newValue = current.purpose;
          displayName = 'Purpose';
          break;
        case 'location':
          oldValue = ContainerEditingDomain.formatLocation(original.location);
          newValue = ContainerEditingDomain.formatLocation(current.location);
          displayName = 'Location';
          break;
        case 'notes':
          oldValue = original.notes;
          newValue = current.notes;
          displayName = 'Notes';
          break;
        case 'shadowServiceEnabled':
          oldValue = original.shadowServiceEnabled ? 'Enabled' : 'Disabled';
          newValue = current.shadowServiceEnabled ? 'Enabled' : 'Disabled';
          displayName = 'Shadow Service';
          break;
        case 'copiedEnvironmentFrom':
          oldValue = original.copiedEnvironmentFrom;
          newValue = current.copiedEnvironmentFrom;
          displayName = 'Copied Environment';
          break;
        case 'roboticsSimulationEnabled':
          oldValue = original.roboticsSimulationEnabled ? 'Enabled' : 'Disabled';
          newValue = current.roboticsSimulationEnabled ? 'Enabled' : 'Disabled';
          displayName = 'Robotics Simulation';
          break;
        case 'ecosystemConnected':
          oldValue = original.ecosystemConnected ? 'Connected' : 'Disconnected';
          newValue = current.ecosystemConnected ? 'Connected' : 'Disconnected';
          displayName = 'Ecosystem Connection';
          break;
        case 'ecosystemSettings':
          oldValue = JSON.stringify(original.ecosystemSettings);
          newValue = JSON.stringify(current.ecosystemSettings);
          displayName = 'Ecosystem Settings';
          break;
        default:
          oldValue = (original as unknown as Record<string, unknown>)[field];
          newValue = (current as unknown as Record<string, unknown>)[field];
          displayName = field.charAt(0).toUpperCase() + field.slice(1);
      }
      
      return { field, oldValue, newValue, displayName };
    });
  }

  /**
   * Format seed types list for display
   */
  private static formatSeedTypesList(seedTypeIds: number[], availableSeedTypes: SeedType[]): string {
    if (!seedTypeIds || seedTypeIds.length === 0) return 'None';
    
    const names = seedTypeIds
      .map(id => availableSeedTypes.find(st => st.id === id)?.name)
      .filter(Boolean);
    
    return names.length > 0 ? names.join(', ') : 'Unknown seed types';
  }

  /**
   * Format location for display
   */
  private static formatLocation(location: Location | null): string {
    if (!location) return 'None';
    
    const parts = [location.city, location.country].filter(p => p?.trim());
    return parts.length > 0 ? parts.join(', ') : 'Incomplete';
  }

  /**
   * Check if ecosystem settings change is safe
   */
  static isEcosystemChangeUnsafe(
    current: EditContainerFormData,
    original: EditContainerFormData
  ): boolean {
    // Changing from connected to disconnected is risky
    if (original.ecosystemConnected && !current.ecosystemConnected) {
      return true;
    }
    
    // Changing environment settings on production containers is risky
    if (current.purpose === 'production' && 
        JSON.stringify(current.ecosystemSettings) !== JSON.stringify(original.ecosystemSettings)) {
      return true;
    }
    
    return false;
  }

  /**
   * Get recommended actions based on changes
   */
  static getRecommendedActions(
    current: EditContainerFormData,
    original: EditContainerFormData
  ): string[] {
    const recommendations: string[] = [];
    const changes = ContainerEditingDomain.getChangedFields(current, original);
    
    if (changes.includes('type')) {
      recommendations.push('Verify that changing container type will not affect active crops');
    }
    
    if (changes.includes('purpose') && current.purpose === 'production') {
      recommendations.push('Production containers require additional monitoring setup');
    }
    
    if (changes.includes('ecosystemConnected') && current.ecosystemConnected) {
      recommendations.push('Test ecosystem connectivity before finalizing changes');
    }
    
    if (changes.includes('seedTypes')) {
      recommendations.push('Ensure new seed types are compatible with current growing conditions');
    }
    
    return recommendations;
  }
}