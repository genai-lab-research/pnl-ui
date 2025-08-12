import { useMemo } from 'react';

interface UseFormattedValueProps {
  value?: string | number;
  unit?: string;
  delta?: number | string;
  deltaDirection?: 'up' | 'down' | 'flat';
}

export const useFormattedValue = ({ 
  value, 
  unit, 
  delta, 
  deltaDirection = 'flat' 
}: UseFormattedValueProps) => {
  return useMemo(() => {
    if (value === undefined || value === null) return '';
    
    let formattedValue = String(value);
    if (unit) {
      formattedValue += unit;
    }
    
    if (delta !== undefined && delta !== null) {
      const deltaSign = deltaDirection === 'up' ? '+' : deltaDirection === 'down' ? '-' : '';
      const deltaValue = Math.abs(Number(delta));
      const deltaUnit = unit || '';
      formattedValue += ` ${deltaSign}${deltaValue}${deltaUnit}`;
    }
    
    return formattedValue;
  }, [value, unit, delta, deltaDirection]);
};

interface UseCardClassesProps {
  variant: 'default' | 'compact' | 'outlined' | 'elevated';
  size: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const useCardClasses = ({ 
  variant, 
  size, 
  onClick, 
  className = '' 
}: UseCardClassesProps) => {
  return useMemo(() => {
    return [
      `variant-${variant}`,
      `size-${size}`,
      onClick ? 'clickable' : '',
      className
    ].filter(Boolean).join(' ');
  }, [variant, size, onClick, className]);
};