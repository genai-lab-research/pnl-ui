import React from 'react';

import { Box, TableRow as MuiTableRow, TableCell, TableHead } from '@mui/material';

import { Column } from '../../../types/containers';

interface TableHeaderProps {
  /**
   * Columns configuration for the header
   */
  columns: Column[];

  /**
   * Custom class name
   */
  className?: string;
}

/**
 * TableHeader component for displaying column headers in a data table
 */
const TableHeader: React.FC<TableHeaderProps> = ({ columns, className }) => {
  return (
    <TableHead className={className}>
      <MuiTableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align || 'left'}
            sx={{
              width: column.width,
              backgroundColor: '#F5F5F5', // Light grey background matching the reference UI
              fontWeight: 500, // Changed from 600 to 500 as per QA report
              color: '#616161', // Darker grey text color
              borderBottom: '1px solid',
              borderBottomColor: '#E0E0E0',
              padding: '12px 16px', // Updated padding for better spacing
              height: '48px',
              '&:first-of-type': {
                paddingLeft: 2,
              },
              '&:last-of-type': {
                paddingRight: 2,
              },
            }}
          >
            <Box
              component="span"
              sx={{
                textTransform: 'uppercase', // Ensuring uppercase as per QA report
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
              }}
            >
              {column.label.toUpperCase()} {/* Ensuring label is uppercase */}
            </Box>
          </TableCell>
        ))}
      </MuiTableRow>
    </TableHead>
  );
};

export default TableHeader;
