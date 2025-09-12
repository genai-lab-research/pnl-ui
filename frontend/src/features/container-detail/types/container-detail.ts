// Container Detail Domain Models and Types
import { 
  ContainerOverviewResponse,
  ActivityLogsResponse,
  DashboardSummaryResponse,
  ContainerInfo,
  DashboardMetrics,
  CropsSummary,
} from '../../../api/containerApiService';
import { Container, ActivityLog, MetricSnapshot, EnvironmentLink } from '../../../types/containers';
import { TimeRangeValue } from './time-range';

// Local interface for container settings update request
export interface ContainerSettingsUpdateRequest {
  tenant_id?: number;
  purpose?: string;
  location?: Record<string, any>;
  notes?: string;
  shadow_service_enabled?: boolean;
  copied_environment_from?: number;
  robotics_simulation_enabled?: boolean;
  ecosystem_connected?: boolean;
  ecosystem_settings?: Record<string, any>;
}

// Core Domain Models
export interface ContainerDetailData {
  container: ContainerInfo;
  dashboard: DashboardMetrics;
  crops: CropsSummary[];
  recentActivity: ActivityLog[];
  lastUpdated: string;
}

export interface ContainerDetailState {
  containerId: number;
  activeTab: string;
  timeRange: TimeRangeValue;
  data: ContainerDetailData | null;
  isLoading: boolean;
  error: ContainerDetailError | null;
  permissions: ContainerDetailPermissions;
}

export interface ContainerDetailPermissions {
  canView: boolean;
  canEdit: boolean;
  canManageSettings: boolean;
  canViewMetrics: boolean;
  canViewActivity: boolean;
  canUpdateEnvironment: boolean;
}

// Chart Data Models
export interface ChartDataPoint {
  date: string;
  value: number;
  is_current_period: boolean;
  is_future: boolean;
}

export interface YieldChartData {
  average: number;
  total: number;
  chartData: ChartDataPoint[];
}

export interface UtilizationChartData {
  nurseryStation: number;
  cultivationArea: number;
  chartData: Array<{
    date: string;
    nursery_value: number;
    cultivation_value: number;
    is_current_period: boolean;
    is_future: boolean;
  }>;
}

// Metrics Models
export interface ContainerMetricsDisplay {
  airTemperature: {
    current: number;
    target?: number;
    unit: '°C' | '°F';
    status: 'normal' | 'warning' | 'critical';
  };
  humidity: {
    current: number;
    target?: number;
    unit: '%';
    status: 'normal' | 'warning' | 'critical';
  };
  co2: {
    current: number;
    target?: number;
    unit: 'ppm';
    status: 'normal' | 'warning' | 'critical';
  };
  yield: YieldChartData;
  spaceUtilization: UtilizationChartData;
}

// Activity Models
export interface ActivityFilters {
  startDate?: string;
  endDate?: string;
  actionType?: string;
  actorType?: string;
}

export interface ActivityLogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ContainerActivityState {
  activities: ActivityLog[];
  pagination: ActivityLogPagination;
  filters: ActivityFilters;
  isLoading: boolean;
  error: ContainerDetailError | null;
}

// Settings Models
export interface ContainerSettingsState {
  settings: ContainerSettingsUpdateRequest;
  environmentLinks: EnvironmentLink | null;
  isEditMode: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  validationErrors: Record<string, string>;
}

// Data Transformation Types
export interface ContainerDetailAdapter {
  fromApiResponse(response: ContainerOverviewResponse): ContainerDetailData;
  toMetricsDisplay(metrics: DashboardMetrics): ContainerMetricsDisplay;
  fromActivityResponse(response: ActivityLogsResponse): ContainerActivityState;
  toSettingsRequest(container: ContainerInfo, settings: Partial<ContainerSettingsUpdateRequest>): ContainerSettingsUpdateRequest;
}

// Polling and Real-time Types
export interface MetricPollingConfig {
  enabled: boolean;
  interval: number; // in milliseconds
  maxRetries: number;
  retryDelay: number;
}

export interface RealTimeMetricsState {
  isPolling: boolean;
  lastUpdate: string | null;
  updateCount: number;
  config: MetricPollingConfig;
}

// Error Types
export interface ContainerDetailError {
  type: 'LOAD_ERROR' | 'PERMISSION_ERROR' | 'NETWORK_ERROR' | 'VALIDATION_ERROR';
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
  retryable: boolean;
}

// Navigation Types
export interface ContainerDetailNavigation {
  containerId: number;
  activeTab: string;
  previousRoute?: string;
  canNavigateBack: boolean;
}

// Search and Filter Types
export interface ContainerDetailFilters {
  timeRange: TimeRangeValue;
  metricInterval: string;
  activityFilters: ActivityFilters;
}

// Export Types for ViewModels
export interface ContainerDetailViewModel {
  state: ContainerDetailState;
  navigation: ContainerDetailNavigation;
  metrics: ContainerMetricsDisplay | null;
  activity: ContainerActivityState;
  settings: ContainerSettingsState;
  realTime: RealTimeMetricsState;
  filters: ContainerDetailFilters;
  error: ContainerDetailError | null;
}

// Action Types for State Management
export type ContainerDetailAction = 
  | { type: 'LOAD_START'; payload: { containerId: number } }
  | { type: 'LOAD_SUCCESS'; payload: ContainerDetailData }
  | { type: 'LOAD_ERROR'; payload: ContainerDetailError }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_TIME_RANGE'; payload: TimeRangeValue }
  | { type: 'UPDATE_METRICS'; payload: ContainerMetricsDisplay }
  | { type: 'ADD_ACTIVITY'; payload: ActivityLog }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ContainerSettingsUpdateRequest> }
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'START_POLLING' }
  | { type: 'STOP_POLLING' }
  | { type: 'CLEAR_ERROR' };

// Form Types
export interface ContainerSettingsForm {
  tenant_id: number;
  purpose: string;
  location: Record<string, any>;
  notes: string;
  shadow_service_enabled: boolean;
  copied_environment_from?: number;
  robotics_simulation_enabled: boolean;
  ecosystem_connected: boolean;
  ecosystem_settings: Record<string, any>;
}

export interface ContainerSettingsValidation {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}
