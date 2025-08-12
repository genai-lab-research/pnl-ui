import { PerformanceMetrics } from './metrics';

// Container Management Data Models
// Based on p1_datamodels.md specifications

export interface Location {
  city: string;
  country: string;
  address: string;
}

export interface SeedType {
  id: number;
  name: string;
  variety: string;
  supplier: string;
  batch_id: string;
}

export interface Tenant {
  id: number;
  name: string;
}

export interface Alert {
  id: number;
  container_id: number;
  description: string;
  created_at: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  active: boolean;
  related_object: Record<string, any>;
}

export interface Device {
  id: number;
  container_id: number;
  name: string;
  model: string;
  serial_number: string;
  firmware_version: string;
  port: string;
  status: string;
  last_active_at: string;
}

export interface Tray {
  id: number;
  container_id: number;
  rfid_tag: string;
  location: Record<string, any>;
  utilization_pct: number;
  provisioned_at: string;
  status: string;
  capacity: number;
  tray_type: string;
}

export interface Panel {
  id: number;
  container_id: number;
  rfid_tag: string;
  location: Record<string, any>;
  utilization_pct: number;
  provisioned_at: string;
  status: string;
  capacity: number;
  panel_type: string;
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

export interface EnvironmentLink {
  container_id: number;
  fa: Record<string, any>;
  pya: Record<string, any>;
  aws: Record<string, any>;
  mbai: Record<string, any>;
  fh: Record<string, any>;
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
  copied_environment_from: number;
  robotics_simulation_enabled: boolean;
  ecosystem_settings: Record<string, any>;
  yield_kg: number;
  space_utilization_pct: number;
  tray_ids: number[];
  panel_ids: number[];
}

// Computed fields for API responses
export interface ContainerSettings {
  shadow_service_enabled: boolean;
  copied_environment_from: number;
  robotics_simulation_enabled: boolean;
  ecosystem_connected: boolean;
  ecosystem_settings: Record<string, any>;
}

export interface ContainerEnvironment {
  temperature: number;
  humidity: number;
  co2: number;
  light_intensity: number;
}

export interface ContainerInventory {
  total_capacity: number;
  used_capacity: number;
  available_capacity: number;
  seed_count: number;
}

export interface ContainerMetrics {
  yield_kg: number;
  space_utilization_pct: number;
  growth_rate: number;
  health_score: number;
}

// Main Container interface
export interface Container {
  id: number;
  name: string;
  tenant_id: number;
  type: 'physical' | 'virtual';
  purpose: 'development' | 'research' | 'production';
  location: Location;
  notes: string;
  shadow_service_enabled: boolean;
  copied_environment_from: number;
  robotics_simulation_enabled: boolean;
  ecosystem_connected: boolean;
  ecosystem_settings: Record<string, any>;
  status: 'created' | 'active' | 'maintenance' | 'inactive';
  created_at: string;
  updated_at: string;
  
  // Relationships
  seed_types: SeedType[];
  alerts: Alert[];
  devices?: Device[];
  trays?: Tray[];
  panels?: Panel[];
  activity_logs?: ActivityLog[];
  metric_snapshots?: MetricSnapshot[];
  container_snapshots?: ContainerSnapshot[];
  tray_snapshots?: any[];
  panel_snapshots?: any[];
  environment_links?: EnvironmentLink;
  
  // Computed fields
  settings: ContainerSettings;
  environment: ContainerEnvironment;
  inventory: ContainerInventory;
  metrics: ContainerMetrics;
}

// Request/Response types for API operations
export interface CreateContainerRequest {
  name: string;
  tenant_id: number;
  type: 'physical' | 'virtual';
  purpose: 'development' | 'research' | 'production';
  location: Location;
  notes: string;
  shadow_service_enabled: boolean;
  copied_environment_from?: number;
  robotics_simulation_enabled: boolean;
  ecosystem_connected: boolean;
  ecosystem_settings: Record<string, any>;
  status: 'created' | 'active' | 'maintenance' | 'inactive';
  seed_type_ids: number[];
}

export interface UpdateContainerRequest {
  name?: string;
  tenant_id?: number;
  type?: 'physical' | 'virtual';
  purpose?: 'development' | 'research' | 'production';
  location?: Location;
  notes?: string;
  shadow_service_enabled?: boolean;
  copied_environment_from?: number;
  robotics_simulation_enabled?: boolean;
  ecosystem_connected?: boolean;
  ecosystem_settings?: Record<string, any>;
  status?: 'created' | 'active' | 'maintenance' | 'inactive';
  seed_type_ids?: number[];
}

export interface ContainerFilterCriteria {
  search?: string;
  type?: 'physical' | 'virtual';
  tenant?: number;
  purpose?: 'development' | 'research' | 'production';
  status?: 'created' | 'active' | 'maintenance' | 'inactive';
  alerts?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface TenantOption {
  id: number;
  name: string;
}

export interface FilterOptions {
  tenants: TenantOption[];
  purposes: string[];
  statuses: string[];
  container_types: string[];
}

export interface ShutdownRequest {
  reason?: string;
  force?: boolean;
}

export interface ShutdownResponse {
  success: boolean;
  message: string;
  container_id: number;
}

// Container List Response
export interface ContainerListResponse {
  containers: Container[];
  pagination: Pagination;
  performance_metrics: PerformanceMetrics;
}

// Container Trend Data
export interface ContainerTrendData {
  container_id: number;
  container_name: string;
  trend_data: Array<{
    date: string;
    yield_kg: number;
    space_utilization_pct: number;
    air_temperature: number;
    humidity: number;
    co2: number;
  }>;
}