import React from 'react';

import { Chip as MuiChip, ChipProps as MuiChipProps } from '@mui/material';

export interface ChipProps extends MuiChipProps {
  selected?: boolean;
}

const Chip: React.FC<ChipProps> = ({ selected, ...props }) => {
  return (
    <MuiChip
      {...props}
      sx={{
        borderRadius: '16px',
        height: 32,
        backgroundColor: selected ? 'primary.main' : 'background.default',
        color: selected ? 'white' : 'text.primary',
        borderColor: selected ? 'primary.main' : 'divider',
        '&:hover': {
          backgroundColor: selected ? 'primary.dark' : 'action.hover',
        },
        ...props.sx,
      }}
    />
  );
};

export default Chip;
