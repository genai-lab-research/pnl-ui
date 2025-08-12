import { useMemo } from 'react';
import { SegmentOption } from './types';

interface UseSegmentClasses {
  variant?: string;
  size?: string;
  fullWidth?: boolean;
  className?: string;
  error?: string;
}

export const useSegmentClasses = ({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  error
}: UseSegmentClasses) => {
  return useMemo(() => {
    const classes = [
      `variant-${variant}`,
      `size-${size}`,
      fullWidth ? 'full-width' : '',
      error ? 'error' : '',
      className
    ].filter(Boolean);
    
    return classes.join(' ');
  }, [variant, size, fullWidth, error, className]);
};

interface UseKeyboardNavigation {
  options: SegmentOption[];
  selectedId: string;
  onChange: (id: string) => void;
}

export const useKeyboardNavigation = ({ options, selectedId, onChange }: UseKeyboardNavigation) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = options.findIndex(option => option.id === selectedId);
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = options.length - 1;
        break;
      default:
        return;
    }

    // Find next non-disabled option
    let attempts = 0;
    while (options[newIndex]?.disabled && attempts < options.length) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        newIndex = newIndex > 0 ? newIndex - 1 : options.length - 1;
      } else {
        newIndex = newIndex < options.length - 1 ? newIndex + 1 : 0;
      }
      attempts++;
    }

    if (!options[newIndex]?.disabled) {
      onChange(options[newIndex].id);
    }
  };

  return { handleKeyDown };
};