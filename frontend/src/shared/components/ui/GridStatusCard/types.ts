import { ReactNode } from 'react';

export type GridItemStatus = 'active' | 'inactive' | 'pending' | 'warning' | 'error' | 'custom';

export interface GridItem {
  id?: string;
  status: GridItemStatus;
  value?: number | string;
  color?: string;
}

export interface GridStatusCardProps {
  slotLabel?: string;
  slotNumber?: string | number;
  title: string;
  utilization?: number;
  progressValue?: number;
  progressColor?: string;
  showProgress?: boolean;
  gridRows?: number;
  gridColumns?: number;
  gridData?: GridItem[][];
  gridLabel?: string;
  itemCount?: number;
  itemLabel?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onActionClick?: () => void;
  variant?: 'default' | 'compact' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  error?: string;
  className?: string;
  ariaLabel?: string;
  statusColors?: {
    active?: string;
    inactive?: string;
    pending?: string;
    warning?: string;
    error?: string;
    custom?: string;
  };
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
  onGridItemClick?: (row: number, col: number, item: GridItem) => void;
}