import { css } from '@emotion/react';

export const avatarContainerStyles = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 64px;
  overflow: hidden;
  border: 1px solid transparent;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  box-sizing: border-box;
  flex-shrink: 0;

  &.clickable {
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    &:hover {
      border-color: #d4d4d8;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  /* Size variants */
  &.size-sm {
    width: 24px;
    height: 24px;
  }

  &.size-md {
    width: 32px;
    height: 32px;
  }

  &.size-lg {
    width: 48px;
    height: 48px;
  }

  &.size-xl {
    width: 64px;
    height: 64px;
  }

  /* Shape variants */
  &.variant-circle {
    border-radius: 50%;
  }

  &.variant-rounded {
    border-radius: 8px;
  }

  &.variant-square {
    border-radius: 4px;
  }
`;

export const avatarImageStyles = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: none;
  background-color: #f3f4f6;
`;

export const fallbackStyles = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter, sans-serif;
  font-weight: 500;
  color: #ffffff;
  background-color: #6b7280;
  user-select: none;

  /* Responsive font sizes based on avatar size */
  &.size-sm {
    font-size: 10px;
  }

  &.size-md {
    font-size: 12px;
  }

  &.size-lg {
    font-size: 16px;
  }

  &.size-xl {
    font-size: 20px;
  }
`;

export const badgeStyles = css`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #ef4444;
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border: 2px solid #ffffff;
  box-sizing: border-box;

  /* Position variants */
  &.position-top-right {
    top: -2px;
    right: -2px;
  }

  &.position-bottom-right {
    bottom: -2px;
    right: -2px;
  }

  &.position-top-left {
    top: -2px;
    left: -2px;
  }

  &.position-bottom-left {
    bottom: -2px;
    left: -2px;
  }

  /* Size adjustments for different avatar sizes */
  .size-sm & {
    min-width: 12px;
    height: 12px;
    font-size: 8px;
    border-width: 1px;
  }

  .size-xl & {
    min-width: 20px;
    height: 20px;
    font-size: 12px;
  }
`;

export const loadingStyles = css`
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: inherit;
    width: 100%;
    height: 100%;
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
  color: #ef4444;
  font-size: 12px;
  text-align: center;
  padding: 4px;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: inherit;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;