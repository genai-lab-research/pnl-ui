// Domain models for dashboard metrics
// Handles metric data, chart data, and time series transformations

// Time range for metrics filtering
export type TimeRange = 'week' | 'month' | 'quarter' | 'year';
export type MetricInterval = 'hour' | 'day' | 'week';

export interface MetricSnapshot {
  value: number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  changePercentage?: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  is_current_period: boolean;
  is_future: boolean;
}

export interface YieldMetrics {
  average: number;
  total: number;
  chart_data: ChartDataPoint[];
}

export interface SpaceUtilizationMetrics {
  nursery_station: number;
  cultivation_area: number;
  chart_data: Array<{
    date: string;
    nursery_value: number;
    cultivation_value: number;
    is_current_period: boolean;
    is_future: boolean;
  }>;
}

export interface DashboardMetrics {
  air_temperature: MetricSnapshot;
  humidity: MetricSnapshot;
  co2: MetricSnapshot;
  yield: YieldMetrics;
  space_utilization: SpaceUtilizationMetrics;
  last_updated: Date;
}

// Domain logic for metrics processing
export class DashboardMetricsModel {
  private metrics: DashboardMetrics | null = null;
  private refreshInterval: number = 15000; // 15 seconds
  private autoRefreshEnabled = true;

  public setMetrics(metrics: DashboardMetrics): void {
    this.metrics = metrics;
  }

  public getMetrics(): DashboardMetrics | null {
    return this.metrics;
  }

  public setRefreshInterval(intervalMs: number): void {
    this.refreshInterval = intervalMs;
  }

  public getRefreshInterval(): number {
    return this.refreshInterval;
  }

  public enableAutoRefresh(): void {
    this.autoRefreshEnabled = true;
  }

  public disableAutoRefresh(): void {
    this.autoRefreshEnabled = false;
  }

  public isAutoRefreshEnabled(): boolean {
    return this.autoRefreshEnabled;
  }

  // Transform raw API data into display-ready format
  public formatTemperature(celsius: number): MetricSnapshot {
    return {
      value: Math.round(celsius * 10) / 10,
      unit: '°C',
      trend: this.calculateTrend(celsius, this.metrics?.air_temperature.value)
    };
  }

  public formatHumidity(humidity: number): MetricSnapshot {
    return {
      value: Math.round(humidity),
      unit: '%',
      trend: this.calculateTrend(humidity, this.metrics?.humidity.value)
    };
  }

  public formatCO2(co2: number): MetricSnapshot {
    return {
      value: Math.round(co2),
      unit: 'ppm',
      trend: this.calculateTrend(co2, this.metrics?.co2.value)
    };
  }

  public formatYield(yieldData: YieldMetrics): YieldMetrics {
    return {
      ...yieldData,
      average: Math.round(yieldData.average * 100) / 100,
      total: Math.round(yieldData.total * 100) / 100
    };
  }

  public formatSpaceUtilization(spaceData: SpaceUtilizationMetrics): SpaceUtilizationMetrics {
    return {
      ...spaceData,
      nursery_station: Math.round(spaceData.nursery_station * 10) / 10,
      cultivation_area: Math.round(spaceData.cultivation_area * 10) / 10
    };
  }

  // Business logic for trend calculation
  private calculateTrend(currentValue: number, previousValue?: number): 'up' | 'down' | 'stable' {
    if (!previousValue) return 'stable';
    
    const threshold = 0.05; // 5% threshold for significant change
    const changeRatio = Math.abs(currentValue - previousValue) / previousValue;
    
    if (changeRatio < threshold) return 'stable';
    return currentValue > previousValue ? 'up' : 'down';
  }

  // Chart data processing for different visualization needs
  public getYieldChartData(): ChartDataPoint[] {
    return this.metrics?.yield.chart_data || [];
  }

  public getSpaceUtilizationChartData(): Array<{ date: string; nursery: number; cultivation: number }> {
    return this.metrics?.space_utilization.chart_data.map(point => ({
      date: point.date,
      nursery: point.nursery_value,
      cultivation: point.cultivation_value
    })) || [];
  }

  // Check if metrics are stale and need refresh
  public areMetricsStale(): boolean {
    if (!this.metrics?.last_updated) return true;
    
    const now = new Date();
    const timeDiff = now.getTime() - this.metrics.last_updated.getTime();
    return timeDiff > this.refreshInterval * 2; // Consider stale if 2x refresh interval
  }

  public getLastUpdatedText(): string {
    if (!this.metrics?.last_updated) return 'Never updated';
    
    const now = new Date();
    const diff = now.getTime() - this.metrics.last_updated.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  }
}
