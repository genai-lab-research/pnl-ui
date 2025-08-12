/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

// Theme-based values for consistency
const colors = {
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  track: 'rgba(0, 0, 0, 0.38)',
  trackHover: 'rgba(0, 0, 0, 0.45)',
  knob: '#fafafa',
  shadow: 'rgba(76, 78, 100, 1)',
  focus: '#3b82f6',
  white: '#ffffff',
} as const;

// Responsive breakpoints
const breakpoints = {
  mobile: '(max-width: 480px)',
  tablet: '(min-width: 481px) and (max-width: 768px)',
  desktop: '(min-width: 769px)',
} as const;

export const toggleSwitchStyles = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 10px;
  background-color: ${colors.track};
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  box-sizing: border-box;
  flex-shrink: 0;
  
  /* Default size (md) - responsive scaling */
  min-width: 60px;
  width: 60px;
  min-height: 38px;
  height: 38px;
  padding: 12px;

  /* Responsive adjustments for mobile */
  @media ${breakpoints.mobile} {
    min-width: 52px;
    width: 52px;
    min-height: 32px;
    height: 32px;
    padding: 10px;
    border-radius: 8px;
  }

  /* Responsive adjustments for tablet */
  @media ${breakpoints.tablet} {
    min-width: 56px;
    width: 56px;
    min-height: 35px;
    height: 35px;
    padding: 11px;
    border-radius: 9px;
  }

  &:hover:not(.disabled):not(.loading) {
    background-color: ${colors.trackHover};
  }

  &:focus-visible {
    outline: 2px solid ${colors.focus};
    outline-offset: 2px;
    border-radius: 10px;
  }

  &.checked {
    background-color: ${colors.primary};
    
    &:hover:not(.disabled):not(.loading) {
      background-color: ${colors.primaryHover};
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  &.loading {
    opacity: 0.6;
    cursor: wait;
    pointer-events: none;
  }

  /* Size variants with responsive scaling */
  &.size-sm {
    min-width: 44px;
    width: 44px;
    min-height: 26px;
    height: 26px;
    padding: 8px;
    border-radius: 8px;

    @media ${breakpoints.mobile} {
      min-width: 38px;
      width: 38px;
      min-height: 22px;
      height: 22px;
      padding: 6px;
      border-radius: 7px;
    }
  }

  &.size-lg {
    min-width: 76px;
    width: 76px;
    min-height: 46px;
    height: 46px;
    padding: 14px;
    border-radius: 12px;

    @media ${breakpoints.mobile} {
      min-width: 68px;
      width: 68px;
      min-height: 40px;
      height: 40px;
      padding: 12px;
      border-radius: 10px;
    }
  }

  /* Variant styles */
  &.variant-compact {
    padding: 8px;
    
    @media ${breakpoints.mobile} {
      padding: 6px;
    }
  }

  &.variant-small {
    min-width: 44px;
    width: 44px;
    min-height: 26px;
    height: 26px;
    padding: 6px;
    border-radius: 8px;

    @media ${breakpoints.mobile} {
      min-width: 38px;
      width: 38px;
      min-height: 22px;
      height: 22px;
      padding: 5px;
      border-radius: 7px;
    }
  }
`;

export const knobStyles = css`
  position: relative;
  background-color: ${colors.knob};
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;
  
  /* Default size (md) - responsive scaling */
  min-width: 20px;
  width: 20px;
  min-height: 20px;
  height: 20px;
  transform: translateX(0);

  /* Multiple shadow effects to match Figma design */
  box-shadow: 
    0 1px 3px 0 ${colors.shadow},
    0 1px 1px 0 ${colors.shadow},
    0 2px 1px -1px ${colors.shadow};

  /* Responsive adjustments for mobile */
  @media ${breakpoints.mobile} {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
  }

  /* Responsive adjustments for tablet */
  @media ${breakpoints.tablet} {
    min-width: 18px;
    width: 18px;
    min-height: 18px;
    height: 18px;
  }

  .checked & {
    transform: translateX(22px);
    
    @media ${breakpoints.mobile} {
      transform: translateX(20px);
    }
    
    @media ${breakpoints.tablet} {
      transform: translateX(21px);
    }
  }

  /* Size variants with responsive scaling */
  .size-sm & {
    min-width: 14px;
    width: 14px;
    min-height: 14px;
    height: 14px;

    @media ${breakpoints.mobile} {
      min-width: 12px;
      width: 12px;
      min-height: 12px;
      height: 12px;
    }
  }

  .size-sm.checked & {
    transform: translateX(18px);
    
    @media ${breakpoints.mobile} {
      transform: translateX(14px);
    }
  }

  .size-lg & {
    min-width: 24px;
    width: 24px;
    min-height: 24px;
    height: 24px;

    @media ${breakpoints.mobile} {
      min-width: 20px;
      width: 20px;
      min-height: 20px;
      height: 20px;
    }
  }

  .size-lg.checked & {
    transform: translateX(30px);
    
    @media ${breakpoints.mobile} {
      transform: translateX(26px);
    }
  }

  /* Variant adjustments */
  .variant-small & {
    min-width: 14px;
    width: 14px;
    min-height: 14px;
    height: 14px;

    @media ${breakpoints.mobile} {
      min-width: 12px;
      width: 12px;
      min-height: 12px;
      height: 12px;
    }
  }

  .variant-small.checked & {
    transform: translateX(18px);
    
    @media ${breakpoints.mobile} {
      transform: translateX(14px);
    }
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
  min-width: 12px;
  width: 12px;
  min-height: 12px;
  height: 12px;
  border: 2px solid ${colors.white};
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  flex-shrink: 0;

  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }

  /* Responsive adjustments for mobile */
  @media ${breakpoints.mobile} {
    min-width: 10px;
    width: 10px;
    min-height: 10px;
    height: 10px;
    border-width: 1.5px;
  }

  /* Responsive adjustments for tablet */
  @media ${breakpoints.tablet} {
    min-width: 11px;
    width: 11px;
    min-height: 11px;
    height: 11px;
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
      border-width: 1px;
    }
  }

  .size-lg & {
    min-width: 16px;
    width: 16px;
    min-height: 16px;
    height: 16px;
    border-width: 3px;
    
    @media ${breakpoints.mobile} {
      min-width: 14px;
      width: 14px;
      min-height: 14px;
      height: 14px;
      border-width: 2px;
    }
  }
`;