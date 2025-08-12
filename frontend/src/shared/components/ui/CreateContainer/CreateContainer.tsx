import React from 'react';
import { CreateContainerProps } from './types';
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
        {loading ? <LoadingSpinner /> : <PlusCircleIcon />}
      </PlusIcon>
      <ButtonText>{text}</ButtonText>
    </StyledCreateContainer>
  );
};

export default CreateContainer;