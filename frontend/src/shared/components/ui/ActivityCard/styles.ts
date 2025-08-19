import styled from 'styled-components';
import { theme, mediaQueries } from '../../../../styles/theme';
import { ActivityCardProps } from './types';

interface StyledContainerProps {
  $variant: ActivityCardProps['variant'];
  $size: ActivityCardProps['size'];
  $disabled: boolean;
  $clickable: boolean;
}

export const StyledContainer = styled.div<StyledContainerProps>`
  display: flex;
  align-items: center;
  position: relative;
  background-color: ${theme.colors.backgroundWhite};
  border: 1px solid ${({ $variant }) => 
    $variant === 'outlined' ? theme.colors.borderSecondary : 'rgba(69, 81, 104, 0.1)'};
  border-radius: 5px;
  padding: 12px;
  gap: 16px;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  opacity: ${props => props.$disabled ? 0.6 : 1};
  pointer-events: ${props => props.$disabled ? 'none' : 'auto'};
  transition: all 0.2s ease;
  
  /* Base dimensions - responsive */
  width: 100%;
  min-width: 320px;
  max-width: 100%;
  min-height: 64px;
  
  /* Size variants */
  ${props => props.$size === 'sm' && `
    padding: 8px 12px;
    gap: 12px;
    min-height: 48px;
    min-width: 280px;
  `}
  
  ${props => props.$size === 'lg' && `
    padding: 16px;
    gap: 20px;
    min-height: 80px;
    min-width: 360px;
  `}
  
  /* Variant styles */
  ${props => props.$variant === 'outlined' && `
    border: 1px solid ${theme.colors.borderSecondary};
    background-color: transparent;
  `}
  
  ${props => props.$variant === 'elevated' && `
    box-shadow: ${theme.shadows.sm};
    border: none;
  `}
  
  ${props => props.$variant === 'compact' && `
    padding: 8px 12px;
    gap: 12px;
    min-height: 48px;
  `}
  
  /* Interactive states */
  ${props => props.$clickable && `
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
    min-width: 340px;
  }
  
  ${mediaQueries.md} {
    min-width: 360px;
  }
`;

export const StyledAvatar = styled.div<{
  $backgroundColor?: string;
  $size: ActivityCardProps['size'];
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${props => props.$backgroundColor || '#489F68'};
  border-radius: 30px;
  flex-shrink: 0;
  
  ${props => props.$size === 'sm' && `
    width: 24px;
    height: 24px;
  `}
  
  ${props => props.$size === 'lg' && `
    width: 40px;
    height: 40px;
  `}
  
  svg {
    width: 60%;
    height: 60%;
    color: white;
    display: block;
  }
`;

export const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0; /* Allow text truncation */
`;

export const StyledTitle = styled.div<{ $size: ActivityCardProps['size'] }>`
  font-family: ${theme.fonts.primary};
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${theme.colors.textPrimary};
  text-align: left;
  margin: 0;
  word-wrap: break-word;
  
  ${props => props.$size === 'sm' && `
    font-size: 12px;
    line-height: 16px;
  `}
  
  ${props => props.$size === 'lg' && `
    font-size: 16px;
    line-height: 24px;
  `}
`;

export const StyledMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

export const StyledTimestampContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const StyledTimestampIcon = styled.div<{ $size: ActivityCardProps['size'] }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  
  ${props => props.$size === 'sm' && `
    width: 14px;
    height: 14px;
  `}
  
  ${props => props.$size === 'lg' && `
    width: 18px;
    height: 18px;
  `}
  
  svg {
    width: 100%;
    height: 100%;
    color: #71717A;
    display: block;
  }
`;

export const StyledMetaText = styled.span<{ $size: ActivityCardProps['size'] }>`
  font-family: ${theme.fonts.primary};
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #71717A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  ${props => props.$size === 'sm' && `
    font-size: 11px;
    line-height: 14px;
  `}
  
  ${props => props.$size === 'lg' && `
    font-size: 13px;
    line-height: 18px;
  `}
`;

export const LoadingContainer = styled(StyledContainer)`
  align-items: center;
  gap: 16px;
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 64px;
  padding: 12px;
  background-color: ${theme.colors.danger}08;
  border: 1px solid ${theme.colors.danger}20;
  border-radius: 5px;
  color: ${theme.colors.danger};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
`;

export const FooterContainer = styled.div`
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid ${theme.colors.borderPrimary};
`;
