import React from 'react';
import { PaginationBlockProps } from './types';
import {
  PaginationContainer,
  StatusText,
  PaginatorControls,
  NavigationButton,
  ButtonContent,
  ButtonText,
  IconContainer,
  CenterStatusText
} from './styles';
import { ArrowLeftIcon, ArrowRightIcon } from './components';
import { usePagination } from './hooks';

/**
 * PaginationBlock component for navigation through paginated content
 * 
 * Displays current page status and provides Previous/Next navigation controls
 * with proper disabled states and responsive layout.
 * 
 * @param props - Component props
 * @returns JSX element representing the pagination block
 */
export const PaginationBlock = ({
  currentPage = 1,
  totalPages = 2,
  onPreviousClick,
  onNextClick,
  isPreviousDisabled,
  isNextDisabled,
  className
}: PaginationBlockProps): React.JSX.Element => {
  // Use custom hook for pagination logic
  const {
    statusText,
    isPreviousDisabled: computedIsPreviousDisabled,
    isNextDisabled: computedIsNextDisabled,
    handlePreviousClick,
    handleNextClick
  } = usePagination({
    currentPage,
    totalPages,
    onPreviousClick,
    onNextClick
  });

  // Allow prop override of computed disabled states
  const finalIsPreviousDisabled = isPreviousDisabled ?? computedIsPreviousDisabled;
  const finalIsNextDisabled = isNextDisabled ?? computedIsNextDisabled;

  return (
    <PaginationContainer className={className}>
      <StatusText>{statusText}</StatusText>
      
      <PaginatorControls>
        <NavigationButton
          disabled={finalIsPreviousDisabled}
          onClick={handlePreviousClick}
          aria-label="Go to previous page"
        >
          <ButtonContent>
            <IconContainer disabled={finalIsPreviousDisabled}>
              <ArrowLeftIcon disabled={finalIsPreviousDisabled} />
            </IconContainer>
            <ButtonText disabled={finalIsPreviousDisabled}>Previous</ButtonText>
          </ButtonContent>
        </NavigationButton>
        
        <CenterStatusText aria-hidden="true">{statusText}</CenterStatusText>
        
        <NavigationButton
          disabled={finalIsNextDisabled}
          onClick={handleNextClick}
          aria-label="Go to next page"
        >
          <ButtonContent>
            <ButtonText disabled={finalIsNextDisabled}>Next</ButtonText>
            <IconContainer disabled={finalIsNextDisabled}>
              <ArrowRightIcon disabled={finalIsNextDisabled} />
            </IconContainer>
          </ButtonContent>
        </NavigationButton>
      </PaginatorControls>
    </PaginationContainer>
  );
};