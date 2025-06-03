import React from 'react';
import { Box, Typography, styled } from '@mui/material';

const TrayContainer = styled(Box)({
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '6px',
  padding: '8px',
  width: '120px',
  height: '100px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: '#3545EE',
    boxShadow: '0 2px 4px rgba(53, 69, 238, 0.1)',
  },
});

const TrayGridLayout = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(10, 1fr)',
  gridTemplateRows: 'repeat(4, 1fr)',
  gap: '1px',
  flex: 1,
  marginBottom: '4px',
});

const CropDot = styled(Box)<{ $status: 'healthy' | 'warning' | 'empty' }>(({ $status }) => ({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  backgroundColor: 
    $status === 'healthy' ? '#2FCA44' :
    $status === 'warning' ? '#FF9500' :
    '#E5E7EB',
  border: $status === 'empty' ? '1px solid #D1D5DB' : 'none',
}));

const TrayInfo = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const TrayLabel = styled(Typography)({
  fontFamily: 'Roboto',
  fontSize: '11px',
  fontWeight: 400,
  lineHeight: '20px',
  color: '#09090B',
});

const TrayCount = styled(Typography)({
  fontFamily: 'Roboto',
  fontSize: '11px',
  fontWeight: 400,
  lineHeight: '20px',
  color: '#09090B',
});

const UtilizationText = styled(Typography)({
  fontFamily: 'Roboto',
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: '16px',
  color: '#09090B',
  position: 'absolute',
  top: '4px',
  right: '4px',
});

export interface TrayGridProps {
  trayId: string;
  utilization: number;
  cropCount: number;
  crops: Array<{
    position: number;
    status: 'healthy' | 'warning' | 'empty';
  }>;
  gridLayout: string;
  className?: string;
  onClick?: () => void;
}

export const TrayGrid: React.FC<TrayGridProps> = ({
  utilization,
  cropCount,
  crops,
  gridLayout,
  className,
  onClick,
}) => {
  // Create a 40-slot grid (10x4) to represent the tray
  const totalSlots = 40;
  const slots = Array.from({ length: totalSlots }, (_, index) => {
    const crop = crops.find(c => c.position === index);
    return crop ? crop.status : 'empty';
  });

  return (
    <TrayContainer className={className} onClick={onClick}>
      <UtilizationText>{utilization}%</UtilizationText>
      
      <TrayGridLayout>
        {slots.map((status, index) => (
          <CropDot key={index} $status={status} />
        ))}
      </TrayGridLayout>
      
      <TrayInfo>
        <TrayLabel>{gridLayout}</TrayLabel>
        <TrayCount>{cropCount} crops</TrayCount>
      </TrayInfo>
    </TrayContainer>
  );
};

export default TrayGrid;