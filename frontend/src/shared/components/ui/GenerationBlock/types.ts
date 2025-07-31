export interface FilterChipOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterChip {
  id: string;
  label: string;
  isActive?: boolean;
  options?: FilterChipOption[];
  selectedOption?: FilterChipOption;
}

export interface GenerationBlockProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterChips?: FilterChip[];
  onChipClick?: (chipId: string) => void;
  onChipOptionSelect?: (chipId: string, option: FilterChipOption) => void;
  hasAlerts?: boolean;
  onAlertsToggle?: (enabled: boolean) => void;
  onClearFilters?: () => void;
  className?: string;
  isSearchLoading?: boolean;
  isFilterLoading?: boolean;
}

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
}

export interface FilterChipProps {
  chip: FilterChip;
  onClick?: (chipId: string) => void;
  onOptionSelect?: (chipId: string, option: FilterChipOption) => void;
  className?: string;
  isLoading?: boolean;
}

export interface AlertsToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  isLoading?: boolean;
}

export interface ClearFiltersButtonProps {
  onClick?: () => void;
  className?: string;
}