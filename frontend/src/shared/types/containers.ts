// Container-related type definitions

export enum ContainerType {
  PHYSICAL = 'Physical',
  VIRTUAL = 'Virtual',
}

export enum ContainerPurpose {
  DEVELOPMENT = 'Development',
  RESEARCH = 'Research',
  PRODUCTION = 'Production',
  TRAINING = 'Training',
}

export enum ContainerStatus {
  CREATED = 'Created',
  ACTIVE = 'Active',
  MAINTENANCE = 'Maintenance',
  INACTIVE = 'Inactive',
}

// For DataTable component
export interface RowData {
  id: string;
  type: ContainerType;
  name: string;
  tenant: string;
  purpose: ContainerPurpose;
  location: string;
  status: ContainerStatus;
  created: string;
  modified: string;
  alerts: number;
}

export interface Column {
  id: string;
  label: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}
