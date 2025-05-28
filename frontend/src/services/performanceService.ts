import { MetricTimeRange } from '../shared/types/metrics';
import { apiRequest } from './api';

export interface PerformanceMetricData {
  labels: string[];
  data: number[];
  avgYield?: number;
  totalYield?: number;
  avgUtilization?: number;
}

export interface ContainerPerformance {
  count: number;
  yield: {
    labels: string[];
    data: number[];
    avgYield: number;
    totalYield: number;
  };
  spaceUtilization: {
    labels: string[];
    data: number[];
    avgUtilization: number;
  };
}

export interface PerformanceResponse {
  physical: ContainerPerformance;
  virtual: ContainerPerformance;
}

// Service to get aggregated performance metrics for both physical and virtual containers
const performanceService = {
  // Get performance metrics grouped by container type
  getPerformanceOverview: async (
    timeRange: MetricTimeRange = MetricTimeRange.WEEK,
  ): Promise<PerformanceResponse> => {
    return apiRequest<PerformanceResponse>({
      method: 'GET',
      url: '/performance',
      params: {
        time_range: timeRange.toUpperCase(),
      },
    });
  },
};

export default performanceService;
