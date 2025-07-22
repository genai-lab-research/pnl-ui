import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TraySlotProps, TrayGridProps } from '../types';
import { UtilizationIndicator } from '../../../shared/components/ui/UtilizationIndicator';
import { TrayGrid } from './TrayGrid';

/**
 * Individual tray slot component
 * Displays either an empty slot with add button or occupied slot with tray details
 */
export const TraySlot: React.FC<TraySlotProps> = ({
  slotNumber,
  tray,
  onTrayClick,
  onAddTray
}) => {
  const handleTrayClick = () => {
    if (tray && onTrayClick) {
      onTrayClick(tray.id);
    }
  };

  const handleAddTray = () => {
    if (onAddTray) {
      onAddTray(slotNumber);
    }
  };

  if (!tray) {
    // Empty slot
    return (
      <Paper 
        className="h-64 border-2 border-dashed border-silver-polish flex flex-col items-center justify-center cursor-pointer hover:border-steel-smoke transition-colors"
        onClick={handleAddTray}
      >
        <IconButton 
          className="mb-2 text-silver-polish hover:text-steel-smoke"
          size="large"
        >
          <AddIcon fontSize="large" />
        </IconButton>
        <Typography variant="body2" className="text-silver-polish">
          Add Tray
        </Typography>
        <Typography variant="caption" className="text-silver-polish">
          Slot {slotNumber}
        </Typography>
      </Paper>
    );
  }

  // Occupied slot
  const utilizationColor = tray.utilization_pct > 80 ? 'bg-green-500' : 
                          tray.utilization_pct > 50 ? 'bg-orange-500' : 'bg-red-500';

  return (
    <Paper 
      className="h-64 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleTrayClick}
    >
      {/* Tray Header */}
      <Box className={`p-2 ${utilizationColor} text-white`}>
        <Box className="flex justify-between items-center">
          <Typography variant="subtitle2" className="font-bold">
            Tray {tray.id}
          </Typography>
          <UtilizationIndicator 
            percentage={tray.utilization_pct}
          />
        </Box>
        <Typography variant="caption">
          {tray.crops?.length || 0} crops • {tray.tray_type}
        </Typography>
      </Box>

      {/* Tray Grid Visualization */}
      <Box className="p-2 h-48">
        <TrayGrid 
          tray={tray as TrayGridProps['tray']}
          compact={true}
        />
      </Box>
    </Paper>
  );
};