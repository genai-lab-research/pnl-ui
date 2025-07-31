// Filters API Adapter
// Adapts backend filter options API responses to domain models

import { containerService } from '../../../api';
import { FiltersDomainModel } from '../models';
import { FilterOptions } from '../../../types/containers';

export interface FilterOptionsResult {
  filters: FiltersDomainModel;
  error?: string;
}

export class FiltersApiAdapter {
  private static instance: FiltersApiAdapter;
  private cachedOptions: FilterOptions | null = null;
  private cacheTimestamp: number = 0;
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): FiltersApiAdapter {
    if (!FiltersApiAdapter.instance) {
      FiltersApiAdapter.instance = new FiltersApiAdapter();
    }
    return FiltersApiAdapter.instance;
  }

  /**
   * Get filter options from backend with caching
   */
  async getFilterOptions(forceRefresh: boolean = false): Promise<FilterOptionsResult> {
    try {
      // Check cache validity
      const now = Date.now();
      const isCacheValid = this.cachedOptions && 
        (now - this.cacheTimestamp) < this.cacheTimeout && 
        !forceRefresh;

      if (isCacheValid) {
        return {
          filters: FiltersDomainModel.fromOptions(this.cachedOptions!)
        };
      }

      // Fetch fresh data
      const response = await containerService.getFilterOptions();
      
      // Update cache
      this.cachedOptions = response;
      this.cacheTimestamp = now;
      
      const filters = FiltersDomainModel.fromOptions(response);
      return { filters };
    } catch (error) {
      // If we have cached data, use it as fallback
      if (this.cachedOptions) {
        return {
          filters: FiltersDomainModel.fromOptions(this.cachedOptions),
          error: `Using cached data: ${error instanceof Error ? error.message : 'Failed to fetch filter options'}`
        };
      }

      // No cached data available, return empty filters with error
      return {
        filters: FiltersDomainModel.createEmpty(),
        error: error instanceof Error ? error.message : 'Failed to fetch filter options'
      };
    }
  }

  /**
   * Initialize filters with default options
   */
  async initializeFilters(): Promise<FilterOptionsResult> {
    return this.getFilterOptions(false);
  }

  /**
   * Refresh filter options cache
   */
  async refreshFilterOptions(): Promise<FilterOptionsResult> {
    return this.getFilterOptions(true);
  }

  /**
   * Get tenant options only
   */
  async getTenantOptions(): Promise<{
    tenants: Array<{ id: number; name: string }>;
    error?: string;
  }> {
    try {
      const result = await this.getFilterOptions();
      if (result.error && !result.filters.availableOptions.tenants.length) {
        return {
          tenants: [],
          error: result.error
        };
      }
      
      return {
        tenants: result.filters.availableOptions.tenants
      };
    } catch (error) {
      return {
        tenants: [],
        error: error instanceof Error ? error.message : 'Failed to fetch tenant options'
      };
    }
  }

  /**
   * Get purpose options only
   */
  async getPurposeOptions(): Promise<{
    purposes: string[];
    error?: string;
  }> {
    try {
      const result = await this.getFilterOptions();
      if (result.error && !result.filters.availableOptions.purposes.length) {
        return {
          purposes: [],
          error: result.error
        };
      }
      
      return {
        purposes: result.filters.availableOptions.purposes
      };
    } catch (error) {
      return {
        purposes: [],
        error: error instanceof Error ? error.message : 'Failed to fetch purpose options'
      };
    }
  }

  /**
   * Get status options only
   */
  async getStatusOptions(): Promise<{
    statuses: string[];
    error?: string;
  }> {
    try {
      const result = await this.getFilterOptions();
      if (result.error && !result.filters.availableOptions.statuses.length) {
        return {
          statuses: [],
          error: result.error
        };
      }
      
      return {
        statuses: result.filters.availableOptions.statuses
      };
    } catch (error) {
      return {
        statuses: [],
        error: error instanceof Error ? error.message : 'Failed to fetch status options'
      };
    }
  }

  /**
   * Get container type options only
   */
  async getContainerTypeOptions(): Promise<{
    containerTypes: string[];
    error?: string;
  }> {
    try {
      const result = await this.getFilterOptions();
      if (result.error && !result.filters.availableOptions.container_types.length) {
        return {
          containerTypes: [],
          error: result.error
        };
      }
      
      return {
        containerTypes: result.filters.availableOptions.container_types
      };
    } catch (error) {
      return {
        containerTypes: [],
        error: error instanceof Error ? error.message : 'Failed to fetch container type options'
      };
    }
  }

  /**
   * Validate filter values against available options
   */
  async validateFilters(filters: FiltersDomainModel): Promise<{
    isValid: boolean;
    errors: string[];
    correctedFilters?: FiltersDomainModel;
  }> {
    try {
      const result = await this.getFilterOptions();
      if (result.error) {
        return {
          isValid: false,
          errors: [result.error]
        };
      }

      const availableOptions = result.filters.availableOptions;
      const errors: string[] = [];
      let correctedFilters = filters;

      // Validate tenant
      if (filters.state.tenant !== null && 
          !availableOptions.tenants.some(t => t.id === filters.state.tenant)) {
        errors.push(`Invalid tenant ID: ${filters.state.tenant}`);
        correctedFilters = correctedFilters.withTenant(null);
      }

      // Validate purpose
      if (filters.state.purpose !== 'all' && 
          !availableOptions.purposes.includes(filters.state.purpose)) {
        errors.push(`Invalid purpose: ${filters.state.purpose}`);
        correctedFilters = correctedFilters.withPurpose('all');
      }

      // Validate status
      if (filters.state.status !== 'all' && 
          !availableOptions.statuses.includes(filters.state.status)) {
        errors.push(`Invalid status: ${filters.state.status}`);
        correctedFilters = correctedFilters.withStatus('all');
      }

      // Validate container type
      if (filters.state.type !== 'all' && 
          !availableOptions.container_types.includes(filters.state.type)) {
        errors.push(`Invalid container type: ${filters.state.type}`);
        correctedFilters = correctedFilters.withType('all');
      }

      return {
        isValid: errors.length === 0,
        errors,
        correctedFilters: errors.length > 0 ? correctedFilters : undefined
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Failed to validate filters']
      };
    }
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  clearCache(): void {
    this.cachedOptions = null;
    this.cacheTimestamp = 0;
  }

  /**
   * Check if cache is valid
   */
  isCacheValid(): boolean {
    if (!this.cachedOptions) return false;
    const now = Date.now();
    return (now - this.cacheTimestamp) < this.cacheTimeout;
  }

  /**
   * Get cache age in milliseconds
   */
  getCacheAge(): number {
    if (!this.cachedOptions) return -1;
    return Date.now() - this.cacheTimestamp;
  }

  /**
   * Preload filter options for faster initial rendering
   */
  async preloadFilterOptions(): Promise<void> {
    try {
      await this.getFilterOptions(false);
    } catch (error) {
      // Silently fail for preloading
      console.warn('Failed to preload filter options:', error);
    }
  }
}

export const filtersApiAdapter = FiltersApiAdapter.getInstance();
