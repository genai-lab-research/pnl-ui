// Container Management Data Models

export interface Location {
  city: string;
  country: string;
  address?: string;
}

export interface Container {
  id: string;
  type: 'physical' | 'virtual';
  name: string;
  tenant: string;
  purpose: 'development' | 'research' | 'production';
  location: Location;
  status: 'created' | 'active' | 'connected' | 'maintenance' | 'inactive';
  seed_types?: string[];
  created: string; // ISO 8601 format
  modified: string; // ISO 8601 format
  has_alert: boolean;
  notes?: string;
  shadow_service_enabled: boolean;
  ecosystem_connected: boolean;
}

export interface ContainerFilterCriteria {
  search?: string;
  type?: 'physical' | 'virtual';
  tenant?: string;
  purpose?: 'development' | 'research' | 'production';
  status?: 'created' | 'active' | 'connected' | 'maintenance' | 'inactive';
  has_alerts?: boolean;
}

export interface CreateContainerRequest {
  name: string;
  tenant: string;
  type: 'physical' | 'virtual';
  purpose: 'development' | 'research' | 'production';
  location: string; // Location identifier or description string
  seed_types?: string[];
  notes?: string;
  shadow_service_enabled: boolean;
  connect_to_other_systems: boolean;
}

export interface UpdateContainerRequest {
  type?: 'physical' | 'virtual';
  name?: string;
  tenant?: string;
  purpose?: 'development' | 'research' | 'production';
  location?: Location;
  status?: 'created' | 'active' | 'connected' | 'maintenance' | 'inactive';
  seed_types?: string[];
  notes?: string;
  shadow_service_enabled?: boolean;
  ecosystem_connected?: boolean;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}