// API utilities and services for the application
import { ContainerPurpose, ContainerStatus, ContainerType } from '../types/containers';
import { MetricTimeRange } from '../types/metrics';

// Base API URL - in a real app, would be configured based on environment
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Type definitions
export interface ContainerSummary {
  id: string;
  name: string;
  type: ContainerType;
  tenant_name: string;
  purpose: ContainerPurpose;
  location_city?: string;
  location_country?: string;
  status: ContainerStatus;
  created_at: string;
  updated_at: string;
  has_alerts: boolean;
}

export interface ContainerListResponse {
  total: number;
  results: ContainerSummary[];
}

export interface ContainerStats {
  physical_count: number;
  virtual_count: number;
}

export interface MetricDataPoint {
  date: string;
  value: number;
}

export interface MetricResponse {
  yield_data: MetricDataPoint[];
  space_utilization_data: MetricDataPoint[];
  average_yield: number;
  total_yield: number;
  average_space_utilization: number;
  current_temperature: number;
  current_humidity: number;
  current_co2: number;
  crop_counts: {
    seeded: number;
    transplanted: number;
    harvested: number;
  };
  is_daily: boolean;
}

// Container API Service
export const containerApi = {
  // Get container list with optional filters
  async getContainers(
    params: {
      skip?: number;
      limit?: number;
      name?: string;
      tenant_id?: string;
      type?: ContainerType;
      purpose?: ContainerPurpose;
      status?: ContainerStatus;
      has_alerts?: boolean;
      location?: string;
    } = {},
  ): Promise<ContainerListResponse> {
    // Build query string from params
    const queryParams = new URLSearchParams();

    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.name) queryParams.append('name', params.name);
    if (params.tenant_id) queryParams.append('tenant_id', params.tenant_id);
    if (params.type) queryParams.append('type', params.type);
    if (params.purpose) queryParams.append('purpose', params.purpose);
    if (params.status) queryParams.append('status', params.status);
    if (params.has_alerts !== undefined)
      queryParams.append('has_alerts', params.has_alerts.toString());
    if (params.location) queryParams.append('location', params.location);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_BASE_URL}/containers/${queryString}`);

    if (!response.ok) {
      throw new Error('Failed to fetch containers');
    }

    return await response.json();
  },

  // Get container statistics
  async getContainerStats(): Promise<ContainerStats> {
    const response = await fetch(`${API_BASE_URL}/containers/stats`);

    if (!response.ok) {
      throw new Error('Failed to fetch container stats');
    }

    return await response.json();
  },

  // Get a single container by ID
  async getContainer(id: string) {
    const response = await fetch(`${API_BASE_URL}/containers/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch container with ID ${id}`);
    }

    return await response.json();
  },
};

// Metrics API Service
export const metricsApi = {
  // Get metrics for a container
  async getContainerMetrics(
    containerId: string,
    timeRange: MetricTimeRange = MetricTimeRange.WEEK,
    startDate?: string,
  ): Promise<MetricResponse> {
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('time_range', timeRange);
    if (startDate) queryParams.append('start_date', startDate);

    const response = await fetch(
      `${API_BASE_URL}/metrics/container/${containerId}/?${queryParams.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch metrics for container ${containerId}`);
    }

    return await response.json();
  },

  // Get metric snapshots for a container
  async getMetricSnapshots(
    containerId: string,
    params: {
      start_date?: string;
      end_date?: string;
      limit?: number;
    } = {},
  ) {
    // Build query string
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_BASE_URL}/metrics/snapshots/${containerId}/${queryString}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch metric snapshots for container ${containerId}`);
    }

    return await response.json();
  },
};
