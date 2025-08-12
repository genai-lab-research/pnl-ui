/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { breakpoints, colors, typography, spacing, borderRadius, transitions, sizes } from './theme';

export const paginationContainerStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  width: 100%;
  max-width: 100%;
  font-family: ${typography.fontFamily};
  box-sizing: border-box;
`;

export const paginationRowStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${spacing.xl};
  min-height: 38px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    gap: ${spacing.md};
    align-items: stretch;
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    gap: ${spacing.sm};
  }
`;

export const pageInfoStyles = css`
  font-size: ${typography.sizes.base};
  font-weight: ${typography.weights.regular};
  line-height: ${typography.lineHeights.base};
  letter-spacing: ${typography.letterSpacing.normal};
  color: ${colors.textPrimary};
  margin: 0;
  white-space: nowrap;
  flex-shrink: 0;
  
  &.hidden {
    visibility: hidden;
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    text-align: center;
    font-size: ${typography.sizes.sm};
  }
`;

export const controlsContainerStyles = css`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: ${breakpoints.tablet}) {
    justify-content: center;
    width: 100%;
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    gap: ${spacing.md};
    
    button {
      width: 100%;
      max-width: 200px;
      justify-content: center;
    }
  }
`;

const baseButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  border-radius: ${borderRadius.button};
  background: transparent;
  cursor: pointer;
  transition: all ${transitions.normal};
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.base};
  font-weight: ${typography.weights.medium};
  line-height: ${typography.lineHeights.lg};
  letter-spacing: ${typography.letterSpacing.wide};
  box-sizing: border-box;
  min-width: 0;
  flex-shrink: 0;
  
  &:hover:not(:disabled) {
    background-color: ${colors.hoverBg};
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    background-color: ${colors.activeBg};
  }
  
  &:focus-visible {
    outline: 2px solid ${colors.focusRing};
    outline-offset: 2px;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
  }
`;

export const buttonStyles = css`
  ${baseButtonStyles}
  padding: ${sizes.button.base.padding};
  gap: ${sizes.button.base.gap};

  /* Size variants */
  &.size-sm {
    padding: ${sizes.button.sm.padding};
    gap: ${sizes.button.sm.gap};
    font-size: ${typography.sizes.sm};
  }
  
  &.size-lg {
    padding: ${sizes.button.lg.padding};
    gap: ${sizes.button.lg.gap};
    font-size: ${typography.sizes.lg};
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    &.size-sm {
      padding: ${sizes.button.base.padding};
      gap: ${sizes.button.base.gap};
    }
  }
`;

export const previousButtonStyles = css`
  color: rgba(76, 78, 100, 0.26);
  border-color: ${colors.borderPrevious};
`;

export const nextButtonStyles = css`
  color: ${colors.textActive};
  border-color: ${colors.borderNext};
`;

export const iconStyles = css`
  width: ${sizes.icon.base};
  height: ${sizes.icon.base};
  flex-shrink: 0;
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  .size-sm & {
    width: ${sizes.icon.sm};
    height: ${sizes.icon.sm};
  }
  
  .size-lg & {
    width: ${sizes.icon.lg};
    height: ${sizes.icon.lg};
  }
`;

export const loadingStyles = css`
  .skeleton {
    background: linear-gradient(90deg, ${colors.skeleton.base} 25%, ${colors.skeleton.highlight} 50%, ${colors.skeleton.base} 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: ${borderRadius.sm};
  }
  
  .skeleton-button {
    width: 80px;
    height: 38px;
    
    @media (max-width: ${breakpoints.mobile}) {
      width: 100%;
      max-width: 200px;
    }
  }
  
  .skeleton-text {
    width: 120px;
    height: 16px;
    
    @media (max-width: ${breakpoints.mobile}) {
      width: 100px;
      height: 14px;
    }
  }
  
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export const errorStyles = css`
  color: ${colors.error};
  font-size: ${typography.sizes.base};
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${colors.errorBg};
  border: 1px solid ${colors.errorBorder};
  border-radius: ${borderRadius.button};
  text-align: center;
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${typography.sizes.sm};
    padding: ${spacing.xs} ${spacing.sm};
  }
`;

// Utilities for preventing overlap and ensuring proper spacing
export const responsiveContainerStyles = css`
  container-type: inline-size;
  
  @container (max-width: 600px) {
    ${controlsContainerStyles} {
      flex-direction: column;
      align-items: stretch;
      
      button {
        width: 100%;
        max-width: none;
      }
    }
  }
`;