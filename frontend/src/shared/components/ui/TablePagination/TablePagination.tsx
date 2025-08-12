/** @jsxImportSource @emotion/react */
import React from 'react';
import { TablePaginationProps } from './types';
import PaginationButton from './components/PaginationButton';
import { LeftArrowIcon, RightArrowIcon } from './components/ArrowIcons';
import { usePageInfo, useDisabledState, usePaginationClasses, useValidatedProps, useKeyboardNavigation } from './hooks';
import {
  paginationContainerStyles,
  paginationRowStyles,
  pageInfoStyles,
  controlsContainerStyles,
  loadingStyles,
  errorStyles,
  responsiveContainerStyles,
} from './styles';

/**
 * TablePagination - A reusable pagination component for tables
 * 
 * Features:
 * - Responsive design that adapts to different screen sizes
 * - Customizable page info display (left, center, or both)
 * - Configurable button labels and icons
 * - Multiple size variants (sm, md, lg)
 * - Loading and error states
 * - Keyboard accessibility
 * - Auto-disabled state management for prev/next buttons
 */
const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage: rawCurrentPage,
  totalPages: rawTotalPages,
  pageInfoFormat,
  showLeftPageInfo = true,
  showCenterPageInfo = true,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  onPrevious,
  onNext,
  previousIcon,
  nextIcon,
  size = 'md',
  variant = 'default',
  disablePrevious,
  disableNext,
  className = '',
  ariaLabel = 'Table pagination',
  loading = false,
  error,
}) => {
  // Validate and sanitize props
  const { currentPage, totalPages, hasValidData } = useValidatedProps({ 
    currentPage: rawCurrentPage, 
    totalPages: rawTotalPages 
  });

  const pageInfo = usePageInfo({ currentPage, totalPages, pageInfoFormat });
  const { isPreviousDisabled, isNextDisabled } = useDisabledState({
    currentPage,
    totalPages,
    disablePrevious,
    disableNext,
  });
  const { handleKeyDown } = useKeyboardNavigation({
    onPrevious,
    onNext,
    isPreviousDisabled,
    isNextDisabled,
  });
  const containerClasses = usePaginationClasses({ size, variant, className });

  // Error state
  if (error) {
    return (
      <div css={[paginationContainerStyles, responsiveContainerStyles]} className={containerClasses}>
        <div css={errorStyles}>
          Error: {error}
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div 
        css={[paginationContainerStyles, loadingStyles, responsiveContainerStyles]} 
        className={containerClasses}
        role="status"
        aria-label="Loading pagination"
      >
        <div css={paginationRowStyles}>
          <div className="skeleton skeleton-text" />
          <div css={controlsContainerStyles}>
            <div className="skeleton skeleton-button" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-button" />
          </div>
        </div>
      </div>
    );
  }

  // Default icons
  const prevIcon = previousIcon || <LeftArrowIcon />;
  const nextIconElement = nextIcon || <RightArrowIcon />;

  // Show error if invalid data
  if (!hasValidData) {
    return (
      <div css={[paginationContainerStyles, responsiveContainerStyles]} className={containerClasses}>
        <div css={errorStyles}>
          Invalid pagination data: currentPage={rawCurrentPage}, totalPages={rawTotalPages}
        </div>
      </div>
    );
  }

  return (
    <nav
      css={[paginationContainerStyles, responsiveContainerStyles]}
      className={containerClasses}
      role="navigation"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div css={paginationRowStyles}>
        {/* Left page info */}
        {showLeftPageInfo && (
          <p css={pageInfoStyles}>
            {pageInfo}
          </p>
        )}

        {/* Pagination controls */}
        <div css={controlsContainerStyles}>
          {/* Previous button */}
          <PaginationButton
            onClick={onPrevious}
            disabled={isPreviousDisabled}
            icon={prevIcon}
            iconPosition="left"
            size={size}
            ariaLabel={`Go to previous page (${Math.max(1, currentPage - 1)})`}
          >
            {previousLabel}
          </PaginationButton>

          {/* Center page info */}
          {showCenterPageInfo && (
            <p css={pageInfoStyles}>
              {pageInfo}
            </p>
          )}

          {/* Next button */}
          <PaginationButton
            onClick={onNext}
            disabled={isNextDisabled}
            icon={nextIconElement}
            iconPosition="right"
            size={size}
            ariaLabel={`Go to next page (${Math.min(totalPages, currentPage + 1)})`}
          >
            {nextLabel}
          </PaginationButton>
        </div>

        {/* Placeholder for alignment when left page info is hidden */}
        {!showLeftPageInfo && <div />}
      </div>
    </nav>
  );
};

export default TablePagination;