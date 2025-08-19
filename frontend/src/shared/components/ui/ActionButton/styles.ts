import styled from '@emotion/styled';
import { ActionButtonStyleProps } from './types';
import { theme, mediaQueries } from '../../../../styles/theme';

export const StyledActionButton = styled.button<ActionButtonStyleProps>`
  /* Base button styling matching Figma design specification */
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Colors - using theme action colors */
  background-color: ${theme.colors.action};
  color: ${theme.colors.textOnPrimary};
  border: 1px solid transparent;
  opacity: ${props => props.$disabled ? 0.3 : 0.5};
  
  /* Typography - using theme values */
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  line-height: ${theme.lineHeights.normal};
  letter-spacing: 0px;
  text-align: center;
  text-transform: none;
  
  /* Layout - using theme values */
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  outline: none;
  
  /* Size variants using theme values */
  ${props => {
    switch (props.$size) {
      case 'sm':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          min-height: 32px;
          font-size: ${theme.fontSizes.xs};
          gap: ${theme.spacing.xs};
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          min-height: 48px;
          font-size: ${theme.fontSizes.md};
          gap: ${theme.spacing.md};
        `;
      default: // 'md'
        return `
          padding: ${theme.spacing.md} ${theme.spacing.md};
          min-height: 40px;
          font-size: ${theme.fontSizes.sm};
          gap: ${theme.spacing.sm};
        `;
    }
  }}
  
  /* Width handling */
  ${props => props.$fullWidth ? 'width: 100%;' : 'width: auto; min-width: fit-content;'}
  
  /* Variant styles using theme colors */
  ${props => {
    switch (props.$variant) {
      case 'outlined':
        return `
          background-color: transparent;
          border-color: ${theme.colors.action};
          color: ${theme.colors.action};
          opacity: ${props.$disabled ? 0.3 : 1};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.hover};
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          border-color: transparent;
          color: ${theme.colors.action};
          opacity: ${props.$disabled ? 0.3 : 1};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.hover};
          }
        `;
      case 'elevated':
        return `
          box-shadow: ${theme.shadows.md};
          opacity: ${props.$disabled ? 0.3 : 0.8};
          
          &:hover:not(:disabled) {
            box-shadow: ${theme.shadows.table};
            transform: translateY(-1px);
          }
        `;
      default: // 'default'
        return `
          &:hover:not(:disabled) {
            background-color: ${theme.colors.actionHover};
            opacity: 1;
            transform: translateY(-1px);
          }
        `;
    }
  }}
  
  /* Interaction states using theme colors */
  &:active:not(:disabled) {
    background-color: ${theme.colors.actionActive};
    opacity: 1;
    transform: translateY(0);
  }
  
  &:focus-visible {
    outline: 2px solid ${theme.colors.focus};
    outline-offset: 2px;
  }
  
  &:disabled {
    background-color: ${theme.colors.actionDisabled};
    cursor: not-allowed;
    transform: none;
  }
  
  /* Responsive adjustments using theme breakpoints */
  ${mediaQueries.sm} {
    ${props => !props.$fullWidth && `max-width: 320px;`}
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    ${props => !props.$fullWidth && `width: 100%; max-width: 280px;`}
    
    ${props => {
      switch (props.$size) {
        case 'sm':
          return `
            font-size: ${theme.fontSizes.xs};
            padding: ${theme.spacing.xs} ${theme.spacing.sm};
            min-height: 28px;
            gap: ${theme.spacing.xs};
          `;
        case 'lg':
          return `
            font-size: ${theme.fontSizes.sm};
            padding: ${theme.spacing.sm} ${theme.spacing.md};
            min-height: 44px;
            gap: ${theme.spacing.sm};
          `;
        default:
          return `
            font-size: ${theme.fontSizes.xs};
            padding: ${theme.spacing.sm} ${theme.spacing.md};
            min-height: 36px;
            gap: ${theme.spacing.xs};
          `;
      }
    }}
  }
`;

export const IconContainer = styled.div<{ $position: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${theme.spacing.lg};
  height: ${theme.spacing.lg};
  
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    width: ${theme.spacing.md};
    height: ${theme.spacing.md};
  }
`;

export const ButtonText = styled.span`
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  white-space: nowrap;
`;

export const LoadingSpinner = styled.div`
  width: ${theme.spacing.lg};
  height: ${theme.spacing.lg};
  border: 2px solid rgba(250, 250, 250, 0.3);
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    width: ${theme.spacing.md};
    height: ${theme.spacing.md};
  }
`;

export const ErrorText = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.danger};
  line-height: ${theme.lineHeights.tight};
`;
