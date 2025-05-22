import React from 'react';
import { Box } from '@mui/material';
import { PaginatorButton } from '../Button';
import Typography from '@mui/material/Typography';

interface PaginatorContainerProps {
  /**
   * Current page number
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Callback when the previous button is clicked
   */
  onPrevious?: () => void;
  /**
   * Callback when the next button is clicked
   */
  onNext?: () => void;
  /**
   * Disable the previous button
   * @default false
   */
  disablePrevious?: boolean;
  /**
   * Disable the next button
   * @default false
   */
  disableNext?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Paginator container component for navigation between pages
 */
export const PaginatorContainer: React.FC<PaginatorContainerProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false,
  className,
}) => {
  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        width: '100%',
      }}
    >
      <PaginatorButton
        variant="outlined"
        color="secondary"
        onClick={onPrevious}
        disabled={disablePrevious}
        icon="previous"
      >
        Previous
      </PaginatorButton>
      
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          textAlign: 'center',
        }}
      >
        Showing page {currentPage} of {totalPages}
      </Typography>
      
      <PaginatorButton
        variant="outlined"
        color="secondary"
        onClick={onNext}
        disabled={disableNext}
        icon="next"
      >
        Next
      </PaginatorButton>
    </Box>
  );
};

export default PaginatorContainer;