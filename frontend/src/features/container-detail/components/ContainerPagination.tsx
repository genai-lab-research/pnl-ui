import React from 'react';
import { PaginationBlock } from '../../../shared/components/ui/PaginationBlock';
import { PaginationModel } from '../types/ui-models';

/**
 * Container-specific pagination component for tabular data navigation
 * 
 * Wraps the atomic PaginationBlock component to provide container-domain
 * pagination controls with proper state management and container context.
 * 
 * Features:
 * - Previous/Next navigation buttons with arrow icons
 * - Page status text display (e.g., "Page 1 of 2")
 * - Proper disabled states for navigation boundaries
 * - Container-specific styling and spacing
 * - Accessibility support for screen readers
 */
export interface ContainerPaginationProps {
  /** Pagination state and controls */
  pagination: PaginationModel;
  
  /** Container ID for accessibility labeling */
  containerId?: string | number;
  
  /** Whether pagination is disabled (e.g., during loading) */
  disabled?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Optional data context for accessibility */
  dataContext?: 'crops' | 'activities' | 'devices' | 'inventory';
}

/**
 * ContainerPagination component for navigating through container tabular data
 * 
 * Provides pagination controls specifically designed for container detail views,
 * adapting the atomic PaginationBlock component to container domain requirements.
 * 
 * @param props - Component props
 * @returns JSX element representing the container pagination controls
 */
export const ContainerPagination: React.FC<ContainerPaginationProps> = ({
  pagination,
  containerId,
  disabled = false,
  className,
  dataContext = 'data'
}) => {
  // Early return if no pagination data
  if (!pagination) {
    return null;
  }

  // Calculate derived pagination state
  const handlePreviousClick = () => {
    if (!disabled && pagination.currentPage > 1) {
      pagination.onPageChange(pagination.currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (!disabled && pagination.currentPage < pagination.totalPages) {
      pagination.onPageChange(pagination.currentPage + 1);
    }
  };

  // Generate accessible aria-label context
  const ariaContext = containerId 
    ? `container ${containerId} ${dataContext}` 
    : `container ${dataContext}`;

  return (
    <PaginationBlock
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      onPreviousClick={handlePreviousClick}
      onNextClick={handleNextClick}
      isPreviousDisabled={disabled || pagination.currentPage <= 1}
      isNextDisabled={disabled || pagination.currentPage >= pagination.totalPages}
      className={className}
    />
  );
};
