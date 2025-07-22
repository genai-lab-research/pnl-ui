import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Grid, Alert, CircularProgress } from '@mui/material';
import { 
  NurseryStationHeader,
  NurseryStationLayout,
  OffShelfTrays,
  TimelapseControls
} from './components';
import type { NurseryStationLayoutProps } from './components/NurseryStationLayout';
import { NurseryStationProps, NurseryStationState, OffShelfTraysProps } from './types';
import { nurseryService } from '../../api/nurseryService';
import { containerService } from '../../api/containerService';

/**
 * Main Nursery Station page component
 * Displays nursery station layout with tray management and time-lapse functionality
 */
export const NurseryStation: React.FC<NurseryStationProps> = ({ containerId: propContainerId }) => {
  const { id: routeContainerId } = useParams<{ id: string }>();
  const containerId = propContainerId || parseInt(routeContainerId || '0', 10);

  const [state, setState] = useState<NurseryStationState>({
    layout: null,
    snapshots: [],
    selectedDate: new Date(),
    loading: true,
    error: null
  });

  const [containerInfo, setContainerInfo] = useState<{
    name?: string;
    type?: string;
    tenant?: string;
    location?: string;
  } | null>(null);

  // Load initial data
  useEffect(() => {
    loadNurseryData();
    loadContainerInfo();
  }, [containerId]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const loadContainerInfo = async () => {
    try {
      const container = await containerService.getContainer(containerId.toString());
      setContainerInfo({
        name: container.data?.name,
        type: container.data?.type,
        tenant: container.data?.tenant,
        location: typeof container.data?.location === 'string' ? container.data.location : JSON.stringify(container.data?.location)
      });
    } catch (error) {
      console.error('Failed to load container info:', error);
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

  if (state.loading && !state.layout) {
    return (
      <Container maxWidth="xl" className="py-8">
        <Box className="flex justify-center items-center h-64">
          <CircularProgress size={60} className="text-lilac-haze" />
        </Box>
      </Container>
    );
  }

  if (state.error) {
    return (
      <Container maxWidth="xl" className="py-8">
        <Alert severity="error" className="mb-4">
          {state.error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8">
      {/* Header */}
      <NurseryStationHeader
        containerId={containerId}
        containerName={containerInfo?.name}
        containerType={containerInfo?.type}
        tenant={containerInfo?.tenant}
        location={containerInfo?.location}
        utilizationPercentage={state.layout?.utilization_summary?.total_utilization_percentage}
      />

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
    </Container>
  );
};

export default NurseryStation;