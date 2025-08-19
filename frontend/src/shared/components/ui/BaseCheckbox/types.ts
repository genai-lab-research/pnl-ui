import { ReactNode } from 'react';

export interface BaseCheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Callback when checkbox state changes */
  onChange: (checked: boolean) => void;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Whether the checkbox is in loading state */
  loading?: boolean;
  /** Error message to display */
  error?: string;
  /** Additional label text */
  label?: string;
  /** Visual variant of the checkbox */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  /** Size of the checkbox */
  size?: 'sm' | 'md' | 'lg';
  /** Custom icon for checked state */
  checkedIcon?: ReactNode;
  /** Custom icon for unchecked state */
  uncheckedIcon?: ReactNode;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Additional className for styling */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

export interface CheckboxStyleProps {
  $checked: boolean;
  $disabled: boolean;
  $loading: boolean;
  $error: boolean;
  $variant: NonNullable<BaseCheckboxProps['variant']>;
  $size: NonNullable<BaseCheckboxProps['size']>;
}
