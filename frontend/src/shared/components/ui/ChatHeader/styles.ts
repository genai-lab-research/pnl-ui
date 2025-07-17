import styled from '@emotion/styled';
import { colors } from '../../../styles';

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.background.overlay};
  padding: 0 24px;
  height: 63px;
  position: relative;
  width: 100%;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BotIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
    fill: ${colors.text.primary};
  }
`;

export const Title = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: ${colors.text.primary};
  letter-spacing: -0.4px;
  line-height: 32px;
  margin: 0;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const IconButton = styled.button`
  width: 40px;
  height: 40px;
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.opacity.black05};
  }

  &:active {
    background-color: ${colors.opacity.black10};
  }

  svg {
    width: 24px;
    height: 24px;
    fill: ${colors.text.primary};
  }
`;

export const Divider = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: ${colors.interactive.active};
`;