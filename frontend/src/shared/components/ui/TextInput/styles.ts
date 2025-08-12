/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { 
  breakpoints, 
  colors, 
  typography, 
  spacing, 
  borderRadius, 
  transitions, 
  shadows 
} from './theme';

export const inputContainerStyles = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0; /* Allows flex shrinking */
  
  /* Responsive max-width */
  max-width: 372px;
  
  @media (max-width: ${breakpoints.mobile}) {
    max-width: 100%;
    min-width: 240px;
  }
`;

export const labelStyles = css`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.md.fontSize};
  font-weight: ${typography.weights.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.gap.xs};
  line-height: 1.2;
  letter-spacing: ${typography.letterSpacing};
  
  /* Responsive font size */
  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${typography.sizes.sm.fontSize};
  }
`;

export const inputWrapperStyles = css`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const inputStyles = css`
  width: 100%;
  min-width: 0; /* Allows text truncation */
  font-family: ${typography.fontFamily};
  font-weight: ${typography.weights.regular};
  letter-spacing: ${typography.letterSpacing};
  color: ${colors.text.primary};
  background-color: ${colors.background.default};
  border: 1px solid ${colors.border.default};
  border-radius: ${borderRadius.default};
  outline: none;
  transition: ${transitions.all};
  
  /* Default size (md) */
  height: ${spacing.md.height};
  padding: ${spacing.md.vertical} ${spacing.md.horizontal};
  font-size: ${typography.sizes.md.fontSize};
  line-height: ${typography.sizes.md.lineHeight};

  &::placeholder {
    color: ${colors.text.placeholder};
    font-style: normal;
  }

  &:focus {
    border-color: ${colors.border.focus};
    box-shadow: ${shadows.focus} ${colors.focus.ring};
  }

  &:hover:not(:disabled):not(:focus) {
    border-color: ${colors.border.hover};
  }

  &:disabled {
    background-color: ${colors.background.disabled};
    color: ${colors.text.disabled};
    cursor: not-allowed;
    
    &::placeholder {
      color: ${colors.text.disabled};
    }
  }

  &.error {
    border-color: ${colors.border.error};
    
    &:focus {
      border-color: ${colors.border.error};
      box-shadow: ${shadows.error} ${colors.focus.errorRing};
    }
  }

  /* Size variants */
  &.size-sm {
    height: ${spacing.sm.height};
    padding: ${spacing.sm.vertical} ${spacing.sm.horizontal};
    font-size: ${typography.sizes.sm.fontSize};
    line-height: ${typography.sizes.sm.lineHeight};
  }

  &.size-lg {
    height: ${spacing.lg.height};
    padding: ${spacing.lg.vertical} ${spacing.lg.horizontal};
    font-size: ${typography.sizes.lg.fontSize};
    line-height: ${typography.sizes.lg.lineHeight};
  }

  /* Variant styles */
  &.variant-outlined {
    background-color: ${colors.background.default};
  }

  &.variant-filled {
    background-color: ${colors.background.filled};
    border: none;
    border-bottom: 2px solid ${colors.border.default};
    border-radius: ${borderRadius.filled.top} ${borderRadius.filled.top} ${borderRadius.filled.bottom} ${borderRadius.filled.bottom};
    
    &:focus {
      background-color: ${colors.background.filledHover};
      border-bottom-color: ${colors.border.focus};
      box-shadow: none;
    }
    
    &:hover:not(:disabled):not(:focus) {
      background-color: ${colors.background.filledHover};
      border-bottom-color: ${colors.border.hover};
    }
  }

  /* Responsive adjustments */
  @media (max-width: ${breakpoints.mobile}) {
    /* Slightly smaller on mobile */
    &.size-md {
      height: ${spacing.sm.height};
      padding: ${spacing.sm.vertical} ${spacing.sm.horizontal};
      font-size: ${typography.sizes.sm.fontSize};
      line-height: ${typography.sizes.sm.lineHeight};
    }
    
    &.size-lg {
      height: ${spacing.md.height};
      padding: ${spacing.md.vertical} ${spacing.md.horizontal};
      font-size: ${typography.sizes.md.fontSize};
      line-height: ${typography.sizes.md.lineHeight};
    }
  }
`;

export const errorMessageStyles = css`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.sm.fontSize};
  font-weight: ${typography.weights.regular};
  color: ${colors.error.text};
  margin-top: ${spacing.gap.xs};
  line-height: 1.2;
  min-height: 16px;
  letter-spacing: ${typography.letterSpacing};
`;

export const helperTextStyles = css`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.sm.fontSize};
  font-weight: ${typography.weights.regular};
  color: ${colors.text.secondary};
  margin-top: ${spacing.gap.xs};
  line-height: 1.2;
  min-height: 16px;
  letter-spacing: ${typography.letterSpacing};
`;

export const loadingStyles = css`
  .skeleton {
    border-radius: ${borderRadius.default};
    background: linear-gradient(
      90deg,
      ${colors.skeleton.base} 25%,
      ${colors.skeleton.highlight} 50%,
      ${colors.skeleton.base} 75%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
    
    /* Default size (md) */
    height: ${spacing.md.height};
  }
  
  &.size-sm .skeleton {
    height: ${spacing.sm.height};
  }
  
  &.size-lg .skeleton {
    height: ${spacing.lg.height};
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  /* Responsive skeleton adjustments */
  @media (max-width: ${breakpoints.mobile}) {
    &.size-md .skeleton {
      height: ${spacing.sm.height};
    }
    
    &.size-lg .skeleton {
      height: ${spacing.md.height};
    }
  }
`;

export const requiredIndicatorStyles = css`
  color: ${colors.required};
  margin-left: 2px;
`;