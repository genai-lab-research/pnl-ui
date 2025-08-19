import { ReactNode } from 'react';

export interface ToggleSwitchProps {
  /** Whether the switch is currently on/off */
  checked?: boolean;
  /** Callback when switch state changes */
  onChange?: (checked: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Size variant of the switch */
  size?: 'small' | 'medium' | 'large';
  /** Color variant when checked */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Label text for the switch */
  label?: string;
  /** Helper text to display below the switch */
  helperText?: string;
  /** Error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Whether the switch is required */
  required?: boolean;
  /** Custom icon when checked */
  checkedIcon?: ReactNode;
  /** Custom icon when unchecked */
  uncheckedIcon?: ReactNode;
  /** Accessibility label */
  ariaLabel?: string;
  /** Custom className for styling */
  className?: string;
  /** Test ID for testing purposes */
  testId?: string;
  /** Name attribute for form handling */
  name?: string;
  /** Value attribute for form handling */
  value?: string;
  /** Auto focus on mount */
  autoFocus?: boolean;
}

export interface ToggleSwitchState {
  isChecked: boolean;
  isFocused: boolean;
  isPressed: boolean;
}
