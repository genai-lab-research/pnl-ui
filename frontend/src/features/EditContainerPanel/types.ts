import { Container } from '../../shared/types/containers';

export interface EditContainerPanelProps {
  open: boolean;
  container: Container | null;
  onClose: () => void;
  onSuccess?: (container: Container) => void;
}

export interface EditContainerFormData {
  name: string;
  tenant_id: string;
  type: 'Physical' | 'Virtual';
  purpose: string;
  seed_types: (string | number)[];
  location: string;
  notes: string;
  shadow_service_enabled: boolean;
  copied_environment_from: string;
  robotics_simulation_enabled: boolean;
  ecosystem_connected: boolean;
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

export const initialEnvironmentState: EnvironmentToggleState = {
  fa: 'Alpha',
  pya: 'Dev',
  aws: 'Dev',
  mbai: 'Prod',
  fh: 'Default'
};