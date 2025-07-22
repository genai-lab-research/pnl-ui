import * as React from 'react';
import { SegmentedButtonContainer, SegmentButtonOption } from './SegmentedButton.styles';
import { SegmentedButtonProps } from './types';

const SegmentedButton: React.FC<SegmentedButtonProps> = ({ 
  options, 
  value, 
  onChange,
  ariaLabel = 'Segmented button group'
}) => {
  return (
    <SegmentedButtonContainer role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <SegmentButtonOption
          key={option.value}
          isActive={value === option.value}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          type="button"
        >
          {option.label}
        </SegmentButtonOption>
      ))}
    </SegmentedButtonContainer>
  );
};

export default SegmentedButton;