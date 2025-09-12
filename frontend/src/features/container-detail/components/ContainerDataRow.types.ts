export interface ContainerRowData {
  variety: string;
  tenantId: string | number;
  phase: string | number;
  sowingDate: string;
  harvestDate: string;
  shipDate: string;
  batchSize: string | number;
  status: 'active' | 'inactive' | 'pending' | 'warning' | 'error';
}

export interface ContainerDataRowProps extends ContainerRowData {
  onClick?: () => void;
  loading?: boolean;
  error?: string;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}

export type ContainerRowStatus = 'active' | 'inactive' | 'pending' | 'warning' | 'error';