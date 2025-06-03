import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export interface TimelapsSelectorProps {
  /** Currently highlighted timepoint (0-based) */
  currentTimepoint?: number;
  /** Callback fired when a timepoint is selected */
  onTimepointSelect?: (index: number) => void;
  /** Number of timepoints to display */
  timepointCount?: number;
  /** If true, will disable the entire component */
  disabled?: boolean;
  /** Custom className for styling */
  className?: string;
  /** If true, stretches the selector to full width */
  fullWidth?: boolean;
}

interface TimepointItemProps {
  active?: boolean;
  disabled?: boolean;
}

const SelectorContainer = styled(Box)<{ fullWidth?: boolean }>(({ fullWidth }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: fullWidth ? 'space-between' : 'center',
  width: fullWidth ? '100%' : 'fit-content',
  padding: '0px 4px',
}));

const TimepointItem = styled('button')<TimepointItemProps>(({ active, disabled }) => ({
  width: '18px',
  height: '18px',
  margin: '0 2px',
  padding: 0,
  borderRadius: '2px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  outline: 'none',
  background: active ? '#BFC3FF' : '#E6E8FC',
  cursor: disabled ? 'default' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  transition: 'all 0.2s ease',
  
  // Hover state (only apply when not disabled and not active)
  ...(!disabled && !active && {
    '&:hover': {
      background: '#CED1FF',
    },
  }),
  
  // Focus state for accessibility
  '&:focus-visible': {
    boxShadow: '0 0 0 2px #BFC3FF',
  },
}));


/**
 * TimelapsSelector component displays a series of timepoint items for selecting a specific timepoint.
 * The component shows light gray boxes for each timepoint and highlights the current/selected timepoint.
 * 
 * @component
 * @example
 * ```tsx
 * const [selectedTimepoint, setSelectedTimepoint] = React.useState<number>(0);
 * 
 * const handleTimepointSelect = (timepoint: number) => {
 *   setSelectedTimepoint(timepoint);
 * };
 * 
 * return (
 *   <TimelapsSelector 
 *     currentTimepoint={selectedTimepoint}
 *     onTimepointSelect={handleTimepointSelect}
 *     timepointCount={12}
 *   />
 * );
 * ```
 */
export const TimelapsSelector: React.FC<TimelapsSelectorProps> = ({
  currentTimepoint = 0,
  onTimepointSelect,
  timepointCount = 7,
  disabled = false,
  className,
  fullWidth = false,
}) => {
  const handleClick = (index: number) => {
    if (!disabled && onTimepointSelect) {
      onTimepointSelect(index);
    }
  };

  return (
    <SelectorContainer className={className} fullWidth={fullWidth} role="group" aria-label="Timepoint selector">
      {Array.from({ length: timepointCount }).map((_, index) => (
        <TimepointItem
          key={index}
          active={currentTimepoint === index}
          disabled={disabled}
          onClick={() => handleClick(index)}
          aria-label={`Timepoint ${index + 1}`}
          aria-pressed={currentTimepoint === index}
          tabIndex={disabled ? -1 : 0}
        />
      ))}
    </SelectorContainer>
  );
};

export default TimelapsSelector;