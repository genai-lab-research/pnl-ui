import React from 'react';
import { AvatarContainer, AvatarImage } from './styles';
import { AvatarProps } from './types';

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  className,
  onClick,
}) => {
  return (
    <AvatarContainer 
      className={className}
      onClick={onClick}
    >
      <AvatarImage 
        src={src} 
        alt={alt} 
      />
    </AvatarContainer>
  );
};