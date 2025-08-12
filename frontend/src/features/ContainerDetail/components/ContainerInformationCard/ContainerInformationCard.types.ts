export interface ContainerInfo {
  id: number;
  name: string;
  type: string;
  tenant: {
    id: number;
    name: string;
  };
  location: Record<string, any>;
  status: string;
}

export interface ContainerFormData {
  tenantId: number;
  purpose: string;
  location: Record<string, unknown>;
  notes: string;
  shadowServiceEnabled: boolean;
  roboticsSimulationEnabled: boolean;
  ecosystemConnected: boolean;
}

export interface ContainerInformationCardProps {
  container: ContainerInfo;
  isEditMode: boolean;
  formData: ContainerFormData;
  onFieldChange: (field: string, value: string | boolean | Record<string, unknown>) => void;
}