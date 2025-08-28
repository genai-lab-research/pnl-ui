export interface TableRow {
  id: string;
  type: 'container' | 'virtual';
  name: string;
  tenant: string;
  purpose: 'Development' | 'Research';
  location: string;
  status: 'Active' | 'Inactive' | 'Created' | 'Maintenance';
  created: string;
  modified: string;
  hasAlert: boolean;
}

export interface VerticalFarmingTableProps {
  data: TableRow[];
  onRowAction?: (rowId: string, action: string) => void;
  isLoading?: boolean;
  selectedRowId?: string | null;
  onRowSelect?: (rowId: string) => void;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
}

export type StatusVariant = 'Active' | 'Inactive' | 'Created' | 'Maintenance';