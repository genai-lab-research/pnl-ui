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
  average: number;
  chart_data: ChartDataPoint[];
}

export interface ContainerTypeMetrics {
  container_count: number;
  yield: YieldMetrics;
  space_utilization: SpaceUtilizationMetrics;
}

export interface TimeRange {
  type: 'week' | 'month' | 'quarter' | 'year';
  start_date: string;
  end_date: string;
}

export interface PerformanceMetrics {
  physical: ContainerTypeMetrics;
  virtual: ContainerTypeMetrics;
  time_range: TimeRange;
  generated_at: string;
}

export interface MetricsFilters {
  timeRange: 'week' | 'month' | 'quarter' | 'year';
  type: 'physical' | 'virtual' | 'all';
  containerIds?: number[];
}

export interface ContainerTrendData {
  container_id: number;
  container_name: string;
  trend_data: Array<{
    date: string;
    yield_kg: number;
    space_utilization_pct: number;
    air_temperature: number;
    humidity: number;
    co2: number;
  }>;
}

// Domain component prop types
export interface MetricCardData {
  title: 'Physical Containers' | 'Virtual Containers';
  containerCount: number;
  yieldData: {
    average: number;
    total?: number;
    unit: string;
    chartData: Array<{
      day: string;
      value: number;
      isCurrent?: boolean;
    }>;
  };
  spaceUtilizationData: {
    average: number;
    unit: string;
    chartData: Array<{
      day: string;
      value: number;
      isCurrent?: boolean;
    }>;
  };
}

export interface TimeRangeSelectorData {
  options: Array<{
    value: 'week' | 'month' | 'quarter' | 'year';
    label: string;
  }>;
  selectedValue: 'week' | 'month' | 'quarter' | 'year';
}

export interface FilterChipData {
  id: string;
  label: string;
  isActive: boolean;
  options?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  selectedOption?: {
    id: string;
    label: string;
    value: string;
  };
}