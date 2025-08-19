import { useMemo } from 'react';
import { KPIMonitorCardProps } from '../types';

/**
 * Custom hook for KPIMonitorCard logic
 * Handles value formatting, icon rendering logic, and accessibility
 */
export const useKPIMonitorCard = (props: KPIMonitorCardProps) => {
  const {
    title,
    value,
    targetValue,
    unit = '',
    delta,
    deltaDirection = 'flat',
    iconName,
    iconSlot,
    ariaLabel,
  } = props;

  // Format display values separately
  const mainValue = useMemo(() => {
    if (value !== undefined) {
      return `${value}${unit}`;
    }
    return '';
  }, [value, unit]);

  const targetValueFormatted = useMemo(() => {
    if (targetValue !== undefined) {
      return `${targetValue}${unit}`;
    }
    return '';
  }, [targetValue, unit]);

  // Combined display value for backward compatibility
  const displayValue = useMemo(() => {
    if (value !== undefined && targetValue !== undefined) {
      return `${value}${unit} / ${targetValue}${unit}`;
    }
    
    if (value !== undefined) {
      return `${value}${unit}`;
    }
    
    return '';
  }, [value, targetValue, unit]);

  // Generate accessibility label
  const generatedAriaLabel = useMemo(() => {
    if (ariaLabel) return ariaLabel;
    
    let label = `${title}: ${displayValue}`;
    
    if (delta !== undefined) {
      const direction = deltaDirection === 'up' ? 'increased' : 
                      deltaDirection === 'down' ? 'decreased' : 'unchanged';
      label += `, ${direction} by ${delta}`;
    }
    
    return label;
  }, [title, displayValue, delta, deltaDirection, ariaLabel]);

  // Determine if component should show icon
  const shouldShowIcon = useMemo(() => {
    return !!(iconSlot || iconName);
  }, [iconSlot, iconName]);

  // Delta display information
  const deltaInfo = useMemo(() => {
    if (delta === undefined) return null;

    const getSymbol = () => {
      switch (deltaDirection) {
        case 'up': return '↗';
        case 'down': return '↘';
        case 'flat': return '→';
        default: return '→';
      }
    };

    const getColor = () => {
      switch (deltaDirection) {
        case 'up': return '#10B981'; // success green
        case 'down': return '#EF4444'; // error red  
        case 'flat': return '#6B7280'; // neutral gray
        default: return '#6B7280';
      }
    };

    return {
      symbol: getSymbol(),
      color: getColor(),
      value: delta,
    };
  }, [delta, deltaDirection]);

  return {
    displayValue,
    mainValue,
    targetValueFormatted,
    generatedAriaLabel,
    shouldShowIcon,
    deltaInfo,
  };
};
