import React from 'react';
import { PaginatorProps } from './types';
import {
  Container,
  Button,
  ButtonContent,
  PreviousText,
  NextText,
  PageStatus
} from './Paginator.styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const Paginator: React.FC<PaginatorProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}) => {
  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

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
      <Button 
        disabled={isPreviousDisabled}
        onClick={handlePreviousClick}
      >
        <ButtonContent>
          <ArrowBackIcon 
            sx={{ 
              fontSize: '20px',
              color: 'rgba(76, 78, 100, 0.26)',
            }} 
          />
          <PreviousText>Previous</PreviousText>
        </ButtonContent>
      </Button>
      
      <PageStatus>Showing page {currentPage} of {totalPages}</PageStatus>
      
      <Button 
        disabled={isNextDisabled}
        onClick={handleNextClick}
      >
        <ButtonContent>
          <NextText>Next</NextText>
          <ArrowForwardIcon 
            sx={{ 
              fontSize: '20px',
              color: '#6C778D',
            }} 
          />
        </ButtonContent>
      </Button>
    </Container>
  );
};

export default Paginator;