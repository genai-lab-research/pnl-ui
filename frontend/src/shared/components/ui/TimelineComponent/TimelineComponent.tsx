import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { TimelapsSelector } from '../TimelapsSelector';

export interface TimelineComponentProps {
  /** Currently selected timepoint (0-based) */
  selectedTimepoint?: number;
  /** Callback fired when a timepoint is selected */
  onTimepointSelect?: (index: number) => void;
  /** Number of timepoints to display */
  timepointCount?: number;
  /** Labels to display at the start and end of the timeline */
  labels?: {
    start?: string;
    end?: string;
  };
  /** Custom class name for additional styling */
  className?: string;
  /** If true, will disable all interactions */
  disabled?: boolean;
  /** If true, stretches the timeline to full width */
  fullWidth?: boolean;
}

const TimelineContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

const SelectorContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}));

const LabelsContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '8px',
}));

const Label = styled(Typography)(() => ({
  fontSize: '8px',
  fontWeight: 500,
  color: '#09090B',
  fontFamily: 'Inter, sans-serif',
  lineHeight: '8px',
  textAlign: 'center',
}));

/**
 * TimelineComponent displays a timeline visualization using a timepoint selector.
 * The component shows a series of timepoint selectors with customizable labels at the start and end.
 * 
 * @component
 * @example
 * ```tsx
 * const [selectedTimepoint, setSelectedTimepoint] = React.useState(0);
 * 
 * return (
 *   <TimelineComponent
 *     selectedTimepoint={selectedTimepoint}
 *     onTimepointSelect={setSelectedTimepoint}
 *     timepointCount={12}
 *     labels={{ start: '01 Apr', end: '15 Apr' }}
 *   />
 * );
 * ```
 */
export const TimelineComponent: React.FC<TimelineComponentProps> = ({
  selectedTimepoint,
  onTimepointSelect,
  timepointCount = 7,
  labels = {
    start: '01\nApr',
    end: '15\nApr'
  },
  className,
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <TimelineContainer className={className}>
      <SelectorContainer>
        <TimelapsSelector
          currentTimepoint={selectedTimepoint}
          onTimepointSelect={onTimepointSelect}
          timepointCount={timepointCount}
          disabled={disabled}
          fullWidth={fullWidth}
        />
      </SelectorContainer>
      
      <LabelsContainer>
        <Label>{labels.start?.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < labels.start!.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}</Label>
        
        <Label>{labels.end?.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < labels.end!.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}</Label>
      </LabelsContainer>
    </TimelineContainer>
  );
};

export default TimelineComponent;