export interface TemperatureMetricCardProps {
  /** Metric or section title (e.g., "Air Temperature", "Soil Temperature") */
  title: string;
  /** Current temperature value */
  currentValue: number | string;
  /** Target/reference temperature value */
  targetValue?: number | string;
  /** Temperature unit (e.g., "°C", "°F") */
  unit?: string;
  /** Icon by name or arbitrary slot */
  iconName?: string;
  iconSlot?: React.ReactNode;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state with sensible skeletons */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Custom footer actions/legend */
  footerSlot?: React.ReactNode;
  /** Accessibility label */
  ariaLabel?: string;
  /** Additional CSS class name */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}