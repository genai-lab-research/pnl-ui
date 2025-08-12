import {
  Container,
  ActivityLog,
  MetricSnapshot,
  EnvironmentLink,
  ContainerFilterCriteria,
  ShutdownRequest,
  ShutdownResponse,
} from '../types/containers';
import { BaseApiService } from './baseApiService';

// Container Overview Response Types based on p4_routing.md
export interface YieldDataPoint {
  date: string;
  value: number;
  is_current_period: boolean;
  is_future: boolean;
}

export interface UtilizationDataPoint {
  date: string;
  nursery_value: number;
  cultivation_value: number;
  is_current_period: boolean;
  is_future: boolean;
}

export interface YieldMetrics {
  average: number;
  total: number;
  chart_data: YieldDataPoint[];
}

export interface SpaceUtilizationMetrics {
  nursery_station: number;
  cultivation_area: number;
  chart_data: UtilizationDataPoint[];
}

export interface DashboardMetrics {
  air_temperature: number;
  humidity: number;
  co2: number;
  yield: YieldMetrics;
  space_utilization: SpaceUtilizationMetrics;
}

export interface CropsSummary {
  seed_type: string;
  nursery_station_count: number;
  cultivation_area_count: number;
  last_seeding_date: string | null;
  last_transplanting_date: string | null;
  last_harvesting_date: string | null;
  average_age: number;
  overdue_count: number;
}

export interface ContainerInfo {
  id: number;
  name: string;
  type: string;
  tenant: {
    id: number;
    name: string;
  };
  location: Record<string, any>;
  status: string;
}

export interface ContainerOverviewResponse {
  container: ContainerInfo;
  dashboard_metrics: DashboardMetrics;
  crops_summary: CropsSummary[];
  recent_activity: ActivityLog[];
}

export interface ActivityLogsResponse {
  activities: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

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

export interface ContainerSettingsUpdateRequest {
  tenant_id?: number;
  purpose?: string;
  location?: Record<string, any>;
  notes?: string;
  shadow_service_enabled?: boolean;
  copied_environment_from?: number;
  robotics_simulation_enabled?: boolean;
  ecosystem_connected?: boolean;
  ecosystem_settings?: Record<string, any>;
}

export interface ContainerSettingsUpdateResponse {
  success: boolean;
  message: string;
  updated_at: string;
}

/**
 * Container API Service implementing unified authentication pattern
 * MUST be used for all container operations as per p4_description.md requirements
 */
export class ContainerApiService extends BaseApiService {
  private static instance: ContainerApiService;

  private constructor() {
    super('/api/v1');
  }

  public static getInstance(): ContainerApiService {
    if (!ContainerApiService.instance) {
      ContainerApiService.instance = new ContainerApiService();
    }
    return ContainerApiService.instance;
  }

  // Core Container Operations

  /**
   * Get a specific container by ID
   */
  public async getContainer(id: number): Promise<Container> {
    return this.get<Container>(`/containers/${id}`);
  }

  /**
   * Get comprehensive overview data for a specific container (Overview Tab 2.1)
   * This is the main endpoint for the Container Overview page
   */
  public async getContainerOverview(
    id: number,
    timeRange: string = 'week',
    metricInterval: string = 'day'
  ): Promise<ContainerOverviewResponse> {
    const params = new URLSearchParams({
      time_range: timeRange,
      metric_interval: metricInterval
    });
    return this.get<ContainerOverviewResponse>(`/containers/${id}/overview?${params}`);
  }

  /**
   * Get paginated activity logs for the container
   */
  public async getActivityLogs(
    id: number,
    page: number = 1,
    limit: number = 20,
    startDate?: string,
    endDate?: string,
    actionType?: string,
    actorType?: string
  ): Promise<ActivityLogsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (actionType) params.append('action_type', actionType);
    if (actorType) params.append('actor_type', actorType);

    return this.get<ActivityLogsResponse>(`/containers/${id}/activity-logs?${params}`);
  }

  /**
   * Get metric snapshots for dashboard charts
   */
  public async getMetricSnapshots(
    id: number,
    startDate?: string,
    endDate?: string,
    interval: string = 'day'
  ): Promise<MetricSnapshot[]> {
    const params = new URLSearchParams({ interval });
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    return this.get<MetricSnapshot[]>(`/containers/${id}/metric-snapshots?${params}`);
  }

  /**
   * Create a new metric snapshot
   */
  public async createMetricSnapshot(
    id: number,
    snapshot: Omit<MetricSnapshot, 'id' | 'container_id' | 'timestamp'>
  ): Promise<MetricSnapshot> {
    return this.post<MetricSnapshot>(`/containers/${id}/metric-snapshots`, snapshot);
  }

  /**
   * Get container snapshots for historical state tracking
   */
  public async getContainerSnapshots(
    id: number,
    startDate?: string,
    endDate?: string,
    limit: number = 100
  ): Promise<any[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    return this.get<any[]>(`/containers/${id}/snapshots?${params}`);
  }

  /**
   * Create a new container snapshot for historical tracking
   */
  public async createContainerSnapshot(id: number, snapshot: any): Promise<any> {
    return this.post<any>(`/containers/${id}/snapshots`, snapshot);
  }

  /**
   * Update container settings from the overview tab settings section
   */
  public async updateContainerSettings(
    id: number,
    settings: ContainerSettingsUpdateRequest
  ): Promise<ContainerSettingsUpdateResponse> {
    return this.put<ContainerSettingsUpdateResponse>(`/containers/${id}/settings`, settings);
  }

  /**
   * Get environment links for ecosystem connectivity
   */
  public async getEnvironmentLinks(id: number): Promise<EnvironmentLink> {
    return this.get<EnvironmentLink>(`/containers/${id}/environment-links`);
  }

  /**
   * Update environment links for ecosystem connectivity
   */
  public async updateEnvironmentLinks(
    id: number,
    links: Partial<EnvironmentLink>
  ): Promise<ContainerSettingsUpdateResponse> {
    return this.put<ContainerSettingsUpdateResponse>(`/containers/${id}/environment-links`, links);
  }

  /**
   * Create a new activity log entry
   */
  public async createActivityLog(
    id: number,
    activity: {
      action_type: string;
      actor_type: string;
      actor_id: string;
      description: string;
    }
  ): Promise<ActivityLog> {
    return this.post<ActivityLog>(`/containers/${id}/activity-logs`, activity);
  }

  /**
   * Get dashboard summary for quick loading
   */
  public async getDashboardSummary(id: number): Promise<DashboardSummaryResponse> {
    return this.get<DashboardSummaryResponse>(`/containers/${id}/dashboard-summary`);
  }

  // Legacy Container Service Methods for Backward Compatibility

  /**
   * Get a list of containers with optional filtering and pagination
   */
  public async getContainers(filters: ContainerFilterCriteria = {}): Promise<any> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    return this.get<any>(`/containers${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Create a new container
   */
  public async createContainer(containerData: any): Promise<Container> {
    return this.post<Container>('/containers/', containerData);
  }

  /**
   * Update an existing container
   */
  public async updateContainer(id: number, containerData: any): Promise<Container> {
    return this.put<Container>(`/containers/${id}`, containerData);
  }

  /**
   * Delete a container
   */
  public async deleteContainer(id: number): Promise<void> {
    return this.delete<void>(`/containers/${id}`);
  }

  /**
   * Shutdown a container
   */
  public async shutdownContainer(id: number, shutdownData: ShutdownRequest = {}): Promise<ShutdownResponse> {
    return this.post<ShutdownResponse>(`/containers/${id}/shutdown`, shutdownData);
  }

  /**
   * Get available filter options for the dashboard
   */
  public async getFilterOptions(): Promise<any> {
    return this.get<any>('/containers/filter-options');
  }
}

// Create and export singleton instance
export const containerApiService = ContainerApiService.getInstance();