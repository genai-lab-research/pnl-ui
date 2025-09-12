import { SeedType, Tenant, Location } from '../../../types/containers';

export interface ContainerEditFormData {
  name: string; // Read-only in edit mode
  tenant_id: number | null;
  type: 'physical' | 'virtual';
  purpose: 'development' | 'research' | 'production' | null;
  seed_type_ids: number[];
  location: Location;
  notes: string;
  shadow_service_enabled: boolean;
  copied_environment_from: number | null;
  robotics_simulation_enabled: boolean;
  ecosystem_connected: boolean;
  ecosystem_settings: {
    fa: 'alpha' | 'prod' | null;
    pya: 'dev' | 'test' | 'stage' | null;
    aws: 'dev' | 'prod' | null;
    mbai: 'prod';
  };
  // Edit-specific fields
  container_id: number;
  original_ecosystem_connected?: boolean; // Track if already connected to ecosystem
}

export interface ContainerEditFormOptions {
  tenants: Tenant[];
  purposes: Array<{ value: string; label: string }>;
  seedTypes: SeedType[];
  virtualContainers: Array<{ id: number; name: string }>;
}

export interface ContainerEditFormErrors {
  tenant_id?: string;
  purpose?: string;
  seed_type_ids?: string;
  location?: string;
  general?: string;
}

export interface ContainerEditFormState {
  data: ContainerEditFormData;
  errors: ContainerEditFormErrors;
  loading: boolean;
  submitting: boolean;
  options: ContainerEditFormOptions;
}
