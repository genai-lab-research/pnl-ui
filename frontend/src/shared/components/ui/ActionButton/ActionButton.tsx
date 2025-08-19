import React from 'react';
import { ActionButtonProps } from './types';
import {
  StyledActionButton,
  IconContainer,
  ButtonText,
  LoadingSpinner,
  ErrorText,
} from './styles';

export const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  onClick,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'default',
  type = 'button',
  iconSlot,
  iconPosition = 'left',
  className,
  ariaLabel,
  error,
  fullWidth = false,
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
        <IconContainer $position={iconPosition}>
          <LoadingSpinner />
        </IconContainer>
      );
    }
    
    if (iconSlot) {
      return (
        <IconContainer $position={iconPosition}>
          {iconSlot}
        </IconContainer>
      );
    }
    
    return null;
  };

  const renderContent = () => {
    const icon = renderIcon();
    const textElement = <ButtonText>{text}</ButtonText>;
    
    if (iconPosition === 'right') {
      return (
        <>
          {textElement}
          {icon}
        </>
      );
    }
    
    return (
      <>
        {icon}
        {textElement}
      </>
    );
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <StyledActionButton
        type={type}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        className={className}
        aria-label={ariaLabel || `${text} button`}
        aria-disabled={disabled || loading}
        role="button"
        tabIndex={disabled ? -1 : 0}
        $size={size}
        $variant={variant}
        $disabled={disabled}
        $loading={loading}
        $fullWidth={fullWidth}
        $hasIcon={!!iconSlot || loading}
      >
        {renderContent()}
      </StyledActionButton>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};

export default ActionButton;
