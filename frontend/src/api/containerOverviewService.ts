import { apiConfig } from './config';
import { TokenStorage } from '../utils/tokenStorage';
import {
  ContainerOverview,
  ActivityLogResponse,
  ActivityLogQueryParams,
  MetricSnapshot,
  MetricSnapshotQueryParams,
  CreateMetricSnapshotRequest,
  ContainerSnapshot,
  ContainerSnapshotQueryParams,
  CreateContainerSnapshotRequest,
  ContainerSettingsUpdateRequest,
  ContainerSettingsUpdateResponse,
  EnvironmentLinks,
  UpdateEnvironmentLinksRequest,
  CreateActivityLogRequest,
  ActivityLog,
  DashboardSummary,
  ContainerOverviewQueryParams
} from '../types/containerOverview';

class ContainerOverviewService {
  private baseUrl: string;

  constructor(baseUrl: string = apiConfig.baseUrl) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const token = TokenStorage.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      // Token expired or invalid
      TokenStorage.clearToken();
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    return searchParams.toString();
  }

  async getContainerOverview(
    id: number,
    params?: ContainerOverviewQueryParams
  ): Promise<ContainerOverview> {
    const queryString = params ? `?${this.buildQueryString(params)}` : '';
    const response = await fetch(`${this.baseUrl}/containers/${id}/overview${queryString}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<ContainerOverview>(response);
  }

  async getActivityLogs(
    containerId: number,
    params?: ActivityLogQueryParams
  ): Promise<ActivityLogResponse> {
    const queryString = params ? `?${this.buildQueryString(params)}` : '';
    const response = await fetch(`${this.baseUrl}/containers/${containerId}/activity-logs${queryString}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<ActivityLogResponse>(response);
  }

  async createActivityLog(
    containerId: number,
    activityData: CreateActivityLogRequest
  ): Promise<ActivityLog> {
    const response = await fetch(`${this.baseUrl}/containers/${containerId}/activity-logs`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(activityData)
    });

    return this.handleResponse<ActivityLog>(response);
  }

  async getMetricSnapshots(
    containerId: number,
    params?: MetricSnapshotQueryParams
  ): Promise<MetricSnapshot[]> {
    const queryString = params ? `?${this.buildQueryString(params)}` : '';
    const response = await fetch(`${this.baseUrl}/containers/${containerId}/metric-snapshots${queryString}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<MetricSnapshot[]>(response);
  }

  async createMetricSnapshot(
    containerId: number,
    metricData: CreateMetricSnapshotRequest
  ): Promise<MetricSnapshot> {
    const response = await fetch(`${this.baseUrl}/containers/${containerId}/metric-snapshots`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(metricData)
    });

    return this.handleResponse<MetricSnapshot>(response);
  }

  async getContainerSnapshots(
    containerId: number,
    params?: ContainerSnapshotQueryParams
  ): Promise<ContainerSnapshot[]> {
    const queryString = params ? `?${this.buildQueryString(params)}` : '';
    const response = await fetch(`${this.baseUrl}/containers/${containerId}/snapshots${queryString}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<ContainerSnapshot[]>(response);
  }

  async createContainerSnapshot(
    containerId: number,
    snapshotData: CreateContainerSnapshotRequest
  ): Promise<ContainerSnapshot> {
    const response = await fetch(`${this.baseUrl}/containers/${containerId}/snapshots`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(snapshotData)
    });

    return this.handleResponse<ContainerSnapshot>(response);
  }

  async updateContainerSettings(
    containerId: number,
    settingsData: ContainerSettingsUpdateRequest
  ): Promise<ContainerSettingsUpdateResponse> {
    const response = await fetch(`${this.baseUrl}/containers/${containerId}/settings`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(settingsData)
    });

    return this.handleResponse<ContainerSettingsUpdateResponse>(response);
  }

  async getEnvironmentLinks(containerId: number): Promise<EnvironmentLinks> {
    const response = await fetch(`${this.baseUrl}/containers/${containerId}/environment-links`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<EnvironmentLinks>(response);
  }

  async updateEnvironmentLinks(
    containerId: number,
    linksData: UpdateEnvironmentLinksRequest
  ): Promise<ContainerSettingsUpdateResponse> {
    const response = await fetch(`${this.baseUrl}/containers/${containerId}/environment-links`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(linksData)
    });

    return this.handleResponse<ContainerSettingsUpdateResponse>(response);
  }

  async getDashboardSummary(containerId: number): Promise<DashboardSummary> {
    const response = await fetch(`${this.baseUrl}/containers/${containerId}/dashboard-summary`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<DashboardSummary>(response);
  }

  // Utility methods for common operations
  async getRecentActivity(containerId: number, limit: number = 10): Promise<ActivityLog[]> {
    const response = await this.getActivityLogs(containerId, { limit, page: 1 });
    return response.activities;
  }

  async getLatestMetrics(containerId: number): Promise<MetricSnapshot | null> {
    const snapshots = await this.getMetricSnapshots(containerId, { limit: 1 });
    return snapshots.length > 0 ? snapshots[0] : null;
  }

  async getMetricsForTimeRange(
    containerId: number,
    startDate: string,
    endDate: string,
    interval: 'hour' | 'day' | 'week' = 'day'
  ): Promise<MetricSnapshot[]> {
    return this.getMetricSnapshots(containerId, {
      start_date: startDate,
      end_date: endDate,
      interval
    });
  }

  async searchActivityLogs(
    containerId: number,
    filters: {
      actionType?: string;
      actorType?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ActivityLogResponse> {
    return this.getActivityLogs(containerId, {
      action_type: filters.actionType,
      actor_type: filters.actorType,
      start_date: filters.startDate,
      end_date: filters.endDate,
      page: filters.page,
      limit: filters.limit
    });
  }
}

export const containerOverviewService = new ContainerOverviewService();
export default containerOverviewService;