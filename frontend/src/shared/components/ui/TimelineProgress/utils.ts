import { DayBlock } from './types';

/**
 * Generates an array of day blocks based on total days and current day
 */
export const generateDayBlocks = (totalDays: number, currentDay: number): DayBlock[] => {
  return Array.from({ length: totalDays }, (_, index) => ({
    index: index + 1,
    isPast: index + 1 < currentDay,
    isCurrent: index + 1 === currentDay,
    isFuture: index + 1 > currentDay,
  }));
};

/**
 * Calculates the position percentage for the current day tooltip
 */
export const calculateTooltipPosition = (currentDay: number, totalDays: number): number => {
  if (!currentDay || !totalDays || totalDays <= 1) return 0;
  return ((currentDay - 1) / (totalDays - 1)) * 100;
};

/**
 * Formats a date string for display
 */
export const formatDateLabel = (date: string | Date): string => {
  if (typeof date === 'string') return date;
  
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: 'short' 
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Determines the appropriate gap size based on total days
 */
export const calculateOptimalGap = (totalDays: number): number => {
  if (totalDays <= 10) return 10;
  if (totalDays <= 30) return 6;
  if (totalDays <= 60) return 4;
  if (totalDays <= 100) return 2;
  return 1;
};