// Location interface used across multiple entities
export interface Location {
  city?: string;
  country?: string;
  address?: string;
  [key: string]: any;
}

// Ecosystem Settings for containers
export interface EcosystemSettings {
  fa?: Record<string, any>;
  pya?: Record<string, any>;
  aws?: Record<string, any>;
  mbai?: Record<string, any>;
  fh?: Record<string, any>;
}

// Container Models
export interface ContainerCreateRequest {
  name: string;
  type?: string;
  tenant_id?: number;
  purpose?: string;
  seed_types?: number[];
  location?: Location;
  notes?: string;
  shadow_service_enabled?: boolean;
  copied_environment_from?: number;
  robotics_simulation_enabled?: boolean;
  ecosystem_connected?: boolean;
  ecosystem_settings?: EcosystemSettings;
}

export interface Container {
  id: number;
  name: string;
  type?: string;
  tenant_id?: number;
  purpose?: string;
  location?: Location;
  notes?: string;
  shadow_service_enabled?: boolean;
  copied_environment_from?: number;
  robotics_simulation_enabled?: boolean;
  ecosystem_connected?: boolean;
  ecosystem_settings?: EcosystemSettings;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContainerListFilters {
  skip?: number;
  limit?: number;
  tenant_id?: number;
  status?: string;
}

export interface ContainerNameValidation {
  name: string;
}

export interface ContainerNameValidationResponse {
  is_valid: boolean;
  suggestions?: string[];
}

// Environment Links
export interface EnvironmentLinks {
  container_id: number;
  fa?: Record<string, any>;
  pya?: Record<string, any>;
  aws?: Record<string, any>;
  mbai?: Record<string, any>;
  fh?: Record<string, any>;
}

export interface EnvironmentLinksUpdate {
  fa?: Record<string, any>;
  pya?: Record<string, any>;
  aws?: Record<string, any>;
  mbai?: Record<string, any>;
  fh?: Record<string, any>;
}

// Tenant Model
export interface Tenant {
  id: number;
  name: string;
}

export interface TenantCreateRequest {
  name: string;
}

// Seed Type Model
export interface SeedType {
  id: number;
  name: string;
  variety?: string;
  supplier?: string;
  batch_id?: string;
}

export interface SeedTypeCreateRequest {
  name: string;
  variety?: string;
  supplier?: string;
  batch_id?: string;
}

// Alert Model
export interface Alert {
  id: number;
  container_id?: number;
  description?: string;
  created_at?: string;
  severity?: string;
  active?: boolean;
  related_object?: Record<string, any>;
}

export interface AlertCreateRequest {
  container_id?: number;
  description?: string;
  severity?: string;
  active?: boolean;
  related_object?: Record<string, any>;
}

export interface AlertListFilters {
  container_id?: number;
  active?: boolean;
  severity?: string;
}

// Device Model
export interface Device {
  id: number;
  container_id?: number;
  name?: string;
  model?: string;
  serial_number?: string;
  firmware_version?: string;
  port?: string;
  status?: string;
  last_active_at?: string;
}

export interface DeviceListFilters {
  container_id?: number;
  status?: string;
}

// Tray Model
export interface Tray {
  id: number;
  container_id?: number;
  rfid_tag?: string;
  location?: Location;
  utilization_pct?: number;
  provisioned_at?: string;
  status?: string;
  capacity?: number;
  tray_type?: string;
}

export interface TrayListFilters {
  container_id?: number;
  status?: string;
}

// Panel Model
export interface Panel {
  id: number;
  container_id?: number;
  rfid_tag?: string;
  location?: Location;
  utilization_pct?: number;
  provisioned_at?: string;
  status?: string;
  capacity?: number;
  panel_type?: string;
}

export interface PanelListFilters {
  container_id?: number;
  status?: string;
}

// Crop Model
export interface Crop {
  id: number;
  seed_type_id?: number;
  seed_date?: string;
  transplanting_date_planned?: string;
  transplanting_date?: string;
  harvesting_date_planned?: string;
  harvesting_date?: string;
  lifecycle_status?: string;
  health_check?: string;
  current_location?: Location;
  last_location?: Location;
  measurements_id?: number;
  image_url?: string;
  recipe_version_id?: number;
  accumulated_light_hours?: number;
  accumulated_water_hours?: number;
  notes?: string;
}

export interface CropListFilters {
  seed_type_id?: number;
  lifecycle_status?: string;
}

// Metric Snapshot Model
export interface MetricSnapshot {
  id: number;
  container_id?: number;
  timestamp?: string;
  air_temperature?: number;
  humidity?: number;
  co2?: number;
  yield_kg?: number;
  space_utilization_pct?: number;
}

export interface MetricSnapshotListFilters {
  container_id?: number;
  start_date?: string;
  end_date?: string;
}

// Activity Log Model
export interface ActivityLog {
  id: number;
  container_id?: number;
  timestamp?: string;
  action_type?: string;
  actor_type?: string;
  actor_id?: string;
  description?: string;
}

export interface ActivityLogListFilters {
  container_id?: number;
  action_type?: string;
  actor_type?: string;
}

// Common response wrappers
export interface ApiListResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  detail: string;
  message?: string;
  code?: string;
}

// Common pagination parameters
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

// Delete response
export interface DeleteResponse {
  message: string;
}