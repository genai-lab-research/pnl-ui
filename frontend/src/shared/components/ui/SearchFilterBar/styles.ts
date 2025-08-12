import { css } from '@emotion/react';

export const containerStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 233px;
  padding: 16px 24px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid transparent;
  box-shadow: 0px 0px 2px 0px rgba(65, 64, 69, 0.25);
  width: 100%;
  min-height: 72px;
  box-sizing: border-box;

  /* Responsive adjustments */
  @media (max-width: 1200px) {
    gap: 100px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  &.variant-compact {
    padding: 12px 18px;
    min-height: 56px;
  }

  &.variant-outlined {
    border: 2px solid #e4e4e7;
    box-shadow: none;
  }

  &.size-sm {
    padding: 12px 18px;
    min-height: 56px;
    gap: 150px;

    @media (max-width: 1200px) {
      gap: 80px;
    }
  }

  &.size-lg {
    padding: 20px 30px;
    min-height: 88px;
    gap: 300px;

    @media (max-width: 1200px) {
      gap: 120px;
    }
  }
`;

export const leftSectionStyles = css`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }
`;

export const rightSectionStyles = css`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const searchInputStyles = css`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  width: 376px;
  height: 40px;
  background-color: #ffffff;
  border: 1px solid #c1c1c5;
  border-radius: 6px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 280px;
  }

  @media (max-width: 480px) {
    min-width: 240px;
  }

  &:focus-within {
    border-color: #3b82f6;
    outline: 2px solid rgba(59, 130, 246, 0.1);
    outline-offset: -1px;
  }

  &.disabled {
    background-color: #f4f4f5;
    border-color: #e4e4e7;
    opacity: 0.6;
    pointer-events: none;
  }
`;

export const searchIconStyles = css`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.6;
`;

export const searchInputFieldStyles = css`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 16.94px;
  color: #000000;
  
  &::placeholder {
    color: #71717a;
  }

  &:disabled {
    color: #a1a1aa;
  }
`;

export const filtersContainerStyles = css`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const filterChipStyles = css`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 8px;
  height: 40px;
  min-width: 130px;
  background-color: transparent;
  border: 1px solid #cac4d0;
  border-radius: 6px;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:hover {
    border-color: #a1a1aa;
    background-color: rgba(0, 0, 0, 0.02);
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    min-width: 110px;
    padding: 4px 6px;
  }
`;

export const filterChipLabelStyles = css`
  flex: 1;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #49454f;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const filterChipIconStyles = css`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.7;
`;

export const toggleContainerStyles = css`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 38px;
`;

export const toggleLabelStyles = css`
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 16.94px;
  color: #000000;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const toggleSwitchStyles = css`
  position: relative;
  width: 44px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.38);
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &.active {
    background-color: #3b82f6;
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export const toggleKnobStyles = css`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: #fafafa;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 
    0px 1px 3px 0px #4c4e64,
    0px 1px 1px 0px #4c4e64,
    0px 2px 1px -1px #4c4e64;

  &.active {
    transform: translateX(20px);
  }
`;

export const clearButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 24px;
  height: 40px;
  min-width: 125px;
  background-color: rgba(109, 120, 141, 0.11);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: rgba(109, 120, 141, 0.16);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(1px);
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    min-width: 100px;
  }
`;

export const clearButtonLabelStyles = css`
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #000000;
  text-align: center;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const loadingStyles = css`
  opacity: 0.6;
  pointer-events: none;
  
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

  .skeleton-search {
    width: 376px;
    height: 40px;
    border-radius: 6px;
  }

  .skeleton-chip {
    width: 130px;
    height: 40px;
    border-radius: 6px;
  }

  .skeleton-button {
    width: 125px;
    height: 40px;
    border-radius: 6px;
  }
`;