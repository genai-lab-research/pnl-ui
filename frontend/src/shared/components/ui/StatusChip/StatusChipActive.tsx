import React from 'react';

import { Chip, ChipProps } from '@mui/material';

export interface StatusChipProps extends Omit<ChipProps, 'variant'> {
  label: string;
  variant?: 'connected' | 'maintenance' | 'inactive' | 'created';
}

const StatusChipActive: React.FC<StatusChipProps> = ({ label, ...props }) => {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: '#e8f5e9',
        color: '#1b5e20',
        fontWeight: 500,
        fontSize: '0.75rem',
        height: '24px',
      }}
      {...props}
    />
  );
};

export default StatusChipActive;
