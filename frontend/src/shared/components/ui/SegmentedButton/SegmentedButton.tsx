import React from 'react';
import { Box, Typography } from '@mui/material';
import { StyledSegmentedButton } from './SegmentedButton.styles';

export interface SegmentedButtonOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SegmentedButtonProps {
  options: SegmentedButtonOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  'data-testid'?: string;
}

export const SegmentedButton: React.FC<SegmentedButtonProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  label,
  'data-testid': testId
}) => {
  return (
    <Box>
      {label && (
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '12px', 
            fontWeight: 400, 
            color: '#4C4E64',
            mb: 1 
          }}
        >
          {label}
        </Typography>
      )}
      <StyledSegmentedButton data-testid={testId}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`segment ${value === option.value ? 'active' : 'inactive'}`}
            onClick={() => onChange(option.value)}
            disabled={disabled || option.disabled}
          >
            {option.label}
          </button>
        ))}
      </StyledSegmentedButton>
    </Box>
  );
};

export default SegmentedButton;