import styled from '@emotion/styled';
import { secondary, text } from '../../../styles/colors';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const Button = styled.button<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid ${({ disabled }) =>
    disabled ? 'rgba(76, 78, 100, 0.12)' : 'rgba(109, 120, 141, 0.5)'};
  background: transparent;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  padding: 0;

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
  color: rgba(76, 78, 100, 0.26);
  text-align: left;
`;

export const NextText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.4px;
  color: ${secondary.light};
  text-align: left;
`;

export const PageStatus = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  color: ${text.disabled};
  text-align: left;
`;