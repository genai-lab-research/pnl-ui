export interface ToggleSwitchProps {
  /** Current toggle state */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Callback when toggle state changes */
  onChange?: (checked: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'small';
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
}