import React from 'react';
import { CircularProgress } from '@mui/material';
import { SegmentedToggleProps } from './types';
import {
  StyledSegmentedToggle,
  StyledSegmentedOption,
  LoadingWrapper,
  ErrorMessage,
} from './styles';

/**
 * SegmentedToggle component for switching between multiple options
 * A reusable component that can be used for any toggle functionality
 */
export const SegmentedToggle: React.FC<SegmentedToggleProps> = ({
  options,
  value,
  onChange,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  error,
  ariaLabel,
  className,
}) => {
  const handleOptionClick = (optionValue: string) => {
    if (!disabled && !loading) {
      onChange(optionValue);
    }
  };

  if (loading) {
    return (
      <LoadingWrapper className={className}>
        <CircularProgress size={16} />
      </LoadingWrapper>
    );
  }

  return (
    <div>
      <StyledSegmentedToggle 
        className={className}
        role="radiogroup"
        aria-label={ariaLabel || 'Segmented toggle'}
      >
        {options.map((option) => (
          <StyledSegmentedOption
            key={option.id}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            aria-label={option.label}
            tabIndex={value === option.value ? 0 : -1}
            $isSelected={value === option.value}
            $isDisabled={disabled || option.disabled || false}
            $variant={variant}
            $size={size}
            disabled={disabled || option.disabled}
            onClick={() => handleOptionClick(option.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOptionClick(option.value);
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const direction = e.key === 'ArrowLeft' ? -1 : 1;
                const currentIndex = options.findIndex(opt => opt.value === value);
                const nextIndex = (currentIndex + direction + options.length) % options.length;
                const nextOption = options[nextIndex];
                if (!nextOption.disabled) {
                  onChange(nextOption.value);
                }
              }
            }}
          >
            {option.label}
          </StyledSegmentedOption>
        ))}
      </StyledSegmentedToggle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default SegmentedToggle;