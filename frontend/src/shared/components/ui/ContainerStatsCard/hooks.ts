import { useMemo } from 'react';
import { ChartDataItem } from './types';

export const useCardClasses = ({
  variant,
  size,
  onClick,
  className,
}: {
  variant?: string;
  size?: string;
  onClick?: () => void;
  className?: string;
}) => {
  return useMemo(() => {
    const classes = [];
    
    if (onClick) {
      classes.push('clickable');
    }
    
    if (variant && variant !== 'default') {
      classes.push(`variant-${variant}`);
    }
    
    if (size && size !== 'md') {
      classes.push(`size-${size}`);
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }, [variant, size, onClick, className]);
};

export const useChartBars = (data: ChartDataItem[]) => {
  return useMemo(() => {
    if (!data || data.length === 0) return [];

    const maxValue = Math.max(...data.map(item => item.value));
    const minHeight = 6; // minimum bar height in pixels
    const maxHeight = 60; // maximum bar height in pixels

    return data.map(item => ({
      ...item,
      height: maxValue > 0 
        ? Math.max(minHeight, (item.value / maxValue) * maxHeight)
        : minHeight,
    }));
  }, [data]);
};