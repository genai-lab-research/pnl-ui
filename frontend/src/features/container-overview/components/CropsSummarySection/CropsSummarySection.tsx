import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import { 
  KeyboardArrowDown as ExpandMoreIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useCropSummary } from '../../hooks/useCropSummary';
import { cropsSummarySectionStyles } from './CropsSummarySection.styles';

interface CropsSummarySectionProps {
  containerId: number;
  isLoading?: boolean;
  onRefresh: () => void;
}

export const CropsSummarySection: React.FC<CropsSummarySectionProps> = ({
  containerId,
  isLoading = false,
  onRefresh,
}) => {
  const {
    filteredCrops: crops,
    isLoading: isCropsLoading,
    hasError,
    errorMessage,
    refreshData: refreshCrops,
  } = useCropSummary({
    containerId,
  });

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  const getOverdueChipColor = (count: number) => {
    if (count === 0) return { backgroundColor: '#E8F5E8', color: '#2E7D32' };
    if (count <= 2) return { backgroundColor: '#FFF3E0', color: '#F57C00' };
    return { backgroundColor: '#FFEBEE', color: '#D32F2F' };
  };

  const handleRefresh = () => {
    refreshCrops();
    onRefresh();
  };

  if (isLoading || (isCropsLoading && !crops.length)) {
    return (
      <Card sx={cropsSummarySectionStyles.card}>
        <CardContent sx={cropsSummarySectionStyles.cardContent}>
          <Box sx={cropsSummarySectionStyles.header}>
            <Skeleton variant="text" width={120} height={28} />
            <Skeleton variant="rectangular" width={24} height={24} />
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Seed Type', 'Nursery Station', 'Cultivation Area', 'Last Seeding', 'Last Transplanting', 'Last Harvesting', 'Average Age', 'Overdue'].map((header) => (
                    <TableCell key={header}>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 8 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" width={60} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card sx={cropsSummarySectionStyles.card}>
        <CardContent sx={cropsSummarySectionStyles.cardContent}>
          <Alert 
            severity="error" 
            action={
              <button onClick={handleRefresh}>
                Retry
              </button>
            }
          >
            {errorMessage || 'Failed to load crops data'}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={cropsSummarySectionStyles.card}>
      <CardContent sx={cropsSummarySectionStyles.cardContent}>
        <Box sx={cropsSummarySectionStyles.header}>
          <Typography variant="h6" sx={cropsSummarySectionStyles.title}>
            Crops
          </Typography>
          
          <IconButton size="small" sx={cropsSummarySectionStyles.expandButton}>
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        <TableContainer sx={cropsSummarySectionStyles.tableContainer}>
          <Table sx={cropsSummarySectionStyles.table}>
            <TableHead>
              <TableRow sx={cropsSummarySectionStyles.tableHeader}>
                <TableCell sx={cropsSummarySectionStyles.headerCell}>
                  Seed Type
                </TableCell>
                <TableCell sx={cropsSummarySectionStyles.headerCell} align="center">
                  Nursery Station (count)
                </TableCell>
                <TableCell sx={cropsSummarySectionStyles.headerCell} align="center">
                  Cultivation Area (count)
                </TableCell>
                <TableCell sx={cropsSummarySectionStyles.headerCell} align="center">
                  Last Seeding Date
                </TableCell>
                <TableCell sx={cropsSummarySectionStyles.headerCell} align="center">
                  Last Transplanting Date
                </TableCell>
                <TableCell sx={cropsSummarySectionStyles.headerCell} align="center">
                  Last Harvesting Date
                </TableCell>
                <TableCell sx={cropsSummarySectionStyles.headerCell} align="center">
                  Average Age
                </TableCell>
                <TableCell sx={cropsSummarySectionStyles.headerCell} align="center">
                  Overdue (count)
                  <Tooltip title="Number of crops that are past their expected timeline">
                    <InfoIcon sx={{ fontSize: 14, ml: 0.5, color: '#71717A' }} />
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {crops.length === 0 ? (
                // Fallback data with clearly visible placeholder values
                <>
                  <TableRow sx={cropsSummarySectionStyles.tableRow}>
                    <TableCell sx={cropsSummarySectionStyles.dataCell}>
                      <Typography variant="body2" sx={cropsSummarySectionStyles.seedType}>
                        {`[NO DATA] Placeholder Crop A`}
                      </Typography>
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      999999
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      999999
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      1999-12-31
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      1999-12-31
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      NO DATA
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      999999
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      <Chip
                        label="999999"
                        size="small"
                        sx={{
                          ...cropsSummarySectionStyles.overdueChip,
                          backgroundColor: '#FFF3E0',
                          color: '#F57C00',
                          fontSize: '0.75rem',
                          height: 20,
                        }}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow sx={cropsSummarySectionStyles.tableRow}>
                    <TableCell sx={cropsSummarySectionStyles.dataCell}>
                      <Typography variant="body2" sx={cropsSummarySectionStyles.seedType}>
                        {`[NO DATA] Placeholder Crop B`}
                      </Typography>
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      0
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      0
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      1999-12-31
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      1999-12-31
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      NO DATA
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      0
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      <Chip
                        label="0"
                        size="small"
                        sx={{
                          ...cropsSummarySectionStyles.overdueChip,
                          backgroundColor: '#E8F5E8',
                          color: '#2E7D32',
                          fontSize: '0.75rem',
                          height: 20,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                crops.map((crop: any, index: number) => (
                  <TableRow 
                    key={`${crop.seed_type || crop.seedType}-${index}`} 
                    sx={cropsSummarySectionStyles.tableRow}
                  >
                    <TableCell sx={cropsSummarySectionStyles.dataCell}>
                      <Typography variant="body2" sx={cropsSummarySectionStyles.seedType}>
                        {crop.seed_type || crop.seedType || '[NO DATA] Unknown Crop'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      {crop.nursery_station_count ?? crop.nurseryStationCount ?? 999999}
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      {crop.cultivation_area_count ?? crop.cultivationAreaCount ?? 999999}
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      {formatDate(crop.last_seeding_date || crop.lastSeedingDate) || '1999-12-31'}
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      {formatDate(crop.last_transplanting_date || crop.lastTransplantingDate) || '1999-12-31'}
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      {formatDate(crop.last_harvesting_date || crop.lastHarvestingDate) || 'NO DATA'}
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      {crop.average_age ?? crop.averageAge ?? 999999} days
                    </TableCell>
                    <TableCell sx={cropsSummarySectionStyles.dataCell} align="center">
                      <Chip
                        label={crop.overdue_count ?? crop.overdueCount ?? 999999}
                        size="small"
                        sx={{
                          ...cropsSummarySectionStyles.overdueChip,
                          ...getOverdueChipColor(crop.overdue_count || crop.overdueCount || 999999),
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={cropsSummarySectionStyles.paginationContainer}>
          <Typography variant="body2" sx={cropsSummarySectionStyles.paginationText}>
            Showing page 1 of 1
          </Typography>
          <Box sx={cropsSummarySectionStyles.paginationControls}>
            <Button
              size="small"
              disabled
              sx={cropsSummarySectionStyles.paginationButton}
            >
              ← Previous
            </Button>
            <Typography variant="body2" sx={cropsSummarySectionStyles.paginationInfo}>
              Showing page 1 of 1
            </Typography>
            <Button
              size="small"
              disabled
              sx={cropsSummarySectionStyles.paginationButton}
            >
              Next →
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
