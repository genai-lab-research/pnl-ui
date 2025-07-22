import React from 'react';
import { MediaControlButtonProps } from '../types';
import { IconButtonWrapper } from '../styles';

const MediaControlButton: React.FC<MediaControlButtonProps> = ({
  onClick,
  icon,
  disabled = false,
  className,
}) => {
  return (
    <IconButtonWrapper
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-disabled={disabled}
    >
      {icon}
    </IconButtonWrapper>
  );
};

export default MediaControlButton;