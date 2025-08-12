import { 
  ContainerInfo, 
  DashboardMetrics, 
  CropsSummary
} from '../../../api/containerApiService';
import { 
  ActivityLog,
  MetricSnapshot,
  EnvironmentLink 
} from '../../../types/containers';

export interface ContainerDetailData {
  container: ContainerInfo;
  dashboardMetrics: DashboardMetrics;
  cropsSummary: CropsSummary[];
  recentActivity: ActivityLog[];
  isLoading: boolean;
  error: string | null;
}

export interface ContainerSettingsData {
  tenantId?: number;
  purpose?: string;
  location?: Record<string, any>;
  notes?: string;
  shadowServiceEnabled?: boolean;
  copiedEnvironmentFrom?: number;
  roboticsSimulationEnabled?: boolean;
  ecosystemConnected?: boolean;
  ecosystemSettings?: Record<string, any>;
}

export type TimePeriod = 'week' | 'month' | 'quarter' | 'year';

export interface ActivityLogFilters {
  startDate?: string;
  endDate?: string;
  actionType?: string;
  actorType?: string;
}

export interface MetricFilters {
  startDate?: string;
  endDate?: string;
  interval?: string;
}

export interface ContainerDetailTab {
  id: 'overview' | 'environment' | 'inventory' | 'devices';
  label: string;
  isActive: boolean;
}

export interface EditMode {
  isActive: boolean;
  isDirty: boolean;
  originalSettings: ContainerSettingsData | null;
}