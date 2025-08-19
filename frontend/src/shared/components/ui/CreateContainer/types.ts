export interface CreateContainerProps {
  /** Callback fired when the create container button is clicked */
  onClick?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Loading state to show spinner instead of icon */
  loading?: boolean;
  /** Custom text for the button (defaults to "Create Container") */
  text?: string;
  /** Optional icon name from public images (falls back to plus icon if not provided or invalid) */
  iconName?: string;
  /** Additional CSS class name */
  className?: string;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** ARIA label for accessibility */
  'aria-label'?: string;
}