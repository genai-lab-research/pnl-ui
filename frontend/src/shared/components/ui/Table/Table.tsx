import React, { useState, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Table as MuiTable, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Typography,
  Button,
  Tooltip,
  Box
} from '@mui/material';
import clsx from 'clsx';

// Define a generic type for the data rows
export type TableRowData = Record<string, unknown>;

export interface TableColumn {
  /**
   * Unique identifier for the column
   */
  id: string;
  
  /**
   * Header text for the column
   */
  label: string;
  
  /**
   * Optional field name to extract data from row objects
   * If not provided, id will be used
   */
  field?: string;
  
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
   * Columns with priority > certain threshold will be hidden on smaller screens
   */
  priority?: number;
  
  /**
   * Custom renderer for cell content
   */
  renderCell?: (row: TableRowData) => React.ReactNode;
}

export interface TableProps {
  /**
   * Array of column definitions
   */
  columns: TableColumn[];
  
  /**
   * Array of data rows
   */
  rows: TableRowData[];
  
  /**
   * Optional className to apply to the root component
   */
  className?: string;
  
  /**
   * Whether the table should have a sticky header
   * @default false
   */
  stickyHeader?: boolean;
  
  /**
   * Maximum height of the table before scrolling (in pixels)
   */
  maxHeight?: number | string;
  
  /**
   * Whether to apply zebra striping to rows
   * @default false
   */
  zebraStriping?: boolean;
  
  /**
   * Whether the table should take the full width of its container
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Border color for the table
   * @default "#E9EDF4"
   */
  borderColor?: string;
  
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
   * Whether to enable pagination
   * @default false
   */
  pagination?: boolean;
  
  /**
   * Number of rows to display per page
   * @default 10
   */
  rowsPerPage?: number;
  
  /**
   * Initial page to display
   * @default 1
   */
  initialPage?: number;
}

// Truncated cell for text overflow handling
const TruncatedCell = styled('div')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
});

const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => !['maxHeight', 'fullWidth', 'borderColor'].includes(prop as string),
})<{ maxHeight?: number | string; fullWidth?: boolean; borderColor?: string }>(
  ({ theme, maxHeight, fullWidth, borderColor }) => ({
    maxHeight: maxHeight || 'none',
    width: fullWidth ? '100%' : 'auto',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${borderColor || '#E9EDF4'}`,
    boxShadow: 'none',
    overflow: 'auto',
    
    // Responsive styling
    [theme.breakpoints.down('sm')]: {
      borderRadius: theme.shape.borderRadius/2,
      fontSize: '0.875rem',
    },
  })
);

const StyledTable = styled(MuiTable)(({ theme }) => ({
  borderCollapse: 'separate',
  borderSpacing: 0,
  fontFamily: 'Inter, sans-serif',
  
  '& .MuiTableCell-root': {
    fontFamily: 'Inter, sans-serif',
    padding: '12px 16px',
    
    [theme.breakpoints.down('sm')]: {
      padding: '8px 12px',
    },
  },
}));

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
    
    // Responsive styling
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
      lineHeight: '20px',
      letterSpacing: '0.15px',
    },
  })
);

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => !['isZebra', 'index'].includes(prop as string),
})<{ isZebra?: boolean; index: number }>(
  ({ isZebra, index }) => ({
    backgroundColor: isZebra && index % 2 === 1 ? '#FAFAFA' : '#FFFFFF',
    '& .MuiTableCell-root': {
      borderBottom: '1px solid rgba(76, 78, 100, 0.1)',
    },
    '&:last-child .MuiTableCell-root': {
      borderBottom: 'none',
    },
  })
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '20px',
  color: '#000000',
  fontWeight: 400,
  
  // Responsive styling
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    lineHeight: '18px',
  },
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  borderTop: '1px solid rgba(76, 78, 100, 0.1)',
  
  // Responsive styling
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '8px',
    padding: '8px 12px',
  },
}));

const PaginationControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  
  // Responsive styling
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'space-between',
  },
}));

/**
 * Table component for displaying tabular data
 * 
 * A responsive and customizable table component that supports various features like sticky headers,
 * custom column rendering, alignments, zebra striping, and pagination.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic table with string data
 * <Table
 *   columns={[
 *     { id: 'name', label: 'Name' },
 *     { id: 'age', label: 'Age', align: 'right' },
 *     { id: 'location', label: 'Location' }
 *   ]}
 *   rows={[
 *     { name: 'John Doe', age: 30, location: 'New York' },
 *     { name: 'Jane Smith', age: 25, location: 'San Francisco' }
 *   ]}
 * />
 * 
 * // Table with custom cell rendering and pagination
 * <Table
 *   columns={[
 *     { id: 'name', label: 'Name' },
 *     { 
 *       id: 'status', 
 *       label: 'Status',
 *       renderCell: (row) => <Chip status={row.status === 'active' ? 'active' : 'inactive'} value={row.status} />
 *     }
 *   ]}
 *   rows={[
 *     { name: 'Project A', status: 'active' },
 *     { name: 'Project B', status: 'inactive' }
 *   ]}
 *   zebraStriping
 *   stickyHeader
 *   maxHeight={400}
 *   pagination
 *   rowsPerPage={5}
 * />
 * ```
 */
export const Table: React.FC<TableProps> = ({
  columns,
  rows,
  className,
  stickyHeader = false,
  maxHeight,
  zebraStriping = false,
  fullWidth = true,
  borderColor = "#E9EDF4",
  headerBgColor = "#F5F5F7",
  headerTextColor = "rgba(76, 78, 100, 0.87)",
  pagination = false,
  rowsPerPage = 10,
  initialPage = 1,
}) => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calculate total pages for pagination
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(rows.length / rowsPerPage));
  }, [rows.length, rowsPerPage]);

  // Get current page data
  const currentPageData = useMemo(() => {
    if (!pagination) return rows;
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    return rows.slice(startIndex, Math.min(startIndex + rowsPerPage, rows.length));
  }, [rows, pagination, currentPage, rowsPerPage]);

  // Handle pagination
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className={clsx('table-component-wrapper', className)}>
      <StyledTableContainer 
        component={Paper}
        className="table-container"
        maxHeight={maxHeight}
        fullWidth={fullWidth}
        borderColor={borderColor}
      >
        <StyledTable stickyHeader={stickyHeader} aria-label="data table">
          <StyledTableHead headerBgColor={headerBgColor}>
            <TableRow>
              {columns.map((column) => (
                <StyledHeaderCell
                  key={column.id}
                  align={column.align || 'left'}
                  headerTextColor={headerTextColor}
                  width={column.width}
                >
                  {column.label}
                </StyledHeaderCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {currentPageData.map((row, index) => (
              <StyledTableRow key={index} isZebra={zebraStriping} index={index}>
                {columns.map((column) => {
                  const fieldName = column.field || column.id;
                  const cellValue = row[fieldName];
                  
                  return (
                    <StyledTableCell key={column.id} align={column.align || 'left'}>
                      {column.renderCell ? (
                        column.renderCell(row)
                      ) : typeof cellValue === 'string' ? (
                        <Tooltip title={cellValue} arrow placement="top">
                          <TruncatedCell>{cellValue}</TruncatedCell>
                        </Tooltip>
                      ) : (
                        cellValue
                      )}
                    </StyledTableCell>
                  );
                })}
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      {pagination && (
        <PaginationContainer>
          <Typography variant="body2" color="textSecondary">
            Showing page {currentPage} of {totalPages}
          </Typography>
          <PaginationControls>
            <Button 
              variant="outlined" 
              size="small"
              disabled={currentPage <= 1}
              onClick={handlePreviousPage}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={currentPage >= totalPages}
              onClick={handleNextPage}
            >
              Next
            </Button>
          </PaginationControls>
        </PaginationContainer>
      )}
    </div>
  );
};

export default Table;