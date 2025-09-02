// Metrics-related type definitions

export enum MetricTimeRange {
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

export interface StatData {
  day: string;
  value: number;
}

export interface MetricData {
  day: string;
  value: number;
}
