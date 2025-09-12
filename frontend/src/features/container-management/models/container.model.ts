// Container domain model
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

export interface Container {
  id: number;
  name: string;
  type: 'nursery' | 'cultivation';
  created: string;
  location: Location;
  status: 'active' | 'inactive' | 'maintenance';
  seed_type: SeedType;
  alerts: Alert[];
  settings: ContainerSettings;
}