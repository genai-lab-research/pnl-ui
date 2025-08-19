import { ReactNode } from 'react';

export interface ActionButtonProps {
  /** Button text content */
  text: string;
  /** Callback fired when button is clicked */
  onClick?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Loading state to show spinner */
  loading?: boolean;
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Button visual variant */
  variant?: 'default' | 'outlined' | 'ghost' | 'elevated';
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Optional icon slot */
  iconSlot?: ReactNode;
  /** Icon position relative to text */
  iconPosition?: 'left' | 'right';
  /** Additional CSS class name */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Error state */
  error?: string;
  /** Full width button */
  fullWidth?: boolean;
}

export interface ActionButtonStyleProps {
  $size: NonNullable<ActionButtonProps['size']>;
  $variant: NonNullable<ActionButtonProps['variant']>;
  $disabled: boolean;
  $loading: boolean;
  $fullWidth: boolean;
  $hasIcon: boolean;
}
