import React from 'react';
import { Box, Button } from '@mui/material';

export type TimeRangeOption = 'week' | 'month' | 'quarter' | 'year';

export interface TimeRangeSelectorProps {
  /**
   * Currently selected time range
   */
  selectedRange: TimeRangeOption;

  /**
   * Handler for time range changes
   */
  onRangeChange: (range: TimeRangeOption) => void;

  /**
   * Optional custom class name
   */
  className?: string;
}

/**
 * TimeRangeSelector component for selecting time range in charts
 */
export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onRangeChange,
  className,
}) => {
  const options: { value: TimeRangeOption; label: string }[] = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year', label: 'Year' },
  ];

  return (
    <Box className={className} sx={{ display: 'flex' }}>
      {options.map((option) => (
        <Button
          key={option.value}
          onClick={() => onRangeChange(option.value)}
          variant="outlined"
          disableElevation
          sx={{
            textTransform: 'none',
            fontWeight: 400,
            fontSize: '0.875rem',
            px: 2,
            py: 0.75,
            borderRadius: '4px',
            minWidth: '80px',
            marginRight: 1.5,
            color: selectedRange === option.value ? '#0033FF' : 'text.secondary',
            backgroundColor: selectedRange === option.value ? 'rgba(0, 51, 255, 0.04)' : 'transparent',
            '&:hover': {
              backgroundColor: selectedRange === option.value 
                ? 'rgba(0, 51, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)',
              borderColor: selectedRange === option.value ? '#0033FF' : 'rgba(0, 0, 0, 0.23)',
            },
            '&:active': {
              backgroundColor: selectedRange === option.value 
                ? 'rgba(0, 51, 255, 0.12)' 
                : 'rgba(0, 0, 0, 0.08)',
            },
            border: '1px solid',
            borderColor: selectedRange === option.value ? '#0033FF' : 'rgba(0, 0, 0, 0.12)',
            boxShadow: selectedRange === option.value ? '0 0 0 1px rgba(0, 51, 255, 0.5)' : 'none',
            '&:last-of-type': {
              marginRight: 0,
            }
          }}
        >
          {option.label}
        </Button>
      ))}
    </Box>
  );
};

export default TimeRangeSelector;