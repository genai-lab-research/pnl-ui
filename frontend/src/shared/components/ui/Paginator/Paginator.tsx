import React from 'react';
import { PaginatorProps } from './types';
import {
  Container,
  Button,
  ButtonContent,
  PreviousText,
  NextText,
  PageStatus,
  PageStatusLeft
} from './Paginator.styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CircularProgress } from '@mui/material';

export const Paginator: React.FC<PaginatorProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  loading = false
}) => {
  const isPreviousDisabled = currentPage <= 1 || totalPages === 0 || loading;
  const isNextDisabled = currentPage >= totalPages || totalPages === 0 || loading;

  const handlePreviousClick = () => {
    if (!isPreviousDisabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (!isNextDisabled) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Container className={className}>
      <PageStatusLeft>
        Showing page {currentPage} of {totalPages}
      </PageStatusLeft>
      <Button 
        disabled={isPreviousDisabled}
        onClick={handlePreviousClick}
      >
        <ButtonContent>
          <ArrowBackIcon 
            sx={{ 
              fontSize: '20px',
              color: isPreviousDisabled ? 'rgba(76, 78, 100, 0.26)' : '#6C778D',
              
            }} 
          />
          <PreviousText disabled={isPreviousDisabled}>
            Previous
          </PreviousText> 
        </ButtonContent>
      </Button>
      
      <PageStatus>
        {loading ? (
          <>
            <CircularProgress size={16} sx={{ marginRight: '8px' }} />
            Loading...
          </>
        ) : (
          `Showing page ${currentPage} of ${totalPages}`
        )}
      </PageStatus>
      
      <Button 
        disabled={isNextDisabled}
        onClick={handleNextClick}
      >
        <ButtonContent>
          <NextText disabled={isNextDisabled}>Next</NextText>
          <ArrowForwardIcon 
            sx={{ 
              fontSize: '20px',
              color: isNextDisabled ? 'rgba(76, 78, 100, 0.26)': '#6C778D',
            }} 
          />
        </ButtonContent>
      </Button>
    </Container>
  );
};

export default Paginator;