export enum ContainerStatus {
    ACTIVE = 'ACTIVE',
    MAINTENANCE = 'MAINTENANCE',
    INACTIVE = 'INACTIVE',
    CREATED = 'CREATED',
  }
  
  export enum ContainerType {
    PHYSICAL = 'PHYSICAL',
    VIRTUAL = 'VIRTUAL',
  }
  
  export interface RowData {
    id: string;
    name: string;
    type: ContainerType;
    tenant: string;
    purpose: string;
    location: string;
    status: ContainerStatus;
    created: string;
    modified: string;
    alerts: number;
  }