import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Skeleton,
  Typography
} from '@mui/material';
import { VerticalFarmingTableProps, StatusVariant } from './types';
import { StatusChip, TableIcon, RowActionsMenu } from './components';
import { useTableActions } from './hooks';
import {
  getTypeIconPath,
  getAlertIconPath,
  getTypeIconAlt,
  getAlertIconAlt
} from './utils';

/**
 * VerticalFarmingTable - A responsive data table component for displaying farming container information
 * Uses MUI Table components for better consistency and accessibility
 * 
 * @param data - Array of table row data
 * @param onRowAction - Optional callback for row actions
 */
const VerticalFarmingTable: React.FC<VerticalFarmingTableProps> = ({
  data,
  onRowAction,
  isLoading = false,
  selectedRowId = null,
  onRowSelect,
  emptyStateTitle,
  emptyStateMessage
}) => {
  const { handleRowAction } = useTableActions({ onRowAction });
  
  const handleRowClick = (rowId: string) => {
    if (onRowSelect) {
      onRowSelect(rowId);
    }
  };

  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>TYPE</TableCell>
              <TableCell>NAME</TableCell>
              <TableCell>TENANT</TableCell>
              <TableCell>PURPOSE</TableCell>
              <TableCell>LOCATION</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell>CREATED</TableCell>
              <TableCell>MODIFIED</TableCell>
              <TableCell>ALERTS</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                {Array.from({ length: 10 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton variant="text" width="100%" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyStateTitle || 'No data available'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {emptyStateMessage || 'No items to display'}
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>TYPE</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>NAME</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>TENANT</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>PURPOSE</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>LOCATION</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>STATUS</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>CREATED</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>MODIFIED</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>ALERTS</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow 
              key={row.id}
              hover={!!onRowSelect}
              selected={selectedRowId === row.id}
              sx={{
                cursor: onRowSelect ? 'pointer' : 'default',
                '&.Mui-selected': {
                  backgroundColor: '#f0f4ff',
                }
              }}
              onClick={() => handleRowClick(row.id)}
            >
              <TableCell>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <TableIcon
                    src={getTypeIconPath(row.type)}
                    alt={getTypeIconAlt(row.type)}
                  />
                </Box>
              </TableCell>
              
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.tenant}</TableCell>
              <TableCell>{row.purpose}</TableCell>
              <TableCell>{row.location}</TableCell>
              
              <TableCell>
                <StatusChip variant={row.status as StatusVariant}>
                  {row.status}
                </StatusChip>
              </TableCell>
              
              <TableCell>{row.created}</TableCell>
              <TableCell>{row.modified}</TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <TableIcon
                    src={getAlertIconPath(row.hasAlert)}
                    alt={getAlertIconAlt(row.hasAlert)}
                  />
                </Box>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <RowActionsMenu
                    rowId={row.id}
                    onView={(rowId) => handleRowAction(rowId, 'view')}
                    onEdit={(rowId) => handleRowAction(rowId, 'edit')}
                    onShutdown={(rowId) => handleRowAction(rowId, 'shutdown')}
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VerticalFarmingTable;