// API Adapter for Container Metrics operations
// Handles real-time metrics fetching and polling

import { ContainerApiService } from '../../../api/containerApiService';
import { DashboardMetrics } from '../models/dashboard-metrics.model';

export interface MetricSnapshotApiResponse {
  id: number;
  container_id: number;
  timestamp: string;
  air_temperature: number;
  humidity: number;
  co2: number;
  yield_kg: number;
  space_utilization_pct: number;
}

export interface MetricsQueryParams {
  start_date?: string;
  end_date?: string;
  interval?: 'hour' | 'day' | 'week';
}

export class MetricsApiAdapter {
  private containerApiService: ContainerApiService;

  constructor(containerApiService?: ContainerApiService) {
    this.containerApiService = containerApiService || ContainerApiService.getInstance();
  }

  /**
   * Get current metric snapshots for dashboard display
   */
  async getMetricSnapshots(
    containerId: number, 
    params: MetricsQueryParams = {}
  ): Promise<MetricSnapshotApiResponse[]> {
    const queryParams = this.buildQueryString(params);
    const endpoint = `/containers/${containerId}/metric-snapshots${queryParams}`;
    
    try {
      const response = await this.containerApiService.getMetricSnapshots(
        containerId,
        params.start_date,
        params.end_date,
        params.interval || 'day'
      );
      return response;
    } catch (error) {
      console.warn('⚠️ Backend metric-snapshots endpoint not available - showing placeholder values (99999/0):', error);
      
      // FALLBACK: Return demo metric data if backend endpoint doesn't exist
      return this.getFallbackMetricSnapshots(containerId, params);
    }
  }

  /**
   * Fallback metric data that makes it obvious when real data is not available
   */
  private getFallbackMetricSnapshots(containerId: number, params: MetricsQueryParams): MetricSnapshotApiResponse[] {
    const today = new Date();
    const daysBack = params.interval === 'hour' ? 1 : params.interval === 'week' ? 7 : 30;
    
    const fallbackData: MetricSnapshotApiResponse[] = [];
    
    for (let i = daysBack; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Use obvious placeholder values to indicate missing backend data
      fallbackData.push({
        id: i,
        container_id: containerId,
        timestamp: date.toISOString(),
        air_temperature: 99999, // Obvious placeholder
        humidity: 99999,        // Obvious placeholder  
        co2: 99999,            // Obvious placeholder
        yield_kg: 0,           // Zero to indicate no data
        space_utilization_pct: 0 // Zero to indicate no data
      });
    }
    
    return fallbackData;
  }

  /**
   * Get the most recent metrics for real-time display
   */
  async getCurrentMetrics(containerId: number): Promise<MetricSnapshotApiResponse | null> {
    try {
      const snapshots = await this.getMetricSnapshots(containerId, {
        interval: 'hour'
      });
      
      // Return the most recent snapshot
      if (snapshots.length > 0) {
        return snapshots.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch current metrics:', error);
      throw new Error('Failed to load current metrics');
    }
  }

  /**
   * Create a new metric snapshot (for testing or manual entry)
   */
  async createMetricSnapshot(
    containerId: number,
    metrics: {
      air_temperature: number;
      humidity: number;
      co2: number;
      yield_kg: number;
      space_utilization_pct: number;
    }
  ): Promise<MetricSnapshotApiResponse> {
    const endpoint = `/containers/${containerId}/metric-snapshots`;
    
    try {
      const response = await this.containerApiService['makeAuthenticatedRequest']<MetricSnapshotApiResponse>(endpoint, {
        method: 'POST',
        body: JSON.stringify(metrics)
      });
      
      return response;
    } catch (error) {
      console.error('Failed to create metric snapshot:', error);
      throw new Error('Failed to save metrics');
    }
  }

  /**
   * Get metrics for a specific time range with aggregation
   */
  async getAggregatedMetrics(
    containerId: number,
    timeRange: 'week' | 'month' | 'quarter' | 'year',
    interval: 'hour' | 'day' | 'week' = 'day'
  ): Promise<{
    snapshots: MetricSnapshotApiResponse[];
    aggregated: {
      air_temperature: { avg: number; min: number; max: number };
      humidity: { avg: number; min: number; max: number };
      co2: { avg: number; min: number; max: number };
      yield_kg: { total: number; avg: number };
      space_utilization_pct: { avg: number; min: number; max: number };
    };
  }> {
    const endDate = new Date();
    const startDate = new Date();
    
    // Calculate start date based on time range
    switch (timeRange) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    const snapshots = await this.getMetricSnapshots(containerId, {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      interval
    });

    // Calculate aggregations
    const aggregated = this.calculateAggregations(snapshots);

    return { snapshots, aggregated };
  }

  /**
   * Transform metric snapshots to dashboard metrics format
   */
  transformToDashboardMetrics(
    snapshots: MetricSnapshotApiResponse[]
  ): DashboardMetrics {
    if (snapshots.length === 0) {
      throw new Error('No metric data available');
    }

    const latest = snapshots[snapshots.length - 1];
    const chartData = snapshots.map(snapshot => ({
      date: snapshot.timestamp,
      value: snapshot.yield_kg,
      is_current_period: true,
      is_future: false
    }));

    const spaceUtilizationData = snapshots.map(snapshot => ({
      date: snapshot.timestamp,
      nursery_value: snapshot.space_utilization_pct * 0.6, // Example split
      cultivation_value: snapshot.space_utilization_pct * 0.4,
      is_current_period: true,
      is_future: false
    }));

    return {
      air_temperature: {
        value: latest.air_temperature,
        unit: '°C'
      },
      humidity: {
        value: latest.humidity,
        unit: '%'
      },
      co2: {
        value: latest.co2,
        unit: 'ppm'
      },
      yield: {
        average: snapshots.reduce((sum, s) => sum + s.yield_kg, 0) / snapshots.length,
        total: snapshots.reduce((sum, s) => sum + s.yield_kg, 0),
        chart_data: chartData
      },
      space_utilization: {
        nursery_station: latest.space_utilization_pct * 0.6,
        cultivation_area: latest.space_utilization_pct * 0.4,
        chart_data: spaceUtilizationData
      },
      last_updated: new Date(latest.timestamp)
    };
  }

  /**
   * Start polling for real-time metrics updates
   */
  startMetricsPolling(
    containerId: number,
    callback: (metrics: MetricSnapshotApiResponse) => void,
    intervalMs: number = 15000
  ): () => void {
    const pollMetrics = async () => {
      try {
        const currentMetrics = await this.getCurrentMetrics(containerId);
        if (currentMetrics) {
          callback(currentMetrics);
        }
      } catch (error) {
        console.error('Metrics polling error:', error);
      }
    };

    // Initial load
    pollMetrics();

    // Set up interval
    const intervalId = setInterval(pollMetrics, intervalMs);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }

  /**
   * Calculate statistical aggregations for metrics
   */
  private calculateAggregations(snapshots: MetricSnapshotApiResponse[]) {
    if (snapshots.length === 0) {
      return {
        air_temperature: { avg: 0, min: 0, max: 0 },
        humidity: { avg: 0, min: 0, max: 0 },
        co2: { avg: 0, min: 0, max: 0 },
        yield_kg: { total: 0, avg: 0 },
        space_utilization_pct: { avg: 0, min: 0, max: 0 }
      };
    }

    const temperatures = snapshots.map(s => s.air_temperature);
    const humidities = snapshots.map(s => s.humidity);
    const co2Values = snapshots.map(s => s.co2);
    const yieldValues = snapshots.map(s => s.yield_kg);
    const spaceValues = snapshots.map(s => s.space_utilization_pct);

    return {
      air_temperature: {
        avg: temperatures.reduce((a, b) => a + b, 0) / temperatures.length,
        min: Math.min(...temperatures),
        max: Math.max(...temperatures)
      },
      humidity: {
        avg: humidities.reduce((a, b) => a + b, 0) / humidities.length,
        min: Math.min(...humidities),
        max: Math.max(...humidities)
      },
      co2: {
        avg: co2Values.reduce((a, b) => a + b, 0) / co2Values.length,
        min: Math.min(...co2Values),
        max: Math.max(...co2Values)
      },
      yield_kg: {
        total: yieldValues.reduce((a, b) => a + b, 0),
        avg: yieldValues.reduce((a, b) => a + b, 0) / yieldValues.length
      },
      space_utilization_pct: {
        avg: spaceValues.reduce((a, b) => a + b, 0) / spaceValues.length,
        min: Math.min(...spaceValues),
        max: Math.max(...spaceValues)
      }
    };
  }

  /**
   * Build query string from parameters
   */
  private buildQueryString(params: Record<string, any>): string {
    const filtered = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => [key, String(value)]);
    
    if (filtered.length === 0) return '';
    
    const searchParams = new URLSearchParams(filtered);
    return `?${searchParams.toString()}`;
  }
}

// Export singleton instance
export const metricsApiAdapter = new MetricsApiAdapter();
