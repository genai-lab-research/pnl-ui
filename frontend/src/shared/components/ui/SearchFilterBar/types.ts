export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterChipProps {
  label: string;
  options?: FilterOption[];
  selectedValue?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

export interface SearchFilterBarProps {
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Search input value */
  searchValue?: string;
  /** Search input change handler */
  onSearchChange?: (value: string) => void;
  /** Filter chips configuration */
  filters?: FilterChipProps[];
  /** Toggle switch label */
  toggleLabel?: string;
  /** Toggle switch state */
  toggleValue?: boolean;
  /** Toggle switch change handler */
  onToggleChange?: (value: boolean) => void;
  /** Clear filters button label */
  clearButtonLabel?: string;
  /** Clear filters button click handler */
  onClearFilters?: () => void;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'outlined';
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Accessibility label */
  ariaLabel?: string;
}