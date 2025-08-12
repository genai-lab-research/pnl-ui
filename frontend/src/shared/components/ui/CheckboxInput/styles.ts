/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

// Theme-based values for consistency
const colors = {
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  border: 'rgba(0, 0, 0, 0.23)',
  borderHover: 'rgba(0, 0, 0, 0.38)',
  borderFocus: '#3b82f6',
  background: '#ffffff',
  backgroundDisabled: '#f5f5f5',
  text: '#1f2937',
  textDisabled: '#9ca3af',
  error: '#ef4444',
  shadow: 'rgba(0, 0, 0, 0.1)',
  checkmark: '#ffffff',
} as const;

// Responsive breakpoints
const breakpoints = {
  mobile: '(max-width: 480px)',
  tablet: '(min-width: 481px) and (max-width: 768px)',
  desktop: '(min-width: 769px)',
} as const;

export const checkboxInputStyles = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${colors.border};
  border-radius: 5px;
  background-color: ${colors.background};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  box-sizing: border-box;
  flex-shrink: 0;
  
  /* Default size (md) - responsive scaling */
  min-width: 20px;
  width: 20px;
  min-height: 20px;
  height: 20px;

  /* Responsive adjustments for mobile */
  @media ${breakpoints.mobile} {
    min-width: 18px;
    width: 18px;
    min-height: 18px;
    height: 18px;
    border-radius: 4px;
  }

  /* Responsive adjustments for tablet */
  @media ${breakpoints.tablet} {
    min-width: 19px;
    width: 19px;
    min-height: 19px;
    height: 19px;
  }

  &:hover:not(.disabled):not(.loading) {
    border-color: ${colors.borderHover};
    box-shadow: 0 1px 3px 0 ${colors.shadow};
  }

  &:focus-visible {
    outline: 2px solid ${colors.borderFocus};
    outline-offset: 2px;
    border-color: ${colors.borderFocus};
  }

  &.checked {
    background-color: ${colors.primary};
    border-color: ${colors.primary};
    
    &:hover:not(.disabled):not(.loading) {
      background-color: ${colors.primaryHover};
      border-color: ${colors.primaryHover};
    }
  }

  &.indeterminate {
    background-color: ${colors.primary};
    border-color: ${colors.primary};
    
    &:hover:not(.disabled):not(.loading) {
      background-color: ${colors.primaryHover};
      border-color: ${colors.primaryHover};
    }
  }

  &.error {
    border-color: ${colors.error};
    
    &:focus-visible {
      outline-color: ${colors.error};
      border-color: ${colors.error};
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
    background-color: ${colors.backgroundDisabled};
    border-color: ${colors.border};
  }

  &.loading {
    opacity: 0.6;
    cursor: wait;
    pointer-events: none;
  }

  /* Size variants with responsive scaling */
  &.size-sm {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    border-radius: 4px;

    @media ${breakpoints.mobile} {
      min-width: 14px;
      width: 14px;
      min-height: 14px;
      height: 14px;
      border-radius: 3px;
    }
  }

  &.size-lg {
    min-width: 24px;
    width: 24px;
    min-height: 24px;
    height: 24px;
    border-radius: 6px;

    @media ${breakpoints.mobile} {
      min-width: 22px;
      width: 22px;
      min-height: 22px;
      height: 22px;
      border-radius: 5px;
    }
  }

  /* Variant styles */
  &.variant-compact {
    border-radius: 3px;
    
    @media ${breakpoints.mobile} {
      border-radius: 2px;
    }
  }

  &.variant-outlined {
    background-color: transparent;
    border-width: 2px;
    
    &.checked {
      background-color: transparent;
      border-color: ${colors.primary};
    }
  }

  &.variant-elevated {
    box-shadow: 0 2px 4px 0 ${colors.shadow};
    
    &:hover:not(.disabled):not(.loading) {
      box-shadow: 0 4px 6px 0 ${colors.shadow};
    }
  }
`;

export const checkmarkStyles = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${colors.checkmark};
  font-size: 12px;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;
  
  /* Responsive adjustments for mobile */
  @media ${breakpoints.mobile} {
    font-size: 10px;
  }

  /* Responsive adjustments for tablet */
  @media ${breakpoints.tablet} {
    font-size: 11px;
  }

  .checked &,
  .indeterminate & {
    opacity: 1;
  }

  /* Size variants */
  .size-sm & {
    font-size: 10px;
    
    @media ${breakpoints.mobile} {
      font-size: 8px;
    }
  }

  .size-lg & {
    font-size: 14px;
    
    @media ${breakpoints.mobile} {
      font-size: 12px;
    }
  }

  /* Outlined variant uses primary color for checkmark */
  .variant-outlined.checked &,
  .variant-outlined.indeterminate & {
    color: ${colors.primary};
  }
`;

export const hiddenInputStyles = css`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  clip: rect(0 0 0 0);
  overflow: hidden;
  white-space: nowrap;
`;

export const loadingSpinnerStyles = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 10px;
  width: 10px;
  min-height: 10px;
  height: 10px;
  border: 1.5px solid ${colors.border};
  border-top: 1.5px solid ${colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  flex-shrink: 0;

  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }

  /* Responsive adjustments for mobile */
  @media ${breakpoints.mobile} {
    min-width: 8px;
    width: 8px;
    min-height: 8px;
    height: 8px;
    border-width: 1px;
  }

  /* Responsive adjustments for tablet */
  @media ${breakpoints.tablet} {
    min-width: 9px;
    width: 9px;
    min-height: 9px;
    height: 9px;
  }

  .size-sm & {
    min-width: 8px;
    width: 8px;
    min-height: 8px;
    height: 8px;
    border-width: 1px;
    
    @media ${breakpoints.mobile} {
      min-width: 6px;
      width: 6px;
      min-height: 6px;
      height: 6px;
    }
  }

  .size-lg & {
    min-width: 12px;
    width: 12px;
    min-height: 12px;
    height: 12px;
    border-width: 2px;
    
    @media ${breakpoints.mobile} {
      min-width: 10px;
      width: 10px;
      min-height: 10px;
      height: 10px;
    }
  }
`;

export const errorMessageStyles = css`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  font-size: 12px;
  color: ${colors.error};
  line-height: 1.2;
  white-space: nowrap;
  
  /* Responsive adjustments for mobile */
  @media ${breakpoints.mobile} {
    font-size: 11px;
    margin-top: 3px;
  }

  /* Size variants */
  .size-sm & {
    font-size: 11px;
    
    @media ${breakpoints.mobile} {
      font-size: 10px;
    }
  }

  .size-lg & {
    font-size: 13px;
    
    @media ${breakpoints.mobile} {
      font-size: 12px;
    }
  }
`;