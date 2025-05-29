export type ContainerType = 'PHYSICAL' | 'VIRTUAL';
export type ContainerStatus = 'CREATED' | 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
export type ContainerPurpose = 'Development' | 'Research' | 'Production';

export interface ContainerLocation {
  city: string;
  country: string;
  address: string;
}

export interface SystemIntegration {
  name: string;
  enabled: boolean;
}

export interface ContainerSystemIntegrations {
  fa_integration: SystemIntegration;
  aws_environment: SystemIntegration;
  mbai_environment: SystemIntegration;
}

export interface ContainerDetail {
  id: string;
  name: string;
  type: ContainerType;
  tenant: string;
  purpose: ContainerPurpose;
  location: ContainerLocation;
  status: ContainerStatus;
  created: string;
  modified: string;
  creator: string;
  seed_types: string[];
  notes: string;
  shadow_service_enabled: boolean;
  ecosystem_connected: boolean;
  system_integrations: ContainerSystemIntegrations;
}

export interface ContainerCrop {
  id: string;
  seed_type: string;
  cultivation_area: number;
  nursery_table: number;
  last_sd: string | null;
  last_td: string | null;
  last_hd: string | null;
  avg_age: number;
  overdue: number;
}

export interface ContainerCropsList {
  total: number;
  results: ContainerCrop[];
}

export type ActivityType = 'SEEDED' | 'SYNCED' | 'ENVIRONMENT_CHANGED' | 'CREATED' | 'MAINTENANCE';

export interface ActivityUser {
  name: string;
  role: string;
}

export interface ActivityDetails {
  [key: string]: unknown;
}

export interface ContainerActivity {
  id: string;
  type: ActivityType;
  timestamp: string;
  description: string;
  user: ActivityUser;
  details: ActivityDetails;
}

export interface ContainerActivityList {
  activities: ContainerActivity[];
}

// Dashboard specific interfaces from page1_routing.md
export interface ContainerSummary {
  id: string;
  name: string;
  type: ContainerType;
  tenant_name: string;
  purpose: ContainerPurpose;
  location_city?: string;
  location_country?: string;
  status: ContainerStatus;
  created_at: string;
  updated_at: string;
  has_alerts: boolean;
}

export interface ContainerList {
  total: number;
  results: ContainerSummary[];
}

export interface ContainerStats {
  physical_count: number;
  virtual_count: number;
}

export interface ContainerFilterParams {
  skip?: number;
  limit?: number;
  name?: string;
  tenant_id?: string;
  type?: ContainerType;
  purpose?: string;
  status?: ContainerStatus;
  has_alerts?: boolean;
  location?: string;
  [key: string]: unknown; // Allow additional properties for API compatibility
}

export interface ContainerCreate {
  name: string;
  type: ContainerType;
  tenant_id: string;
  purpose: ContainerPurpose;
  location_city?: string;
  location_country?: string;
  notes?: string;
}

export interface ContainerUpdate {
  name?: string;
  type?: ContainerType;
  tenant_id?: string;
  purpose?: ContainerPurpose;
  location_city?: string;
  location_country?: string;
  status?: ContainerStatus;
  notes?: string;
}

// Page 2 specific interfaces - Create Container Form
export interface ContainerFormData {
  name: string;
  tenant: string;
  type: 'physical' | 'virtual';
  purpose: string;
  seed_types: string[];
  location: string;
  notes?: string;
  shadow_service_enabled: boolean;
  connect_to_other_systems: boolean;
}

export interface ContainerResponse {
  id: string;
  name: string;
  type: 'PHYSICAL' | 'VIRTUAL';
  tenant_name: string;
  purpose: string;
  location_city: string;
  location_country: string;
  status: 'CREATED';
  created_at: string;
  updated_at: string;
  has_alerts: boolean;
  shadow_service_enabled: boolean;
  ecosystem_connected: boolean;
}