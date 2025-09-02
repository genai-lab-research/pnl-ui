import React, { useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/ErrorOutline';
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';

import {
  formattedContainerList,
  mockContainerList,
} from '../../../../features/container-management/constants/mockData';
import {
  Column,
  ContainerPurpose,
  ContainerStatus,
  ContainerType,
  RowData,
} from '../../../types/containers';
import { ContainerSummary, containerApi } from '../../../utils/api';
import { StatusChipProps } from '../StatusChip/StatusChipActive';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

export interface DataTableProps {
  /**
   * Columns configuration for the table
   */
  columns: Column[];

  /**
   * Data rows for the table
   */
  rows?: RowData[];

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Handler for row click events
   */
  onRowClick?: (row: RowData) => void;

  /**
   * Handler for row action button clicks
   */
  onActionClick?: (row: RowData) => void;

  /**
   * Whether to fetch data from the API instead of using provided rows
   */
  useApi?: boolean;

  /**
   * Filters to apply when fetching from API
   */
  apiFilters?: Record<string, any>;
}

/**
 * DataTable container component for displaying tabular data
 */
export const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows: initialRows,
  className,
  onRowClick,
  onActionClick,
  useApi = false,
  apiFilters = {},
}) => {
  // If initialRows is provided, use it, otherwise show mock data for demo
  const [rows, setRows] = useState<RowData[]>(initialRows || formattedContainerList || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch container data from API if useApi is true
  useEffect(() => {
    if (!useApi) return;

    const fetchContainers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use mock data instead of real API for now
        const response = mockContainerList;

        // Convert API response to RowData format
        const formattedRows: RowData[] = response.map((container) => {
          return {
            id: container.id,
            name: container.name,
            type: container.type === 'PHYSICAL' ? ContainerType.PHYSICAL : ContainerType.VIRTUAL,
            tenant: container.tenant_name,
            purpose: container.purpose as ContainerPurpose,
            location:
              container.location_city && container.location_country
                ? `${container.location_city}, ${container.location_country}`
                : 'N/A',
            status:
              container.status === 'Active'
                ? ContainerStatus.ACTIVE
                : container.status === 'Maintenance'
                ? ContainerStatus.MAINTENANCE
                : container.status === 'Inactive'
                ? ContainerStatus.INACTIVE
                : ContainerStatus.CREATED,
            created: new Date(container.created_at).toLocaleDateString(),
            modified: new Date(container.updated_at).toLocaleDateString(),
            alerts: container.has_alerts ? 1 : 0,
          };
        });

        setRows(formattedRows);
      } catch (err) {
        console.error('Failed to fetch containers:', err);
        setError('Failed to load containers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchContainers();
  }, [useApi, apiFilters, initialRows]);

  // Map status to appropriate status chip variant
  const getStatusChipProps = (status: ContainerStatus): StatusChipProps['variant'] => {
    console.log(status);
    switch (status) {
      case ContainerStatus.ACTIVE:
        return 'connected';
      case ContainerStatus.MAINTENANCE:
        return 'maintenance';
      case ContainerStatus.INACTIVE:
        return 'inactive';
      case ContainerStatus.CREATED:
        return 'created';
      default:
        return 'inactive';
    }
  };

  return (
    <Box className={className} sx={{ width: '100%', overflow: 'hidden', borderRadius: 1 }}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          maxHeight: '100%',
          border: '1px solid',
          borderColor: '#EEEEEE', // Lighter border color
          minHeight: '200px',
          position: 'relative',
          borderRadius: 2, // Slightly more rounded corners
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)', // Subtle shadow for depth
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
          >
            <ErrorIcon color="error" sx={{ mr: 1 }} />
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Table
            stickyHeader
            aria-label="data table"
            sx={{
              tableLayout: 'fixed',
              '& .MuiTableCell-root': {
                borderColor: '#EEEEEE', // Consistent border color
              },
            }}
          >
            <TableHeader columns={columns} />
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    row={row}
                    columns={columns}
                    onClick={() => onRowClick?.(row)}
                    onActionClick={() => onActionClick?.(row)}
                    statusChipProps={{ variant: getStatusChipProps(row.status) }}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '24px' }}>
                    No data available
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default DataTable;
