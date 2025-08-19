import { ReactNode } from 'react';

export interface KPIMonitorCardProps {
  /** Metric or section title (e.g., "Air Temperature", "Humidity") */
  title: string;
  
  /** Primary current value */
  value?: string | number;
  
  /** Target or comparison value */
  targetValue?: string | number;
  
  /** Value unit (e.g., "°C", "%", "kg/ha") */
  unit?: string;
  
  /** Optional supporting label */
  subtitle?: string;
  
  /** Change since previous period */
  delta?: number | string;
  
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

export interface KPIIconProps {
  iconName?: string;
  iconSlot?: ReactNode;
  size: KPIMonitorCardProps['size'];
}

export interface KPIValueDisplayProps {
  value?: string | number;
  targetValue?: string | number;
  unit?: string;
  size: KPIMonitorCardProps['size'];
}
