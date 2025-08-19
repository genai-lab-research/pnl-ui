import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from '../../../../styles/theme';
import { TabBarStyleProps, TabIndicatorProps } from './types';

export const StyledTabBar = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  position: relative;
  background-color: transparent;
  border-radius: 5px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'fit-content')};
  overflow: visible;
`;

export const StyledTab = styled.button<TabBarStyleProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  
  /* Typography - matching Figma specs */
  font-family: ${theme.fonts?.secondary || 'Roboto, sans-serif'};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  text-align: center;
  
  /* Default size and spacing */
  padding: 14px 16px;
  height: 40px;
  min-width: fit-content;
  
  /* Full width behavior */
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      flex: 1;
    `}

  /* Selected state colors - matching Figma */
  ${({ $isSelected }) =>
    $isSelected
      ? css`
          color: ${theme.colors?.action || '#3545EE'};
          /* Selected tabs have slightly less padding on sides in Figma */
          padding: 14px 12px;
        `
      : css`
          color: #49454F;
        `}

  /* Disabled state */
  ${({ $isDisabled }) =>
    $isDisabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
      pointer-events: none;
    `}

  /* Hover state for unselected tabs */
  ${({ $isSelected, $isDisabled }) =>
    !$isSelected &&
    !$isDisabled &&
    css`
      &:hover {
        color: #3545EE;
        background-color: rgba(53, 69, 238, 0.04);
      }
    `}

  /* Size variants */
  ${({ $size }) =>
    $size === 'sm' &&
    css`
      font-size: 12px;
      line-height: 16px;
      padding: 10px 12px;
      height: 32px;
    `}

  ${({ $size }) =>
    $size === 'lg' &&
    css`
      font-size: 16px;
      line-height: 24px;
      padding: 16px 20px;
      height: 48px;
    `}

  /* Visual variants */
  ${({ $variant }) =>
    $variant === 'outlined' &&
    css`
      border: 1px solid ${theme.colors?.borderPrimary || '#E9EDF4'};
      border-radius: ${theme.borderRadius?.sm || '4px'};
      margin: 0 2px;
      
      &:first-child {
        margin-left: 0;
      }
      
      &:last-child {
        margin-right: 0;
      }
    `}

  ${({ $variant }) =>
    $variant === 'elevated' &&
    css`
      box-shadow: ${theme.shadows?.sm || '0 1px 3px 0 rgba(76, 78, 100, 0.1)'};
      border-radius: ${theme.borderRadius?.sm || '4px'};
      margin: 0 2px;
      background-color: ${theme.colors?.backgroundWhite || '#ffffff'};
      
      &:first-child {
        margin-left: 0;
      }
      
      &:last-child {
        margin-right: 0;
      }
    `}

  ${({ $variant }) =>
    $variant === 'compact' &&
    css`
      padding: 8px 12px;
      height: 32px;
      font-size: 13px;
    `}

  /* Focus states */
  &:focus-visible {
    outline: 2px solid ${theme.colors?.focus || '#4CAF50'};
    outline-offset: 2px;
    border-radius: 2px;
  }

  /* Active state */
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

export const TabContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  z-index: 2;
`;

export const TabBadge = styled.span`
  background-color: ${theme.colors?.danger || '#f44336'};
  color: white;
  border-radius: 50%;
  min-width: 16px;
  height: 16px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  margin-left: 4px;
`;

export const TabIndicator = styled.div<TabIndicatorProps>`
  position: absolute;
  bottom: 0;
  height: 2px;
  background-color: ${theme.colors?.action || '#3545EE'};
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  
  /* Dynamic positioning and width based on selected tab */
  ${({ $selectedIndex, $tabCount, $fullWidth }) => {
    if ($fullWidth) {
      const width = 100 / $tabCount;
      const left = ($selectedIndex * 100) / $tabCount;
      return css`
        width: ${width}%;
        left: ${left}%;
      `;
    } else {
      // For non-full-width, we'll calculate based on tab positioning in JavaScript
      return css`
        width: 0;
        left: 0;
      `;
    }
  }}
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  height: 40px;
  min-width: 100px;
`;

export const ErrorMessage = styled.div`
  color: ${theme.colors?.danger || '#f44336'};
  font-size: 12px;
  margin-top: 4px;
  font-family: ${theme.fonts?.secondary || 'Roboto, sans-serif'};
`;
