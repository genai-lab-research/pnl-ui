import { useMemo, useCallback } from 'react';
import { TablePaginationProps } from './types';

export const usePageInfo = ({ 
  currentPage, 
  totalPages, 
  pageInfoFormat 
}: Pick<TablePaginationProps, 'currentPage' | 'totalPages' | 'pageInfoFormat'>) => {
  return useMemo(() => {
    if (pageInfoFormat) {
      return pageInfoFormat(currentPage, totalPages);
    }
    return `Showing page ${currentPage} of ${totalPages}`;
  }, [currentPage, totalPages, pageInfoFormat]);
};

export const useDisabledState = ({ 
  currentPage, 
  totalPages, 
  disablePrevious,
  disableNext 
}: Pick<TablePaginationProps, 'currentPage' | 'totalPages' | 'disablePrevious' | 'disableNext'>) => {
  return useMemo(() => ({
    isPreviousDisabled: disablePrevious ?? currentPage <= 1,
    isNextDisabled: disableNext ?? currentPage >= totalPages,
  }), [currentPage, totalPages, disablePrevious, disableNext]);
};

export const usePaginationClasses = ({
  size = 'md',
  variant = 'default',
  className = ''
}: Pick<TablePaginationProps, 'size' | 'variant' | 'className'>) => {
  return useMemo(() => {
    const classes = ['table-pagination'];
    
    if (size) classes.push(`size-${size}`);
    if (variant) classes.push(`variant-${variant}`);
    if (className) classes.push(className);
    
    return classes.join(' ');
  }, [size, variant, className]);
};

export const useValidatedProps = ({ 
  currentPage, 
  totalPages 
}: Pick<TablePaginationProps, 'currentPage' | 'totalPages'>) => {
  return useMemo(() => {
    // Validate and sanitize props
    const safeCurrent = Math.max(1, Math.min(currentPage, totalPages));
    const safeTotal = Math.max(1, totalPages);
    
    return {
      currentPage: safeCurrent,
      totalPages: safeTotal,
      hasValidData: safeCurrent <= safeTotal && safeTotal >= 1,
    };
  }, [currentPage, totalPages]);
};

export const useKeyboardNavigation = ({
  onPrevious,
  onNext,
  isPreviousDisabled,
  isNextDisabled,
}: {
  onPrevious?: () => void;
  onNext?: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
}) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts for pagination
    if (e.altKey && e.key === 'ArrowLeft' && !isPreviousDisabled && onPrevious) {
      e.preventDefault();
      onPrevious();
    } else if (e.altKey && e.key === 'ArrowRight' && !isNextDisabled && onNext) {
      e.preventDefault();
      onNext();
    }
  }, [onPrevious, onNext, isPreviousDisabled, isNextDisabled]);

  return { handleKeyDown };
};