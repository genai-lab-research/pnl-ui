// Container Detail API Adaptor Service
import { 
  containerApiService,
  ContainerOverviewResponse,
  ActivityLogsResponse,
  DashboardSummaryResponse,
  ContainerSettingsUpdateResponse,
} from '../../../api/containerApiService';
import { MetricSnapshot, EnvironmentLink } from '../../../types/containers';
import { 
  ContainerDetailData,
  ContainerActivityState,
  ActivityFilters,
  ContainerDetailError,
  TimeRangeValue,
  METRIC_INTERVALS,
  ContainerSettingsUpdateRequest,
} from '../types';
import { 
  transformContainerOverview,
  transformActivityLogsResponse,
} from './dataTransformers';

/**
 * Container Detail Adaptor - Domain-specific wrapper around containerApiService
 * Handles data transformation, error handling, and caching for container detail operations
 */
export class ContainerDetailAdaptor {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Load comprehensive container overview data
   */
  async loadContainerOverview(
    containerId: number,
    timeRange: TimeRangeValue = 'week'
  ): Promise<ContainerDetailData> {
    const cacheKey = `overview-${containerId}-${timeRange}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const metricInterval = METRIC_INTERVALS[timeRange];
      const response = await containerApiService.getContainerOverview(
        containerId,
        {
          time_range: timeRange,
          metric_interval: metricInterval
        }
      );
      
      const transformedData = transformContainerOverview(response);
      this.setCachedData(cacheKey, transformedData);
      
      return transformedData;
    } catch (error) {
      throw this.handleApiError(error, 'LOAD_ERROR');
    }
  }

  /**
   * Load paginated activity logs with filtering
   */
  async loadActivityLogs(
    containerId: number,
    page: number = 1,
    limit: number = 20,
    filters: ActivityFilters = {}
  ): Promise<ContainerActivityState> {
    try {
      const response = await containerApiService.getActivityLogs(
        containerId,
        {
          page,
          limit,
          start_date: filters.startDate,
          end_date: filters.endDate,
          action_type: filters.actionType,
          actor_type: filters.actorType
        }
      );
      
      return transformActivityLogsResponse(response);
    } catch (error) {
      throw this.handleApiError(error, 'LOAD_ERROR');
    }
  }

  /**
   * Load real-time metric snapshots
   */
  async loadMetricSnapshots(
    containerId: number,
    startDate?: string,
    endDate?: string,
    interval: string = 'day'
  ): Promise<MetricSnapshot[]> {
    try {
      return await containerApiService.getMetricSnapshots(
        containerId,
        {
          start_date: startDate,
          end_date: endDate,
          interval
        }
      );
    } catch (error) {
      throw this.handleApiError(error, 'LOAD_ERROR');
    }
  }

  /**
   * Load dashboard summary for quick overview
   */
  async loadDashboardSummary(containerId: number): Promise<DashboardSummaryResponse> {
    const cacheKey = `summary-${containerId}`;
    const cached = this.getCachedData(cacheKey, 30000); // 30 second cache
    
    if (cached) {
      return cached;
    }

    try {
      const summary = await containerApiService.getDashboardSummary(containerId);
      this.setCachedData(cacheKey, summary, 30000);
      return summary;
    } catch (error) {
      throw this.handleApiError(error, 'LOAD_ERROR');
    }
  }

  /**
   * Update container settings
   */
  async updateContainerSettings(
    containerId: number,
    settings: ContainerSettingsUpdateRequest
  ): Promise<ContainerSettingsUpdateResponse> {
    try {
      const response = await containerApiService.updateContainerSettings(containerId, settings);
      
      // Invalidate related cache entries
      this.invalidateCache(`overview-${containerId}`);
      this.invalidateCache(`summary-${containerId}`);
      
      return response;
    } catch (error) {
      throw this.handleApiError(error, 'VALIDATION_ERROR');
    }
  }

  /**
   * Load environment links
   */
  async loadEnvironmentLinks(containerId: number): Promise<EnvironmentLink> {
    const cacheKey = `env-links-${containerId}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const links = await containerApiService.getEnvironmentLinks(containerId);
      this.setCachedData(cacheKey, links);
      return links;
    } catch (error) {
      throw this.handleApiError(error, 'LOAD_ERROR');
    }
  }

  /**
   * Update environment links
   */
  async updateEnvironmentLinks(
    containerId: number,
    links: Partial<EnvironmentLink>
  ): Promise<ContainerSettingsUpdateResponse> {
    try {
      const response = await containerApiService.updateEnvironmentLinks(containerId, links);
      
      // Invalidate cache
      this.invalidateCache(`env-links-${containerId}`);
      
      return response;
    } catch (error) {
      throw this.handleApiError(error, 'VALIDATION_ERROR');
    }
  }

  /**
   * Create activity log entry
   */
  async createActivityLog(
    containerId: number,
    activity: {
      action_type: string;
      actor_type: string;
      actor_id: string;
      description: string;
    }
  ): Promise<void> {
    try {
      await containerApiService.createActivityLog(containerId, activity);
      
      // Invalidate activity-related cache
      this.invalidateCache(`overview-${containerId}`);
    } catch (error) {
      throw this.handleApiError(error, 'VALIDATION_ERROR');
    }
  }

  /**
   * Check if user has permission to access container
   */
  async checkContainerAccess(containerId: number): Promise<boolean> {
    try {
      // Attempt to load basic container info
      await containerApiService.getContainer(containerId);
      return true;
    } catch (error: any) {
      if (error.message.includes('403') || error.message.includes('Access denied')) {
        return false;
      }
      // Re-throw other errors
      throw this.handleApiError(error, 'PERMISSION_ERROR');
    }
  }

  /**
   * Prefetch data for better performance
   */
  async prefetchData(containerId: number, timeRange: TimeRangeValue): Promise<void> {
    try {
      // Load essential data in parallel
      await Promise.allSettled([
        this.loadContainerOverview(containerId, timeRange),
        this.loadDashboardSummary(containerId),
        this.loadEnvironmentLinks(containerId),
      ]);
    } catch (error) {
      // Prefetch errors are non-critical
      console.warn('Prefetch failed:', error);
    }
  }

  /**
   * Clear all cached data for a container
   */
  clearContainerCache(containerId: number): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(`-${containerId}`)
    );
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Clear all cached data
   */
  clearAllCache(): void {
    this.cache.clear();
  }

  // Private helper methods

  private getCachedData(key: string, customTtl?: number): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    const ttl = customTtl || cached.ttl;
    
    if (now - cached.timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  private setCachedData(key: string, data: any, customTtl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: customTtl || this.CACHE_TTL,
    });
  }

  private invalidateCache(keyPattern: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(keyPattern)
    );
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private handleApiError(error: any, type: ContainerDetailError['type']): ContainerDetailError {
    const baseError = {
      type,
      timestamp: new Date().toISOString(),
      retryable: false,
    };

    if (error.message?.includes('401') || error.message?.includes('Authentication required')) {
      return {
        ...baseError,
        type: 'PERMISSION_ERROR',
        message: 'Authentication required. Please log in again.',
        code: '401',
        retryable: false,
      };
    }

    if (error.message?.includes('403') || error.message?.includes('Access denied')) {
      return {
        ...baseError,
        type: 'PERMISSION_ERROR',
        message: 'You do not have permission to access this container.',
        code: '403',
        retryable: false,
      };
    }

    if (error.message?.includes('Network') || error.message?.includes('fetch')) {
      return {
        ...baseError,
        type: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection and try again.',
        retryable: true,
      };
    }

    return {
      ...baseError,
      message: error.message || 'An unexpected error occurred',
      details: { originalError: error },
      retryable: type === 'LOAD_ERROR',
    };
  }
}

// Create and export singleton instance
export const containerDetailAdaptor = new ContainerDetailAdaptor();
