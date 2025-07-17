import React from 'react';
import { StatusType, StyledChip } from './StatusChip.styles';

export type { StatusType };

interface StatusChipProps {
  status: StatusType;
  size?: 'small' | 'medium';
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  size = 'small'
}) => {
  return (
    <StyledChip
      label={status}
      size={size}
      statustype={status}
      variant="outlined"
    />
  );
};