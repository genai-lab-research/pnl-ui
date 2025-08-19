/**
 * Metric Snapshot Service
 * Handles all metric snapshot related API operations
 * Based on p2_routing.md specifications
 */

import { BaseApiService } from './baseApiService';
import { 
  MetricSnapshot, 
  MetricSnapshotFilterCriteria, 
  MetricSnapshotListResponse,
  MetricStatistics,
  MetricThreshold,
  CreateMetricThresholdRequest,
  MetricComparison,
  MetricStreamSubscription,
  MetricType,
  MetricInterval
} from '../types/metricSnapshots';
import { ApiError } from './index';

export class MetricSnapshotService extends BaseApiService {
  private static instance: MetricSnapshotService;

  private constructor(baseURL: string = '/api/v1') {
    super(baseURL);
  }

  public static getInstance(baseURL?: string): MetricSnapshotService {
    if (!MetricSnapshotService.instance) {
      MetricSnapshotService.instance = new MetricSnapshotService(baseURL);
    }
    return MetricSnapshotService.instance;
  }

  /**
   * Get metric snapshots with optional filtering and aggregation
   */
  public async getMetricSnapshots(filters?: MetricSnapshotFilterCriteria): Promise<MetricSnapshotListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const url = `/metrics/snapshots/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<MetricSnapshotListResponse>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch metric snapshots');
    }
  }

  /**
   * Get metric statistics for a specific metric type
   */
  public async getMetricStatistics(
    containerId: number,
    metricType: MetricType,
    startDate: string,
    endDate: string
  ): Promise<MetricStatistics> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('container_id', containerId.toString());
      queryParams.append('metric_type', metricType);
      queryParams.append('start_date', startDate);
      queryParams.append('end_date', endDate);

      const response = await this.makeAuthenticatedRequest<MetricStatistics>(`/metrics/statistics?${queryParams.toString()}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch metric statistics');
    }
  }

  /**
   * Get latest metrics for a container
   */
  public async getLatestMetrics(containerId: number): Promise<MetricSnapshot> {
    try {
      const response = await this.makeAuthenticatedRequest<MetricSnapshot>(`/metrics/snapshots/latest/${containerId}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch latest metrics for container ${containerId}`);
    }
  }

  /**
   * Get metric trends for multiple containers
   */
  public async getMetricTrends(
    containerIds: number[],
    metricTypes: MetricType[],
    startDate: string,
    endDate: string,
    interval: MetricInterval = '1h'
  ): Promise<Array<{
    container_id: number;
    metric_type: MetricType;
    data_points: Array<{ timestamp: string; value: number }>;
  }>> {
    try {
      const requestBody = {
        container_ids: containerIds,
        metric_types: metricTypes,
        start_date: startDate,
        end_date: endDate,
        interval
      };

      const response = await this.makeAuthenticatedRequest<Array<{
        container_id: number;
        metric_type: MetricType;
        data_points: Array<{ timestamp: string; value: number }>;
      }>>('/metrics/trends', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch metric trends');
    }
  }

  /**
   * Create metric threshold for alerts
   */
  public async createMetricThreshold(thresholdData: CreateMetricThresholdRequest): Promise<MetricThreshold> {
    try {
      const response = await this.makeAuthenticatedRequest<MetricThreshold>('/metrics/thresholds', {
        method: 'POST',
        body: JSON.stringify(thresholdData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create metric threshold');
    }
  }

  /**
   * Get metric thresholds for a container
   */
  public async getMetricThresholds(containerId: number): Promise<MetricThreshold[]> {
    try {
      const response = await this.makeAuthenticatedRequest<MetricThreshold[]>(`/metrics/thresholds/${containerId}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch metric thresholds for container ${containerId}`);
    }
  }

  /**
   * Update metric threshold
   */
  public async updateMetricThreshold(
    thresholdId: number, 
    thresholdData: Partial<CreateMetricThresholdRequest>
  ): Promise<MetricThreshold> {
    try {
      const response = await this.makeAuthenticatedRequest<MetricThreshold>(`/metrics/thresholds/${thresholdId}`, {
        method: 'PUT',
        body: JSON.stringify(thresholdData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update metric threshold ${thresholdId}`);
    }
  }

  /**
   * Delete metric threshold
   */
  public async deleteMetricThreshold(thresholdId: number): Promise<{ message: string }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string }>(`/metrics/thresholds/${thresholdId}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to delete metric threshold ${thresholdId}`);
    }
  }

  /**
   * Compare metrics between containers or time periods
   */
  public async compareMetrics(
    comparisonType: 'container_vs_container' | 'time_period' | 'against_benchmark',
    baselineId: string,
    comparisonId: string,
    metricTypes: MetricType[],
    startDate: string,
    endDate: string
  ): Promise<MetricComparison> {
    try {
      const requestBody = {
        comparison_type: comparisonType,
        baseline_id: baselineId,
        comparison_id: comparisonId,
        metric_types: metricTypes,
        start_date: startDate,
        end_date: endDate
      };

      const response = await this.makeAuthenticatedRequest<MetricComparison>('/metrics/compare', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to compare metrics');
    }
  }

  /**
   * Export metrics data
   */
  public async exportMetrics(
    containerId: number,
    startDate: string,
    endDate: string,
    format: 'csv' | 'json' | 'excel' = 'csv',
    metricTypes?: MetricType[]
  ): Promise<{ download_url: string; expires_at: string }> {
    try {
      const requestBody = {
        container_id: containerId,
        start_date: startDate,
        end_date: endDate,
        format,
        metric_types: metricTypes
      };

      const response = await this.makeAuthenticatedRequest<{ download_url: string; expires_at: string }>('/metrics/export', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to export metrics');
    }
  }

  /**
   * Subscribe to real-time metric updates
   */
  public async subscribeToMetrics(
    containerIds: number[],
    metricTypes: MetricType[],
    updateFrequency: MetricInterval,
    callbackUrl?: string
  ): Promise<MetricStreamSubscription> {
    try {
      const requestBody = {
        container_ids: containerIds,
        metric_types: metricTypes,
        update_frequency: updateFrequency,
        callback_url: callbackUrl
      };

      const response = await this.makeAuthenticatedRequest<MetricStreamSubscription>('/metrics/subscribe', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to subscribe to metrics');
    }
  }

  /**
   * Unsubscribe from metric updates
   */
  public async unsubscribeFromMetrics(subscriptionId: string): Promise<{ message: string }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string }>(`/metrics/unsubscribe/${subscriptionId}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to unsubscribe from metrics subscription ${subscriptionId}`);
    }
  }

  /**
   * Get metric dashboard summary
   */
  public async getMetricDashboard(containerId?: number): Promise<{
    current_metrics: Record<MetricType, number>;
    alerts: Array<{ metric_type: MetricType; message: string; severity: string }>;
    trends: Record<MetricType, 'up' | 'down' | 'stable'>;
    last_updated: string;
  }> {
    try {
      const queryParams = containerId ? `?container_id=${containerId}` : '';
      const response = await this.makeAuthenticatedRequest<{
        current_metrics: Record<MetricType, number>;
        alerts: Array<{ metric_type: MetricType; message: string; severity: string }>;
        trends: Record<MetricType, 'up' | 'down' | 'stable'>;
        last_updated: string;
      }>(`/metrics/dashboard${queryParams}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch metric dashboard');
    }
  }
}

// Create and export singleton instance
export const metricSnapshotService = MetricSnapshotService.getInstance();

// Export utility functions for easier usage
export const getMetricSnapshots = (filters?: MetricSnapshotFilterCriteria): Promise<MetricSnapshotListResponse> => 
  metricSnapshotService.getMetricSnapshots(filters);

export const getMetricStatistics = (
  containerId: number,
  metricType: MetricType,
  startDate: string,
  endDate: string
): Promise<MetricStatistics> => 
  metricSnapshotService.getMetricStatistics(containerId, metricType, startDate, endDate);

export const getLatestMetrics = (containerId: number): Promise<MetricSnapshot> => 
  metricSnapshotService.getLatestMetrics(containerId);

export const getMetricTrends = (
  containerIds: number[],
  metricTypes: MetricType[],
  startDate: string,
  endDate: string,
  interval: MetricInterval = '1h'
): Promise<Array<{
  container_id: number;
  metric_type: MetricType;
  data_points: Array<{ timestamp: string; value: number }>;
}>> => 
  metricSnapshotService.getMetricTrends(containerIds, metricTypes, startDate, endDate, interval);

export const createMetricThreshold = (thresholdData: CreateMetricThresholdRequest): Promise<MetricThreshold> => 
  metricSnapshotService.createMetricThreshold(thresholdData);

export const getMetricThresholds = (containerId: number): Promise<MetricThreshold[]> => 
  metricSnapshotService.getMetricThresholds(containerId);

export const updateMetricThreshold = (
  thresholdId: number, 
  thresholdData: Partial<CreateMetricThresholdRequest>
): Promise<MetricThreshold> => 
  metricSnapshotService.updateMetricThreshold(thresholdId, thresholdData);

export const deleteMetricThreshold = (thresholdId: number): Promise<{ message: string }> => 
  metricSnapshotService.deleteMetricThreshold(thresholdId);

export const compareMetrics = (
  comparisonType: 'container_vs_container' | 'time_period' | 'against_benchmark',
  baselineId: string,
  comparisonId: string,
  metricTypes: MetricType[],
  startDate: string,
  endDate: string
): Promise<MetricComparison> => 
  metricSnapshotService.compareMetrics(comparisonType, baselineId, comparisonId, metricTypes, startDate, endDate);

export const exportMetrics = (
  containerId: number,
  startDate: string,
  endDate: string,
  format: 'csv' | 'json' | 'excel' = 'csv',
  metricTypes?: MetricType[]
): Promise<{ download_url: string; expires_at: string }> => 
  metricSnapshotService.exportMetrics(containerId, startDate, endDate, format, metricTypes);

export const subscribeToMetrics = (
  containerIds: number[],
  metricTypes: MetricType[],
  updateFrequency: MetricInterval,
  callbackUrl?: string
): Promise<MetricStreamSubscription> => 
  metricSnapshotService.subscribeToMetrics(containerIds, metricTypes, updateFrequency, callbackUrl);

export const unsubscribeFromMetrics = (subscriptionId: string): Promise<{ message: string }> => 
  metricSnapshotService.unsubscribeFromMetrics(subscriptionId);

export const getMetricDashboard = (containerId?: number): Promise<{
  current_metrics: Record<MetricType, number>;
  alerts: Array<{ metric_type: MetricType; message: string; severity: string }>;
  trends: Record<MetricType, 'up' | 'down' | 'stable'>;
  last_updated: string;
}> => 
  metricSnapshotService.getMetricDashboard(containerId);
