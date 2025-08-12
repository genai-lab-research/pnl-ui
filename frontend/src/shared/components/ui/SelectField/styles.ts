import { css } from '@emotion/react';

export const selectContainerStyles = css`
  position: relative;
  display: flex;
  width: 100%;
  max-width: 372px;
  min-width: 200px;
  box-sizing: border-box;
  
  /* Responsive adjustments */
  @media (max-width: 480px) {
    min-width: 160px;
    max-width: 100%;
  }
  
  @media (min-width: 768px) and (max-width: 1024px) {
    max-width: 320px;
  }
`;

export const selectStyles = css`
  width: 100%;
  height: 40px;
  background: transparent;
  border: 1px solid rgba(76, 78, 100, 0.22);
  border-radius: 6px;
  padding: 8px 40px 8px 17px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(76, 78, 100, 0.6);
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: all 0.2s ease;
  outline: none;

  &:hover:not(:disabled) {
    border-color: rgba(76, 78, 100, 0.4);
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
    color: #09090b;
  }

  &:disabled {
    background-color: #f5f5f5;
    border-color: rgba(76, 78, 100, 0.12);
    color: rgba(76, 78, 100, 0.38);
    cursor: not-allowed;
  }

  &.has-value {
    color: #09090b;
  }

  &.error {
    border-color: #ef4444;
    color: #ef4444;
  }

  &.size-sm {
    height: 32px;
    padding: 6px 32px 6px 12px;
    font-size: 12px;
    line-height: 20px;
  }

  &.size-lg {
    height: 48px;
    padding: 12px 48px 12px 20px;
    font-size: 16px;
    line-height: 28px;
  }

  @media (max-width: 480px) {
    min-width: 160px;
    font-size: 13px;
    padding: 8px 36px 8px 14px;
    height: 44px; /* Improved touch target on mobile */
  }
  
  @media (hover: none) and (pointer: coarse) {
    /* Touch devices */
    height: 44px;
    font-size: 16px; /* Prevent zoom on iOS */
  }
`;

export const arrowIconStyles = css`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  pointer-events: none;
  color: rgba(76, 78, 100, 0.6);
  transition: color 0.2s ease, transform 0.2s ease;

  &.focused {
    color: #3b82f6;
    transform: translateY(-50%) rotate(180deg);
  }

  &.disabled {
    color: rgba(76, 78, 100, 0.38);
  }

  &.error {
    color: #ef4444;
  }

  &.size-sm {
    width: 20px;
    height: 20px;
    right: 8px;
  }

  &.size-lg {
    width: 28px;
    height: 28px;
    right: 16px;
  }

  @media (max-width: 480px) {
    right: 10px;
    width: 20px;
    height: 20px;
  }
`;

export const errorMessageStyles = css`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  font-size: 12px;
  color: #ef4444;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  line-height: 16px;
`;

export const loadingStyles = css`
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 6px;
    height: 40px;
    width: 100%;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  &.size-sm .skeleton {
    height: 32px;
  }

  &.size-lg .skeleton {
    height: 48px;
  }
`;

export const requiredIndicatorStyles = css`
  color: #ef4444;
  font-size: 14px;
  margin-left: 2px;
`;