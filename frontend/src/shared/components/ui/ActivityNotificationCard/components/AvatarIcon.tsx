/** @jsxImportSource @emotion/react */
import React from 'react';
import { AvatarIconProps } from '../types';
import { avatarStyles } from '../styles';

export const AvatarIcon: React.FC<AvatarIconProps> = ({ 
  icon, 
  variant, 
  size 
}) => {
  return (
    <div 
      css={avatarStyles}
      className={`avatar-${variant} size-${size}`}
    >
      {icon}
    </div>
  );
};