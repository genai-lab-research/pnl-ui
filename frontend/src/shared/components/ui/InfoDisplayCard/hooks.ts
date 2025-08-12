import { useMemo } from 'react';

interface UseCardClassesProps {
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const useCardClasses = ({ 
  variant = 'default', 
  size = 'md', 
  onClick, 
  className = '' 
}: UseCardClassesProps): string => {
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

interface UseStatusPillClassesProps {
  variant: 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export const useStatusPillClasses = ({ 
  variant, 
  size = 'md' 
}: UseStatusPillClassesProps): string => {
  return useMemo(() => {
    const classes = [`status-${variant}`];
    
    if (size !== 'md') {
      classes.push(`size-${size}`);
    }
    
    return classes.join(' ');
  }, [variant, size]);
};