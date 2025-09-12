// UI Models for Container Detail Components - Domain-specific adaptations of atomic components
import { ReactNode } from 'react';
import { StatusBlockProps } from '../../../shared/components/ui/StatusBlock/types';

// Navigation Models
export interface ContainerNavigationModel {
  containerId: number;
  containerName: string;
  showBreadcrumb: boolean;
  onNavigateBack: () => void;
}

// Header Models  
export interface ContainerHeaderModel {
  containerInfo: {
    name: string;
    type: string;
    status: string;
    tenant: {
      id: number;
      name: string;
    };
    location?: Record<string, any>;
  };
  iconName: string;
  statusVariant: 'active' | 'inactive' | 'maintenance' | 'error';
}

// Container Status Header Props - Domain component for showing container type, tenant, and status
export interface ContainerStatusHeaderProps {
  /** Container name identifier */
  containerName: string;
  
  /** Container type (physical or virtual) */
  containerType?: 'physical' | 'virtual';
  
  /** Tenant name to display */
  tenantName?: string;
  
  /** Current status of the container */
  status?: string;
  
  /** Status variant for styling */
  statusVariant?: 'active' | 'inactive' | 'maintenance' | 'error';
  
  /** Loading state */
  loading?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

// Container Tab Navigation Props - Domain component interface for SegmentedToggle wrapper
export interface ContainerTabNavigationProps {
  /** Currently active tab value */
  activeTab: string;
  
  /** Callback fired when tab selection changes */
  onTabChange: (tabValue: string) => void;
  
  /** Optional custom tabs to override default container tabs */
  customTabs?: ContainerTabModel[];
  
  /** Whether to show badge counts on tabs */
  showBadges?: boolean;
  
  /** Badge counts for each tab (keyed by tab value) */
  badgeCounts?: Record<string, number>;
  
  /** Container ID for accessibility labeling */
  containerId?: string | number;
  
  /** Visual variant of the tab navigation */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  
  /** Size of the tab navigation */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether the entire component is disabled */
  disabled?: boolean;
  
  /** Whether to show loading state */
  loading?: boolean;
  
  /** Error message to display */
  error?: string;
  
  /** Additional CSS classes */
  className?: string;
}

// Tab Navigation Models
export interface ContainerTabModel {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  badge?: string | number;
}

export type ContainerTabType = 'overview' | 'environment' | 'inventory' | 'devices';

export const CONTAINER_TABS: ContainerTabModel[] = [
  { id: 'overview', label: 'Overview', value: 'overview' },
  { id: 'environment', label: 'Environment & Recipes', value: 'environment' },
  { id: 'inventory', label: 'Inventory', value: 'inventory' },
  { id: 'devices', label: 'Devices', value: 'devices' },
];

// Time Selector Models
export interface TimeRangeSelectorModel {
  selectedValue: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}

// Container Time Selector Props - Domain component interface for SegmentedToggle wrapper
export interface ContainerTimeSelectorProps extends Omit<import('../../../shared/components/ui/SegmentedToggle/types').SegmentedToggleProps, 'options' | 'value' | 'onChange' | 'ariaLabel'> {
  /** Currently selected time range value */
  selectedTimeRange: import('./time-range').TimeRangeValue;
  
  /** Callback fired when time range selection changes */
  onTimeRangeChange: (timeRange: import('./time-range').TimeRangeValue) => void;
  
  /** Container ID for accessibility labeling */
  containerId?: string | number;
  
  /** Custom time range options to override defaults */
  customTimeRanges?: import('./time-range').TimeRangeOption[];
  
  /** Whether to show full labels or abbreviated versions */
  showLabels?: boolean;
}

// Metric Card Models
export interface MetricCardModel {
  title: string;
  icon: ReactNode;
  currentValue: number;
  targetValue?: number;
  unit: string;
  format: 'temperature' | 'percentage' | 'decimal' | 'kg';
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    isPositive: boolean;
  };
}

// Container Metric Card Props - Domain component interface for KPIMonitorCard wrapper
export interface ContainerMetricCardProps {
  /** Type of metric being displayed */
  metricType: 'temperature' | 'humidity' | 'air_quality' | 'pressure';
  
  /** Current metric value */
  currentValue?: string | number;
  
  /** Target or comparison value */
  targetValue?: string | number;
  
  /** Unit of measurement (e.g., "°C", "%", "ppm") */
  unit?: string;
  
  /** Custom metric title (overrides default based on metricType) */
  metricTitle?: string;
  
  /** Change since previous reading */
  delta?: number | string;
  
  /** Direction of the delta for visual indicators */
  deltaDirection?: 'up' | 'down' | 'flat';
  
  /** Whether to show current vs target comparison format */
  showComparison?: boolean;
  
  /** Custom icon to override the default metric type icon */
  customIcon?: ReactNode;
  
  /** Click handler for metric interaction */
  onMetricClick?: () => void;
  
  /** Container ID for accessibility and context */
  containerId?: string | number;
  
  /** Visual variant */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  
  /** Size of the metric card */
  size?: 'sm' | 'md' | 'lg';
  
  /** Loading state */
  loading?: boolean;
  
  /** Error message to display */
  error?: string;
  
  /** Additional CSS classes */
  className?: string;
}

// Crops Table Models
export interface CropsTableModel {
  seedType: string;
  nurseryCount: number;
  cultivationCount: number;
  lastSeeding: string | null;
  lastTransplanting: string | null;
  lastHarvesting: string | null;
  averageAge: number;
  overdueCount: number;
}

// Activity Models
export interface ActivityItemModel {
  id: number;
  title: string;
  timestamp: string;
  author: string;
  avatarColor?: string;
  actionType: string;
}

export interface ContainerActivityModel {
  id: number;
  message?: string;
  description?: string;
  timestamp: string;
  author?: string;
  actorId?: string;
  category?: string;
  actionType: string;
}

// Container Activity Item Props - Domain component interface for ActivityCard wrapper
export interface ContainerActivityItemProps {
  /** Activity data to display */
  activity: ContainerActivityModel;
  
  /** Visual variant of the activity card */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  
  /** Size of the activity card */
  size?: 'sm' | 'md' | 'lg';
  
  /** Loading state */
  loading?: boolean;
  
  /** Error message to display */
  error?: string;
  
  /** Click handler for activity interaction */
  onClick?: () => void;
  
  /** Additional CSS classes */
  className?: string;
}

// Container Info Panel Models
export interface ContainerInfoModel {
  basicInfo: Array<{
    label: string;
    value: string | number;
    icon?: ReactNode;
  }>;
  statusInfo: {
    text: string;
    variant: 'active' | 'inactive' | 'maintenance' | 'error';
  };
  sections: Array<{
    title: string;
    content: string | ReactNode;
  }>;
  isEditMode: boolean;
  onToggleEdit: () => void;
  onSave: (data: any) => void;
}

// Pagination Models
export interface PaginationModel {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

// Loading and Error State Models
export interface LoadingStateModel {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface ErrorStateModel {
  isError: boolean;
  errorMessage: string;
  onRetry?: () => void;
}

// Combined State Models
export interface ContainerDetailUIState {
  navigation: ContainerNavigationModel;
  header: ContainerHeaderModel;
  tabs: {
    active: string;
    tabs: ContainerTabModel[];
    onChange: (tab: string) => void;
  };
  timeRange: TimeRangeSelectorModel;
  loading: LoadingStateModel;
  error: ErrorStateModel;
}

// Permission Models
export interface ContainerPermissions {
  canView: boolean;
  canEdit: boolean;
  canManageSettings: boolean;
  canViewActivity: boolean;
}
