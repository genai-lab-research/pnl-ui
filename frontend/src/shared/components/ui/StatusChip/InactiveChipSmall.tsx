import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface InactiveChipSmallProps extends Omit<ChipProps, 'variant'> {
  label: string;
}

const InactiveChipSmall: React.FC<InactiveChipSmallProps> = ({ label, ...props }) => {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: '#ffebee',
        color: '#b71c1c',
        fontWeight: 500,
        fontSize: '0.75rem',
        height: '24px',
      }}
      {...props}
    />
  );
};

export default InactiveChipSmall;