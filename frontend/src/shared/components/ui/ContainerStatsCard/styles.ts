import { css } from '@emotion/react';

export const cardStyles = css`
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  background-color: #ffffff;
  padding: 1rem;
  width: 100%;
  max-width: 668px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  box-sizing: border-box;

  /* Responsive breakpoints */
  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.75rem;
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
    gap: 0.75rem;
  }

  &.variant-outlined {
    border-width: 2px;
  }

  &.variant-elevated {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  }

  &.size-sm {
    max-width: 480px;
    padding: 0.75rem;
    gap: 0.75rem;
  }

  &.size-lg {
    max-width: 800px;
    padding: 1.25rem;
    gap: 1.25rem;
  }
`;

export const headerStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const titleStyles = css`
  font-family: Roboto, sans-serif;
  font-size: 1rem; /* 16px */
  font-weight: 700;
  line-height: 1.5rem; /* 24px */
  letter-spacing: 0.15px;
  color: #000000;
  margin: 0;
  flex: 1;
`;

export const badgeStyles = css`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Roboto, sans-serif;
  font-size: 1.48rem; /* 23.625px */
  font-weight: 500;
  line-height: 2rem; /* 32px */
  color: #0f1729;
  flex-shrink: 0;
`;

export const chartsContainerStyles = css`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const chartStyles = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const chartHeaderStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const chartTitleStyles = css`
  font-family: Roboto, sans-serif;
  font-size: 0.75rem; /* 12px */
  font-weight: 500;
  line-height: 1.25rem; /* 20px */
  color: #000000;
  text-transform: uppercase;
  margin: 0;
`;

export const metricsContainerStyles = css`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

export const metricStyles = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const metricLabelStyles = css`
  font-family: Roboto, sans-serif;
  font-size: 0.625rem; /* 10px */
  font-weight: 400;
  line-height: 1.25rem; /* 20px */
  color: rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  margin: 0;
`;

export const metricValueStyles = css`
  font-family: Roboto, sans-serif;
  font-size: 0.625rem; /* 10px */
  font-weight: 500;
  line-height: 1.25rem; /* 20px */
  color: #000000;
  text-transform: uppercase;
  margin: 0;
`;

export const chartContentStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
`;

export const chartGridStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  pointer-events: none;
`;

export const gridLineStyles = css`
  width: 100%;
  height: 1px;
  background-color: #dedede;
  position: absolute;
`;

export const barsContainerStyles = css`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  height: clamp(60px, 10vh, 80px);
  padding: 0.5rem;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    gap: 0.75rem;
    height: 60px;
  }

  @media (min-width: 1024px) {
    gap: 1.75rem;
    height: 90px;
  }
`;

export const barStyles = css`
  width: clamp(8px, 1.5vw, 12px);
  min-height: 6px;
  border-radius: 2px;
  position: relative;
  transition: all 0.2s ease;

  @media (max-width: 480px) {
    width: 8px;
    min-height: 4px;
  }

  @media (min-width: 1024px) {
    width: 14px;
    min-height: 8px;
  }

  &.active {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 6px solid #000000;
      
      @media (max-width: 480px) {
        border-left-width: 3px;
        border-right-width: 3px;
        border-top-width: 4px;
        top: -6px;
      }
    }
  }
`;

export const labelsContainerStyles = css`
  display: flex;
  justify-content: center;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  padding: 0.5rem;

  @media (max-width: 480px) {
    gap: 0.75rem;
    padding: 0.25rem;
  }

  @media (min-width: 1024px) {
    gap: 1.75rem;
  }
`;

export const labelStyles = css`
  font-family: Roboto, sans-serif;
  font-size: 0.625rem; /* 10px */
  font-weight: 400;
  line-height: 0.875rem; /* 14px */
  letter-spacing: 0.4px;
  color: rgba(76, 78, 100, 0.6);
  text-align: center;
  margin: 0;
  width: 12px;
  
  @media (max-width: 480px) {
    width: 8px;
    font-size: 0.5rem;
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
    height: 24px;
    width: 150px;
  }

  .skeleton-badge {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .skeleton-chart {
    height: 120px;
    width: 100%;
  }
`;

export const errorStyles = css`
  color: #ef4444;
  text-align: center;
  font-size: 14px;
  padding: 1rem;
  border: 1px solid #fee2e2;
  border-radius: 4px;
  background-color: #fef2f2;
`;