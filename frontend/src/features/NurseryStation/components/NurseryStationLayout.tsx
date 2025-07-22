import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { TraySlot } from './TraySlot';

export interface NurseryStationLayoutProps {
  layout: {
    upper_shelf?: { slot_number: number; tray?: { id: number; utilization_pct: number; crops?: { length: number }[]; tray_type: string } | null }[];
    lower_shelf?: { slot_number: number; tray?: { id: number; utilization_pct: number; crops?: { length: number }[]; tray_type: string } | null }[];
  } | null;
  onTrayClick?: (trayId: number) => void;
  onAddTray?: (shelf: string, slotNumber: number) => void;
}

/**
 * Main nursery station layout showing upper and lower shelves with 8 slots each
 */
export const NurseryStationLayout: React.FC<NurseryStationLayoutProps> = ({
  layout,
  onTrayClick,
  onAddTray
}) => {
  if (!layout) {
    return (
      <Paper className="p-6 text-center">
        <Typography variant="h6" className="text-steel-smoke">
          Loading nursery station layout...
        </Typography>
      </Paper>
    );
  }

  const handleAddTray = (shelf: string) => (slotNumber: number) => {
    if (onAddTray) {
      onAddTray(shelf, slotNumber);
    }
  };

  const renderShelf = (shelfData: { slot_number: number; tray?: { id: number; utilization_pct: number; crops?: { length: number }[]; tray_type: string } | null }[], shelfName: string) => {
    // Ensure we have 8 slots
    const slots = Array.from({ length: 8 }, (_, index) => {
      const slotNumber = index + 1;
      const slotData = shelfData.find(slot => slot.slot_number === slotNumber);
      return {
        slot_number: slotNumber,
        tray: slotData?.tray || null
      };
    });

    return (
      <Box className="mb-8">
        <Typography variant="h6" className="mb-4 text-steel-smoke font-semibold">
          {shelfName}
        </Typography>
        <Grid container spacing={2}>
          {slots.map((slot) => (
            <Grid item xs={12} sm={6} md={3} lg={1.5} key={slot.slot_number}>
              <TraySlot
                slotNumber={slot.slot_number}
                tray={slot.tray}
                onTrayClick={onTrayClick}
                onAddTray={handleAddTray(shelfName.toLowerCase().replace(' ', '_'))}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Paper className="p-6">
      <Typography variant="h5" className="mb-6 text-steel-smoke font-bold">
        Nursery Station Layout
      </Typography>
      
      {/* Upper Shelf */}
      {renderShelf(layout.upper_shelf || [], 'Upper Shelf')}
      
      {/* Lower Shelf */}
      {renderShelf(layout.lower_shelf || [], 'Lower Shelf')}
    </Paper>
  );
};