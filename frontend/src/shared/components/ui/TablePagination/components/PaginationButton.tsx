/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react';
import { PaginationButtonProps } from '../types';
import { buttonStyles, previousButtonStyles, nextButtonStyles, iconStyles } from '../styles';

const PaginationButton: React.FC<PaginationButtonProps> = ({
  children,
  onClick,
  disabled = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  className = '',
  ariaLabel,
}) => {
  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!disabled && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  }, [disabled, onClick]);

  // Determine button type based on children text for styling
  const isNextButton = React.isValidElement(children) 
    ? false 
    : typeof children === 'string' && children.toLowerCase().includes('next');

  const buttonTypeStyles = isNextButton ? nextButtonStyles : previousButtonStyles;

  return (
    <button
      css={[buttonStyles, buttonTypeStyles]}
      className={`${className} size-${size}`.trim()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      type="button"
    >
      {icon && iconPosition === 'left' && (
        <span css={iconStyles}>
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span css={iconStyles}>
          {icon}
        </span>
      )}
    </button>
  );
};

export default PaginationButton;