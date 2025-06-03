import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export interface AddTraySlotProps {
  /** Slot number to display (e.g., "SLOT 4") */
  slotNumber: number;
  /** Callback when the add slot is clicked */
  onClick?: () => void;
  /** If true, will disable the component with reduced opacity */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
  sx?: object;
}

const Container = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'disabled' && prop !== 'clickable',
})<{ disabled?: boolean; clickable?: boolean }>(({ disabled, clickable }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '162px',
  height: '301px',
  border: '1px dashed #E6E8FC',
  borderRadius: '8px',
  padding: '12px',
  backgroundColor: 'white',
  opacity: disabled ? 0.5 : 1,
  cursor: clickable ? 'pointer' : 'default',
  position: 'relative',
  '&:hover': clickable ? {
    backgroundColor: '#f8f9ff',
    borderColor: '#d1d5f7',
  } : {},
}));

const TitleText = styled(Typography)(() => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '8px',
  fontWeight: 500,
  lineHeight: '10px',
  color: '#6E7191',
  marginBottom: 'auto',
  textTransform: 'uppercase',
  letterSpacing: '0px',
  textAlign: 'left',
}));

const ContentContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  gap: '8px',
}));

const PlusIconContainer = styled(Box)(() => ({
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  border: '2px solid #9CA3AF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}));

const PlusIcon = styled(Box)(() => ({
  width: '8px',
  height: '8px',
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    backgroundColor: '#9CA3AF',
    borderRadius: '1px',
  },
  '&::before': {
    width: '8px',
    height: '2px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  '&::after': {
    width: '2px',
    height: '8px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const AddText = styled(Typography)(() => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  color: '#6E7191',
  textAlign: 'center',
}));

/**
 * AddTraySlot component displays an empty slot where users can add a new tray.
 * 
 * @component
 * @example
 * ```tsx
 * <AddTraySlot 
 *   slotNumber={4}
 *   onClick={() => handleAddTray(4)}
 * />
 * ```
 */
export const AddTraySlot: React.FC<AddTraySlotProps> = ({
  slotNumber,
  onClick,
  disabled = false,
  className,
  sx,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <Container 
      disabled={disabled} 
      clickable={!!onClick && !disabled}
      className={className} 
      sx={sx}
      onClick={handleClick}
    >
      <TitleText>SLOT {slotNumber}</TitleText>
      
      <ContentContainer>
        <PlusIconContainer>
          <PlusIcon />
        </PlusIconContainer>
        
        <AddText>Add Tray</AddText>
      </ContentContainer>
    </Container>
  );
};

export default AddTraySlot;