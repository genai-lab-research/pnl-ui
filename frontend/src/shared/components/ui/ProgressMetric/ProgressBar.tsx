import React from 'react';
import { ProgressBarProps } from './types';
import { ProgressBarContainer, ProgressBarTrack, ProgressBarFill } from './styles';
import { useNormalizedValue, useProgressColors } from './hooks';

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color,
  backgroundColor,
  height = 12,
  borderRadius = 10,
  className,
  ariaLabel,
}) => {
  const normalizedValue = useNormalizedValue(value);
  const { fillColor, trackColor } = useProgressColors(color, backgroundColor);

  return (
    <ProgressBarContainer
      height={height}
      borderRadius={borderRadius}
      className={className}
      role="progressbar"
      aria-valuenow={normalizedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel || `Progress: ${normalizedValue}%`}
    >
      <ProgressBarTrack 
        backgroundColor={trackColor} 
        borderRadius={borderRadius}
      />
      <ProgressBarFill 
        value={normalizedValue} 
        color={fillColor}
        borderRadius={borderRadius}
      />
    </ProgressBarContainer>
  );
};