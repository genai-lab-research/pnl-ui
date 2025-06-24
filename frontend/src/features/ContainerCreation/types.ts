import { CreateContainerRequest } from '../../shared/types/containers';

export interface ContainerCreationDrawerProps {
  open: boolean;
  onClose: () => void;
  onContainerCreated?: (container: CreateContainerRequest) => void;
}

export interface ContainerFormData extends CreateContainerRequest {
  // Add any additional form-specific fields if needed
  validation?: {
    isValid: boolean;
    errors: ContainerFormErrors;
  };
}

export interface ContainerFormErrors {
  name?: string;
  tenant?: string;
  type?: string;
  purpose?: string;
  location?: string;
  seed_types?: string;
  notes?: string;
}