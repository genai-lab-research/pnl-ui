export interface ChartDataPoint {
  /** Day of the week (e.g., 'Mon', 'Tue', etc.) */
  day: string;
  /** Chart value for the day */
  value: number;
  /** Whether this day is the current day (for indicator) */
  isCurrent?: boolean;
}

export interface MiniBarChartProps {
  /** Chart data points */
  data: ChartDataPoint[];
  /** Chart color */
  color: string;
  /** Muted bar color for non-active days */
  mutedColor?: string;
  /** Maximum height of the chart in pixels */
  maxHeight?: number;
  /** Additional CSS class name */
  className?: string;
}