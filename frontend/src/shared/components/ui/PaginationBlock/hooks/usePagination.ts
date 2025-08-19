import { useMemo, useCallback } from 'react';

/**
 * Configuration options for the pagination hook
 */
export interface UsePaginationOptions {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback function called when previous button is clicked */
  onPreviousClick?: () => void;
  /** Callback function called when next button is clicked */
  onNextClick?: () => void;
}

/**
 * Return type for the pagination hook
 */
export interface UsePaginationReturn {
  /** Formatted status text for display */
  statusText: string;
  /** Whether the previous button should be disabled */
  isPreviousDisabled: boolean;
  /** Whether the next button should be disabled */
  isNextDisabled: boolean;
  /** Handler for previous button click */
  handlePreviousClick: () => void;
  /** Handler for next button click */
  handleNextClick: () => void;
}

/**
 * Custom hook for managing pagination state and interactions
 * 
 * Provides computed values and handlers for pagination controls,
 * including disabled states and status text formatting.
 * 
 * @param options - Configuration options for pagination
 * @returns Object containing pagination state and handlers
 * 
 * @example
 * ```tsx
 * const {
 *   statusText,
 *   isPreviousDisabled,
 *   isNextDisabled,
 *   handlePreviousClick,
 *   handleNextClick
 * } = usePagination({
 *   currentPage: 2,
 *   totalPages: 10,
 *   onPreviousClick: () => setPage(page - 1),
 *   onNextClick: () => setPage(page + 1)
 * });
 * ```
 */
export const usePagination = ({
  currentPage,
  totalPages,
  onPreviousClick,
  onNextClick
}: UsePaginationOptions): UsePaginationReturn => {
  
  // Memoized status text for performance
  const statusText = useMemo(() => 
    `Showing page ${currentPage} of ${totalPages}`,
    [currentPage, totalPages]
  );

  // Memoized disabled states
  const isPreviousDisabled = useMemo(() => 
    currentPage <= 1,
    [currentPage]
  );

  const isNextDisabled = useMemo(() => 
    currentPage >= totalPages,
    [currentPage, totalPages]
  );

  // Stable click handlers using useCallback
  const handlePreviousClick = useCallback(() => {
    if (!isPreviousDisabled && onPreviousClick) {
      onPreviousClick();
    }
  }, [isPreviousDisabled, onPreviousClick]);

  const handleNextClick = useCallback(() => {
    if (!isNextDisabled && onNextClick) {
      onNextClick();
    }
  }, [isNextDisabled, onNextClick]);

  return {
    statusText,
    isPreviousDisabled,
    isNextDisabled,
    handlePreviousClick,
    handleNextClick
  };
};