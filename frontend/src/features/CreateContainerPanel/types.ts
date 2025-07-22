import { ContainerCreateRequest, Tenant, SeedType } from '../../types/verticalFarm';

export interface CreateContainerPanelProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (container: any) => void;
}

export interface CreateContainerFormData {
  name: string;
  tenant_id: number | '';
  type: 'Physical' | 'Virtual';
  purpose: string;
  seed_types: number[];
  location: string;
  notes: string;
  shadow_service_enabled: boolean;
  copied_environment_from: number | '';
  robotics_simulation_enabled: boolean;
  ecosystem_connected: boolean;
  ecosystem_settings: {
    fa: string;
    pya: string;
    aws: string;
    mbai: string;
    fh: string;
  };
}

export interface FormErrors {
  name?: string;
  tenant_id?: string;
  purpose?: string;
  seed_types?: string;
  location?: string;
  general?: string;
}

export interface EnvironmentToggleState {
  fa: 'Alpha' | 'Prod';
  pya: 'Dev' | 'Test' | 'Stage';
  aws: 'Dev' | 'Prod';
  mbai: 'Prod';
  fh: 'Default';
}

export const purposeOptions = [
  { value: 'development', label: 'Development' },
  { value: 'research', label: 'Research' },
  { value: 'production', label: 'Production' }
];

export const initialFormData: CreateContainerFormData = {
  name: '',
  tenant_id: '',
  type: 'Physical',
  purpose: '',
  seed_types: [],
  location: '',
  notes: '',
  shadow_service_enabled: false,
  copied_environment_from: '',
  robotics_simulation_enabled: false,
  ecosystem_connected: false,
  ecosystem_settings: {
    fa: 'Alpha',
    pya: 'Dev',
    aws: 'Dev',
    mbai: 'Prod',
    fh: 'Default'
  }
};

export const initialEnvironmentState: EnvironmentToggleState = {
  fa: 'Alpha',
  pya: 'Dev',
  aws: 'Dev',
  mbai: 'Prod',
  fh: 'Default'
};