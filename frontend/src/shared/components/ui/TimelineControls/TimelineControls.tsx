import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RepeatIcon from '@mui/icons-material/Repeat';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export type PlayState = 'playing' | 'paused';

export interface TimelineControlsProps {
  /** Current play state */
  playState?: PlayState;
  /** Callback fired when play/pause button is clicked */
  onPlayPauseClick?: () => void;
  /** Callback fired when previous button is clicked */
  onPreviousClick?: () => void;
  /** Callback fired when next button is clicked */
  onNextClick?: () => void;
  /** Callback fired when repeat button is clicked */
  onRepeatClick?: () => void;
  /** If true, will disable all controls */
  disabled?: boolean;
  /** Custom class name for additional styling */
  className?: string;
}

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 6,
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 4,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-disabled': {
    opacity: 0.5,
    color: theme.palette.text.disabled,
  },
}));

/**
 * TimelineControls component provides standard media player controls for timeline navigation
 * including previous, play/pause, next, and repeat buttons.
 * 
 * @component
 * @example
 * ```tsx
 * const [playState, setPlayState] = React.useState<PlayState>('paused');
 * 
 * const handlePlayPause = () => {
 *   setPlayState(prevState => prevState === 'playing' ? 'paused' : 'playing');
 * };
 * 
 * return (
 *   <TimelineControls 
 *     playState={playState}
 *     onPlayPauseClick={handlePlayPause}
 *     onPreviousClick={() => console.log('Previous clicked')}
 *     onNextClick={() => console.log('Next clicked')}
 *     onRepeatClick={() => console.log('Repeat clicked')}
 *   />
 * );
 * ```
 */
export const TimelineControls: React.FC<TimelineControlsProps> = ({
  playState = 'paused',
  onPlayPauseClick,
  onPreviousClick,
  onNextClick,
  onRepeatClick,
  disabled = false,
  className,
}) => {
  return (
    <ControlsContainer className={className} role="group" aria-label="Timeline controls">
      <StyledIconButton
        aria-label="previous"
        onClick={onPreviousClick}
        disabled={disabled}
        size="small"
      >
        <SkipPreviousIcon fontSize="small" />
      </StyledIconButton>

      <StyledIconButton
        aria-label={playState === 'playing' ? 'pause' : 'play'}
        onClick={onPlayPauseClick}
        disabled={disabled}
        size="small"
      >
        {playState === 'playing' ? (
          <PauseIcon fontSize="small" />
        ) : (
          <PlayArrowIcon fontSize="small" />
        )}
      </StyledIconButton>

      <StyledIconButton
        aria-label="repeat"
        onClick={onRepeatClick}
        disabled={disabled}
        size="small"
      >
        <RepeatIcon fontSize="small" />
      </StyledIconButton>

      <StyledIconButton
        aria-label="next"
        onClick={onNextClick}
        disabled={disabled}
        size="small"
      >
        <SkipNextIcon fontSize="small" />
      </StyledIconButton>
    </ControlsContainer>
  );
};

export default TimelineControls;