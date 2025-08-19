import styled from '@emotion/styled';
import { theme, mediaQueries } from '../../../../styles/theme';

export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  align-items: flex-start;
  width: 100%;
  height: auto;
  min-height: 38px;

  ${mediaQueries.md} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing.xl};
    height: 38px;
  }
`;

export const StatusText = styled.span`
  font-family: ${theme.fonts.primary};
  font-style: normal;
  font-weight: ${theme.fontWeights.regular};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeights.normal};
  letter-spacing: 0px;
  color: ${theme.colors.textMuted};
  text-align: left;
  text-transform: none;
  white-space: nowrap;
`;

export const PaginatorControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.lg};
  height: 38px;
`;

export const NavigationButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px ${theme.spacing.md};
  background: transparent;
  border: 1px solid ${props => props.disabled ? 
    `rgba(76, 78, 100, 0.12)` : 
    `rgba(109, 120, 141, 0.5)`
  };
  border-radius: ${theme.borderRadius.md};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  min-height: 38px;
  gap: ${theme.spacing.sm};

  &:hover {
    background: ${props => props.disabled ? 'transparent' : theme.colors.hover};
  }

  &:active {
    background: ${props => props.disabled ? 'transparent' : theme.colors.active};
  }

  &:focus {
    outline: 2px solid ${theme.colors.focus};
    outline-offset: 2px;
  }
`;

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  flex-direction: row;
`;

export const ButtonText = styled.span<{ disabled?: boolean }>`
  font-family: ${theme.fonts.primary};
  font-style: normal;
  font-weight: ${theme.fontWeights.medium};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeights.relaxed};
  letter-spacing: 0.4px;
  color: ${props => props.disabled ? 'rgba(76, 78, 100, 0.26)' : '#6C778D'};
  text-align: left;
  text-transform: none;
  white-space: nowrap;
`;

export const IconContainer = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: ${props => props.disabled ? 'rgba(76, 78, 100, 0.26)' : '#6C778D'};

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;

export const CenterStatusText = styled(StatusText)`
  display: inline;
`;