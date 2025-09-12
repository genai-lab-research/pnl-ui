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

export interface Alert {
  id: number;
  container_id: number;
  description: string;
  created_at: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  active: boolean;
  related_object: Record<string, unknown>;
}

export interface ContainerSettings {
  shadow_service_enabled: boolean;
  copied_environment_from: number | null;
  robotics_simulation_enabled: boolean;
  ecosystem_connected: boolean;
  ecosystem_settings: Record<string, unknown>;
}

export interface Environment {
  temperature: number;
  humidity: number;
  co2: number;
  light_intensity: number;
}

export interface Inventory {
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

export interface Container {
  id: number;
  name: string;
  tenant_id: number;
  type: 'physical' | 'virtual';
  purpose: 'development' | 'research' | 'production';
  location?: Location;
  notes: string;
  status: 'created' | 'active' | 'maintenance' | 'inactive';
  created_at: string;
  updated_at: string;
  seed_types: SeedType[];
  alerts: Alert[];
  settings: ContainerSettings;
  environment: Environment;
  inventory: Inventory;
  metrics: ContainerMetrics;
}

export interface Tenant {
  id: number;
  name: string;
}

export interface ContainerFilters {
  search?: string;
  type?: 'physical' | 'virtual' | 'all';
  tenant?: number | 'all';
  purpose?: 'development' | 'research' | 'production' | 'all';
  status?: 'created' | 'active' | 'maintenance' | 'inactive' | 'all';
  alerts?: boolean;
}

export interface ContainerSortOptions {
  field: 'name' | 'created_at' | 'updated_at' | 'status' | 'type';
  order: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: 10 | 25 | 50 | 100;
}

export interface ContainerListParams extends ContainerFilters, ContainerSortOptions, PaginationOptions {}

export interface ContainerTableRow {
  id: string;
  type: 'physical' | 'virtual';
  name: string;
  tenant: string;
  purpose: 'development' | 'research' | 'production';
  location?: string;
  status: 'created' | 'active' | 'maintenance' | 'inactive';
  created: string;
  modified: string;
  hasAlert: boolean;
}

export interface CreateContainerRequest {
  name: string;
  tenant_id: number;
  type: 'physical' | 'virtual';
  purpose: 'development' | 'research' | 'production';
  location?: Location;
  notes: string;
  shadow_service_enabled: boolean;
  copied_environment_from?: number;
  robotics_simulation_enabled: boolean;
  ecosystem_connected: boolean;
  ecosystem_settings: Record<string, unknown>;
  status: 'created' | 'active' | 'maintenance' | 'inactive';
  seed_type_ids: number[];
}

export type UpdateContainerRequest = Partial<CreateContainerRequest>;

export interface ShutdownContainerRequest {
  reason: string;
  force: boolean;
}

export interface ShutdownContainerResponse {
  success: boolean;
  message: string;
  container_id: number;
}