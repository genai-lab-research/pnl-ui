// Container Creation Domain Logic
// Pure domain logic for container creation business rules

import { ContainerFormData } from '../models/create-container.model';
import { Location } from '../../../types/containers';

export interface EcosystemEnvironment {
  fa: { environment: 'alpha' | 'prod' };
  pya: { environment: 'dev' | 'test' | 'stage' };
  aws: { environment: 'dev' | 'prod' };
  mbai: { environment: 'prod' };
}

export class ContainerCreationDomain {
  /**
   * Business rule: Determine required fields based on container type
   */
  static getRequiredFields(type: 'physical' | 'virtual'): Array<keyof ContainerFormData> {
    const baseRequired: Array<keyof ContainerFormData> = [
      'name',
      'tenantId',
      'type',
      'purpose',
      'seedTypes'
    ];

    if (type === 'physical') {
      return [...baseRequired, 'location'];
    }

    return baseRequired;
  }

  /**
   * Business rule: Auto-select environment settings based on purpose
   */
  static getEnvironmentSettingsForPurpose(
    purpose: 'development' | 'research' | 'production'
  ): EcosystemEnvironment {
    switch (purpose) {
      case 'development':
        return {
          fa: { environment: 'alpha' },
          pya: { environment: 'dev' },
          aws: { environment: 'dev' },
          mbai: { environment: 'prod' }
        };
      
      case 'research':
        return {
          fa: { environment: 'prod' },
          pya: { environment: 'test' },
          aws: { environment: 'prod' },
          mbai: { environment: 'prod' }
        };
      
      case 'production':
        return {
          fa: { environment: 'prod' },
          pya: { environment: 'stage' },
          aws: { environment: 'prod' },
          mbai: { environment: 'prod' }
        };
      
      default:
        return {
          fa: { environment: 'alpha' },
          pya: { environment: 'dev' },
          aws: { environment: 'dev' },
          mbai: { environment: 'prod' }
        };
    }
  }

  /**
   * Business rule: Validate location completeness for physical containers
   */
  static isLocationComplete(location: Location | null): boolean {
    if (!location) return false;
    
    return !!(
      location.city?.trim() && 
      location.country?.trim() && 
      location.address?.trim()
    );
  }

  /**
   * Business rule: Generate container name suggestions
   */
  static generateNameSuggestions(baseName: string, count: number = 3): string[] {
    if (!baseName.trim()) return [];
    
    const suggestions: string[] = [];
    const cleanName = baseName.trim().toLowerCase().replace(/\s+/g, '-');
    
    // Pattern 1: Add sequential numbers
    for (let i = 1; i <= count; i++) {
      suggestions.push(`${cleanName}-${i}`);
    }
    
    // Pattern 2: Add common suffixes
    if (count > 3) {
      suggestions.push(`${cleanName}-dev`);
      suggestions.push(`${cleanName}-test`);
      suggestions.push(`${cleanName}-prod`);
    }
    
    return suggestions.slice(0, count);
  }

  /**
   * Business rule: Validate container name format
   */
  static isValidContainerNameFormat(name: string): boolean {
    if (!name || name.length < 3 || name.length > 50) {
      return false;
    }
    
    // Allow letters, numbers, hyphens, underscores
    const validNameRegex = /^[a-zA-Z0-9_-]+$/;
    return validNameRegex.test(name.trim());
  }

  /**
   * Business rule: Check if container type change is allowed
   */
  static canChangeContainerType(
    currentType: 'physical' | 'virtual',
    newType: 'physical' | 'virtual',
    hasExistingData: boolean
  ): boolean {
    // Always allow if no existing data
    if (!hasExistingData) return true;
    
    // Allow same type
    if (currentType === newType) return true;
    
    // In practice, you might have more complex rules here
    // For now, allow all type changes during creation
    return true;
  }

  /**
   * Business rule: Determine if virtual-specific settings should be shown
   */
  static shouldShowVirtualSettings(type: 'physical' | 'virtual'): boolean {
    return type === 'virtual';
  }

  /**
   * Business rule: Determine if ecosystem settings should be shown
   */
  static shouldShowEcosystemSettings(ecosystemConnected: boolean): boolean {
    return ecosystemConnected;
  }

  /**
   * Business rule: Validate seed type selection
   */
  static isValidSeedTypeSelection(seedTypeIds: number[]): boolean {
    return seedTypeIds.length > 0 && seedTypeIds.length <= 10; // Max 10 seed types
  }

  /**
   * Business rule: Calculate estimated setup time
   */
  static calculateEstimatedSetupTime(formData: ContainerFormData): number {
    let baseTime = 30; // Base 30 minutes
    
    // Physical containers take longer
    if (formData.type === 'physical') {
      baseTime += 60; // +60 minutes for physical setup
    }
    
    // Virtual with robotics simulation
    if (formData.type === 'virtual' && formData.roboticsSimulationEnabled) {
      baseTime += 20; // +20 minutes for simulation setup
    }
    
    // Ecosystem connections add complexity
    if (formData.ecosystemConnected) {
      baseTime += 45; // +45 minutes for ecosystem integration
    }
    
    // Multiple seed types add time
    if (formData.seedTypes.length > 3) {
      baseTime += (formData.seedTypes.length - 3) * 5; // +5 minutes per additional seed type
    }
    
    return baseTime;
  }

  /**
   * Business rule: Determine container priority based on purpose
   */
  static getContainerPriority(purpose: 'development' | 'research' | 'production'): 'low' | 'medium' | 'high' {
    switch (purpose) {
      case 'production':
        return 'high';
      case 'research':
        return 'medium';
      case 'development':
        return 'low';
      default:
        return 'low';
    }
  }

  /**
   * Business rule: Check if shadow service should be recommended
   */
  static shouldRecommendShadowService(
    type: 'physical' | 'virtual',
    purpose: 'development' | 'research' | 'production'
  ): boolean {
    // Recommend shadow service for production physical containers
    return type === 'physical' && purpose === 'production';
  }

  /**
   * Business rule: Validate ecosystem settings configuration
   */
  static validateEcosystemSettings(
    settings: ContainerFormData['ecosystemSettings'],
    purpose: 'development' | 'research' | 'production'
  ): boolean {
    // MBAI must always be prod
    if (settings.mbai.environment !== 'prod') {
      return false;
    }
    
    // Production containers should use prod environments
    if (purpose === 'production') {
      return settings.fa.environment === 'prod' && 
             settings.aws.environment === 'prod';
    }
    
    // Development containers should avoid prod for FA and AWS
    if (purpose === 'development') {
      return settings.fa.environment === 'alpha' && 
             settings.aws.environment === 'dev';
    }
    
    return true;
  }

  /**
   * Business rule: Get recommended container settings
   */
  static getRecommendedSettings(formData: Partial<ContainerFormData>): Partial<ContainerFormData> {
    const recommendations: Partial<ContainerFormData> = {};
    
    if (formData.type && formData.purpose) {
      // Recommend shadow service
      recommendations.shadowServiceEnabled = this.shouldRecommendShadowService(
        formData.type,
        formData.purpose
      );
      
      // Recommend ecosystem settings
      if (formData.ecosystemConnected) {
        recommendations.ecosystemSettings = this.getEnvironmentSettingsForPurpose(
          formData.purpose
        );
      }
    }
    
    return recommendations;
  }

  /**
   * Business rule: Check if form data represents a valid container configuration
   */
  static isValidContainerConfiguration(formData: ContainerFormData): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Name validation
    if (!this.isValidContainerNameFormat(formData.name)) {
      issues.push('Container name format is invalid');
    }
    
    // Location validation for physical containers
    if (formData.type === 'physical' && !this.isLocationComplete(formData.location)) {
      issues.push('Physical containers require complete location information');
    }
    
    // Seed type validation
    if (!this.isValidSeedTypeSelection(formData.seedTypes)) {
      issues.push('Invalid seed type selection');
    }
    
    // Ecosystem settings validation
    if (formData.ecosystemConnected && 
        !this.validateEcosystemSettings(formData.ecosystemSettings, formData.purpose)) {
      issues.push('Ecosystem settings are not valid for the selected purpose');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
}