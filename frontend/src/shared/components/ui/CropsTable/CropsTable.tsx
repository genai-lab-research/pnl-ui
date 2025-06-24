import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { CropsTableProps } from './types';
import { StyledTableContainer, StyledTableCell, StyledHeaderCell } from './CropsTable.styles';

/**
 * CropsTable component for displaying crop data in a table format
 * 
 * @param props - CropsTable props
 * @returns JSX element
 */
export const CropsTable: React.FC<CropsTableProps> = ({
  crops,
  loading = false,
  onRowClick,
  ...props
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getOverdueStatus = (overdueDays: number) => {
    if (overdueDays === 0) {
      return <Chip label="On time" size="small" color="success" />;
    } else if (overdueDays > 0) {
      return <Chip label={`${overdueDays} days overdue`} size="small" color="error" />;
    }
    return <Chip label="Upcoming" size="small" color="default" />;
  };

  if (loading) {
    return (
      <StyledTableContainer>
        <Box p={4} textAlign="center">
          <Typography>Loading crops data...</Typography>
        </Box>
      </StyledTableContainer>
    );
  }

  return (
    <StyledTableContainer {...props}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledHeaderCell>Seed Type</StyledHeaderCell>
            <StyledHeaderCell align="center">Cultivation Area</StyledHeaderCell>
            <StyledHeaderCell align="center">Nursery Table</StyledHeaderCell>
            <StyledHeaderCell align="center">Last SO</StyledHeaderCell>
            <StyledHeaderCell align="center">Last TP</StyledHeaderCell>
            <StyledHeaderCell align="center">Last HD</StyledHeaderCell>
            <StyledHeaderCell align="center">Avg Age</StyledHeaderCell>
            <StyledHeaderCell align="center">Overdue</StyledHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {crops.map((crop, index) => (
            <TableRow
              key={crop.id || index}
              hover
              onClick={() => onRowClick?.(crop)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              <StyledTableCell component="th" scope="row">
                <Typography variant="body2" fontWeight={500}>
                  {crop.seed_type}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2">
                  {crop.cultivation_area_count || 0}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2">
                  {crop.nursery_table_count || 0}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2">
                  {formatDate(crop.seed_date)}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2">
                  {formatDate(crop.transplanting_date_planned || '')}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2">
                  {formatDate(crop.harvesting_date_planned || '')}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2">
                  {crop.age || 0} days
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                {getOverdueStatus(crop.overdue_days || 0)}
              </StyledTableCell>
            </TableRow>
          ))}
          {crops.length === 0 && (
            <TableRow>
              <StyledTableCell colSpan={8} align="center">
                <Typography color="textSecondary">
                  No crops data available
                </Typography>
              </StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default CropsTable;