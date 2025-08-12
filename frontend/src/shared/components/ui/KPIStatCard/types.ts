export interface KPIStatCardProps {
  /** Metric or section title */
  title: string;
  /** Primary numeric/text value */
  value?: string | number;
  /** Value unit (e.g., "%", "kg/ha") */
  unit?: string;
  /** Optional supporting label */
  subtitle?: string;
  /** Change since previous period */
  delta?: number | string;
  /** Trend direction for visuals/colors */
  deltaDirection?: 'up' | 'down' | 'flat';
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