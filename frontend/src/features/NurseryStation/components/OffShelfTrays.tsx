import React from 'react';
import { Box, Typography, Paper, Grid, Chip } from '@mui/material';
import { OffShelfTraysProps } from '../types';
import { UtilizationIndicator } from '../../../shared/components/ui/UtilizationIndicator';

interface OffShelfTrayCardProps {
  tray: {
    id: number;
    status: string;
    utilization_pct: number;
    tray_type: string;
    capacity: number;
    rfid_tag?: string;
    last_location?: string;
  };
  onSelect?: (trayId: number) => void;
}

const OffShelfTrayCard: React.FC<OffShelfTrayCardProps> = ({ 
  tray, 
  onSelect 
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(tray.id);
    }
  };

  return (
    <Paper 
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <Box className="flex justify-between items-start mb-2">
        <Typography variant="h6" className="font-bold text-steel-smoke">
          Tray {tray.id}
        </Typography>
        <Chip 
          label={tray.status} 
          size="small"
          className="bg-lilac-haze text-steel-smoke"
        />
      </Box>
      
      <Box className="space-y-2">
        <Box className="flex justify-between items-center">
          <Typography variant="body2" className="text-steel-smoke">
            Utilization
          </Typography>
          <UtilizationIndicator 
            percentage={tray.utilization_pct}
          />
        </Box>
        
        <Typography variant="body2" className="text-steel-smoke">
          Type: {tray.tray_type}
        </Typography>
        
        <Typography variant="body2" className="text-steel-smoke">
          Capacity: {tray.capacity}
        </Typography>
        
        {tray.rfid_tag && (
          <Typography variant="caption" className="text-silver-polish">
            RFID: {tray.rfid_tag}
          </Typography>
        )}
        
        {tray.last_location && (
          <Typography variant="caption" className="text-silver-polish">
            Last Location: {tray.last_location}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

/**
 * Display trays that are not currently placed in nursery station slots
 */
export const OffShelfTrays: React.FC<OffShelfTraysProps> = ({
  trays,
  onTraySelect
}) => {
  if (!trays || trays.length === 0) {
    return (
      <Paper className="p-6 text-center">
        <Typography variant="h6" className="text-steel-smoke mb-2">
          Off-Shelf Trays
        </Typography>
        <Typography variant="body2" className="text-silver-polish">
          All trays are currently placed in nursery station slots
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className="p-6">
      <Typography variant="h6" className="mb-4 text-steel-smoke font-semibold">
        Off-Shelf Trays ({trays.length})
      </Typography>
      
      <Grid container spacing={3}>
        {trays.map((tray) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={(tray as { id: number }).id}>
            <OffShelfTrayCard
              tray={tray as OffShelfTrayCardProps['tray']}
              onSelect={onTraySelect}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};