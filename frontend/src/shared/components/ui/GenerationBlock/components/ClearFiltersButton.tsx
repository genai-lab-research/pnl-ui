import React from 'react';
import { ClearFiltersButtonProps } from '../types';
import { ClearFiltersButton as StyledClearFiltersButton } from '../styles';

export const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({
  onClick,
  className
}) => {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <StyledClearFiltersButton
      className={className}
      onClick={handleClick}
      type="button"
    >
      Clear Filters
    </StyledClearFiltersButton>
  );
};