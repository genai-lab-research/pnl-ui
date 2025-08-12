import { css } from '@emotion/react';

export const containerStyles = css`
  display: flex;
  position: relative;
  border-radius: 6px;
  box-sizing: border-box;
  min-height: 2.5rem; /* 40px */
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }

  /* Responsive breakpoints */
  @media (max-width: 48rem) { /* 768px */
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
  }

  @media (max-width: 30rem) { /* 480px */
    min-height: 2.25rem; /* 36px */
  }
`;

export const tabGroupStyles = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  min-width: fit-content;
  background-color: transparent;
  gap: 0;
`;

export const tabItemStyles = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
  outline: none;
  white-space: nowrap;
  user-select: none;
  box-sizing: border-box;
  scroll-snap-align: center;
  flex-shrink: 0;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &:focus-visible {
    outline: 0.125rem solid #3545EE; /* 2px */
    outline-offset: 0.125rem; /* 2px */
  }

  /* Size variants with rem units for better scaling */
  &.size-sm {
    padding: 0.5rem 0.75rem; /* 8px 12px */
    font-size: 0.8125rem; /* 13px */
    line-height: 1rem; /* 16px */
    min-height: 2rem; /* 32px */
  }

  &.size-md {
    padding: 0.875rem 0.75rem; /* 14px 12px */
    font-size: 0.875rem; /* 14px */
    line-height: 1.25rem; /* 20px */
    min-height: 2.5rem; /* 40px */
    
    @media (max-width: 30rem) { /* 480px */
      padding: 0.75rem 0.5rem; /* 12px 8px */
      font-size: 0.8125rem; /* 13px */
      line-height: 1.125rem; /* 18px */
      min-height: 2.25rem; /* 36px */
    }
  }

  &.size-lg {
    padding: 1rem 1rem; /* 16px 16px */
    font-size: 1rem; /* 16px */
    line-height: 1.5rem; /* 24px */
    min-height: 3rem; /* 48px */
  }

  /* Full width support */
  &.full-width {
    flex: 1;
  }

  /* Active state */
  &.active {
    color: #3545EE;
    font-weight: 500;
  }

  /* Inactive state */
  &.inactive {
    color: #49454F;
    font-weight: 500;
    
    &:hover:not(:disabled) {
      background-color: rgba(53, 69, 238, 0.04);
      color: #3545EE;
    }
    
    @media (hover: none) {
      &:hover:not(:disabled) {
        background-color: transparent;
        color: #49454F;
      }
    }
  }
`;

export const tabContentStyles = css`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-direction: row;
`;

export const labelStyles = css`
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-style: normal;
  letter-spacing: 0.00625rem; /* 0.1px */
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

export const badgeStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  background-color: #dc2626;
  color: white;
  border-radius: 8px;
  line-height: 1;
`;

export const indicatorStyles = css`
  position: absolute;
  width: 100%;
  height: 0.125rem; /* 2px */
  background-color: #3545EE;
  border-radius: 0.0625rem; /* 1px */
  transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
  will-change: transform, width;
  
  &.position-bottom {
    bottom: 0;
    left: 0;
  }
  
  &.position-top {
    top: 0;
    left: 0;
  }
`;

export const loadingStyles = css`
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
  }
  
  .skeleton-tab {
    width: 80px;
    height: 20px;
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

export const variantStyles = {
  pill: css`
    ${tabItemStyles}
    border-radius: 20px;
    margin: 0 2px;
    
    &.active {
      background-color: #3545EE;
      color: white;
    }
    
    &.inactive:hover:not(:disabled) {
      background-color: rgba(53, 69, 238, 0.08);
    }
  `,
  compact: css`
    ${tabItemStyles}
    
    &.size-md {
      padding: 8px 12px;
      min-height: 32px;
    }
  `,
};