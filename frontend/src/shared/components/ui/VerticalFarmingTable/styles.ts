import styled from '@emotion/styled';
import { theme, mediaQueries } from '../../../../styles';

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid ${theme.colors.borderPrimary};
  border-radius: ${theme.borderRadius.md};
  width: 100%;
  overflow-x: auto;
  background: ${theme.colors.backgroundWhite};
  box-shadow: ${theme.shadows.sm};
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 800px;
  background-color: ${theme.colors.backgroundSecondary};
  border-bottom: 1px solid rgba(76, 78, 100, 0.1);
  
  ${mediaQueries.md} {
    min-width: 100%;
  }
`;

export const HeaderCell = styled.div<{ width?: string }>`
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  line-height: ${theme.lineHeights.relaxed};
  letter-spacing: 0.17px;
  color: rgba(76, 78, 100, 0.87);
  text-transform: uppercase;
  text-align: left;
  white-space: nowrap;
  
  flex: ${props => {
    if (props.width === 'icon') return '0 0 60px';
    if (props.width === 'fixed') return '0 0 120px';
    return '1';
  }};
  
  min-width: ${props => {
    if (props.width === 'icon') return '60px';
    if (props.width === 'fixed') return '120px';
    return '140px';
  }};
  
  ${mediaQueries.lg} {
    flex: ${props => {
      if (props.width === 'icon') return '0 0 48px';
      if (props.width === 'fixed') return '0 0 115px';
      return '1';
    }};
    
    min-width: ${props => {
      if (props.width === 'icon') return '48px';
      if (props.width === 'fixed') return '115px';
      return 'auto';
    }};
  }
`;

export const TableRow = styled.div<{ selected?: boolean; clickable?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 800px;
  border-top: 1px solid rgba(76, 78, 100, 0.1);
  transition: background-color 0.2s ease;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  
  &:first-of-type {
    border-top: none;
  }
  
  &:hover {
    background-color: ${props => props.clickable ? theme.colors.hover : 'transparent'};
  }
  
  background-color: ${props => props.selected ? '#f0f4ff' : 'transparent'};
  
  ${mediaQueries.md} {
    min-width: 100%;
  }
`;

export const TableCell = styled.div<{ width?: string }>`
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.regular};
  line-height: ${theme.lineHeights.normal};
  color: ${theme.colors.textPrimary};
  text-align: left;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  flex: ${props => {
    if (props.width === 'icon') return '0 0 60px';
    if (props.width === 'fixed') return '0 0 120px';
    return '1';
  }};
  
  min-width: ${props => {
    if (props.width === 'icon') return '60px';
    if (props.width === 'fixed') return '120px';
    return '140px';
  }};
  
  ${mediaQueries.lg} {
    flex: ${props => {
      if (props.width === 'icon') return '0 0 48px';
      if (props.width === 'fixed') return '0 0 115px';
      return '1';
    }};
    
    min-width: ${props => {
      if (props.width === 'icon') return '48px';
      if (props.width === 'fixed') return '115px';
      return 'auto';
    }};
  }
`;

export const IconCell = styled(TableCell)`
  justify-content: center;
  padding: ${theme.spacing.lg};
`;



