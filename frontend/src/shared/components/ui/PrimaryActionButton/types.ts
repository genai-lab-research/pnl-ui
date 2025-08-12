import { ReactNode } from 'react';

export interface PrimaryActionButtonProps {
  /** Button text/label */
  label: string;
  /** Icon component or element */
  icon?: ReactNode;
  /** Button visual variant */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: string;
  /** Full width button */
  fullWidth?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Button type for forms */
  type?: 'button' | 'submit' | 'reset';
  /** Accessibility label */
  ariaLabel?: string;
  /** ID for testing/targeting */
  id?: string;
  /** Custom background color */
  backgroundColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Custom border radius */
  borderRadius?: string;
}