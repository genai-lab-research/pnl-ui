import styled from '@emotion/styled';
import { colors } from '../../../styles';

export const YieldBlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid ${colors.border.primary};
  border-radius: 6px;
  gap: 16px;
  width: 100%;
  height: 100%;
  min-height: 88px;
`;

export const YieldLabel = styled.div`
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${colors.opacity.textMuted50};
`;

export const ValueContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const IconWrapper = styled.div`
  display: flex;
  width: 28px;
  height: 28px;
  opacity: 0.3;
`;

export const ValueText = styled.div`
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 32px;
  color: ${colors.text.primary};
`;