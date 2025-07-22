import React from 'react';
import { 
  Container, 
  Label, 
  PercentageContainer, 
  PercentageText,
  ProgressBarContainer,
  ProgressFill
} from './styles';
import { UtilizationIndicatorProps } from './types';

/**
 * UtilizationIndicator Component
 * 
 * A component that displays a utilization read-out with a percentage value
 * and a horizontal progress bar for vertical-farming monitoring dashboards.
 */
export const UtilizationIndicator: React.FC<UtilizationIndicatorProps> = ({ 
  percentage,
  label = "Utilization:",
  className
}) => {
  // Ensure percentage is within valid range (0-100)
  const validPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <Container className={className}>
      <Label>{label}</Label>
      <PercentageContainer>
        <PercentageText>{validPercentage}%</PercentageText>
        <ProgressBarContainer>
          <ProgressFill percentage={validPercentage} />
        </ProgressBarContainer>
      </PercentageContainer>
    </Container>
  );
};