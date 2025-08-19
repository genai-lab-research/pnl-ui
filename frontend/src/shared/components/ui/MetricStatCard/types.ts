import { ReactNode } from 'react';

export interface MetricStatCardProps {
  /** Metric or section title (e.g., "Yield", "Temperature", "Humidity") */
  title: string;
  
  /** Primary numeric/text value */
  value?: string | number;
  
  /** Value unit (e.g., "%", "kg/ha", "°C") */
  unit?: string;
  
  /** Optional supporting label */
  subtitle?: string;
  
  /** Change since previous period (e.g., "+1.5Kg", "-2%") */
  delta?: string;
  
  /** Trend direction for visuals/colors */
  deltaDirection?: 'up' | 'down' | 'flat';
  
  /** Icon by name or arbitrary slot */
  iconName?: string;
  iconSlot?: ReactNode;
  
  /** Visual variant */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  
  /** Loading state with sensible skeletons */
  loading?: boolean;
  
  /** Error state */
  error?: string;
  
  /** Custom footer actions/legend */
  footerSlot?: ReactNode;
  
  /** Optional mini-chart */
  chartData?: { labels: string[]; values: number[] };
  
  /** Optional micro visualization type */
  chartType?: 'sparkline' | 'bar' | 'line';
  
  /** Accessibility label */
  ariaLabel?: string;
  
  /** Custom className for additional styling */
  className?: string;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Whether the component is disabled */
  disabled?: boolean;
}

export interface MetricIconProps {
  iconName?: string;
  iconSlot?: ReactNode;
  size: MetricStatCardProps['size'];
  opacity?: number;
}

export interface MetricValueDisplayProps {
  value?: string | number;
  unit?: string;
  delta?: string;
  size: MetricStatCardProps['size'];
}
