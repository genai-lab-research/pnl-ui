export interface Tab {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabBarProps {
  tabs: Tab[];
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

export interface TabBarStyleProps {
  $isSelected: boolean;
  $isDisabled: boolean;
  $variant: TabBarProps['variant'];
  $size: TabBarProps['size'];
  $fullWidth: boolean;
}

export interface TabIndicatorProps {
  $selectedIndex: number;
  $tabCount: number;
  $fullWidth: boolean;
}
