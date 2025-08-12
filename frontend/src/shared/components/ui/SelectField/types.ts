export interface SelectOption {
  /** Option value */
  value: string;
  /** Option label displayed to user */
  label: string;
  /** Option disabled state */
  disabled?: boolean;
}

export interface SelectFieldProps {
  /** Input field label/placeholder text */
  placeholder?: string;
  /** Array of selectable options */
  options?: SelectOption[];
  /** Currently selected value */
  value?: string;
  /** Change handler for selection */
  onChange?: (value: string) => void;
  /** Visual variant */
  variant?: 'default' | 'outlined' | 'filled';
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string;
  /** Required field indicator */
  required?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Accessibility label */
  ariaLabel?: string;
  /** Test ID for testing */
  testId?: string;
  /** Focus handler */
  onFocus?: () => void;
  /** Blur handler */
  onBlur?: () => void;
}