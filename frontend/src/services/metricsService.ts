import { apiRequest } from './api';

// Types matching backend schemas
export type MetricTimeRange = 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';

export interface MetricPoint {
  date: string;
  value: number;
}

export interface MetricCropCounts {
  seeded: number;
  transplanted: number;
  harvested: number;
}

export interface MetricResponse {
  yield_data: MetricPoint[];
  space_utilization_data: MetricPoint[];
  average_yield: number;
  total_yield: number;
  average_space_utilization: number;
  current_temperature: number;
  current_humidity: number;
  current_co2: number;
  crop_counts: MetricCropCounts;
  is_daily: boolean;
}

export interface MetricSnapshot {
  id: string;
  container_id: string;
  air_temperature: number;
  humidity: number;
  co2: number;
  yield_kg: number;
  space_utilization_percentage: number;
  nursery_utilization_percentage?: number;
  cultivation_utilization_percentage?: number;
  timestamp: string;
}

// Service functions to interact with metrics endpoints
const metricsService = {
  // Get metrics for a specific container
  getContainerMetrics: async (
    containerId: string,
    timeRange: MetricTimeRange = 'WEEK',
    startDate?: string,
  ): Promise<MetricResponse> => {
    return apiRequest<MetricResponse>({
      method: 'GET',
      url: `/metrics/container/${containerId}/`,
      params: {
        time_range: timeRange,
        start_date: startDate,
      },
    });
  },

  // Get raw metric snapshots for a container
  getMetricSnapshots: async (
    containerId: string,
    startDate?: string,
    endDate?: string,
    limit: number = 100,
  ): Promise<MetricSnapshot[]> => {
    return apiRequest<MetricSnapshot[]>({
      method: 'GET',
      url: `/metrics/snapshots/${containerId}/`,
      params: {
        start_date: startDate,
        end_date: endDate,
        limit,
      },
    });
  },

  // Create a new metric snapshot
  createMetricSnapshot: async (metricData: Partial<MetricSnapshot>): Promise<MetricSnapshot> => {
    return apiRequest<MetricSnapshot>({
      method: 'POST',
      url: '/metrics/snapshots/',
      data: metricData,
    });
  },
};

export default metricsService;
