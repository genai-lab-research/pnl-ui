import React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import { ProgressMetricProps } from './types';
import { ProgressBar } from './ProgressBar';
import { 
  StyledContainer, 
  LabelText, 
  ValueText, 
  ProgressCluster,
  sizeConfig 
} from './styles';
import { useNormalizedValue, useProgressColors } from './hooks';

export const ProgressMetric: React.FC<ProgressMetricProps> = ({
  label,
  value,
  unit = '%',
  showValue = true,
  showProgressBar = true,
  progressColor,
  progressBackgroundColor,
  variant = 'default',
  size = 'md',
  loading = false,
  error,
  className,
  valueSlot,
  ariaLabel,
  disabled = false,
  onClick,
}) => {
  const normalizedValue = useNormalizedValue(value);
  const { fillColor, trackColor } = useProgressColors(progressColor, progressBackgroundColor);
  const config = sizeConfig[size];
  const isClickable = !!onClick;

  if (loading) {
    return (
      <StyledContainer variant={variant} disabled className={className}>
        <Skeleton variant="text" width={100} height={config.lineHeight} />
        <Box sx={{ display: 'flex', gap: 1, flex: 1, ml: 2 }}>
          <Skeleton variant="text" width={50} height={config.lineHeight} />
          <Skeleton variant="rectangular" width={200} height={config.progressHeight} />
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer variant={variant} disabled className={className}>
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer
      variant={variant}
      disabled={disabled}
      {...(isClickable ? { clickable: true } : {})}
      onClick={disabled ? undefined : onClick}
      className={className}
      aria-label={ariaLabel || `${label}: ${normalizedValue}${unit}`}
      sx={{ gap: `${config.gap}px` }}
    >
      <LabelText size={size}>
        {label}:
      </LabelText>
      
      <ProgressCluster size={size}>
        {showValue && (
          valueSlot || (
            <ValueText size={size}>
              {normalizedValue}{unit}
            </ValueText>
          )
        )}
        
        {showProgressBar && (
          <ProgressBar
            value={normalizedValue}
            color={fillColor}
            backgroundColor={trackColor}
            height={config.progressHeight}
            borderRadius={10}
            ariaLabel={`${label} progress`}
          />
        )}
      </ProgressCluster>
    </StyledContainer>
  );
};