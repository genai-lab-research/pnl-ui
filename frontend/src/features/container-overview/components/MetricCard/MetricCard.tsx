import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Skeleton,
} from '@mui/material';
import {
  Thermostat as TemperatureIcon,
  WaterDrop as HumidityIcon,
  CloudQueue as CO2Icon,
  Agriculture as YieldIcon,
  GridView as SpaceIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { metricCardStyles } from './MetricCard.styles';

interface MetricCardProps {
  title: string;
  value?: number | string;
  unit?: string;
  subtitle?: string;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  isLoading?: boolean;
  variant?: 'temperature' | 'humidity' | 'co2' | 'yield' | 'space' | 'info';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  change,
  trend,
  isLoading = false,
  variant = 'info',
  onClick,
}) => {
  const getVariantIcon = () => {
    switch (variant) {
      case 'temperature':
        return <TemperatureIcon sx={metricCardStyles.icon} />;
      case 'humidity':
        return <HumidityIcon sx={metricCardStyles.icon} />;
      case 'co2':
        return <CO2Icon sx={metricCardStyles.icon} />;
      case 'yield':
        return <YieldIcon sx={metricCardStyles.icon} />;
      case 'space':
        return <SpaceIcon sx={metricCardStyles.icon} />;
      default:
        return <InfoIcon sx={metricCardStyles.icon} />;
    }
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'temperature':
        return '#FF6B6B';
      case 'humidity':
        return '#4ECDC4';
      case 'co2':
        return '#96CEB4';
      case 'yield':
        return '#FECA57';
      case 'space':
        return '#FF9FF3';
      default:
        return '#6C5CE7';
    }
  };

  const formatValue = (value: number | string | undefined): string => {
    // Use clearly visible placeholder values when data is not available
    if (value === undefined || value === null) {
      // Use different placeholder values based on variant type
      switch (variant) {
        case 'temperature':
          return '999';
        case 'humidity':
        case 'space':
          return '0';
        case 'co2':
          return '999999';
        case 'yield':
          return '0';
        default:
          return '0';
      }
    }
    
    if (typeof value === 'string') return value;
    
    // Format numbers based on unit type
    if (unit === '%' || unit === 'ppm') {
      return value.toFixed(0);
    }
    if (unit === '°C') {
      return value.toFixed(0);
    }
    return value.toFixed(1);
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#22C55E';
      case 'down':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  if (isLoading) {
    return (
      <Card sx={metricCardStyles.card}>
        <CardContent sx={metricCardStyles.cardContent}>
          <Box sx={metricCardStyles.iconContainer}>
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
          <Box sx={metricCardStyles.content}>
            <Skeleton variant="text" width={80} height={16} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={60} height={24} />
            {subtitle && <Skeleton variant="text" width={50} height={14} sx={{ mt: 0.5 }} />}
          </Box>
        </CardContent>
      </Card>
    );
  }

  const formattedValue = formatValue(value);
  const displayValue = `${formattedValue}${unit ? ` / ${unit}` : ''}`;

  return (
    <Card 
      sx={{
        ...metricCardStyles.card,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? metricCardStyles.cardHover : {},
      } as any}
      onClick={onClick}
    >
      <CardContent sx={metricCardStyles.cardContent}>
        <Box sx={metricCardStyles.header}>
          <Box 
            sx={{
              ...metricCardStyles.iconContainer,
              color: getVariantColor(),
            } as any}
          >
            {getVariantIcon()}
          </Box>
          <Typography variant="body2" sx={metricCardStyles.title}>
            {title}
          </Typography>
        </Box>

        <Box sx={metricCardStyles.valueContainer}>
          <Typography variant="h4" sx={metricCardStyles.value}>
            {formattedValue}
          </Typography>
          {unit && (
            <Typography variant="body2" sx={metricCardStyles.unit}>
              / {unit}
            </Typography>
          )}
        </Box>

        {subtitle && (
          <Typography variant="caption" sx={metricCardStyles.subtitle}>
            {subtitle}
          </Typography>
        )}

        {change && (
          <Typography 
            variant="caption" 
            sx={{
              ...metricCardStyles.change,
              color: getTrendColor(),
            } as any}
          >
            {change}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
