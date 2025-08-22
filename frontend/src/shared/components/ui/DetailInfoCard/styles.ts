import styled from 'styled-components';
import { theme, mediaQueries } from '../../../../styles/theme';
import { StyledContainerProps, StyledTextProps, StatusBadgeStyledProps } from './types';

export const StyledContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'disabled', 'clickable'].includes(prop),
})<StyledContainerProps>`
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: ${theme.colors.backgroundWhite};
  border: 1px solid #E4E4E7;
  border-radius: 8px;
  padding: 24px;
  gap: 24px;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  transition: all 0.2s ease;
  
  /* Base dimensions - responsive */
  width: 100%;
  max-width: 437px;
  height: auto;
  
  /* Size variants */
  ${props => props.size === 'sm' && `
    padding: 16px;
    gap: 16px;
    max-width: 300px;
  `}
  
  ${props => props.size === 'lg' && `
    padding: 32px;
    gap: 32px;
    max-width: 500px;
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
    padding: 16px;
    gap: 12px;
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
    max-width: 400px;
  }
  
  ${mediaQueries.md} {
    max-width: 437px;
  }
`;

export const StyledHeader = styled.div<StyledTextProps>`
  font-family: ${theme.fonts.secondary}; /* Roboto */
  font-style: normal;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: #000000;
  text-align: left;
  margin: 0;
  
  ${props => props.size === 'sm' && `
    font-size: 14px;
    line-height: 20px;
  `}
  
  ${props => props.size === 'lg' && `
    font-size: 18px;
    line-height: 28px;
  `}
`;

export const StyledDataGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  
  ${mediaQueries.sm} {
    gap: 32px;
  }
`;

export const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledLabelColumn = styled(StyledColumn)`
  flex: 0 0 auto;
  min-width: 120px;
`;

export const StyledValueColumn = styled(StyledColumn)`
  flex: 1;
  min-width: 0;
`;

export const StyledDataLabel = styled.div<StyledTextProps>`
  font-family: ${theme.fonts.secondary}; /* Roboto */
  font-style: normal;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0px;
  color: #09090B;
  text-align: left;
  margin: 0;
  
  ${props => props.size === 'sm' && `
    font-size: 12px;
    line-height: 16px;
  `}
  
  ${props => props.size === 'lg' && `
    font-size: 16px;
    line-height: 24px;
  `}
`;

export const StyledDataValue = styled.div<StyledTextProps>`
  font-family: ${theme.fonts.primary}; /* Inter */
  font-style: normal;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0px;
  color: #09090B;
  text-align: left;
  margin: 0;
  word-wrap: break-word;
  
  ${props => props.size === 'sm' && `
    font-size: 12px;
    line-height: 16px;
  `}
  
  ${props => props.size === 'lg' && `
    font-size: 16px;
    line-height: 24px;
  `}
`;

export const StyledValueWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledIconContainer = styled.div<StyledTextProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  
  ${props => props.size === 'sm' && `
    width: 14px;
    height: 14px;
  `}
  
  ${props => props.size === 'lg' && `
    width: 18px;
    height: 18px;
  `}
  
  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

export const StyledStatusBadge = styled.div<StatusBadgeStyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-family: ${theme.fonts.primary}; /* Inter */
  font-style: normal;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0px;
  text-align: center;
  width: fit-content;
  max-width: 120px;
  
  ${props => props.size === 'sm' && `
    padding: 3px 10px;
    font-size: 10px;
    line-height: 14px;
    max-width: 100px;
  `}
  
  ${props => props.size === 'lg' && `
    padding: 5px 16px;
    font-size: 12px;
    line-height: 18px;
    max-width: 140px;
  `}
  
  /* Status variants - matching VerticalFarmingTable colors */
  ${props => {
    switch (props.variant) {
      case 'active':
        return `
          background-color: #479F67;
          color: #FAFAFA;
        `;
      case 'success':
        return `
          background-color: #479F67;
          color: #FAFAFA;
        `;
      case 'warning':
        return `
          background-color: #F97316;
          color: #FAFAFA;
        `;
      case 'error':
        return `
          background-color: #f44336;
          color: #FAFAFA;
        `;
      case 'inactive':
        return `
          background-color: #6B7280;
          color: #FAFAFA;
        `;
      case 'created':
        return `
          background-color: #E5E7EB;
          color: #18181B;
        `;
      default:
        return `
          background-color: #479F67;
          color: #FAFAFA;
        `;
    }
  }}
`;

export const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledSectionHeader = styled.div<StyledTextProps>`
  font-family: ${theme.fonts.secondary}; /* Roboto */
  font-style: normal;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: #000000;
  text-align: left;
  margin: 0;
  
  ${props => props.size === 'sm' && `
    font-size: 14px;
    line-height: 20px;
  `}
  
  ${props => props.size === 'lg' && `
    font-size: 18px;
    line-height: 28px;
  `}
`;

export const StyledSectionContent = styled.div<StyledTextProps>`
  font-family: ${theme.fonts.primary}; /* Inter */
  font-style: normal;
  font-size: 14px;
  font-weight: 400;
  line-height: 16.94px;
  letter-spacing: 0px;
  color: #000000;
  text-align: left;
  margin: 0;
  word-wrap: break-word;
  
  ${props => props.size === 'sm' && `
    font-size: 12px;
    line-height: 14px;
  `}
  
  ${props => props.size === 'lg' && `
    font-size: 16px;
    line-height: 20px;
  `}
`;

export const LoadingContainer = styled(StyledContainer)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  padding: 16px;
  background-color: ${theme.colors.danger}08;
  border: 1px solid ${theme.colors.danger}20;
  border-radius: 8px;
  color: ${theme.colors.danger};
  font-size: 14px;
  text-align: center;
`;

export const FooterContainer = styled.div`
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #E4E4E7;
`;
