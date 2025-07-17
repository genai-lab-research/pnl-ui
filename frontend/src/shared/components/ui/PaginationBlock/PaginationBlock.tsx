import * as React from 'react';
import { PaginationBlockProps } from './types';
import {
  Container,
  InnerContainer,
  LeftLabel,
  ButtonGroup,
  CenterLabel,
  Button,
  ButtonContent,
  PreviousText,
  NextText
} from './PaginationBlock.styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { colors } from '../../../styles';

export const PaginationBlock: React.FC<PaginationBlockProps> = ({
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

  const pageStatus = `Showing page ${currentPage} of ${totalPages}`;

  return (
    <Container className={className}>
      <InnerContainer>
        <LeftLabel>{pageStatus}</LeftLabel>

        <ButtonGroup>
          <Button
            disabled={isPreviousDisabled}
            onClick={handlePreviousClick}
          >
            <ButtonContent>
              <ArrowBackIcon
                sx={{
                  fontSize: '20px',
                  color: colors.opacity.secondary26,
                }}
              />
              <PreviousText>Previous</PreviousText>
            </ButtonContent>
          </Button>

          <CenterLabel>{pageStatus}</CenterLabel>

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
        </ButtonGroup>
      </InnerContainer>
    </Container>
  );
};

export default PaginationBlock;