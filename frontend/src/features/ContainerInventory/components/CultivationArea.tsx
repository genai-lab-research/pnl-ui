import React from 'react';
import { Box, Typography, Grid, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PanelBlock } from '../../../shared/components/ui/PanelBlock';
import { AddPanelBlock } from '../../../shared/components/ui/AddPanelBlock';
import { UtilizationIndicator } from '../../../shared/components/ui/UtilizationIndicator';
import { CultivationArea as CultivationAreaType, Panel, Crop } from '../../../types/inventory';

interface CultivationAreaProps {
  cultivationData: CultivationAreaType | null;
  onAddPanel: (wallNumber: number, slotNumber: number) => void;
  onPanelClick: (panel: Panel) => void;
  onCropClick?: (crop: Crop) => void;
}

const WallSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const WallHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

/**
 * CultivationArea Component
 * 
 * Displays the cultivation area with 4 walls, each containing up to 22 panel slots.
 * Shows panel utilization and allows adding new panels to empty slots.
 */
export const CultivationArea: React.FC<CultivationAreaProps> = ({
  cultivationData,
  onAddPanel,
  onPanelClick,
  onCropClick,
}) => {
  if (!cultivationData) {
    return null;
  }

  // Helper function to get panels for a specific wall
  const getPanelsForWall = (wallNumber: number): Panel[] => {
    const wallKey = `wall_${wallNumber}` as keyof CultivationAreaType;
    return (cultivationData[wallKey] as Panel[]) || [];
  };

  // Calculate wall utilization
  const calculateWallUtilization = (panels: Panel[]) => {
    if (panels.length === 0) return 0;
    
    const totalSlots = 22; // 22 slots per wall
    const totalUtilization = panels.reduce((sum, panel) => sum + panel.utilization_percentage, 0);
    
    // Calculate average utilization across all slots (including empty ones)
    const averageUtilization = totalUtilization / totalSlots;
    return Math.round(averageUtilization);
  };

  // Render a single wall
  const renderWall = (wallNumber: number) => {
    const panels = getPanelsForWall(wallNumber);
    const wallUtilization = calculateWallUtilization(panels);

    return (
      <WallSection key={`wall-${wallNumber}`}>
        <WallHeader>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Wall {wallNumber}
          </Typography>
          <UtilizationIndicator 
            percentage={wallUtilization}
            label={`Wall ${wallNumber} Utilization:`}
          />
        </WallHeader>
        
        <Grid container spacing={2}>
          {Array.from({ length: 22 }, (_, index) => {
            const slotNumber = index + 1;
            const panel = panels.find(p => p.location.slot_number === slotNumber);
            
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={`wall-${wallNumber}-slot-${slotNumber}`}>
                {panel ? (
                  <PanelBlock
                    panelId={panel.id}
                    wallNumber={wallNumber}
                    slotNumber={slotNumber}
                    utilization={panel.utilization_percentage}
                    cropCount={panel.crop_count}
                    crops={panel.crops}
                    onClick={() => onPanelClick(panel)}
                    onCropClick={onCropClick}
                  />
                ) : (
                  <AddPanelBlock
                    wallNumber={wallNumber}
                    slotNumber={slotNumber}
                    onAddPanelClick={onAddPanel}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>
        
        {wallNumber < 4 && <Divider sx={{ mt: 4 }} />}
      </WallSection>
    );
  };

  return (
    <Box>
      {/* Overall Utilization */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <UtilizationIndicator 
          percentage={cultivationData.utilization_percentage || 0}
          label="Cultivation Area Utilization:"
        />
      </Box>

      {/* Render all 4 walls */}
      {[1, 2, 3, 4].map(renderWall)}

      {/* Off-Wall Panels */}
      {cultivationData.off_wall_panels && cultivationData.off_wall_panels.length > 0 && (
        <WallSection>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Currently off the Wall(s)
          </Typography>
          <Grid container spacing={2}>
            {cultivationData.off_wall_panels.map((panel) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={`off-wall-${panel.id}`}>
                <PanelBlock
                  panelId={panel.id}
                  wallNumber={0}
                  slotNumber={0}
                  utilization={panel.utilization_percentage}
                  cropCount={panel.crop_count}
                  crops={panel.crops}
                  onClick={() => onPanelClick(panel)}
                  onCropClick={onCropClick}
                />
              </Grid>
            ))}
          </Grid>
        </WallSection>
      )}
    </Box>
  );
};