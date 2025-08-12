export interface MetricValue {
  value: number;
  unit: string;
  change?: number;
  changeDirection?: 'up' | 'down' | 'stable';
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface MetricChartData {
  yield: ChartDataPoint[];
  spaceUtilization: {
    nursery: ChartDataPoint[];
    cultivation: ChartDataPoint[];
  };
}

export interface MetricPollingConfig {
  enabled: boolean;
  intervalMs: number;
}