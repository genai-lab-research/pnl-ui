import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Collapse
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { CropsSummary } from '../../../../api/containerApiService';
import { styles } from './CropsSummaryTable.styles';

interface CropsSummaryTableProps {
  crops: CropsSummary[];
}

export const CropsSummaryTable: React.FC<CropsSummaryTableProps> = ({ crops }) => {
  const [expanded, setExpanded] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const getOverdueChip = (count: number) => {
    if (count === 0) {
      return <Chip label={count} size="small" color="success" />;
    } else if (count > 0) {
      return <Chip label={`${count} days`} size="small" color="error" />;
    }
    return null;
  };

  const paginatedCrops = crops.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={styles.root}>
      <Box sx={styles.header}>
        <Typography variant="h5" sx={styles.title}>
          Crops
        </Typography>
        <IconButton 
          onClick={() => setExpanded(!expanded)}
          size="small"
          sx={styles.expandButton}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <TableContainer sx={styles.tableContainer}>
          <Table sx={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.headerCell}>SEED TYPE</TableCell>
                <TableCell sx={{ ...styles.headerCell, display: { xs: 'none', sm: 'table-cell' } }} align="center">CULTIVATION AREA</TableCell>
                <TableCell sx={{ ...styles.headerCell, display: { xs: 'none', sm: 'table-cell' } }} align="center">NURSERY TABLE</TableCell>
                <TableCell sx={{ ...styles.headerCell, display: { xs: 'none', md: 'table-cell' } }} align="center">LAST SD</TableCell>
                <TableCell sx={{ ...styles.headerCell, display: { xs: 'none', md: 'table-cell' } }} align="center">LAST TD</TableCell>
                <TableCell sx={{ ...styles.headerCell, display: { xs: 'none', lg: 'table-cell' } }} align="center">LAST HD</TableCell>
                <TableCell sx={styles.headerCell} align="center">AVG AGE</TableCell>
                <TableCell sx={styles.headerCell} align="center">OVERDUE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCrops.map((crop, index) => (
                <TableRow key={`${crop.seed_type}-${index}`} sx={styles.dataRow}>
                  <TableCell sx={styles.seedTypeCell}>{crop.seed_type}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} align="center">{crop.cultivation_area_count}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} align="center">{crop.nursery_station_count}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="center">{formatDate(crop.last_seeding_date)}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="center">{formatDate(crop.last_transplanting_date)}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }} align="center">{formatDate(crop.last_harvesting_date)}</TableCell>
                  <TableCell align="center">{crop.average_age}</TableCell>
                  <TableCell align="center">{getOverdueChip(crop.overdue_count)}</TableCell>
                </TableRow>
              ))}
              {paginatedCrops.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={styles.emptyCell}>
                    No crops data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {crops.length > 5 && (
          <TablePagination
            component="div"
            count={crops.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            sx={styles.pagination}
          />
        )}
      </Collapse>
    </Paper>
  );
};