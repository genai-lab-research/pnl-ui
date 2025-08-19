import { ReactNode } from 'react';

export type CellAlignment = 'left' | 'center' | 'right';
export type CellType = 'text' | 'status' | 'custom';
export type DataTableRowStatusVariant = 'active' | 'inactive' | 'pending' | 'warning' | 'error';

export interface CellData {
  /** Unique identifier for the cell */
  id: string;
  
  /** Type of cell content */
  type: CellType;
  
  /** Text content for text cells */
  content?: string | number;
  
  /** Font weight override for text cells */
  fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  
  /** Status variant for status chips */
  statusVariant?: DataTableRowStatusVariant;
  
  /** Custom React content for custom cells */
  customContent?: ReactNode;
  
  /** Text alignment */
  alignment?: CellAlignment;
  
  /** Fixed width for the cell */
  width?: number;
  
  /** Whether the cell should grow to fill available space */
  flex?: boolean;
  
  /** Accessibility label */
  ariaLabel?: string;
}

export interface DataTableRowProps {
  /** Array of cell data to render */
  cells: CellData[];
  
  /** Whether the row is in a loading state */
  loading?: boolean;
  
  /** Error message to display instead of content */
  error?: string;
  
  /** Whether the row is selected */
  selected?: boolean;
  
  /** Whether the row is disabled */
  disabled?: boolean;
  
  /** Click handler for the entire row */
  onClick?: () => void;
  
  /** Hover handler for the row */
  onHover?: (hovered: boolean) => void;
  
  /** Size variant for the row */
  size?: 'sm' | 'md' | 'lg';
  
  /** Visual variant */
  variant?: 'default' | 'bordered' | 'elevated';
  
  /** Custom className for additional styling */
  className?: string;
  
  /** Accessibility label for the row */
  ariaLabel?: string;
  
  /** Whether the row is clickable */
  clickable?: boolean;
}
