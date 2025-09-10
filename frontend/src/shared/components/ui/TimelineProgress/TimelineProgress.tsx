import React from 'react';
import { Box } from '@mui/material';
import { TimelineProgressProps } from './types';
import { useTimelineProgress } from './hooks/useTimelineProgress';
import {
  Container,
  TimelineWrapper,
  BlocksContainer,
  DayBlockStyled,
  DateLabel,
  TooltipContent,
  TooltipText,
  TooltipWrapper,
  LoadingSkeleton,
  ErrorAlert,
} from './styles';

/**
 * TimelineProgress Component
 * 
 * A reusable timeline visualization component that displays progress through a series of days or steps.
 * Features include customizable colors, tooltip indicators, loading states, and interactive day selection.
 * 
 * @component
 * @example
 * ```tsx
 * <TimelineProgress
 *   startDate="01 Jan"
 *   endDate="31 Dec"
 *   currentDay={145}
 *   totalDays={365}
 *   showTooltip={true}
 *   tooltipLabel="Today"
 * />
 * ```
 */
export const TimelineProgress: React.FC<TimelineProgressProps> = ({
  startDate = '05 Apr',
  endDate = '06 Jun',
  currentDay = 36,
  totalDays = 62,
  showTooltip = true,
  tooltipLabel = 'Today',
  accentColor = '#ABC3F2',
  baseColor = '#E6EBF6',
  futureOpacity = 0.4,
  gap,
  height = 18,
  borderRadius = 6,
  loading = false,
  error,
  className,
  ariaLabel = 'Timeline progress indicator',
  onDayClick,
  customTooltip,
}) => {
  const {
    dayBlocks,
    tooltipPosition,
    optimalGap,
    handleDayClick,
    handleKeyDown,
  } = useTimelineProgress({
    totalDays,
    currentDay,
    gap,
    onDayClick,
  });

  // Loading state
  if (loading) {
    return (
      <Container className={className}>
        <LoadingSkeleton 
          variant="rectangular" 
          width="100%" 
          height={height} 
          sx={{ borderRadius: `${borderRadius}px` }} 
        />
        <Box display="flex" justifyContent="space-between" width="100%" mt={0.5}>
          <LoadingSkeleton width={40} height={8} />
          <LoadingSkeleton width={40} height={8} />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className={className}>
        <ErrorAlert severity="error">
          {error}
        </ErrorAlert>
      </Container>
    );
  }

  return (
    <Container className={className} aria-label={ariaLabel}>
      <TimelineWrapper>
        <BlocksContainer gap={optimalGap}>
          {dayBlocks.map((day) => (
            <DayBlockStyled
              key={day.index}
              isPast={day.isPast}
              isCurrent={day.isCurrent}
              isFuture={day.isFuture}
              accentColor={accentColor}
              baseColor={baseColor}
              futureOpacity={futureOpacity}
              onClick={() => handleDayClick(day.index)}
              role="button"
              tabIndex={0}
              aria-label={`Day ${day.index} of ${totalDays}`}
              onKeyDown={(e) => handleKeyDown(e, day.index)}
            />
          ))}
        </BlocksContainer>
        
        {showTooltip && currentDay && (
          <TooltipWrapper
            style={{
              left: `${tooltipPosition}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {customTooltip || (
              <TooltipContent>
                <TooltipText>{tooltipLabel}</TooltipText>
              </TooltipContent>
            )}
          </TooltipWrapper>
        )}
        
        <DateLabel style={{ left: 0 }}>
          {startDate}
        </DateLabel>
        <DateLabel style={{ right: 0 }}>
          {endDate}
        </DateLabel>
      </TimelineWrapper>
    </Container>
  );
};