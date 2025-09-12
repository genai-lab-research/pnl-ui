// Domain types for Container Detail feature
// Based on API endpoints and UI requirements

import { CellData } from '../../../shared/components/ui/DataTableRow';

// Core container detail types
export interface ContainerDetail {
  id: number;
  name: string;
  type: string;
  tenant: {
    id: number;
    name: string;
  };
  location?: Record<string, unknown>;
  status: string;
  // Additional fields from full container details
  purpose?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
  seed_types?: Array<{
    id: number;
    name: string;
    variety?: string;
    supplier?: string;
    batch_id?: string;
  }>;
  shadow_service_enabled?: boolean;
  ecosystem_connected?: boolean;
  ecosystem_settings?: Record<string, any>;
  robotics_simulation_enabled?: boolean;
  copied_environment_from?: number;
  tenant_id?: number;
}

// Dashboard metrics types
export interface DashboardMetrics {
  air_temperature: number;
  humidity: number;
  co2: number;
  yield: YieldMetrics;
  space_utilization: SpaceUtilizationMetrics;
}

export interface YieldMetrics {
  average: number;
  total: number;
  chart_data: ChartDataPoint[];
}

export interface SpaceUtilizationMetrics {
  nursery_station: number;
  cultivation_area: number;
  chart_data: SpaceChartDataPoint[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
  is_current_period: boolean;
  is_future: boolean;
}

export interface SpaceChartDataPoint {
  date: string;
  nursery_value: number;
  cultivation_value: number;
  is_current_period: boolean;
  is_future: boolean;
}

// Crops summary types
export interface CropsSummary {
  seed_type: string;
  nursery_station_count: number;
  cultivation_area_count: number;
  last_seeding_date: string;
  last_transplanting_date: string;
  last_harvesting_date: string;
  average_age: number;
  overdue_count: number;
}

// Activity types
export interface ActivityLog {
  id: number;
  container_id: number;
  timestamp: string;
  action_type: string;
  actor_type: string;
  actor_id: string;
  description: string;
}

export interface ActivityLogsResponse {
  activities: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Metric snapshots types
export interface MetricSnapshot {
  id: number;
  container_id: number;
  timestamp: string;
  air_temperature: number;
  humidity: number;
  co2: number;
  yield_kg: number;
  space_utilization_pct: number;
}

// Container overview response type
export interface ContainerOverview {
  container: ContainerDetail;
  dashboard_metrics: DashboardMetrics;
  crops_summary: CropsSummary[];
  recent_activity: ActivityLog[];
}

// Environment links types
export interface EnvironmentLinks {
  container_id: number;
  fa: Record<string, unknown>;
  pya: Record<string, unknown>;
  aws: Record<string, unknown>;
  mbai: Record<string, unknown>;
  fh: Record<string, unknown>;
}

// Settings update types
export interface ContainerSettingsUpdate {
  tenant_id?: number;
  purpose?: string;
  location?: Record<string, unknown>;
  notes?: string;
  shadow_service_enabled?: boolean;
  copied_environment_from?: number;
  robotics_simulation_enabled?: boolean;
  ecosystem_connected?: boolean;
  ecosystem_settings?: Record<string, unknown>;
}

// Tab navigation types
export type ContainerDetailTab = 'overview' | 'environment' | 'inventory' | 'devices';

// Time range types for metrics
export type TimeRange = 'week' | 'month' | 'quarter' | 'year';
export type MetricInterval = 'hour' | 'day' | 'week';

// Loading states
export interface LoadingStates {
  overview: boolean;
  metrics: boolean;
  activities: boolean;
  settings: boolean;
}

// Error states
export interface ErrorStates {
  overview?: string;
  metrics?: string;
  activities?: string;
  settings?: string;
}

// Domain component props types (for integration with atomic components)
export interface ContainerNavigationBlockProps {
  containerName: string;
  onBreadcrumbClick: () => void;
}

export interface ContainerStatusHeaderProps {
  containerType: string;
  description: string;
  status: string;
  statusVariant: 'active' | 'inactive' | 'pending' | 'warning' | 'error';
}

export interface ContainerTabNavigationProps {
  activeTab: ContainerDetailTab;
  onTabChange: (tab: ContainerDetailTab) => void;
}

export interface ContainerTimeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export interface ContainerMetricCardProps {
  title: string;
  value: string | number;
  targetValue?: string | number;
  unit?: string;
  iconName?: string;
  delta?: number | string;
  deltaDirection?: 'up' | 'down' | 'flat';
}

export interface ContainerDataRowProps {
  cells: CellData[];
  onClick?: () => void;
  selected?: boolean;
}

export interface ContainerPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

// Form and edit mode types
export interface EditModeState {
  isEditMode: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// API query parameters
export interface OverviewQueryParams {
  time_range?: TimeRange;
  metric_interval?: MetricInterval;
}

export interface ActivityLogsQueryParams {
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  action_type?: string;
  actor_type?: string;
}

export interface MetricSnapshotsQueryParams {
  start_date?: string;
  end_date?: string;
  interval?: MetricInterval;
}