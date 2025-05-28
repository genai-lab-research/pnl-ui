import React from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Card, CardContent, Chip, IconButton, Typography } from '@mui/material';

import { ContainerCrop } from '../../services/containerService';
import { PaginatorButton } from '../../shared/components/ui/Button';
import { PaginatorContainer } from '../../shared/components/ui/Container';
import { DataTable } from '../../shared/components/ui/Table';

export interface CropsSectionProps {
  crops: ContainerCrop[];
  totalCrops: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const CropsSection: React.FC<CropsSectionProps> = ({
  crops,
  totalCrops,
  page,
  pageSize,
  onPageChange,
  className,
}) => {
  const [expanded, setExpanded] = React.useState<boolean>(true);

  // Toggle expanded state
  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  // Define columns for crops table
  const columns = [
    { id: 'seed_type', label: 'SEED TYPE', width: '20%' },
    { id: 'cultivation_area', label: 'CULTIVATION AREA', width: '10%', align: 'center' as const },
    { id: 'nursery_table', label: 'NURSERY TABLE', width: '10%', align: 'center' as const },
    { id: 'last_sd', label: 'LAST SD', width: '10%', align: 'center' as const },
    { id: 'last_td', label: 'LAST TD', width: '10%', align: 'center' as const },
    { id: 'last_hd', label: 'LAST HD', width: '10%', align: 'center' as const },
    { id: 'avg_age', label: 'AVG AGE', width: '10%', align: 'center' as const },
    { id: 'overdue', label: 'OVERDUE', width: '20%', align: 'center' as const },
  ];

  // Format crops data for the table
  const formatCropsForTable = (crops: ContainerCrop[]) => {
    return crops.map((crop) => {
      return {
        id: crop.id,
        seed_type: crop.seed_type,
        cultivation_area: crop.cultivation_area || '—',
        nursery_table: crop.nursery_table || '—',
        last_sd: crop.last_sd || '—',
        last_td: crop.last_td || '—',
        last_hd: crop.last_hd || '—',
        avg_age: crop.avg_age || '—',
        overdue: crop.overdue ? (
          <Chip label={`${crop.overdue} days`} color="error" size="small" />
        ) : (
          '—'
        ),
      };
    });
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCrops / pageSize);

  // Previous page handler
  const handlePreviousPage = () => {
    if (page > 0) {
      onPageChange(page - 1);
    }
  };

  // Next page handler
  const handleNextPage = () => {
    if (page < totalPages - 1) {
      onPageChange(page + 1);
    }
  };

  return (
    <Card
      className={className}
      elevation={0}
      sx={{
        mb: 4,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: expanded ? '1px solid' : 'none',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight="medium">
            Crops
          </Typography>
          <IconButton onClick={handleExpandToggle} size="small">
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>

        {expanded && (
          <>
            {crops.length > 0 ? (
              <>
                <DataTable columns={columns} rows={formatCropsForTable(crops)} />

                <Box sx={{ p: 2 }}>
                  <PaginatorContainer
                    currentPage={page + 1}
                    totalPages={totalPages}
                    onPrevious={handlePreviousPage}
                    onNext={handleNextPage}
                    disablePrevious={page === 0}
                    disableNext={page >= totalPages - 1}
                  />
                </Box>
              </>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No crops data available.</Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CropsSection;
