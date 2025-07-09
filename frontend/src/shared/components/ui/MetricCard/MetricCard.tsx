import React from 'react';
import { Box, Typography } from '@mui/material';
import { MetricCardProps } from './types';
import { StyledMetricCard, StyledMetricValue, StyledMetricLabel } from './MetricCard.styles';

/**
 * MetricCard component for displaying individual container metrics
 * 
 * @param props - MetricCard props
 * @returns JSX element
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  format = 'default',
  trend,
  ...props
}) => {
  const formatValue = (val: number | string, fmt: string) => {
    if (typeof val === 'string') return val;
    
    switch (fmt) {
      case 'temperature':
        return `${val}°C`;
      case 'percentage':
        return `${val}%`;
      case 'co2':
        return `${val},800-900ppm`;
      case 'weight':
        return `${val}KG`;
      default:
        return val.toString();
    }
  };

  const displayValue = unit ? `${value}${unit}` : formatValue(value, format);

  return (
    <StyledMetricCard {...props}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <StyledMetricValue variant="h4">
          {displayValue}
        </StyledMetricValue>
        <StyledMetricLabel variant="body2">
          {label}
        </StyledMetricLabel>
        {trend && (
          <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
            {trend > 0 ? '+' : ''}{trend}%
          </Typography>
        )}
      </Box>
    </StyledMetricCard>
  );
};

export default MetricCard;