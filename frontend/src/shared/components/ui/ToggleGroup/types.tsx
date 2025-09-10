import { ReactNode } from 'react';

export interface ToggleOption {
  /** Unique identifier for the option */
  id: string;
  /** Display label for the option */
  label: string;
  /** Optional icon to display with the label */
  icon?: ReactNode;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Aria label for accessibility */
  ariaLabel?: string;
}

export interface ToggleGroupProps {
  /** Array of options to display */
  options: ToggleOption[];
  /** Currently selected option ID */
  selectedId?: string;
  /** Callback when selection changes (optionId can be undefined for deselection) */
  onSelectionChange?: (optionId: string | undefined) => void;
  /** Component variant */
  variant?: 'default' | 'outlined' | 'elevated';
  /** Component size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the entire group is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Additional CSS class names */
  className?: string;
  /** Accessibility label for the group */
  ariaLabel?: string;
  /** Name for the radio group (for accessibility) */
  name?: string;
  /** Whether to allow deselection (no option selected) */
  allowDeselection?: boolean;
  /** Whether to stretch options to fill container width */
  fullWidth?: boolean;
}

export interface ToggleOptionProps {
  /** The option data */
  option: ToggleOption;
  /** Whether this option is selected */
  selected: boolean;
  /** Component size */
  size: 'sm' | 'md' | 'lg';
  /** Component variant */
  variant: 'default' | 'outlined' | 'elevated';
  /** Whether the option is disabled */
  disabled: boolean;
  /** Click handler */
  onClick: (optionId: string) => void;
  /** Radio group name */
  name?: string;
  /** Whether options should stretch to fill width */
  fullWidth: boolean;
}
