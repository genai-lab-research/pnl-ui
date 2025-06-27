import React from 'react';
import { Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors as themeColors } from '@/shared/constants/colors';

export type StatusType = 'Connected' | 'Maintenance' | 'Created' | 'Inactive';

const getStatusColors = (status: StatusType) => {
  switch (status) {
    case 'Connected':
      return {
        backgroundColor: themeColors.success,
        color: 'white',
      };
    case 'Maintenance':
      return {
        backgroundColor: themeColors.warning,
        color: 'white',
      };
    case 'Created':
      return {
        backgroundColor: themeColors.gray[100],
        color: 'black',
      };
    case 'Inactive':
      return {
        backgroundColor: themeColors.gray[900],
        color: 'white',
      };
    default:
      return {
        backgroundColor: themeColors.gray[100],
        color: 'black',
      };
  }
};

const StyledChip = styled(Chip)<{ statustype: StatusType }>(({ statustype }) => {
  const statusColors = getStatusColors(statustype);
  return {
    backgroundColor: statusColors.backgroundColor,
    color: statusColors.color,
    borderRadius: '16px',
    height: '24px',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'body',
    textTransform: 'capitalize',
    '& .MuiChip-label': {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  };
});

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
    />
  );
};