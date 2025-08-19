import React from 'react';
import { Box, Typography } from '@mui/material';
import { SegmentedToggle } from '../../../shared/components/ui/SegmentedToggle';

interface ContainerTypeToggleProps {
  value: 'physical' | 'virtual';
  onChange: (type: 'physical' | 'virtual') => void;
  disabled?: boolean;
}

export const ContainerTypeToggle: React.FC<ContainerTypeToggleProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const options = [
    {
      id: 'physical',
      value: 'physical',
      label: 'Physical'
    },
    {
      id: 'virtual', 
      value: 'virtual',
      label: 'Virtual'
    }
  ];

  return (
    <Box>
      <Typography 
        variant="body2" 
        component="label"
        sx={{ 
          display: 'block',
          mb: 1,
          fontSize: '0.875rem',
          color: '#333',
          fontWeight: 500
        }}
      >
        Container Type
      </Typography>
      
      <SegmentedToggle
        options={options}
        value={value}
        onChange={(value) => onChange(value as 'physical' | 'virtual')}
        disabled={disabled}
        ariaLabel="Select container type"
        variant="default"
        size="md"
      />
      
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block',
          mt: 1,
          color: '#666',
          fontSize: '0.75rem'
        }}
      >
        {value === 'physical' 
          ? 'Physical containers require location information'
          : 'Virtual containers allow simulation and environment copying'
        }
      </Typography>
    </Box>
  );
};
