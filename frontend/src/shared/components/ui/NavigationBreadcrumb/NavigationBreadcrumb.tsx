/** @jsxImportSource @emotion/react */
import React from 'react';
import clsx from 'clsx';
import {
  breadcrumbContainerStyles,
  arrowContainerStyles,
  labelStyles,
  loadingStyles,
  errorStyles
} from './styles';
import { NavigationBreadcrumbProps } from './types';

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.6667 10L6.66667 10M6.66667 10L11.6667 5M6.66667 10L11.6667 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({
  label,
  arrowDirection = 'left',
  variant = 'default',
  size = 'md',
  loading = false,
  error,
  backgroundVariant = 'dark',
  arrowIcon,
  onClick,
  ariaLabel,
  className
}) => {
  const isClickable = Boolean(onClick);

  if (error) {
    return (
      <div css={errorStyles} role="alert">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div 
        css={[breadcrumbContainerStyles, loadingStyles]}
        className={clsx(
          `variant-${variant}`,
          `size-${size}`,
          `background-${backgroundVariant}`,
          className
        )}
        aria-label="Loading navigation breadcrumb"
      >
        <div className={clsx('skeleton', backgroundVariant === 'dark' && 'skeleton-dark', 'skeleton-arrow')} />
        <div className={clsx('skeleton', backgroundVariant === 'dark' && 'skeleton-dark', 'skeleton-label')} />
      </div>
    );
  }

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isClickable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      css={breadcrumbContainerStyles}
      className={clsx(
        `variant-${variant}`,
        `size-${size}`,
        `background-${backgroundVariant}`,
        isClickable && 'clickable',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel || `Navigate to ${label}`}
    >
      <div 
        css={arrowContainerStyles}
        className={`arrow-${arrowDirection}`}
      >
        {arrowIcon || <ArrowIcon />}
      </div>
      
      <div css={labelStyles}>
        {label}
      </div>
    </div>
  );
};