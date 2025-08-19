import { ReactNode } from 'react';

export interface ControlBlockProps {
  /** Label text to display next to the icon */
  label: string;
  /** Optional icon slot for custom icons */
  iconSlot?: ReactNode;
  /** Callback fired when the control block is clicked */
  onClick?: () => void;
  /** Whether the control block is disabled */
  disabled?: boolean;
  /** Loading state to show spinner instead of icon */
  loading?: boolean;
  /** Visual variant of the control block */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  /** Size scale of the control block */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: string;
  /** Additional CSS class name */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Custom footer content slot */
  footerSlot?: ReactNode;
}

export interface ControlBlockStyleProps {
  $variant: NonNullable<ControlBlockProps['variant']>;
  $size: NonNullable<ControlBlockProps['size']>;
  $disabled: boolean;
  $loading: boolean;
  $hasFooter: boolean;
}
