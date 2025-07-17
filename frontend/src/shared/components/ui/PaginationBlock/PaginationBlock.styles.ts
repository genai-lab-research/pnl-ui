import styled from '@emotion/styled';
import { colors } from '../../../styles';

export const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 38px;
  border-radius: 5px;
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 38px;
  gap: 24px;
`;

export const LeftLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  color: ${colors.text.disabled};
  text-align: left;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const CenterLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  color: ${colors.text.disabled};
  text-align: left;
`;

export const Button = styled.button<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid ${({ disabled }) =>
    disabled ? colors.opacity.secondary12 : colors.opacity.inputDisabled50};
  background: transparent;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  padding: 0;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};

  &:focus {
    outline: none;
  }
`;

export const ButtonContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
`;

export const PreviousText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.4px;
  color: ${colors.opacity.secondary26};
  text-align: left;
`;

export const NextText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.4px;
  color: ${colors.secondary.light};
  text-align: left;
`;