// Performance Metrics Data Models
// Based on p1_datamodels.md specifications

export interface DataPoint {
  date: string;
  value: number;
  is_current_period: boolean;
  is_future: boolean;
}

export interface YieldDataPoint extends DataPoint {
  // Yield value in kg
}

export interface UtilizationDataPoint extends DataPoint {
  // Utilization percentage (0-100)
}

export interface YieldMetrics {
  average: number; // Average yield in kg
  total: number;   // Total yield in kg
  chart_data: YieldDataPoint[];
}

export interface UtilizationMetrics {
  average: number; // Average utilization percentage (0-100)
  chart_data: UtilizationDataPoint[];
}

export interface MetricsData {
  container_count: number;
  yield: YieldMetrics;
  space_utilization: UtilizationMetrics;
}

export interface TimeRange {
  type: 'week' | 'month' | 'quarter' | 'year';
  start_date: string;
  end_date: string;
}

export interface PerformanceMetrics {
  physical: MetricsData;
  virtual: MetricsData;
  time_range: TimeRange;
  generated_at: string;
}

// API Request types for metrics
export interface MetricsFilterCriteria {
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
  type?: 'physical' | 'virtual' | 'all';
  containerIds?: string; // Comma-separated container IDs
}

export interface ContainerMetricsRequest {
  days?: number; // Number of days for trend data (default: 30, max: 365)
}

// Chart data types for visualization
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  isCurrentPeriod?: boolean;
  isFuture?: boolean;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

export interface MetricsChartData {
  labels: string[];
  datasets: ChartSeries[];
}

// Performance comparison types
export interface MetricsComparison {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PerformanceSummary {
  yield: MetricsComparison;
  utilization: MetricsComparison;
  containers: {
    total: number;
    active: number;
    inactive: number;
  };
  alerts: {
    total: number;
    critical: number;
    high: number;
  };
}

// Real-time metrics for dashboard
export interface RealTimeMetrics {
  timestamp: string;
  physical_containers: {
    count: number;
    active: number;
    yield_total: number;
    utilization_avg: number;
  };
  virtual_containers: {
    count: number;
    active: number;
    yield_total: number;
    utilization_avg: number;
  };
  system_health: {
    status: 'healthy' | 'warning' | 'critical';
    alerts_count: number;
    uptime_percentage: number;
  };
}

// Aggregated metrics for reports
export interface MetricsAggregation {
  period: string;
  total_yield: number;
  average_utilization: number;
  container_count: number;
  active_alerts: number;
  growth_rate: number;
  efficiency_score: number;
}

// Export types for easy importing
export type MetricsTimeRange = TimeRange['type'];
export type MetricsType = 'physical' | 'virtual' | 'all';
export type TrendDirection = 'up' | 'down' | 'stable';
export type SystemStatus = 'healthy' | 'warning' | 'critical';