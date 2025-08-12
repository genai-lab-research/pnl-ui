import { useMemo, useCallback } from 'react';
import { SearchFilterBarProps } from './types';

interface UseSearchFilterBarClassesParams {
  variant?: SearchFilterBarProps['variant'];
  size?: SearchFilterBarProps['size'];
  className?: string;
}

export const useSearchFilterBarClasses = ({ 
  variant = 'default', 
  size = 'md', 
  className = '' 
}: UseSearchFilterBarClassesParams) => {
  return useMemo(() => {
    const classes = ['search-filter-bar'];
    
    if (variant !== 'default') {
      classes.push(`variant-${variant}`);
    }
    
    if (size !== 'md') {
      classes.push(`size-${size}`);
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }, [variant, size, className]);
};

export const useToggleSwitch = (
  value: boolean = false,
  onChange?: (value: boolean) => void,
  disabled: boolean = false
) => {
  const handleToggle = useCallback(() => {
    if (disabled) return;
    onChange?.(!value);
  }, [value, onChange, disabled]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange?.(!value);
    }
  }, [value, onChange, disabled]);

  return {
    handleToggle,
    handleKeyDown,
    isActive: value
  };
};

export const useFilterChip = (
  selectedValue?: string,
  onSelect?: (value: string) => void,
  disabled: boolean = false
) => {
  const handleClick = useCallback(() => {
    if (disabled) return;
    // For now, just toggle the chip or call onSelect with current value
    // In a real implementation, this would open a dropdown
    if (onSelect && selectedValue) {
      onSelect(selectedValue);
    }
  }, [selectedValue, onSelect, disabled]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick, disabled]);

  return {
    handleClick,
    handleKeyDown
  };
};