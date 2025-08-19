import styled from '@emotion/styled';
import { theme, mediaQueries } from '../../../../styles';
import { CheckboxStyleProps } from './types';
import {
  getCheckboxSizeStyles,
  getCheckboxBackgroundColor,
  getCheckboxBorderColor,
  getCheckboxHoverStyles,
} from './utils';

// CSS-in-JS Error Prevention - using $-prefixed props to avoid emotion/babel-plugin issues
export const CheckboxContainer = styled.div<CheckboxStyleProps>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  position: relative;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `
          font-size: ${theme.fontSizes.sm};
        `;
      case 'lg':
        return `
          font-size: ${theme.fontSizes.lg};
        `;
      default:
        return `
          font-size: ${theme.fontSizes.md};
        `;
    }
  }}
`;

export const CheckboxInput = styled.input<CheckboxStyleProps>`
  position: absolute;
  opacity: 0;
  cursor: inherit;
  width: 100%;
  height: 100%;
  margin: 0;
  z-index: 1;
`;

export const CheckboxBox = styled.div<CheckboxStyleProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease-in-out;
  flex-shrink: 0; /* Prevent shrinking on mobile */
  
  /* Responsive sizing using utility function */
  ${({ $size }) => {
    const sizeStyles = getCheckboxSizeStyles($size);
    return `
      width: ${sizeStyles.box};
      height: ${sizeStyles.box};
      padding: ${sizeStyles.padding};
      
      /* Responsive adjustments for mobile */
      ${mediaQueries.sm} {
        min-width: ${sizeStyles.box};
        min-height: ${sizeStyles.box};
      }
    `;
  }}
  
  /* Background and border using utility functions */
  background-color: ${({ $variant, $checked, $error }) => 
    getCheckboxBackgroundColor($variant, $checked, $error)};
  border: 1px solid ${({ $variant, $checked, $error }) => 
    getCheckboxBorderColor($variant, $checked, $error)};
  
  /* Add shadow for elevated variant */
  ${({ $variant }) => $variant === 'elevated' ? `box-shadow: ${theme.shadows.sm};` : ''}
  
  &:hover {
    ${({ $disabled, $variant, $checked }) => {
      if ($disabled) return '';
      const hoverStyles = getCheckboxHoverStyles($variant, $checked, $disabled);
      return Object.entries(hoverStyles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n');
    }}
  }
  
  &:focus-within {
    outline: 2px solid ${theme.colors.focus};
    outline-offset: 2px;
  }
  
  /* Accessibility: increase touch target on mobile */
  ${mediaQueries.sm} {
    &::before {
      content: '';
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      z-index: -1;
    }
  }
`;

export const CheckboxIcon = styled.div<CheckboxStyleProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${({ $variant, $checked, $error }) => {
    if ($error) return theme.colors.textOnPrimary;
    if ($variant === 'default' && !$checked) return theme.colors.textOnPrimary;
    return $checked ? theme.colors.textOnPrimary : theme.colors.textSecondary;
  }};
  
  svg {
    width: 100%;
    height: 100%;
    transition: all 0.2s ease-in-out;
    
    /* Responsive icon sizing */
    ${({ $size }) => {
      const sizeStyles = getCheckboxSizeStyles($size);
      return `
        min-width: ${sizeStyles.icon};
        min-height: ${sizeStyles.icon};
        max-width: ${sizeStyles.icon};
        max-height: ${sizeStyles.icon};
      `;
    }}
  }
`;

export const CheckboxLabel = styled.label<CheckboxStyleProps>`
  color: ${({ $error, $disabled }) => {
    if ($error) return theme.colors.danger;
    if ($disabled) return theme.colors.textMuted;
    return theme.colors.textPrimary;
  }};
  cursor: inherit;
  user-select: none;
  line-height: ${theme.lineHeights.normal};
`;

export const LoadingSpinner = styled.div<CheckboxStyleProps>`
  /* Responsive sizing using utility function */
  ${({ $size }) => {
    const sizeStyles = getCheckboxSizeStyles($size);
    return `
      width: ${sizeStyles.icon};
      height: ${sizeStyles.icon};
    `;
  }}
  border: 2px solid ${theme.colors.textMuted};
  border-top: 2px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  flex-shrink: 0;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ErrorMessage = styled.div`
  color: ${theme.colors.danger};
  font-size: ${theme.fontSizes.xs};
  margin-top: ${theme.spacing.xs};
  line-height: ${theme.lineHeights.tight};
`;
