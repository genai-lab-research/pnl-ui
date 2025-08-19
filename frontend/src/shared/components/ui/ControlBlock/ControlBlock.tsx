import React from 'react';
import { ControlBlockProps } from './types';
import {
  StyledControlBlock,
  IconContainer,
  LabelText,
  LoadingSpinner,
  ErrorText,
  FooterContainer,
} from './styles';

/**
 * ControlBlock - A compact control component for dashboard navigation
 * 
 * Displays an icon and label in a horizontal layout, typically used for
 * navigation or action triggers in dashboard interfaces.
 */
export const ControlBlock: React.FC<ControlBlockProps> = ({
  label,
  iconSlot,
  onClick,
  disabled = false,
  loading = false,
  variant = 'default',
  size = 'md',
  error,
  className,
  ariaLabel,
  footerSlot,
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const renderIcon = () => {
    if (loading) {
      return (
        <IconContainer>
          <LoadingSpinner />
        </IconContainer>
      );
    }
    
    if (iconSlot) {
      return (
        <IconContainer>
          {iconSlot}
        </IconContainer>
      );
    }
    
    // Default arrow forward icon if no icon provided
    return (
      <IconContainer>
        <svg 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
            fill="#FFFFFF"
          />
        </svg>
      </IconContainer>
    );
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <StyledControlBlock
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        className={className}
        aria-label={ariaLabel || `${label} control`}
        aria-disabled={disabled || loading}
        role="button"
        tabIndex={disabled ? -1 : 0}
        $variant={variant}
        $size={size}
        $disabled={disabled}
        $loading={loading}
        $hasFooter={!!footerSlot}
      >
        {renderIcon()}
        <LabelText>{label}</LabelText>
      </StyledControlBlock>
      
      {footerSlot && (
        <FooterContainer>
          {footerSlot}
        </FooterContainer>
      )}
      
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};

export default ControlBlock;
