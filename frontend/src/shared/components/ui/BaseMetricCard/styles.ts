import { css } from '@emotion/react';

export const cardStyles = css`
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background: #F7F9FD;
  border: 1px solid #E4E4E7;
  border-radius: 6px;
  width: 208px;
  height: 100px;
  gap: 16px;
  flex-shrink: 0;
  position: relative;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  box-sizing: border-box;

  &.transparent {
    background: transparent;
    border: 1px solid #E4E4E7;
    border-radius: 6px;
  }

  &.clickable {
    cursor: pointer;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      border-color: #6b7280;
    }

    &:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  }
`;

export const contentStyles = css`
  flex: 1;
  min-width: 0;
`;

export const titleStyles = css`
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #6b7280;
  margin: 0 0 4px 0;
`;

export const valueContainerStyles = css`
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
`;

export const primaryValueStyles = css`
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: #111827;
  margin: 0;
`;

export const secondaryValueStyles = css`
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #6b7280;
  margin: 0;
`;

export const changeIndicatorStyles = css`
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin: 0 0 0 8px;
  
  &.positive {
    color: #10b981;
  }
  
  &.negative {
    color: #ef4444;
  }
`;

export const iconStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #9ca3af;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const loadingStyles = css`
  .skeleton {
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
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
    height: 16px;
    width: 100px;
    margin-bottom: 8px;
  }

  .skeleton-value {
    height: 28px;
    width: 120px;
  }
`;

export const errorStyles = css`
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  padding: 16px;
`;