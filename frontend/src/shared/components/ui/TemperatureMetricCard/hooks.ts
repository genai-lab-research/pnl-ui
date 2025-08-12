import { useMemo } from 'react';

interface UseFormattedTemperatureProps {
  currentValue: number | string | undefined;
  targetValue?: number | string;
  unit?: string;
}

interface UseCardClassesProps {
  variant: string;
  size: string;
  onClick?: () => void;
  className: string;
}

export const useFormattedTemperature = ({
  currentValue,
  targetValue,
  unit = '°C'
}: UseFormattedTemperatureProps) => {
  return useMemo(() => {
    if (currentValue === undefined) return '';
    
    let formatted = `${currentValue}${unit}`;
    
    if (targetValue !== undefined) {
      formatted += ` / ${targetValue}${unit}`;
    }
    
    return formatted;
  }, [currentValue, targetValue, unit]);
};

export const useCardClasses = ({
  variant,
  size,
  onClick,
  className
}: UseCardClassesProps) => {
  return useMemo(() => {
    const classes = [className];
    
    if (onClick) {
      classes.push('clickable');
    }
    
    if (variant !== 'default') {
      classes.push(`variant-${variant}`);
    }
    
    if (size !== 'md') {
      classes.push(`size-${size}`);
    }
    
    return classes.filter(Boolean).join(' ');
  }, [variant, size, onClick, className]);
};