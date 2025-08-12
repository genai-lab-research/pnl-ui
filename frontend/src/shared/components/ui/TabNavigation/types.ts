export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Badge count or indicator */
  badge?: string | number;
  /** Icon slot for the tab */
  iconSlot?: React.ReactNode;
}

export interface TabNavigationProps {
  /** Array of tab items */
  tabs: TabItem[];
  /** Currently active tab ID */
  activeTabId: string;
  /** Callback when tab is changed */
  onTabChange: (tabId: string) => void;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'pill';
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Whether tabs fill the full width */
  fullWidth?: boolean;
  /** Custom color for active state indicator */
  indicatorColor?: string;
  /** Position of the indicator */
  indicatorPosition?: 'bottom' | 'top';
  /** Loading state */
  loading?: boolean;
  /** Accessibility label */
  ariaLabel?: string;
  /** Additional CSS class name */
  className?: string;
}