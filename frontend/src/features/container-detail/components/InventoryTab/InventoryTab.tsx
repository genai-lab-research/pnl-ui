import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { AreaToggle } from './components/AreaToggle';
import { TrayProgressTimeline } from './components/TrayProgressTimeline';
import { GridStatusCard } from './components/GridStatusCard';
import { TrayManagementCard } from './components/TrayManagementCard';
import { TrayUtilizationBar } from './components/TrayUtilizationBar';
import { useInventoryData } from '../../hooks/useInventoryData';
import { InventoryTabContainer, SectionContainer, ShelfSection, ShelfGrid } from './InventoryTab.styles';

interface InventoryTabProps {
  containerId: number;
  containerName?: string;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({ containerId, containerName }) => {
  const [activeArea, setActiveArea] = useState<'nursery' | 'cultivation'>('nursery');
  const { inventoryData, loading, error, refetch } = useInventoryData(containerId, activeArea);

  const handleAreaChange = (area: string) => {
    setActiveArea(area as 'nursery' | 'cultivation');
  };

  const handleAddTray = (slotId: string) => {
    console.log('Add tray to slot:', slotId);
    // TODO: Implement add tray functionality
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <InventoryTabContainer>
      {/* Area Toggle */}
      <Box sx={{ mb: 3 }}>
        <AreaToggle
          activeArea={activeArea}
          onAreaChange={handleAreaChange}
        />
      </Box>

      {/* Nursery Station View */}
      {activeArea === 'nursery' && inventoryData && (
        <>
          {/* Nursery Station Header with Utilization */}
          <SectionContainer>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Nursery Station
              </Typography>
              <Box sx={{ width: '300px' }}>
                <TrayUtilizationBar
                  utilization={inventoryData.nurseryUtilization || 75}
                  label="UTILIZATION:"
                />
              </Box>
            </Box>

            {/* Timeline Progress */}
            <Box sx={{ mb: 3 }}>
              <TrayProgressTimeline
                currentDay={inventoryData.currentDay || 31}
                totalDays={60}
                startDate="Apr"
                endDate="Jul"
              />
            </Box>
          </SectionContainer>

          {/* Shelf Upper Section */}
          <ShelfSection>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Shelf Upper
              </Typography>
              <Box sx={{ width: '200px' }}>
                <TrayUtilizationBar
                  utilization={inventoryData.shelfUpperUtilization || 70}
                  label="UTILIZATION:"
                />
              </Box>
            </Box>

            <ShelfGrid>
              {inventoryData.shelfUpperSlots?.map((slot, index) => (
                <GridStatusCard
                  key={slot.id || index}
                  trayId={slot.trayId}
                  utilization={slot.utilization}
                  gridSize={slot.gridSize}
                  cropCount={slot.cropCount}
                  gridData={slot.gridData}
                  status={slot.status}
                />
              ))}
              {/* Add empty slots */}
              {inventoryData.shelfUpperEmptySlots?.map((slot, index) => (
                <TrayManagementCard
                  key={`empty-upper-${index}`}
                  slotId={slot.id}
                  onAddTray={() => handleAddTray(slot.id)}
                />
              ))}
            </ShelfGrid>
          </ShelfSection>

          {/* Shelf Lower Section */}
          <ShelfSection>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Shelf Lower
              </Typography>
              <Box sx={{ width: '200px' }}>
                <TrayUtilizationBar
                  utilization={inventoryData.shelfLowerUtilization || 80}
                  label="UTILIZATION:"
                />
              </Box>
            </Box>

            <ShelfGrid>
              {inventoryData.shelfLowerSlots?.map((slot, index) => (
                <GridStatusCard
                  key={slot.id || index}
                  trayId={slot.trayId}
                  utilization={slot.utilization}
                  gridSize={slot.gridSize}
                  cropCount={slot.cropCount}
                  gridData={slot.gridData}
                  status={slot.status}
                />
              ))}
              {/* Add empty slots */}
              {inventoryData.shelfLowerEmptySlots?.map((slot, index) => (
                <TrayManagementCard
                  key={`empty-lower-${index}`}
                  slotId={slot.id}
                  onAddTray={() => handleAddTray(slot.id)}
                />
              ))}
            </ShelfGrid>
          </ShelfSection>

          {/* Currently Off the Shelf Section */}
          {inventoryData.offShelfSlots && inventoryData.offShelfSlots.length > 0 && (
            <ShelfSection>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Currently Off the Shelf(s)
              </Typography>
              <ShelfGrid>
                {inventoryData.offShelfSlots.map((slot, index) => (
                  <GridStatusCard
                    key={slot.id || index}
                    trayId={slot.trayId}
                    utilization={slot.utilization}
                    gridSize={slot.gridSize}
                    cropCount={slot.cropCount}
                    gridData={slot.gridData}
                    status={slot.status}
                  />
                ))}
              </ShelfGrid>
            </ShelfSection>
          )}
        </>
      )}

      {/* Cultivation Area View */}
      {activeArea === 'cultivation' && (
        <SectionContainer>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Cultivation Area
          </Typography>
          <Typography color="text.secondary">
            Cultivation area inventory management will be implemented in the next iteration.
          </Typography>
        </SectionContainer>
      )}
    </InventoryTabContainer>
  );
};