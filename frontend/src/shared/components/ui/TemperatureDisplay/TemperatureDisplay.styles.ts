import styled from '@emotion/styled';
import { colors } from '../../../styles';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 5px;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid ${colors.border.primary};
  background-color: ${colors.background.panel};
  gap: 16px;
  height: 100%;
  min-height: 88px;
`;

export const Title = styled.div`
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${colors.opacity.textMuted50};
`;

export const ReadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const IconWrapper = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
`;

export const TemperatureText = styled.div`
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 32px;
  color: ${colors.text.primary};
`;