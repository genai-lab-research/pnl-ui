export interface DataGridRowProps {
  cropName: string;
  generation: number;
  cycles: number;
  seedingDate: string;
  harvestDate: string;
  inspectionDate: string;
  beds: number;
  status: {
    type: 'active' | 'inactive' | 'warning' | 'error';
    count: number;
  };
}

export interface DataGridCellProps {
  children: React.ReactNode;
  grow?: boolean;
  align?: 'left' | 'center' | 'right';
}