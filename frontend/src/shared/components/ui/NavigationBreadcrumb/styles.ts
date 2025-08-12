import { css } from '@emotion/react';

export const breadcrumbContainerStyles = css`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  margin: 0;
  border-radius: 0;
  height: 32px;
  box-sizing: border-box;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  
  &.clickable {
    cursor: pointer;
    
    &:hover {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    &:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    &:active {
      transform: translateY(1px);
    }
  }

  &.variant-compact {
    min-height: 24px;
    gap: 6px;
  }

  &.variant-minimal {
    background-color: transparent;
    min-height: 28px;
  }

  &.size-sm {
    min-height: 28px;
    gap: 6px;
  }

  &.size-lg {
    min-height: 36px;
    gap: 10px;
  }

  &.background-light {
    background-color: #ffffff;
    color: #000000;
  }

  &.background-transparent {
    background-color: transparent;
  }

  /* Responsive breakpoints */
  @media (max-width: 480px) {
    min-height: 28px;
    gap: 6px;
  }
`;

export const arrowContainerStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 32px;
  flex-shrink: 0;
  
  svg {
    width: 20px;
    height: 20px;
    color: #000000;
    transition: transform 0.2s ease;
  }

  .size-sm & {
    width: 16px;
    height: 16px;
    
    svg {
      width: 12px;
      height: 12px;
    }
  }

  .size-lg & {
    width: 24px;
    height: 24px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }

  .clickable:hover & svg {
    transform: translateX(-2px);
  }

  /* Arrow direction transforms */
  &.arrow-right svg {
    transform: rotate(180deg);
  }
  
  &.arrow-up svg {
    transform: rotate(90deg);
  }
  
  &.arrow-down svg {
    transform: rotate(-90deg);
  }

  .clickable:hover &.arrow-right svg {
    transform: rotate(180deg) translateX(-2px);
  }
  
  .clickable:hover &.arrow-up svg {
    transform: rotate(90deg) translateY(-2px);
  }
  
  .clickable:hover &.arrow-down svg {
    transform: rotate(-90deg) translateY(2px);
  }
`;

export const labelStyles = css`
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-size: 14px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  color: #000000;
  text-align: left;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 28px;
  display: flex;
  align-items: center;

  .background-dark & {
    color: #000000;
  }

  .background-light & {
    color: #000000;
  }

  .background-transparent & {
    color: inherit;
  }

  .size-sm & {
    font-size: 12px;
    line-height: 24px;
    font-weight: 600;
  }

  .size-lg & {
    font-size: 16px;
    line-height: 32px;
  }

  .variant-compact & {
    font-size: 13px;
    line-height: 24px;
    font-weight: 600;
  }

  /* Responsive breakpoints */
  @media (max-width: 480px) {
    font-size: 12px;
    line-height: 24px;
    max-width: 200px;
  }

  @media (max-width: 360px) {
    max-width: 160px;
  }
`;

export const subtitleStyles = css`
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: #666666;
  margin: 0;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .background-dark & {
    color: #cccccc;
  }

  .background-light & {
    color: #666666;
  }

  .size-sm & {
    font-size: 10px;
    line-height: 16px;
  }

  .size-lg & {
    font-size: 13px;
    line-height: 22px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    line-height: 18px;
  }
`;

export const loadingStyles = css`
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
  }

  .skeleton-dark {
    background: linear-gradient(90deg, #333333 25%, #555555 50%, #333333 75%);
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .skeleton-arrow {
    width: 20px;
    height: 20px;
  }

  .skeleton-label {
    height: 20px;
    width: 120px;
  }

  .skeleton-subtitle {
    height: 16px;
    width: 80px;
    margin-top: 4px;
  }
`;

export const errorStyles = css`
  color: #ef4444;
  text-align: left;
  font-size: 14px;
  padding: 8px;
  border: 1px solid #fee2e2;
  border-radius: 4px;
  background-color: #fef2f2;
  width: 100%;
  max-width: 300px;
`;