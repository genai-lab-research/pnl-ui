export interface PaginationBlockProps {
  currentPage?: number;
  totalPages?: number;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
  className?: string;
}