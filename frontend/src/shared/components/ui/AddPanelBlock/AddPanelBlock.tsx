import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { AddPanelBlockProps } from './types';

const StyledAddPanelBlock = styled(Box)(() => ({
  backgroundColor: '#F9FAFB',
  border: '2px dashed #E5E7EB',
  borderRadius: '8px',
  padding: '16px',
  width: '100%',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    '& .MuiIconButton-root': {
      backgroundColor: '#E5E7EB',
    },
  },
}));

const AddButton = styled(IconButton)(() => ({
  backgroundColor: '#F3F4F6',
  width: '64px',
  height: '64px',
  marginBottom: '16px',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#E5E7EB',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '32px',
    color: '#6B7280',
  },
}));

/**
 * AddPanelBlock Component
 * 
 * Displays an empty panel slot with an add button for adding new panels
 * to the cultivation area.
 */
export const AddPanelBlock: React.FC<AddPanelBlockProps> = ({
  wallNumber,
  slotNumber,
  onAddPanelClick,
}) => {
  const handleClick = () => {
    onAddPanelClick(wallNumber, slotNumber);
  };

  return (
    <StyledAddPanelBlock onClick={handleClick}>
      <AddButton>
        <AddIcon />
      </AddButton>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Wall {wallNumber}, Slot {slotNumber}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Add Panel
      </Typography>
    </StyledAddPanelBlock>
  );
};