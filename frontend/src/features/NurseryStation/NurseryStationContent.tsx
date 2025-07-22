import React, { useState, useEffect } from 'react';
import { Box, Grid, Alert, CircularProgress, Typography, Tab, Tabs } from '@mui/material';
import { 
  NurseryStationLayout,
  OffShelfTrays,
  TimelapseControls
} from './components';
import { NurseryStationState, OffShelfTraysProps } from './types';
import { nurseryService } from '../../api/nurseryService';
import type { NurseryStationLayoutProps } from './components/NurseryStationLayout';

export interface NurseryStationContentProps {
  containerId: number;
}

/**
 * Nursery Station content component for embedding in the Container Overview Inventory tab
 * This is a simplified version without the header, designed to be embedded
 */
export const NurseryStationContent: React.FC<NurseryStationContentProps> = ({ containerId }) => {
  const [subTab, setSubTab] = useState('nursery-station');
  const [state, setState] = useState<NurseryStationState>({
    layout: null,
    snapshots: [],
    selectedDate: new Date(),
    loading: true,
    error: null
  });

  // Load initial data
  useEffect(() => {
    loadNurseryData();
  }, [containerId]);

  // Reload data when date changes
  useEffect(() => {
    if (state.selectedDate) {
      loadNurseryData(state.selectedDate);
    }
  }, [state.selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadNurseryData = async (date?: Date) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const [layoutResponse, snapshotsResponse] = await Promise.all([
        nurseryService.getNurseryStationLayout(containerId, date?.toISOString()),
        nurseryService.getTraySnapshots(containerId, {
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        })
      ]);

      setState(prev => ({
        ...prev,
        layout: layoutResponse,
        snapshots: snapshotsResponse,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load nursery data',
        loading: false
      }));
    }
  };

  const handleDateChange = (date: Date) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  };

  const handleTrayClick = (trayId: number) => {
    // TODO: Open tray details modal
    console.log('Tray clicked:', trayId);
  };

  const handleAddTray = (shelf: string, slotNumber: number) => {
    // TODO: Open add tray form
    console.log('Add tray to:', shelf, slotNumber);
  };

  const handleOffShelfTraySelect = (trayId: number) => {
    // TODO: Handle off-shelf tray selection (maybe for moving to slot)
    console.log('Off-shelf tray selected:', trayId);
  };

  const renderNurseryStationTab = () => {
    if (state.loading && !state.layout) {
      return (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress size={60} />
        </Box>
      );
    }

    if (state.error) {
      return (
        <Alert severity="error" className="mb-4">
          {state.error}
        </Alert>
      );
    }

    return (
      <Grid container spacing={4}>
        {/* Main Layout */}
        <Grid item xs={12} lg={8}>
          <NurseryStationLayout
            layout={state.layout?.layout as NurseryStationLayoutProps['layout']}
            onTrayClick={handleTrayClick}
            onAddTray={handleAddTray}
          />
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box className="space-y-6">
            {/* Time-lapse Controls */}
            <TimelapseControls
              selectedDate={state.selectedDate}
              onDateChange={handleDateChange}
              snapshots={state.snapshots}
            />

            {/* Off-Shelf Trays */}
            <OffShelfTrays
              trays={(state.layout?.off_shelf_trays || []) as OffShelfTraysProps['trays']}
              onTraySelect={handleOffShelfTraySelect}
            />
          </Box>
        </Grid>
      </Grid>
    );
  };

  const renderCultivationAreaTab = () => {
    return (
      <Box className="text-center py-8">
        <Typography variant="h6" className="text-steel-smoke mb-2">
          Cultivation Area
        </Typography>
        <Alert severity="info">
          Cultivation area management will be available in the next release.
        </Alert>
      </Box>
    );
  };

  return (
    <Box>
      {/* Inventory Sub-tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={subTab} onChange={(_, newValue) => setSubTab(newValue)}>
          <Tab label="Nursery Station" value="nursery-station" />
          <Tab label="Cultivation Area" value="cultivation-area" />
        </Tabs>
      </Box>

      {/* Utilization Summary */}
      {state.layout && (
        <Box className="mb-6">
          <Box className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="text-steel-smoke">
              {subTab === 'nursery-station' ? 'Nursery Station' : 'Cultivation Area'} Utilization
            </Typography>
            <Typography variant="h4" className="font-bold text-steel-smoke">
              {state.layout.utilization_summary?.total_utilization_percentage || 0}%
            </Typography>
          </Box>
        </Box>
      )}

      {/* Tab Content */}
      {subTab === 'nursery-station' && renderNurseryStationTab()}
      {subTab === 'cultivation-area' && renderCultivationAreaTab()}
    </Box>
  );
};

export default NurseryStationContent;