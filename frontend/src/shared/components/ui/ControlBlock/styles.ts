import styled, { css, keyframes } from 'styled-components';
import { theme, mediaQueries } from '../../../../styles/theme';
import { ControlBlockStyleProps } from './types';

// Animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

// Size variants
const sizeVariants = {
  sm: css`
    min-height: 24px;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.fontSizes.xs};
    border-radius: ${theme.borderRadius.sm};
  `,
  md: css`
    min-height: 32px;
    padding: 0;
    font-size: ${theme.fontSizes.sm};
    border-radius: 5px;
    width: 296px;
    max-width: 100%;
  `,
  lg: css`
    min-height: 40px;
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.md};
    border-radius: ${theme.borderRadius.lg};
  `,
};

// Visual variants
const visualVariants = {
  default: css`
    background-color: #000000;
    color: #000000;
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.8);
    }
    
    &:active:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.9);
    }
  `,
  compact: css`
    background-color: #000000;
    color: #000000;
    border: 1px solid transparent;
    padding: ${theme.spacing.xs};
  `,
  outlined: css`
    background-color: transparent;
    color: #000000;
    border: 1px solid ${theme.colors.borderPrimary};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.hover};
      border-color: ${theme.colors.borderSecondary};
    }
  `,
  elevated: css`
    background-color: #000000;
    color: #000000;
    border: 1px solid transparent;
    box-shadow: ${theme.shadows.md};
    
    &:hover:not(:disabled) {
      box-shadow: ${theme.shadows.table};
    }
  `,
};

export const StyledControlBlock = styled.button<ControlBlockStyleProps>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  font-family: ${theme.fonts.secondary}; // Roboto
  font-weight: ${theme.fontWeights.bold}; // 700
  line-height: 28px;
  letter-spacing: 0px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  animation: ${fadeIn} 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
  
  // Apply size variant
  ${({ $size }) => sizeVariants[$size]}
  
  // Apply visual variant
  ${({ $variant }) => visualVariants[$variant]}
  
  // Disabled state
  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    `}
  
  // Loading state
  ${({ $loading }) =>
    $loading &&
    css`
      cursor: wait;
      pointer-events: none;
    `}
  
  // Focus state
  &:focus-visible {
    outline: 2px solid ${theme.colors.focus};
    outline-offset: 2px;
  }
  
  // Responsive design
  ${mediaQueries.sm} {
    ${({ $size }) => $size === 'md' && css`
      width: auto;
      min-width: 200px;
    `}
  }
  
  ${mediaQueries.md} {
    ${({ $size }) => $size === 'md' && css`
      width: 296px;
    `}
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;

export const LabelText = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #000000;
`;

export const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const ErrorText = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  color: ${theme.colors.danger};
  font-size: ${theme.fontSizes.xs};
  margin-top: ${theme.spacing.xs};
  padding: ${theme.spacing.xs};
  background-color: ${theme.colors.backgroundWhite};
  border: 1px solid ${theme.colors.danger};
  border-radius: ${theme.borderRadius.sm};
  z-index: 10;
`;

export const FooterContainer = styled.div`
  margin-top: ${theme.spacing.xs};
  padding-top: ${theme.spacing.xs};
  border-top: 1px solid ${theme.colors.borderPrimary};
`;
