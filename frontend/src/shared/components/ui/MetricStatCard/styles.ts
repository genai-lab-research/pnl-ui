import styled from 'styled-components';
import { theme, mediaQueries } from '../../../../styles/theme';
import { MetricStatCardProps } from './types';

interface StyledContainerProps {
  variant: MetricStatCardProps['variant'];
  size: MetricStatCardProps['size'];
  disabled: boolean;
  clickable: boolean;
}

export const StyledContainer = styled.div<StyledContainerProps>`
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: ${theme.colors.backgroundWhite};
  border: 1px solid ${theme.colors.borderPrimary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  gap: ${theme.spacing.lg};
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  transition: all 0.2s ease;
  
  /* Base dimensions - responsive */
  width: 100%;
  min-width: 180px;
  max-width: 240px;
  height: auto;
  min-height: 100px;
  
  /* Size variants */
  ${props => props.size === 'sm' && `
    padding: ${theme.spacing.md};
    gap: ${theme.spacing.md};
    min-height: 80px;
    min-width: 160px;
    max-width: 200px;
  `}
  
  ${props => props.size === 'lg' && `
    padding: ${theme.spacing.xl};
    gap: ${theme.spacing.xl};
    min-height: 120px;
    min-width: 200px;
    max-width: 280px;
  `}
  
  /* Variant styles */
  ${props => props.variant === 'outlined' && `
    border: 2px solid ${theme.colors.borderSecondary};
    background-color: transparent;
  `}
  
  ${props => props.variant === 'elevated' && `
    box-shadow: ${theme.shadows.md};
    border: none;
  `}
  
  ${props => props.variant === 'compact' && `
    padding: ${theme.spacing.md};
    gap: ${theme.spacing.sm};
    min-height: 70px;
  `}
  
  /* Interactive states */
  ${props => props.clickable && `
    &:hover {
      background-color: ${theme.colors.hover};
      border-color: ${theme.colors.borderSecondary};
    }
    
    &:active {
      background-color: ${theme.colors.active};
    }
    
    &:focus {
      outline: 2px solid ${theme.colors.focus};
      outline-offset: 2px;
    }
  `}
  
  /* Responsive adjustments */
  ${mediaQueries.sm} {
    min-width: 200px;
  }
  
  ${mediaQueries.md} {
    min-width: 208px;
  }
`;

export const StyledTitleText = styled.div<{ size: MetricStatCardProps['size'] }>`
  font-family: ${theme.fonts.primary};
  font-weight: ${theme.fontWeights.medium};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeights.normal};
  color: ${theme.colors.textPrimary};
  opacity: 0.5;
  text-align: left;
  margin: 0;
  
  ${props => props.size === 'sm' && `
    font-size: ${theme.fontSizes.xs};
    line-height: ${theme.lineHeights.tight};
  `}
  
  ${props => props.size === 'lg' && `
    font-size: ${theme.fontSizes.md};
    line-height: ${theme.lineHeights.relaxed};
  `}
`;

export const StyledValueContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  flex: 1;
`;

export const StyledIconContainer = styled.div<{ size: MetricStatCardProps['size']; opacity?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  opacity: ${props => props.opacity || 0.3};
  flex-shrink: 0;
  
  ${props => props.size === 'sm' && `
    width: 24px;
    height: 24px;
  `}
  
  ${props => props.size === 'lg' && `
    width: 32px;
    height: 32px;
  `}
  
  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

export const StyledValueText = styled.div<{ size: MetricStatCardProps['size'] }>`
  font-family: ${theme.fonts.primary};
  font-weight: ${theme.fontWeights.medium};
  font-size: ${theme.fontSizes.sm};
  line-height: 32px;
  color: ${theme.colors.textPrimary};
  text-align: left;
  margin: 0;
  flex: 1;
  
  ${props => props.size === 'sm' && `
    font-size: ${theme.fontSizes.xs};
    line-height: 28px;
  `}
  
  ${props => props.size === 'lg' && `
    font-size: ${theme.fontSizes.md};
    line-height: 36px;
  `}
`;

export const LoadingContainer = styled(StyledContainer)`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.danger}08;
  border: 1px solid ${theme.colors.danger}20;
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.danger};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
`;

export const FooterContainer = styled.div`
  margin-top: auto;
  padding-top: ${theme.spacing.sm};
  border-top: 1px solid ${theme.colors.borderPrimary};
`;
