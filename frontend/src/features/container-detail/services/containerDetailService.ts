// Container Detail Service - High-level orchestration layer
import { containerDetailAdaptor } from './containerDetailAdaptor';
import { metricsPollingService } from './metricsPollingService';
import { 
  ContainerDetailData,
  ContainerDetailError,
  TimeRangeValue,
  ActivityFilters,
  ContainerSettingsUpdateRequest,
  ContainerDetailPermissions,
} from '../types';
import { validateContainerSettings } from './dataTransformers';

/**
 * High-level service for container detail operations
 * Orchestrates data loading, caching, and real-time updates
 */
export class ContainerDetailService {
  /**
   * Initialize container detail view
   */
  async initializeContainer(
    containerId: number,
    timeRange: TimeRangeValue = 'week'
  ): Promise<{
    data: ContainerDetailData;
    permissions: ContainerDetailPermissions;
  }> {
    try {
      // Check access permissions first
      const hasAccess = await containerDetailAdaptor.checkContainerAccess(containerId);
      
      if (!hasAccess) {
        throw new Error('Access denied to container');
      }

      // Load initial data
      const data = await containerDetailAdaptor.loadContainerOverview(containerId, timeRange);
      
      // Determine user permissions (simplified - in real app would check JWT claims)
      const permissions = await this.determinePermissions(containerId);
      
      // Start prefetching additional data
      containerDetailAdaptor.prefetchData(containerId, timeRange);
      
      return { data, permissions };
      
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  /**
   * Start real-time metrics monitoring
   */
  startRealTimeMonitoring(
    containerId: number,
    onUpdate: (metrics: any) => void,
    onError: (error: Error) => void
  ): () => void {
    // Start polling service
    metricsPollingService.startPolling(containerId, {
      enabled: true,
      interval: 30000, // 30 seconds
      maxRetries: 3,
    });

    // Subscribe to updates
    const unsubscribeMetrics = metricsPollingService.subscribe(onUpdate);
    const unsubscribeErrors = metricsPollingService.subscribeToErrors(onError);

    // Return cleanup function
    return () => {
      unsubscribeMetrics();
      unsubscribeErrors();
      metricsPollingService.stopPolling();
    };
  }

  /**
   * Load activity logs with pagination
   */
  async loadActivityLogs(
    containerId: number,
    page: number = 1,
    limit: number = 20,
    filters: ActivityFilters = {}
  ) {
    try {
      return await containerDetailAdaptor.loadActivityLogs(containerId, page, limit, filters);
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  /**
   * Update container settings with validation
   */
  async updateContainerSettings(
    containerId: number,
    settings: ContainerSettingsUpdateRequest
  ) {
    try {
      // Validate settings
      const validation = validateContainerSettings(settings);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
      }

      // Update settings
      const result = await containerDetailAdaptor.updateContainerSettings(containerId, settings);
      
      // Log the activity
      await this.logActivity(containerId, {
        action_type: 'update',
        actor_type: 'user',
        actor_id: 'current_user', // TODO: Get from auth context
        description: 'Container settings updated',
      });

      return result;
      
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  /**
   * Update environment links
   */
  async updateEnvironmentLinks(containerId: number, links: any) {
    try {
      const result = await containerDetailAdaptor.updateEnvironmentLinks(containerId, links);
      
      // Log the activity
      await this.logActivity(containerId, {
        action_type: 'environment',
        actor_type: 'user',
        actor_id: 'current_user', // TODO: Get from auth context
        description: 'Environment links updated',
      });

      return result;
      
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  /**
   * Refresh container data
   */
  async refreshContainerData(
    containerId: number,
    timeRange: TimeRangeValue = 'week'
  ): Promise<ContainerDetailData> {
    try {
      // Clear cache to force fresh data
      containerDetailAdaptor.clearContainerCache(containerId);
      
      // Load fresh data
      return await containerDetailAdaptor.loadContainerOverview(containerId, timeRange);
      
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  /**
   * Get dashboard summary for quick loading
   */
  async getDashboardSummary(containerId: number) {
    try {
      return await containerDetailAdaptor.loadDashboardSummary(containerId);
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  /**
   * Check if container data needs refresh
   */
  shouldRefreshData(lastUpdateTime: string, maxAge: number = 5 * 60 * 1000): boolean {
    const lastUpdate = new Date(lastUpdateTime).getTime();
    const now = Date.now();
    return (now - lastUpdate) > maxAge;
  }

  /**
   * Cleanup resources when leaving container detail view
   */
  cleanup(containerId: number): void {
    // Stop real-time polling
    metricsPollingService.stopPolling();
    
    // Clear cached data (optional - might want to keep for navigation back)
    // containerDetailAdaptor.clearContainerCache(containerId);
  }

  // Private helper methods

  private async determinePermissions(containerId: number): Promise<ContainerDetailPermissions> {
    // TODO: Implement proper permission checking based on JWT claims and container ownership
    // For now, return basic permissions
    return {
      canView: true,
      canEdit: true, // Should check if user owns container or has edit permissions
      canManageSettings: true,
      canViewMetrics: true,
      canViewActivity: true,
      canUpdateEnvironment: true,
    };
  }

  private async logActivity(
    containerId: number,
    activity: {
      action_type: string;
      actor_type: string;
      actor_id: string;
      description: string;
    }
  ): Promise<void> {
    try {
      await containerDetailAdaptor.createActivityLog(containerId, activity);
    } catch (error) {
      // Activity logging is non-critical
      console.warn('Failed to log activity:', error);
    }
  }

  private handleServiceError(error: any): ContainerDetailError {
    if (error instanceof Object && 'type' in error) {
      // Already a ContainerDetailError
      return error as ContainerDetailError;
    }

    // Convert generic error to ContainerDetailError
    return {
      type: 'LOAD_ERROR',
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      retryable: true,
      details: { originalError: error },
    };
  }
}

// Create and export singleton instance
export const containerDetailService = new ContainerDetailService();
