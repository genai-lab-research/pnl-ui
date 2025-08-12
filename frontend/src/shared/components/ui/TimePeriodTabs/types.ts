export interface TimePeriodTabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TimePeriodTabsProps {
  tabs: TimePeriodTabItem[];
  selectedTabId: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'compact' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  primaryColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  loading?: boolean;
  error?: string;
  ariaLabel?: string;
  className?: string;
}