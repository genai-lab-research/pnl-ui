import React from 'react';
import { Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AddPanelBlockProps } from './types';
import { StyledAddPanelBlock, AddButton } from './AddPanelBlock.styles';



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