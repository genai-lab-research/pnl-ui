import React from 'react';

import PersonIcon from '@mui/icons-material/Person';
import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface AvatarIconProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

const StyledAvatar = styled(Avatar)<{ size?: number }>(({ theme, size = 32 }) => ({
  width: size,
  height: size,
  borderRadius: '50%',
}));

/**
 * Avatar icon for user profiles
 */
export const AvatarIcon: React.FC<AvatarIconProps> = ({
  src,
  alt = 'User avatar',
  size = 32,
  className,
}) => {
  return (
    <StyledAvatar src={src} alt={alt} size={size} className={className}>
      {!src && <PersonIcon />}
    </StyledAvatar>
  );
};

export default AvatarIcon;
