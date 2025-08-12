import { ReactNode } from 'react';

export interface TablePaginationProps {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Label format for showing page info - defaults to "Showing page X of Y" */
  pageInfoFormat?: (current: number, total: number) => string;
  /** Show page info on the left side */
  showLeftPageInfo?: boolean;
  /** Show page info in the center */
  showCenterPageInfo?: boolean;
  /** Custom label for previous button */
  previousLabel?: string;
  /** Custom label for next button */
  nextLabel?: string;
  /** Callback when previous button is clicked */
  onPrevious?: () => void;
  /** Callback when next button is clicked */
  onNext?: () => void;
  /** Custom previous button icon */
  previousIcon?: ReactNode;
  /** Custom next button icon */
  nextIcon?: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'default' | 'minimal' | 'outlined';
  /** Disable previous button */
  disablePrevious?: boolean;
  /** Disable next button */
  disableNext?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Accessibility label for the entire pagination component */
  ariaLabel?: string;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
}

export interface PaginationButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}