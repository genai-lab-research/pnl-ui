export interface MetricCardProps {
  /** The metric label/title */
  label: string;
  /** The metric value */
  value: number | string;
  /** Optional unit suffix */
  unit?: string;
  /** Format type for value display */
  format?: 'default' | 'temperature' | 'percentage' | 'co2' | 'weight';
  /** Optional trend indicator (percentage change) */
  trend?: number;
  /** Additional styling props */
  sx?: object;
}