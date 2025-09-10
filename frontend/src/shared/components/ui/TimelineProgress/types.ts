import { ReactNode } from 'react';

export interface TimelineProgressProps {
  startDate?: string;
  endDate?: string;
  currentDay?: number;
  totalDays?: number;
  showTooltip?: boolean;
  tooltipLabel?: string;
  accentColor?: string;
  baseColor?: string;
  futureOpacity?: number;
  gap?: number;
  height?: number;
  borderRadius?: number;
  loading?: boolean;
  error?: string;
  className?: string;
  ariaLabel?: string;
  onDayClick?: (day: number) => void;
  customTooltip?: ReactNode;
}

export interface DayBlock {
  index: number;
  isPast: boolean;
  isCurrent: boolean;
  isFuture: boolean;
}