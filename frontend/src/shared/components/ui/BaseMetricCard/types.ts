import { ReactNode } from 'react';

export interface BaseMetricCardProps {
  /** Card title displayed at the top */
  title: string;
  /** Icon element or component */
  icon: ReactNode;
  /** Primary value to display */
  value: string | number;
  /** Secondary/target value after slash */
  secondaryValue?: string | number;
  /** Change indicator (e.g., +5%, +1.5kg) */
  changeValue?: string;
  /** Whether change is positive */
  isPositiveChange?: boolean;
  /** Whether to use transparent background */
  transparent?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Additional CSS class */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Accessibility label */
  ariaLabel?: string;
}