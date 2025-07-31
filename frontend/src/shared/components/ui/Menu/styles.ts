import styled from '@emotion/styled';
import { theme } from '../../../../styles/theme';

export const MenuContainer = styled.div<{ position?: { top?: number; left?: number; right?: number; bottom?: number } }>`
  position: absolute;
  min-width: 145px;
  max-width: 200px;
  width: max-content;
  background-color: ${theme.colors.backgroundWhite};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xs} 0;
  box-shadow: 
    ${theme.shadows.sm},
    0px 2px 6px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  
  ${props => props.position && `
    ${props.position.top !== undefined ? `top: ${props.position.top}px;` : ''}
    ${props.position.left !== undefined ? `left: ${props.position.left}px;` : ''}
    ${props.position.right !== undefined ? `right: ${props.position.right}px;` : ''}
    ${props.position.bottom !== undefined ? `bottom: ${props.position.bottom}px;` : ''}
  `}
  
  @media (max-width: ${theme.breakpoints.sm}) {
    min-width: 120px;
    max-width: 160px;
  }
`;

export const MenuItem = styled.div<{ isLast?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.lg};
  min-height: ${theme.spacing.xxl};
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  ${props => props.isLast && `
    border-top: 1px solid ${theme.colors.borderPrimary};
  `}
  
  &:hover {
    background-color: ${theme.colors.hover};
  }
  
  &:active {
    background-color: ${theme.colors.active};
  }
  
  &:focus {
    outline: 2px solid ${theme.colors.focus};
    outline-offset: -2px;
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    min-height: 28px;
  }
`;

export const MenuItemText = styled.span`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.regular};
  line-height: ${theme.lineHeights.relaxed};
  letter-spacing: 0.15px;
  color: rgba(${parseInt(theme.colors.textSecondary.slice(1, 3), 16)}, ${parseInt(theme.colors.textSecondary.slice(3, 5), 16)}, ${parseInt(theme.colors.textSecondary.slice(5, 7), 16)}, 0.87);
  text-align: left;
  flex: 1;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
    line-height: ${theme.lineHeights.normal};
  }
`;