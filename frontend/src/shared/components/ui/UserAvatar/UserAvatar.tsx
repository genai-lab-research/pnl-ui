import React from 'react';
import { AvatarContainer, AvatarImage } from './UserAvatar.styles';
import { UserAvatarProps } from './types';

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt,
  size = 32,
  className,
  onClick,
}) => {
  return (
    <AvatarContainer 
      size={size} 
      className={className}
      onClick={onClick}
    >
      <AvatarImage 
        src={src} 
        alt={alt} 
        size={size} 
      />
    </AvatarContainer>
  );
};

export default UserAvatar;