import React from 'react';
import { MediaControlButtonSetProps } from './types';
import { MediaControlButtonSetContainer } from './styles';
import { MediaControlButton } from './components';
import {
  SkipPreviousIcon,
  PlayArrowIcon,
  RepeatIcon,
  SkipNextIcon
} from './icons';

const MediaControlButtonSet: React.FC<MediaControlButtonSetProps> = ({
  onPreviousClick,
  onPlayClick,
  onRepeatClick,
  onNextClick,
  disabled = false,
  className,
}) => {
  return (
    <MediaControlButtonSetContainer className={className}>
      <MediaControlButton
        icon={<SkipPreviousIcon />}
        onClick={onPreviousClick}
        disabled={disabled}
      />
      <MediaControlButton
        icon={<PlayArrowIcon />}
        onClick={onPlayClick}
        disabled={disabled}
      />
      <MediaControlButton
        icon={<RepeatIcon />}
        onClick={onRepeatClick}
        disabled={disabled}
      />
      <MediaControlButton
        icon={<SkipNextIcon />}
        onClick={onNextClick}
        disabled={disabled}
      />
    </MediaControlButtonSetContainer>
  );
};

export default MediaControlButtonSet;