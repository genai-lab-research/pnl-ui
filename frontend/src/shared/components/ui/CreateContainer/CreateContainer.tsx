import React from 'react';
import { CreateContainerProps } from './types';
import { getPublicIconPath, getIconAltText, isValidPublicIcon, PublicIconName } from '../../../utils/iconUtils';
import {
  StyledCreateContainer,
  PlusIcon,
  ButtonText,
  LoadingSpinner,
} from './styles';

const PlusCircleIcon: React.FC = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      cx="8"
      cy="8"
      r="7.33"
      stroke="currentColor"
      strokeWidth="1.33"
      fill="none"
    />
    <path
      d="M8 4.67v6.66M4.67 8h6.66"
      stroke="currentColor"
      strokeWidth="1.33"
      strokeLinecap="round"
    />
  </svg>
);

export const CreateContainer: React.FC<CreateContainerProps> = ({
  onClick,
  disabled = false,
  loading = false,
  text = 'Create Container',
  iconName,
  className,
  type = 'button',
  'aria-label': ariaLabel,
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

  // Render icon based on props
  const renderIcon = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    
    // Try to use public icon if provided and valid
    if (iconName && isValidPublicIcon(iconName)) {
      return (
        <img 
          src={getPublicIconPath(iconName as PublicIconName)}
          alt={getIconAltText(iconName as PublicIconName)}
          width={16}
          height={16}
          style={{ objectFit: 'contain' }}
        />
      );
    }
    
    // Default to plus circle icon
    return <PlusCircleIcon />;
  };

  return (
    <StyledCreateContainer
      type={type}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      className={className}
      aria-label={ariaLabel || `${text} button`}
      aria-disabled={disabled || loading}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      <PlusIcon>
        {renderIcon()}
      </PlusIcon>
      <ButtonText>{text}</ButtonText>
    </StyledCreateContainer>
  );
};

export default CreateContainer;