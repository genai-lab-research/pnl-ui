import React from 'react';
import { styled } from '@mui/material/styles';
import { TableRow, TableCell, TableHead } from '@mui/material';
import clsx from 'clsx';

export interface TableHeaderColumn {
  /**
   * Unique identifier for the column
   */
  id: string;
  
  /**
   * Header text for the column
   */
  label: string;
  
  /**
   * Width of the column (can be a number for pixels or a string for percent/other units)
   */
  width?: number | string;
  
  /**
   * Alignment of the content in cells
   * @default "left"
   */
  align?: 'left' | 'center' | 'right';
  
  /**
   * Whether this column can be sorted
   * @default false
   */
  sortable?: boolean;
  
  /**
   * Column priority for responsive behavior (lower number = higher priority)
   */
  priority?: number;
}

export interface TableHeaderProps {
  /**
   * Array of column definitions
   */
  columns: TableHeaderColumn[];
  
  /**
   * Optional className to apply to the root component
   */
  className?: string;
  
  /**
   * Header background color
   * @default "#F5F5F7"
   */
  headerBgColor?: string;
  
  /**
   * Text color for the header
   * @default "rgba(76, 78, 100, 0.87)"
   */
  headerTextColor?: string;
  
  /**
   * Whether the table should have a sticky header
   * @default false
   */
  stickyHeader?: boolean;
}

const StyledTableHead = styled(TableHead, {
  shouldForwardProp: (prop) => !['headerBgColor'].includes(prop as string),
})<{ headerBgColor?: string }>(
  ({ headerBgColor }) => ({
    '& .MuiTableRow-root': {
      backgroundColor: headerBgColor || '#F5F5F7',
      '& .MuiTableCell-root': {
        borderBottom: 'none',
      },
    },
  })
);

const StyledHeaderCell = styled(TableCell, {
  shouldForwardProp: (prop) => !['headerTextColor'].includes(prop as string),
})<{ headerTextColor?: string; width?: number | string }>(
  ({ theme, headerTextColor, width }) => ({
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '24px',
    color: headerTextColor || 'rgba(76, 78, 100, 0.87)',
    textTransform: 'uppercase',
    letterSpacing: '0.17px',
    width: width || 'auto',
    fontFamily: 'Inter, sans-serif',
    padding: '12px 16px',
    
    // Responsive styling
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
      lineHeight: '20px',
      letterSpacing: '0.15px',
      padding: '8px 12px',
    },
  })
);

/**
 * TableHeader component displays a styled header row for a table with customizable columns.
 * 
 * This component is designed to be used as the header section of tables, providing a consistent
 * styling that matches the application's design system. It supports custom column definitions
 * with configurable widths and text alignment.
 * 
 * @component
 * @example
 * ```tsx
 * <TableHeader 
 *   columns={[
 *     { id: 'type', label: 'Type' },
 *     { id: 'name', label: 'Name', width: '20%' },
 *     { id: 'tenant', label: 'Tenant', align: 'center' },
 *     { id: 'purpose', label: 'Purpose' }
 *   ]}
 *   headerBgColor="#F5F5F7"
 *   headerTextColor="rgba(76, 78, 100, 0.87)"
 * />
 * ```
 */
export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  className,
  headerBgColor = '#F5F5F7',
  headerTextColor = 'rgba(76, 78, 100, 0.87)',
  stickyHeader = false,
}) => {
  return (
    <StyledTableHead 
      headerBgColor={headerBgColor} 
      className={clsx('table-header', className)}
    >
      <TableRow>
        {columns.map((column) => (
          <StyledHeaderCell
            key={column.id}
            align={column.align || 'left'}
            headerTextColor={headerTextColor}
            width={column.width}
            stickyHeader={stickyHeader}
          >
            {column.label}
          </StyledHeaderCell>
        ))}
      </TableRow>
    </StyledTableHead>
  );
};

export default TableHeader;
