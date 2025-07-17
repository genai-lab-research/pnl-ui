import styled from '@emotion/styled';
import { colors } from '../../../styles';

export const MenuContainer = styled.div`
  background-color: ${colors.background.primary};
  border-radius: 8px;
  padding: 8px 0;
  min-width: 160px;
  box-shadow:
    0px 1px 2px 0px ${colors.text.primary},
    0px 2px 6px 2px ${colors.text.primary};
  z-index: 1000;
`;

export const MenuItem = styled.div<{
  disabled?: boolean;
  destructive?: boolean;
  hasTopBorder?: boolean;
}>`
  padding: 8px 16px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  border-top: ${props => props.hasTopBorder ? `1px solid ${colors.border.tertiary}` : 'none'};

  &:hover {
    background-color: ${colors.opacity.white88};
  }
`;

export const MenuItemIcon = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const MenuItemText = styled.span<{ destructive?: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${props => props.destructive ? colors.status.error : colors.opacity.secondary87};
`;