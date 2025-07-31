export type TimeRange = 'Week' | 'Month' | 'Quarter' | 'Year';

export interface TimeRangeOption {
  /** The value/id of the time range option */
  value: TimeRange;
  /** The display label for the option */
  label: string;
  /** Whether this option is disabled */
  disabled?: boolean;
}

export interface TimeRangeSelectorProps {
  /** Currently selected time range */
  selectedValue: TimeRange;
  /** Callback when a time range is selected */
  onValueChange: (value: TimeRange) => void;
  /** Available time range options */
  options?: TimeRangeOption[];
  /** Whether the entire selector is disabled */
  disabled?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Size variant of the selector */
  size?: 'small' | 'medium' | 'large';
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Whether data is currently loading */
  isLoading?: boolean;
}

export interface TimeRangeOptionProps {
  /** The option configuration */
  option: TimeRangeOption;
  /** Whether this option is currently selected */
  isSelected: boolean;
  /** Click handler for this option */
  onClick: (value: TimeRange) => void;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
}