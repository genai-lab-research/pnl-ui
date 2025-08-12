import { css } from '@emotion/react';

// Theme tokens - Following project color scheme
const theme = {
  colors: {
    primary: '#3545EE',
    primaryHover: '#2A37CC',
    primaryActive: '#1F29AA',
    white: '#FFFFFF',
    gray100: '#F4F4F5',
    gray200: '#E4E4E7',
    gray300: '#D4D4D8',
    gray600: '#6b7280',
    gray900: '#27272A',
    focus: '#3b82f6',
    success: '#22c55e',
    error: '#ef4444',
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '0.75rem', // 12px
    lg: '1rem',    // 16px
  },
  borderRadius: {
    base: '6px',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: {
      medium: 500,
    },
  },
};

export const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border: 1px solid transparent;
  border-radius: ${theme.borderRadius.base};
  font-family: ${theme.typography.fontFamily};
  font-weight: ${theme.typography.fontWeight.medium};
  letter-spacing: 0;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  position: relative;
  box-sizing: border-box;
  white-space: nowrap;
  
  /* Focus states for accessibility */
  &:focus-visible {
    outline: 2px solid ${theme.colors.focus};
    outline-offset: 2px;
  }
  
  /* Disabled state */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  /* Active state for tactile feedback */
  &:not(:disabled):active {
    transform: translateY(1px);
  }

  /* Responsive behavior */
  @media (max-width: 640px) {
    &:not(.full-width) {
      min-width: fit-content;
    }
  }

  /* Variants */
  &.variant-primary {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border-color: ${theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.primaryHover};
      border-color: ${theme.colors.primaryHover};
      box-shadow: 0 1px 3px rgba(52, 69, 238, 0.2);
    }
    
    &:active:not(:disabled) {
      background-color: ${theme.colors.primaryActive};
      border-color: ${theme.colors.primaryActive};
      box-shadow: 0 1px 2px rgba(52, 69, 238, 0.3);
    }
  }
  
  &.variant-secondary {
    background-color: ${theme.colors.gray100};
    color: ${theme.colors.gray900};
    border-color: ${theme.colors.gray200};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.gray200};
      border-color: ${theme.colors.gray300};
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    &:active:not(:disabled) {
      background-color: ${theme.colors.gray300};
    }
  }
  
  &.variant-outlined {
    background-color: transparent;
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: rgba(52, 69, 238, 0.05);
      border-color: ${theme.colors.primaryHover};
      color: ${theme.colors.primaryHover};
    }
    
    &:active:not(:disabled) {
      background-color: rgba(52, 69, 238, 0.1);
    }
  }
  
  &.variant-ghost {
    background-color: transparent;
    color: ${theme.colors.gray900};
    border-color: transparent;
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.gray100};
    }
    
    &:active:not(:disabled) {
      background-color: ${theme.colors.gray200};
    }
  }

  /* Responsive sizes */
  &.size-sm {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
    line-height: 1rem;
    min-height: 1.75rem;
    
    @media (max-width: 480px) {
      padding: 0.25rem 0.375rem;
      font-size: 0.6875rem;
      min-height: 1.5rem;
    }
  }
  
  &.size-md {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    min-height: 2.5rem;
    
    @media (max-width: 480px) {
      padding: 0.5rem 0.625rem;
      font-size: 0.8125rem;
      min-height: 2.25rem;
    }
  }
  
  &.size-lg {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    line-height: 1.5rem;
    min-height: 3rem;
    
    @media (max-width: 480px) {
      padding: 0.625rem 0.875rem;
      font-size: 0.9375rem;
      min-height: 2.75rem;
    }
  }
  
  /* Full width utility */
  &.full-width {
    width: 100%;
    max-width: 100%;
  }

  /* Loading state with improved spinner */
  &.loading {
    color: transparent;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1rem;
      height: 1rem;
      border: 2px solid;
      border-color: currentColor transparent currentColor transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin {
    0% { 
      transform: translate(-50%, -50%) rotate(0deg); 
    }
    100% { 
      transform: translate(-50%, -50%) rotate(360deg); 
    }
  }
`;

export const iconStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  /* Responsive icon sizes */
  .size-sm & {
    width: 0.875rem;
    height: 0.875rem;
  }
  
  .size-lg & {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

export const labelStyles = css`
  font-weight: inherit;
  line-height: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
`;

export const errorStyles = css`
  color: ${theme.colors.error};
  font-size: 0.75rem;
  line-height: 1rem;
  margin-top: ${theme.spacing.xs};
  text-align: left;
  font-family: ${theme.typography.fontFamily};
`;