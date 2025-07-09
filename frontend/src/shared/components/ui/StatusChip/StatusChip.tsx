import React from 'react';
import { Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

export type StatusType = 'Connected' | 'Maintenance' | 'Created' | 'Inactive';

const getStatusColors = (status: StatusType) => {
  switch (status) {
    case 'Connected':
      return {
        backgroundColor: '#D4EDDA',
        color: '#155724',
        borderColor: '#C3E6CB',
      };
    case 'Maintenance':
      return {
        backgroundColor: '#FFF3CD',
        color: '#856404',
        borderColor: '#FFEAA7',
      };
    case 'Created':
      return {
        backgroundColor: '#F8F9FA',
        color: '#495057',
        borderColor: '#DEE2E6',
      };
    case 'Inactive':
      return {
        backgroundColor: '#F8D7DA',
        color: '#721C24',
        borderColor: '#F5C6CB',
      };
    default:
      return {
        backgroundColor: '#F8F9FA',
        color: '#495057',
        borderColor: '#DEE2E6',
      };
  }
};

const StyledChip = styled(Chip)<{ statustype: StatusType }>(({ statustype }) => {
  const colors = getStatusColors(statustype);
  return {
    backgroundColor: colors.backgroundColor,
    color: colors.color,
    border: `1px solid ${colors.borderColor}`,
    borderRadius: '16px',
    height: '24px',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'Inter, sans-serif',
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
      variant="outlined"
    />
  );
};