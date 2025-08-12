// API Adapter for Container Overview operations
// Wraps containerApiService with typed operations and data transformation

import { 
  ContainerApiService, 
  ContainerOverviewResponse as ApiContainerOverviewResponse,
  DashboardMetrics,
  CropsSummary,
  ContainerInfo as ApiContainerInfo
} from '../../../api/containerApiService';
import { Container } from '../../../types/containers';
import { ContainerInfo } from '../models/container-overview.model';

// Use the API response type directly
export type ContainerOverviewResponse = ApiContainerOverviewResponse;

export interface DashboardSummaryResponse {
  current_metrics: {
    air_temperature: number;
    humidity: number;
    co2: number;
    yield_kg: number;
    space_utilization_pct: number;
  };
  crop_counts: {
    total_crops: number;
    nursery_crops: number;
    cultivation_crops: number;
    overdue_crops: number;
  };
  activity_count: number;
  last_updated: string;
}

export class ContainerOverviewApiAdapter {
  private containerApiService: ContainerApiService;

  constructor(containerApiService?: ContainerApiService) {
    this.containerApiService = containerApiService || ContainerApiService.getInstance();
  }

  /**
   * Get basic container information
   */
  async getContainerInfo(containerId: number): Promise<ContainerInfo> {
    const overview = await this.containerApiService.getContainerOverview(containerId);
    
    return {
      id: overview.container.id,
      name: overview.container.name,
      type: overview.container.type,
      tenant: overview.container.tenant,
      location: overview.container.location,
      status: overview.container.status
    };
  }

  /**
   * Get comprehensive overview data for the container
   * Uses the unified endpoint that returns all overview tab data
   */
  async getContainerOverview(
    containerId: number,
    timeRange: string = 'week',
    metricInterval: string = 'day'
  ): Promise<ContainerOverviewResponse> {
    try {
      // Use the updated container service method
      const response = await this.containerApiService.getContainerOverview(containerId, timeRange, metricInterval);
      
      // Transform API response if needed
      return this.transformOverviewResponse(response);
    } catch (error) {
      console.error('Failed to fetch container overview:', error);
      throw new Error('Failed to load container overview data');
    }
  }

  /**
   * Get dashboard summary for quick loading
   */
  async getDashboardSummary(containerId: number): Promise<DashboardSummaryResponse> {
    try {
      const response = await this.containerApiService.getDashboardSummary(containerId);
      return response;
    } catch (error) {
      console.error('Failed to fetch dashboard summary:', error);
      throw new Error('Failed to load dashboard summary');
    }
  }

  /**
   * Check container permissions for the current user
   */
  async checkContainerPermissions(containerId: number): Promise<{
    canView: boolean;
    canEdit: boolean;
    canManage: boolean;
  }> {
    try {
      // In a real implementation, this would check JWT claims or make a permissions endpoint call
      // For now, assume basic permissions based on container access
      await this.containerApiService.getContainer(containerId);
      
      return {
        canView: true,
        canEdit: true, // Would be determined by user role/permissions
        canManage: true // Would be determined by user role/permissions
      };
    } catch (error) {
      return {
        canView: false,
        canEdit: false,
        canManage: false
      };
    }
  }

  /**
   * Transform API response to match our domain models
   */
  private transformOverviewResponse(response: ContainerOverviewResponse): ContainerOverviewResponse {
    // Defensive check for response structure
    if (!response || !response.dashboard_metrics) {
      console.warn('⚠️ Backend response missing dashboard_metrics - showing placeholder values (99999/0)');
      return response;
    }

    return {
      ...response,
      dashboard_metrics: {
        ...response.dashboard_metrics,
        yield: response.dashboard_metrics.yield ? {
          ...response.dashboard_metrics.yield,
          chart_data: response.dashboard_metrics.yield.chart_data?.map(point => ({
            ...point,
            date: new Date(point.date).toISOString()
          })) || []
        } : { 
          average: 99999,  // Obvious placeholder to indicate missing data
          total: 99999,    // Obvious placeholder to indicate missing data
          chart_data: [] 
        },
        space_utilization: response.dashboard_metrics.space_utilization ? {
          ...response.dashboard_metrics.space_utilization,
          chart_data: response.dashboard_metrics.space_utilization.chart_data?.map(point => ({
            ...point,
            date: new Date(point.date).toISOString()
          })) || []
        } : { 
          nursery_station: 99999,  // Obvious placeholder to indicate missing data
          cultivation_area: 99999, // Obvious placeholder to indicate missing data
          chart_data: [] 
        }
      },
      recent_activity: response.recent_activity.map(activity => ({
        ...activity,
        timestamp: new Date(activity.timestamp).toISOString()
      }))
    };
  }

  /**
   * Handle API errors with user-friendly messages
   */
  private handleApiError(error: any, operation: string): never {
    if (error.message?.includes('401')) {
      throw new Error('Authentication required. Please log in again.');
    }
    if (error.message?.includes('403')) {
      throw new Error('You do not have permission to access this container.');
    }
    if (error.message?.includes('404')) {
      throw new Error('Container not found.');
    }
    
    console.error(`Container overview ${operation} failed:`, error);
    throw new Error(`Failed to ${operation}. Please try again.`);
  }
}

// Export singleton instance
export const containerOverviewApiAdapter = new ContainerOverviewApiAdapter();
