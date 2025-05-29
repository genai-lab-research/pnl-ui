import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NextButton } from '../NextButton/NextButton';
import { PreviousButton } from '../PreviousButton/PreviousButton';

export interface PaginationProps {
  /**
   * Current page number (1-based)
   * @default 1
   */
  page: number;
  
  /**
   * Total number of pages
   * @default 1
   */
  totalPages: number;
  
  /**
   * Optional text to display before page information
   * @default "Showing page"
   */
  showingText?: string;
  
  /**
   * If `true`, the pagination will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Callback fired when the page is changed
   */
  onPageChange: (page: number) => void;
  
  /**
   * Custom class name
   */
  className?: string;
}

const PaginationContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fullWidth',
})<{ fullWidth?: boolean }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

const PageInfoText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#71717A',
  fontWeight: 400,
  margin: '0 16px',
  [theme.breakpoints.down('sm')]: {
    margin: '8px 0',
    order: 3, // Move to bottom on mobile
  },
}));

const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'space-between',
  },
}));

/**
 * Pagination component for navigating through pages.
 * Uses NextButton and PreviousButton components for navigation controls.
 *
 * @component
 * @example
 * ```tsx
 * <Pagination 
 *   page={1} 
 *   totalPages={10} 
 *   onPageChange={(newPage) => console.log(`Navigate to page ${newPage}`)} 
 * />
 * ```
 */
export const Pagination: React.FC<PaginationProps> = ({
  page = 1,
  totalPages = 1,
  showingText = "Showing page",
  fullWidth = false,
  onPageChange,
  className,
}) => {
  const handlePreviousClick = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextClick = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <PaginationContainer fullWidth={fullWidth} className={className}>
      <ButtonsContainer>
        <PreviousButton 
          onClick={handlePreviousClick} 
          disabled={page <= 1} 
        />
        <PageInfoText>{`${showingText} ${page} of ${totalPages}`}</PageInfoText>
        <NextButton 
          onClick={handleNextClick} 
          disabled={page >= totalPages} 
        />
      </ButtonsContainer>
    </PaginationContainer>
  );
};

export default Pagination;