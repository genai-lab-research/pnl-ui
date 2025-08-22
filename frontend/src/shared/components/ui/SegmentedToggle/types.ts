export interface SegmentedOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SegmentedToggleProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  ariaLabel?: string;
  className?: string;
  fullWidth?: boolean;
}

export interface SegmentedToggleStyleProps {
  $isSelected: boolean;
  $isDisabled: boolean;
  $variant: SegmentedToggleProps['variant'];
  $size: SegmentedToggleProps['size'];
  $fullWidth?: boolean;
}