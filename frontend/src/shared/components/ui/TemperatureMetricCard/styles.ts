import { css } from '@emotion/react';

export const cardStyles = css`
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  background-color: #f7f9fd;
  padding: 1rem;
  min-width: 160px;
  max-width: 100%;
  width: 100%;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  box-sizing: border-box;

  /* Responsive breakpoints */
  @media (min-width: 360px) {
    width: 208px;
  }

  @media (max-width: 480px) {
    min-width: 140px;
    padding: 0.75rem;
    gap: 0.75rem;
    min-height: 80px;
  }

  &:hover {
    border-color: #d4d4d8;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &.clickable {
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    &:active {
      transform: translateY(1px);
    }
  }

  &.variant-compact {
    padding: 0.75rem;
    min-height: 80px;
    gap: 0.75rem;
  }

  &.variant-outlined {
    border-width: 2px;
  }

  &.variant-elevated {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  }

  &.size-sm {
    min-width: 120px;
    width: 160px;
    min-height: 80px;
    padding: 0.75rem;
    gap: 0.75rem;

    @media (max-width: 480px) {
      min-width: 100px;
      width: 140px;
    }
  }

  &.size-lg {
    min-width: 200px;
    width: 240px;
    min-height: 120px;
    padding: 1.25rem;
    gap: 1.25rem;

    @media (max-width: 480px) {
      min-width: 160px;
      width: 200px;
      padding: 1rem;
    }
  }
`;

export const titleStyles = css`
  font-family: Inter, sans-serif;
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  line-height: 1.25rem; /* 20px */
  letter-spacing: 0;
  color: #09090b;
  text-align: center;
  opacity: 0.5;
  margin: 0;
  word-wrap: break-word;
  hyphens: auto;

  @media (max-width: 480px) {
    font-size: 0.75rem; /* 12px */
    line-height: 1rem; /* 16px */
  }
`;

export const valueContainerStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 360px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

export const temperatureValueStyles = css`
  font-family: Inter, sans-serif;
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  line-height: 2rem; /* 32px */
  letter-spacing: 0;
  color: #000000;
  margin: 0;
  text-align: center;
  word-wrap: break-word;

  @media (max-width: 480px) {
    font-size: 0.75rem; /* 12px */
    line-height: 1.5rem; /* 24px */
  }
`;

export const iconStyles = css`
  width: 1.75rem; /* 28px */
  height: 1.75rem; /* 28px */
  opacity: 0.3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 1.5rem; /* 24px */
    height: 1.5rem; /* 24px */
  }
`;

export const loadingStyles = css`
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .skeleton-title {
    height: 20px;
    width: 100px;
    margin: 0 auto;
  }

  .skeleton-value {
    height: 32px;
    width: 120px;
  }
`;

export const errorStyles = css`
  color: #ef4444;
  text-align: center;
  font-size: 14px;
  padding: 8px;
  border: 1px solid #fee2e2;
  border-radius: 4px;
  background-color: #fef2f2;
`;