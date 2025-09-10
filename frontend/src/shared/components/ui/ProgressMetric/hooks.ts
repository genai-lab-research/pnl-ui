import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

export const useProgressColors = (
  progressColor?: string,
  progressBackgroundColor?: string
) => {
  const theme = useTheme();
  
  return useMemo(() => ({
    fillColor: progressColor || theme.palette.success.main,
    trackColor: progressBackgroundColor || theme.palette.action.hover,
  }), [progressColor, progressBackgroundColor, theme]);
};

export const useNormalizedValue = (value: number): number => {
  return useMemo(() => Math.min(100, Math.max(0, value)), [value]);
};