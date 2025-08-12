/** @jsxImportSource @emotion/react */
import React from 'react';
import clsx from 'clsx';
import { iconButtonStyles, iconContainerStyles } from '../styles';
import type { IconButtonProps } from '../types';

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  iconPath,
  size = 16,
  onClick,
  ariaLabel,
  disabled = false,
  className,
}) => {
  const renderIcon = () => {
    if (icon) {
      return icon;
    }
    
    if (iconPath) {
      return (
        <img
          src={iconPath}
          alt=""
          role="presentation"
          style={{ 
            width: `${size}px`, 
            height: `${size}px`, 
            display: 'block' 
          }}
        />
      );
    }

    return null;
  };

  if (!onClick) {
    return (
      <div
        css={iconContainerStyles}
        className={className}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {renderIcon()}
      </div>
    );
  }

  return (
    <button
      css={iconButtonStyles}
      className={clsx(className)}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type="button"
    >
      <div css={iconContainerStyles} style={{ width: `${size}px`, height: `${size}px` }}>
        {renderIcon()}
      </div>
    </button>
  );
};