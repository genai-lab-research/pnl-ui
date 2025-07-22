import * as React from 'react';
import { TimelapsProps } from './types';
import {
  TimelapsContainer,
  GenerationBlockContainer,
  TimelineCellsContainer,
  TimelineCell,
  StartDateLabel,
  EndDateLabel,
  TooltipContainer,
  TooltipContent,
  TooltipArrow,
  TooltipText
} from './Timelaps.styles';

export const Timelaps: React.FC<TimelapsProps> = ({
  cells,
  startDate,
  endDate,
  currentDayIndex,
  className
}) => {
  const calculateTooltipPosition = () => {
    if (currentDayIndex === undefined || currentDayIndex < 0 || currentDayIndex >= cells.length) {
      return 0;
    }
    
    // Calculate position based on the current day index
    // We have 62 cells across 1344px, so each cell position needs to be calculated
    const cellWidth = 1344 / (cells.length - 1);
    return currentDayIndex * cellWidth;
  };

  return (
    <TimelapsContainer className={className}>
      <GenerationBlockContainer>
        <TimelineCellsContainer>
          {cells.map((cell, index) => (
            <TimelineCell
              key={index}
              isActive={cell.isActive}
              isFuture={cell.isFuture}
            />
          ))}
        </TimelineCellsContainer>
        
        <StartDateLabel>{startDate}</StartDateLabel>
        <EndDateLabel>{endDate}</EndDateLabel>
        
        {currentDayIndex !== undefined && (
          <TooltipContainer position={calculateTooltipPosition()}>
            <TooltipContent>
              <TooltipText>Today</TooltipText>
            </TooltipContent>
            <TooltipArrow />
          </TooltipContainer>
        )}
      </GenerationBlockContainer>
    </TimelapsContainer>
  );
};