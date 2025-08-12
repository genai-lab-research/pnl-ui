import { ReactNode } from 'react';

export interface ActionButtonProps {
  /** Button text/label */
  label: string;
  /** Icon component or element */
  icon?: ReactNode;
  /** Button visual variant */
  variant?: 'primary' | 'secondary' | 'outlined' | 'ghost';
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
}