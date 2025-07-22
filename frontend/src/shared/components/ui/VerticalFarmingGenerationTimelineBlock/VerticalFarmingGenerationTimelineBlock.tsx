import React from 'react';
import {
  Container,
  BarRow,
  BarSegment,
  DateLabel,
  TooltipContainer,
  TooltipArrow,
  TooltipBody,
  TooltipText
} from './styles';
import { VerticalFarmingGenerationTimelineBlockProps } from './types';

/**
 * VerticalFarmingGenerationTimelineBlock Component
 * 
 * A miniature bar-chart timeline showing daily generation values and an inline tooltip.
 * Designed for use inside the Vertical-Farming Control Panel to visualise production across dates.
 */
export const VerticalFarmingGenerationTimelineBlock: React.FC<VerticalFarmingGenerationTimelineBlockProps> = ({
  data,
  startDateLabel,
  endDateLabel,
  tooltipDate,
  selectedBarIndices = [3, 4, 14], // Default selected bars from the design
  className
}) => {
  // Calculate tooltip position as percentage (centered on the selected bar)
  const selectedIndex = selectedBarIndices?.[0] ?? 3;
  const tooltipPosition = data.length > 0 ? ((selectedIndex + 0.5) / data.length) * 100 : 0;

  return (
    <Container className={className}>
      <BarRow>
        {data.map((_, index) => (
          <BarSegment 
            key={index}
            isSelected={selectedBarIndices.includes(index)}
          />
        ))}
      </BarRow>
      
      <DateLabel position="left">{startDateLabel}</DateLabel>
      <DateLabel position="right">{endDateLabel}</DateLabel>
      
      {tooltipDate && (
        <TooltipContainer position={tooltipPosition}>
          <TooltipBody>
            <TooltipText>{tooltipDate}</TooltipText>
          </TooltipBody>
          <TooltipArrow />
        </TooltipContainer>
      )}
    </Container>
  );
};
