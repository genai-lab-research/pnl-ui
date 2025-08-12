export interface ChartDataItem {
  label: string;
  value: number;
  isActive?: boolean;
}

export interface ChartConfig {
  title: string;
  avgLabel: string;
  avgValue: string;
  totalLabel?: string;
  totalValue?: string;
  color: string;
  data: ChartDataItem[];
}

export interface ContainerStatsCardProps {
  /** Main title for the statistics card */
  title: string;
  /** Total count displayed in the badge */
  totalCount?: number | string;
  /** Array of chart configurations */
  charts: ChartConfig[];
  /** Visual variant */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state with sensible skeletons */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Custom footer actions/legend */
  footerSlot?: React.ReactNode;
  /** Accessibility label */
  ariaLabel?: string;
  /** Additional CSS class name */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}