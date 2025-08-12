import { css } from '@emotion/react';
import { mediaQuery, colors, sizeConfig } from './utils';

export const containerStyles = css`
  display: inline-flex;
  position: relative;
  border-radius: 0.3125rem; /* 5px */
  box-sizing: border-box;
  overflow: hidden;
  background-color: transparent;
  max-width: 100%;
  min-width: fit-content;
  
  &.full-width {
    width: 100%;
    display: flex;
  }

  &.error {
    border: 1px solid ${colors.error};
    border-radius: 0.3125rem;
  }
  
  /* Enhanced responsive behavior */
  ${mediaQuery('tablet')} {
    min-width: auto;
    max-width: 100%;
  }
  
  ${mediaQuery('mobile')} {
    width: 100%;
    display: flex;
  }
`;

export const segmentGroupStyles = css`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  gap: -1px; /* Negative gap to overlap borders */
`;

export const segmentItemStyles = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${colors.secondaryLight};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
  outline: none;
  white-space: nowrap;
  user-select: none;
  box-sizing: border-box;
  flex: 1;
  min-width: 3rem; /* 48px minimum for touch targets */
  
  /* Remove default border radius */
  border-radius: 0;
  
  /* First segment gets left border radius */
  &:first-child {
    border-top-left-radius: 0.3125rem; /* 5px */
    border-bottom-left-radius: 0.3125rem; /* 5px */
  }
  
  /* Last segment gets right border radius */
  &:last-child {
    border-top-right-radius: 0.3125rem; /* 5px */
    border-bottom-right-radius: 0.3125rem; /* 5px */
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
    pointer-events: none;
  }

  &:focus-visible {
    outline: 0.125rem solid ${colors.focus};
    outline-offset: 0.125rem;
    z-index: 2;
    border-radius: inherit;
  }

  /* Dynamic size variants using configuration */
  &.size-sm {
    padding: ${sizeConfig.sm.padding};
    font-size: ${sizeConfig.sm.fontSize};
    line-height: ${sizeConfig.sm.lineHeight};
    min-height: ${sizeConfig.sm.minHeight};
  }

  &.size-md {
    padding: ${sizeConfig.md.padding};
    font-size: ${sizeConfig.md.fontSize};
    line-height: ${sizeConfig.md.lineHeight};
    min-height: ${sizeConfig.md.minHeight};
    
    ${mediaQuery('mobile')} {
      padding: 0.75rem 0.5rem;
      font-size: 0.8125rem;
      line-height: 1.125rem;
      min-height: 2rem;
    }
  }

  &.size-lg {
    padding: ${sizeConfig.lg.padding};
    font-size: ${sizeConfig.lg.fontSize};
    line-height: ${sizeConfig.lg.lineHeight};
    min-height: ${sizeConfig.lg.minHeight};
    
    ${mediaQuery('tablet')} {
      padding: 0.75rem 0.875rem;
      font-size: 0.9375rem;
      min-height: 2.25rem;
    }
    
    ${mediaQuery('mobile')} {
      padding: 0.625rem 0.75rem;
      font-size: 0.875rem;
      min-height: 2rem;
    }
  }

  /* Selected state - matches Figma Physical segment */
  &.selected {
    background-color: ${colors.primary};
    border-color: ${colors.primaryLight};
    color: ${colors.white};
    font-weight: 500;
    z-index: 1;
    
    /* Ensure selected state is visible on focus */
    &:focus-visible {
      outline-color: ${colors.white};
      outline-offset: -0.125rem;
    }
  }

  /* Unselected state - matches Figma Virtual segment */
  &.unselected {
    background-color: transparent;
    border-color: ${colors.secondaryLight};
    color: ${colors.primary};
    font-weight: 500;
    
    &:hover:not(:disabled) {
      background-color: rgba(69, 81, 104, 0.04);
      border-color: ${colors.primaryLight};
      
      ${mediaQuery('mobile')} {
        background-color: rgba(69, 81, 104, 0.08);
      }
    }
    
    &:active:not(:disabled) {
      background-color: rgba(69, 81, 104, 0.08);
      transform: scale(0.98);
    }
    
    @media (hover: none) {
      &:hover:not(:disabled) {
        background-color: transparent;
        border-color: ${colors.secondaryLight};
      }
    }
  }

  /* Compact variant with responsive adjustments */
  &.variant-compact {
    &.size-md {
      padding: 0.5rem 0.625rem;
      min-height: 1.625rem;
      font-size: 0.8125rem;
      
      ${mediaQuery('mobile')} {
        padding: 0.4375rem 0.5rem;
        min-height: 1.5rem;
      }
    }
  }

  /* Outlined variant with enhanced borders */
  &.variant-outlined {
    border-width: 2px;
    
    &.selected {
      border-color: ${colors.primary};
      box-shadow: 0 0 0 1px ${colors.primary};
    }
    
    &.unselected {
      border-color: ${colors.secondary};
      
      &:hover:not(:disabled) {
        border-color: ${colors.primary};
        box-shadow: 0 0 0 1px ${colors.primary};
      }
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border-width: 2px;
    
    &.selected {
      outline: 2px solid;
      outline-offset: -2px;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

export const segmentContentStyles = css`
  display: flex;
  align-items: center;
  gap: 0.25rem; /* 4px */
  flex-direction: row;
`;

export const labelStyles = css`
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-style: normal;
  letter-spacing: 0.00625rem; /* 0.1px - matches Figma */
  text-align: center;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  word-break: break-word;
  hyphens: auto;
  
  @media (max-width: 30rem) { /* 480px */
    font-size: inherit;
    line-height: inherit;
  }
`;

export const loadingStyles = css`
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 0.25rem; /* 4px */
  }
  
  .skeleton-segment {
    width: 100%;
    height: 1.25rem; /* 20px */
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
  font-size: 0.75rem; /* 12px */
  font-weight: 400;
  margin-top: 0.25rem; /* 4px */
  line-height: 1rem; /* 16px */
  font-family: inherit;
  
  ${mediaQuery('mobile')} {
    font-size: 0.6875rem; /* 11px */
    line-height: 0.875rem; /* 14px */
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    font-weight: 600;
    text-decoration: underline;
  }
`;