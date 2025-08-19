import { ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  /** The label text for the select field */
  label?: string;
  /** The placeholder text when no option is selected */
  placeholder?: string;
  /** Array of options to choose from */
  options?: SelectOption[];
  /** Current selected value */
  value?: string;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Callback when the select is opened/closed */
  onToggle?: (isOpen: boolean) => void;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether the select is in an error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Helper text to display below the select */
  helperText?: string;
  /** Whether the select is required */
  required?: boolean;
  /** Visual variant of the select */
  variant?: 'outlined' | 'filled';
  /** Size of the select */
  size?: 'small' | 'medium' | 'large';
  /** Loading state */
  loading?: boolean;
  /** Custom icon to replace the default dropdown arrow */
  icon?: ReactNode;
  /** Accessibility label */
  ariaLabel?: string;
  /** Custom className for styling */
  className?: string;
  /** Test ID for testing purposes */
  testId?: string;
}

export interface SelectState {
  isOpen: boolean;
  selectedValue: string | undefined;
  focusedIndex: number;
}
