// ViewModel for Dashboard Metrics management
// Handles metrics data, real-time updates, and time range filtering

import { 
  DashboardMetricsModel, 
  DashboardMetrics, 
  TimeRange, 
  MetricInterval 
} from '../models/dashboard-metrics.model';
import { metricsApiAdapter, MetricSnapshotApiResponse } from '../services/metrics-api.adapter';

export interface DashboardMetricsState {
  metrics: DashboardMetrics | null;
  isLoading: boolean;
  error: string | null;
  timeRange: TimeRange;
  metricInterval: MetricInterval;
  autoRefreshEnabled: boolean;
  refreshInterval: number;
  lastUpdated: string | null;
}

export class DashboardMetricsViewModel {
  private model: DashboardMetricsModel;
  private containerId: number;
  private onStateChange?: (state: DashboardMetricsState) => void;
  private pollingCleanup?: () => void;
  private currentTimeRange: TimeRange = 'week';
  private currentInterval: MetricInterval = 'day';

  constructor(containerId: number) {
    this.containerId = containerId;
    this.model = new DashboardMetricsModel();
  }

  // State management
  public setStateChangeListener(callback: (state: DashboardMetricsState) => void): void {
    this.onStateChange = callback;
  }

  public getState(): DashboardMetricsState {
    return {
      metrics: this.model.getMetrics(),
      isLoading: false, // Loading state managed by this viewmodel
      error: null, // Error state managed by this viewmodel
      timeRange: this.currentTimeRange,
      metricInterval: this.currentInterval,
      autoRefreshEnabled: this.model.isAutoRefreshEnabled(),
      refreshInterval: this.model.getRefreshInterval(),
      lastUpdated: this.model.getLastUpdatedText()
    };
  }

  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }

  // Core operations
  public async initialize(): Promise<void> {
    try {
      this.notifyStateChange(); // Set loading state

      await this.loadMetrics();
      
      // Start auto-refresh if enabled
      if (this.model.isAutoRefreshEnabled()) {
        this.startAutoRefresh();
      }

    } catch (error) {
      console.error('Failed to initialize dashboard metrics:', error);
      this.notifyStateChange();
    }
  }

  public async loadMetrics(
    timeRange: TimeRange = this.currentTimeRange,
    metricInterval: MetricInterval = this.currentInterval
  ): Promise<void> {
    try {
      this.currentTimeRange = timeRange;
      this.currentInterval = metricInterval;

      const { snapshots } = await metricsApiAdapter.getAggregatedMetrics(
        this.containerId,
        timeRange,
        metricInterval
      );

      if (snapshots.length > 0) {
        const dashboardMetrics = metricsApiAdapter.transformToDashboardMetrics(snapshots);
        this.model.setMetrics(dashboardMetrics);
      }

      this.notifyStateChange();

    } catch (error) {
      console.error('Failed to load metrics:', error);
      this.notifyStateChange();
    }
  }

  public async refreshMetrics(): Promise<void> {
    await this.loadMetrics();
  }

  // Time range and interval management
  public async setTimeRange(timeRange: TimeRange): Promise<void> {
    if (timeRange !== this.currentTimeRange) {
      await this.loadMetrics(timeRange, this.currentInterval);
    }
  }

  public async setMetricInterval(interval: MetricInterval): Promise<void> {
    if (interval !== this.currentInterval) {
      await this.loadMetrics(this.currentTimeRange, interval);
    }
  }

  public getTimeRangeOptions(): Array<{ value: TimeRange; label: string }> {
    return [
      { value: 'week', label: 'Last Week' },
      { value: 'month', label: 'Last Month' },
      { value: 'quarter', label: 'Last Quarter' },
      { value: 'year', label: 'Last Year' }
    ];
  }

  public getIntervalOptions(): Array<{ value: MetricInterval; label: string }> {
    return [
      { value: 'hour', label: 'Hourly' },
      { value: 'day', label: 'Daily' },
      { value: 'week', label: 'Weekly' }
    ];
  }

  // Auto-refresh management
  public startAutoRefresh(): void {
    this.stopAutoRefresh(); // Clear any existing polling

    this.pollingCleanup = metricsApiAdapter.startMetricsPolling(
      this.containerId,
      (newMetrics: MetricSnapshotApiResponse) => {
        this.handleRealtimeUpdate(newMetrics);
      },
      this.model.getRefreshInterval()
    );

    this.model.enableAutoRefresh();
    this.notifyStateChange();
  }

  public stopAutoRefresh(): void {
    if (this.pollingCleanup) {
      this.pollingCleanup();
      this.pollingCleanup = undefined;
    }

    this.model.disableAutoRefresh();
    this.notifyStateChange();
  }

  public toggleAutoRefresh(): void {
    if (this.model.isAutoRefreshEnabled()) {
      this.stopAutoRefresh();
    } else {
      this.startAutoRefresh();
    }
  }

  public setRefreshInterval(intervalMs: number): void {
    this.model.setRefreshInterval(intervalMs);
    
    // Restart polling with new interval if active
    if (this.model.isAutoRefreshEnabled()) {
      this.startAutoRefresh();
    }
  }

  // Real-time update handling
  private handleRealtimeUpdate(newMetrics: MetricSnapshotApiResponse): void {
    const currentMetrics = this.model.getMetrics();
    if (!currentMetrics) return;

    // Update current metrics with new values
    const updatedMetrics: DashboardMetrics = {
      ...currentMetrics,
      air_temperature: this.model.formatTemperature(newMetrics.air_temperature),
      humidity: this.model.formatHumidity(newMetrics.humidity),
      co2: this.model.formatCO2(newMetrics.co2),
      last_updated: new Date(newMetrics.timestamp)
    };

    this.model.setMetrics(updatedMetrics);
    this.notifyStateChange();
  }

  // UI data transformation
  public getCurrentMetrics() {
    return this.model.getMetrics();
  }

  public getFormattedMetrics() {
    const metrics = this.model.getMetrics();
    if (!metrics) return null;

    return {
      temperature: {
        value: metrics.air_temperature.value,
        unit: metrics.air_temperature.unit,
        trend: metrics.air_temperature.trend,
        color: this.getMetricColor('temperature', metrics.air_temperature.value)
      },
      humidity: {
        value: metrics.humidity.value,
        unit: metrics.humidity.unit,
        trend: metrics.humidity.trend,
        color: this.getMetricColor('humidity', metrics.humidity.value)
      },
      co2: {
        value: metrics.co2.value,
        unit: metrics.co2.unit,
        trend: metrics.co2.trend,
        color: this.getMetricColor('co2', metrics.co2.value)
      },
      yield: {
        average: metrics.yield.average,
        total: metrics.yield.total,
        chartData: metrics.yield.chart_data
      },
      spaceUtilization: {
        nursery: metrics.space_utilization.nursery_station,
        cultivation: metrics.space_utilization.cultivation_area,
        chartData: metrics.space_utilization.chart_data
      }
    };
  }

  public getChartData() {
    const metrics = this.model.getMetrics();
    if (!metrics) return null;

    return {
      yieldChart: this.model.getYieldChartData(),
      spaceUtilizationChart: this.model.getSpaceUtilizationChartData()
    };
  }

  public getLastUpdatedText(): string {
    return this.model.getLastUpdatedText();
  }

  public areMetricsStale(): boolean {
    return this.model.areMetricsStale();
  }

  // Metric status and colors
  private getMetricColor(type: string, value: number): 'success' | 'warning' | 'error' | 'info' {
    switch (type) {
      case 'temperature':
        if (value < 18 || value > 28) return 'error';
        if (value < 20 || value > 26) return 'warning';
        return 'success';
      
      case 'humidity':
        if (value < 40 || value > 80) return 'error';
        if (value < 50 || value > 70) return 'warning';
        return 'success';
      
      case 'co2':
        if (value > 1500) return 'error';
        if (value > 1200) return 'warning';
        return 'success';
      
      default:
        return 'info';
    }
  }

  public getMetricStatus(type: string, value: number): 'optimal' | 'warning' | 'critical' {
    const color = this.getMetricColor(type, value);
    switch (color) {
      case 'success':
        return 'optimal';
      case 'warning':
        return 'warning';
      case 'error':
        return 'critical';
      default:
        return 'optimal';
    }
  }

  // Export functionality
  public async exportMetricsData(): Promise<string> {
    const metrics = this.model.getMetrics();
    if (!metrics) {
      throw new Error('No metrics data to export');
    }

    return JSON.stringify({
      container_id: this.containerId,
      time_range: this.currentTimeRange,
      interval: this.currentInterval,
      exported_at: new Date().toISOString(),
      metrics: metrics
    }, null, 2);
  }

  // Cleanup
  public destroy(): void {
    this.stopAutoRefresh();
    this.onStateChange = undefined;
  }
}
