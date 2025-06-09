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

export type TimeRangeOption = 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';

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



