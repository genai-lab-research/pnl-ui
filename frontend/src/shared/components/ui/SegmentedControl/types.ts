export interface SegmentOption {
  /** Unique identifier for the segment */
  id: string;
  /** Display label for the segment */
  label: string;
  /** Whether this segment is disabled */
  disabled?: boolean;
  /** Icon slot for the segment */
  iconSlot?: React.ReactNode;
}

export interface SegmentedControlProps {
  /** Array of segment options */
  options: SegmentOption[];
  /** Currently selected option ID */
  selectedId: string;
  /** Callback when selection changes */
  onChange: (selectedId: string) => void;
  /** Visual variant */
  variant?: 'default' | 'outlined' | 'compact';
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Whether segments fill the full width */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Accessibility label */
  ariaLabel?: string;
  /** Additional CSS class name */
  className?: string;
  /** Custom border radius */
  borderRadius?: string;
  /** Whether to disable animations */
  disableAnimations?: boolean;
}