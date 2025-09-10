import { ReactNode } from 'react';

export interface ProgressMetricProps {
  /** Main label text for the metric */
  label: string;
  /** Numeric value (0-100) representing the percentage */
  value: number;
  /** Optional unit to display after the value (default: '%') */
  unit?: string;
  /** Whether to show the percentage value text */
  showValue?: boolean;
  /** Whether to show the progress bar */
  showProgressBar?: boolean;
  /** Color theme for the progress bar */
  progressColor?: string;
  /** Background color for the progress bar track */
  progressBackgroundColor?: string;
  /** Visual variant of the component */
  variant?: 'default' | 'compact' | 'outlined';
  /** Size of the component */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string;
  /** Additional className for custom styling */
  className?: string;
  /** Custom content to render in place of value */
  valueSlot?: ReactNode;
  /** Accessibility label */
  ariaLabel?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Callback when component is clicked */
  onClick?: () => void;
}

export interface ProgressBarProps {
  value: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  borderRadius?: number;
  className?: string;
  ariaLabel?: string;
}