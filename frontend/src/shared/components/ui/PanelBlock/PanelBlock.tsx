import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PanelBlockProps, CropVisualizationProps } from './types';

const StyledPanelBlock = styled(Box)(() => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  padding: '16px',
  width: '100%',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
}));

const PanelHeader = styled(Box)<{ utilization: number }>(({ utilization }) => ({
  backgroundColor: utilization > 80 ? '#DC2626' : utilization > 60 ? '#F59E0B' : '#10B981',
  color: '#FFFFFF',
  padding: '8px 12px',
  borderRadius: '4px',
  marginBottom: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const ChannelContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '8px',
});

const Channel = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px',
  backgroundColor: '#F9FAFB',
  borderRadius: '4px',
});

const CropCircle = styled(Box)<{ size: 'small' | 'medium' | 'large'; status: 'healthy' | 'overdue' }>(
  ({ size, status }) => ({
    width: size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px',
    height: size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px',
    borderRadius: '50%',
    backgroundColor: status === 'healthy' ? '#10B981' : '#F59E0B',
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.2)',
    },
  })
);

const CropVisualization: React.FC<CropVisualizationProps> = ({ crops, channel, onCropClick }) => {
  return (
    <Channel>
      <Typography variant="caption" sx={{ minWidth: '20px', color: '#6B7280' }}>
        CH{channel}
      </Typography>
      <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap', flex: 1 }}>
        {crops.map((crop) => {
          const age = crop.age || 0;
          const size = age < 10 ? 'small' : age < 20 ? 'medium' : 'large';
          const status = crop.overdue_days > 0 ? 'overdue' : 'healthy';
          
          return (
            <Tooltip
              key={crop.id}
              title={
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    {crop.seed_type}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Age: {age} days
                  </Typography>
                  <Typography variant="caption" display="block">
                    Seeded: {new Date(crop.seed_date).toLocaleDateString()}
                  </Typography>
                  {crop.transplanted_date && (
                    <Typography variant="caption" display="block">
                      Transplanted: {new Date(crop.transplanted_date).toLocaleDateString()}
                    </Typography>
                  )}
                  <Typography variant="caption" display="block">
                    Harvest planned: {new Date(crop.harvesting_date_planned).toLocaleDateString()}
                  </Typography>
                  {crop.overdue_days > 0 && (
                    <Typography variant="caption" display="block" color="warning.main">
                      Overdue: {crop.overdue_days} days
                    </Typography>
                  )}
                </Box>
              }
              arrow
            >
              <CropCircle 
                size={size} 
                status={status} 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('CropCircle clicked, calling onCropClick with:', crop);
                  if (onCropClick) {
                    onCropClick(crop);
                  } else {
                    console.log('No onCropClick handler provided');
                  }
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Channel>
  );
};

/**
 * PanelBlock Component
 * 
 * Displays a panel with crop visualization for the cultivation area.
 * Shows panel information, utilization, and crops organized by channels.
 */
export const PanelBlock: React.FC<PanelBlockProps> = ({
  panelId,
  wallNumber,
  slotNumber,
  utilization,
  cropCount,
  crops,
  onClick,
  onCropClick,
}) => {
  // Group crops by channel
  const cropsByChannel = crops.reduce((acc, crop) => {
    const channel = crop.location.channel || 1;
    if (!acc[channel]) {
      acc[channel] = [];
    }
    acc[channel].push(crop);
    return acc;
  }, {} as Record<number, typeof crops>);

  // Create channels 1-5
  const channels = [1, 2, 3, 4, 5];

  return (
    <StyledPanelBlock onClick={onClick}>
      <PanelHeader utilization={utilization}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {panelId}
        </Typography>
        <Typography variant="caption">
          {utilization}%
        </Typography>
      </PanelHeader>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Wall {wallNumber}, Slot {slotNumber}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {cropCount} crops
        </Typography>
      </Box>

      <ChannelContainer>
        {channels.map((channel) => (
          <CropVisualization
            key={channel}
            channel={channel}
            crops={cropsByChannel[channel] || []}
            onCropClick={onCropClick}
          />
        ))}
      </ChannelContainer>
    </StyledPanelBlock>
  );
};