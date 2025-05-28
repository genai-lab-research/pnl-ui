import React from 'react';

import { Chip, ChipProps } from '@mui/material';

interface StatusChipMaintenanceProps extends Omit<ChipProps, 'variant'> {
  label: string;
}

const StatusChipMaintenance: React.FC<StatusChipMaintenanceProps> = ({ label, ...props }) => {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: '#fff3e0',
        color: '#e65100',
        fontWeight: 500,
        fontSize: '0.75rem',
        height: '24px',
      }}
      {...props}
    />
  );
};

export default StatusChipMaintenance;
