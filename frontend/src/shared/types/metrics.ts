export type TimeRange = 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';

export interface MetricValue {
  current: number;
  unit: string;
  target?: number;
  trend?: number;
}

export interface ContainerMetrics {
  temperature: MetricValue;
  humidity: MetricValue;
  co2: MetricValue;
  yield: MetricValue;
  nursery_utilization: MetricValue;
  cultivation_utilization: MetricValue;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  targetValue?: string | number;
  icon?: React.ReactNode;
  trend?: number;
}

// Dashboard metrics from page1_routing.md
export type MetricTimeRange = 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
export type TimeRangeOption = 'week' | 'month' | 'quarter' | 'year';

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

export interface BarChartData {
  day: string;
  value: number;
}

export interface PerformanceData {
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

export interface PerformanceOverview {
  physical: PerformanceData;
  virtual: PerformanceData;
}