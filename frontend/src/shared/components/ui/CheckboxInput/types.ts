export interface CheckboxInputProps {
  /** Current checked state */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Callback when checked state changes */
  onChange?: (checked: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Accessibility label */
  ariaLabel?: string;
  /** Additional CSS class name */
  className?: string;
  /** Form name attribute */
  name?: string;
  /** Form value attribute */
  value?: string;
  /** Form id attribute */
  id?: string;
  /** Error state */
  error?: string;
  /** Indeterminate state for partial selection */
  indeterminate?: boolean;
  /** Custom icon slot */
  iconSlot?: React.ReactNode;
}