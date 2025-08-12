/** @jsxImportSource @emotion/react */
import React from 'react';
import { SegmentOption } from '../types';
import { segmentItemStyles, segmentContentStyles, labelStyles } from '../styles';
import { getSegmentAriaAttributes } from '../utils';

export interface SegmentButtonProps {
  option: SegmentOption;
  isSelected: boolean;
  index: number;
  totalCount: number;
  size: 'sm' | 'md' | 'lg';
  variant: string;
  onClick: (optionId: string, disabled?: boolean) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  disableAnimations?: boolean;
  borderRadius?: string;
}

/**
 * Individual segment button component
 * Extracted for better separation of concerns and reusability
 */
const SegmentButton: React.FC<SegmentButtonProps> = ({
  option,
  isSelected,
  index,
  totalCount,
  size,
  variant,
  onClick,
  onKeyDown,
  disableAnimations = false,
  borderRadius,
}) => {
  const segmentClasses = [
    `size-${size}`,
    `variant-${variant}`,
    isSelected ? 'selected' : 'unselected',
  ].filter(Boolean).join(' ');

  const ariaAttributes = getSegmentAriaAttributes(option, isSelected, totalCount, index);

  const customStyles = {
    ...(disableAnimations && { transition: 'none' }),
    ...(borderRadius && index === 0 && {
      borderTopLeftRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
    }),
    ...(borderRadius && index === totalCount - 1 && {
      borderTopRightRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
    }),
  };

  return (
    <button
      css={segmentItemStyles}
      className={segmentClasses}
      role="radio"
      tabIndex={isSelected ? 0 : -1}
      disabled={option.disabled}
      onClick={() => onClick(option.id, option.disabled)}
      onKeyDown={isSelected ? onKeyDown : undefined}
      style={customStyles}
      {...ariaAttributes}
    >
      <div css={segmentContentStyles}>
        {option.iconSlot}
        <span css={labelStyles}>
          {option.label}
        </span>
      </div>
    </button>
  );
};

export default SegmentButton;