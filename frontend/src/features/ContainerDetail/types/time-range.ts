// Time Range Types for Container Detail Views

export type TimeRangeValue = 'week' | 'month' | 'quarter' | 'year';

export interface TimeRangeOption {
  label: string;
  value: TimeRangeValue;
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' },
];

export interface MetricInterval {
  hour: string;
  day: string;
  week: string;
}

export const METRIC_INTERVALS: Record<TimeRangeValue, string> = {
  week: 'hour',
  month: 'day',
  quarter: 'day',
  year: 'week',
};
