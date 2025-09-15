import styled from '@emotion/styled';
import { theme, mediaQueries } from '../../../../styles';
import { CellAlignment, DataTableRowStatusVariant } from './types';

export const RowContainer = styled.div<{
  clickable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'bordered' | 'elevated';
}>`
  display: flex;
  width: 100%;
  min-height: 44px;
  background-color: ${theme.colors.backgroundWhite};
  border: 1px solid ${props => props.variant === 'bordered' 
    ? `rgba(76, 78, 100, 0.1)` 
    : 'transparent'
  };
  border-radius: ${props => props.variant === 'elevated' ? theme.borderRadius.sm : '0px'};
  box-shadow: ${props => props.variant === 'elevated' ? theme.shadows.sm : 'none'};
  transition: all 0.2s ease-in-out;
  
  ${props => props.clickable && `
    cursor: pointer;
    
    &:hover {
      background-color: ${theme.colors.hover};
      border-color: ${theme.colors.borderSecondary};
    }
    
    &:active {
      background-color: ${theme.colors.active};
    }
  `}
  
  ${props => props.selected && `
    background-color: ${theme.colors.focus}20;
    border-color: ${theme.colors.focus};
  `}
  
  ${props => props.disabled && `
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  `}
  
  ${mediaQueries.sm} {
    flex-wrap: nowrap;
  }
`;

export const Cell = styled.div<{
  alignment?: CellAlignment;
  width?: number;
  flex?: boolean;
  size?: 'sm' | 'md' | 'lg';
}>`
  display: flex;
  align-items: center;
  justify-content: ${props => {
    switch (props.alignment) {
      case 'center': return 'center';
      case 'right': return 'flex-end';
      default: return 'flex-start';
    }
  }};
  
  ${props => props.width ? `
    min-width: ${props.width}px;
    max-width: ${props.width}px;
    flex: 0 0 ${props.width}px;
  ` : props.flex ? `
    flex: 1;
    min-width: 0;
  ` : `
    flex: 0 0 auto;
  `}
  
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${theme.spacing.sm} ${theme.spacing.md}`;
      case 'lg': return `${theme.spacing.xl} ${theme.spacing.md}`;
      default: return `${theme.spacing.lg} ${theme.spacing.md}`;
    }
  }};
  
  ${mediaQueries.sm} {
    padding: ${props => {
      switch (props.size) {
        case 'sm': return `${theme.spacing.xs} ${theme.spacing.md}`;
        case 'lg': return `${theme.spacing.lg} ${theme.spacing.md}`;
        default: return `${theme.spacing.md} ${theme.spacing.md}`;
      }
    }};
  }
`;

export const CellText = styled.span<{
  fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
}>`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeights.normal};
  color: ${theme.colors.textPrimary};
  font-weight: ${props => {
    switch (props.fontWeight) {
      case 'medium': return theme.fontWeights.medium;
      case 'semibold': return theme.fontWeights.semibold;
      case 'bold': return theme.fontWeights.bold;
      default: return theme.fontWeights.regular;
    }
  }};
  
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StatusChip = styled.div<{ variant: DataTableRowStatusVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.pill};
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  line-height: ${theme.lineHeights.tight};
  text-align: center;
  white-space: nowrap;
  
  background-color: ${props => {
    switch (props.variant) {
      case 'active':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.danger;
      case 'pending':
        return theme.colors.info;
      case 'inactive':
        return theme.colors.inactive;
      default:
        return theme.colors.created;
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'active':
      case 'warning':
      case 'error':
      case 'pending':
      case 'inactive':
        return theme.colors.textOnPrimary;
      default:
        return theme.colors.textOnSecondary;
    }
  }};
`;

export const LoadingCell = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  flex: 1;
  min-width: 0;
`;

export const LoadingSkeleton = styled.div<{ width?: string }>`
  height: 16px;
  width: ${props => props.width || '100%'};
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: ${theme.borderRadius.sm};
  
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  flex: 1;
  color: ${theme.colors.danger};
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  font-style: italic;
`;
