import { useMemo, useCallback } from 'react';
import { generateDayBlocks, calculateTooltipPosition, calculateOptimalGap } from '../utils';
import { TimelineProgressProps } from '../types';

/**
 * Custom hook for managing timeline progress logic
 */
export const useTimelineProgress = ({
  totalDays = 62,
  currentDay = 1,
  gap,
  onDayClick,
}: Pick<TimelineProgressProps, 'totalDays' | 'currentDay' | 'gap' | 'onDayClick'>) => {
  const dayBlocks = useMemo(
    () => generateDayBlocks(totalDays, currentDay),
    [totalDays, currentDay]
  );

  const tooltipPosition = useMemo(
    () => calculateTooltipPosition(currentDay, totalDays),
    [currentDay, totalDays]
  );

  const optimalGap = useMemo(
    () => gap ?? calculateOptimalGap(totalDays),
    [gap, totalDays]
  );

  const handleDayClick = useCallback(
    (dayIndex: number) => {
      onDayClick?.(dayIndex);
    },
    [onDayClick]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, dayIndex: number) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleDayClick(dayIndex);
      }
    },
    [handleDayClick]
  );

  return {
    dayBlocks,
    tooltipPosition,
    optimalGap,
    handleDayClick,
    handleKeyDown,
  };
};