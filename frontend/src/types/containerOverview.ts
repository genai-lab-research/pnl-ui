export interface TenantInfo {
  id: number;
  name: string;
}

export interface ContainerInfo {
  id: number;
  name: string;
  type: string;
  tenant: TenantInfo;
  location: Record<string, any>;
  status: string;
}

export interface YieldDataPoint {
  date: string;
  value: number;
  is_current_period: boolean;
  is_future: boolean;
}

export interface UtilizationDataPoint {
  date: string;
  nursery_value: number;
  cultivation_value: number;
  is_current_period: boolean;
  is_future: boolean;
}

export interface YieldMetrics {
  average: number;
  total: number;
  chart_data: YieldDataPoint[];
}

export interface SpaceUtilizationMetrics {
  nursery_station: number;
  cultivation_area: number;
  chart_data: UtilizationDataPoint[];
}

export interface DashboardMetrics {
  air_temperature: number;
  humidity: number;
  co2: number;
  yield: YieldMetrics;
  space_utilization: SpaceUtilizationMetrics;
}

export interface CropSummary {
  seed_type: string;
  nursery_station_count: number;
  cultivation_area_count: number;
  last_seeding_date?: string;
  last_transplanting_date?: string;
  last_harvesting_date?: string;
  average_age: number;
  overdue_count: number;
}

export interface ActivityLog {
  id: number;
  container_id: number;
  timestamp: string;
  action_type: string;
  actor_type: string;
  actor_id: string;
  description: string;
}

export interface ContainerOverview {
  container: ContainerInfo;
  dashboard_metrics: DashboardMetrics;
  crops_summary: CropSummary[];
  recent_activity: ActivityLog[];
}

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

export interface CreateMetricSnapshotRequest {
  air_temperature: number;
  humidity: number;
  co2: number;
  yield_kg: number;
  space_utilization_pct: number;
}

export interface ContainerSnapshot {
  id: number;
  container_id: number;
  timestamp: string;
  type: string;
  status: string;
  tenant_id: number;
  purpose: string;
  location: Record<string, any>;
  shadow_service_enabled: boolean;
  copied_environment_from?: number;
  robotics_simulation_enabled: boolean;
  ecosystem_settings: Record<string, any>;
  yield_kg: number;
  space_utilization_pct: number;
  tray_ids: number[];
  panel_ids: number[];
}

export interface CreateContainerSnapshotRequest {
  type: string;
  status: string;
  tenant_id: number;
  purpose: string;
  location: Record<string, any>;
  shadow_service_enabled: boolean;
  copied_environment_from?: number;
  robotics_simulation_enabled: boolean;
  ecosystem_settings: Record<string, any>;
  yield_kg: number;
  space_utilization_pct: number;
  tray_ids: number[];
  panel_ids: number[];
}

export interface ContainerSettingsUpdateRequest {
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

export interface ContainerSettingsUpdateResponse {
  success: boolean;
  message: string;
  updated_at: string;
}

export interface EnvironmentLinks {
  container_id: number;
  fa: Record<string, any>;
  pya: Record<string, any>;
  aws: Record<string, any>;
  mbai: Record<string, any>;
  fh: Record<string, any>;
}

export interface UpdateEnvironmentLinksRequest {
  fa: Record<string, any>;
  pya: Record<string, any>;
  aws: Record<string, any>;
  mbai: Record<string, any>;
  fh: Record<string, any>;
}

export interface CreateActivityLogRequest {
  action_type: string;
  actor_type: string;
  actor_id: string;
  description: string;
}

export interface DashboardSummary {
  current_metrics: {
    air_temperature: number;
    humidity: number;
    co2: number;
    yield_kg: number;
    space_utilization_pct: number;
  };
  crop_counts: {
    total_crops: number;
    nursery_crops: number;
    cultivation_crops: number;
    overdue_crops: number;
  };
  activity_count: number;
  last_updated: string;
}

export interface ActivityLogQueryParams {
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  action_type?: string;
  actor_type?: string;
}

export interface ActivityLogResponse {
  activities: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface MetricSnapshotQueryParams {
  start_date?: string;
  end_date?: string;
  interval?: 'hour' | 'day' | 'week';
  limit?: number;
}

export interface ContainerSnapshotQueryParams {
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export interface ContainerOverviewQueryParams {
  time_range?: 'week' | 'month' | 'quarter' | 'year';
  metric_interval?: 'hour' | 'day' | 'week';
}