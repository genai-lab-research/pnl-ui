import styled from '@emotion/styled';
import { colors } from '../../../styles';

export const MessageInputContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.background.primary};
  border-radius: 8px;
  padding: 12px 12px 12px 25px;
  gap: 12px;
  box-shadow: ${colors.shadow.panel};
  width: 100%;
  min-height: 64px;
`;

export const StyledInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  color: ${colors.text.subtitle};

  &::placeholder {
    color: ${colors.component.avatarPlaceholder};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 8px;

  &:hover:not(:disabled) {
    background-color: ${colors.opacity.messageShadow};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: ${colors.gradient.primaryButton};
  border-radius: 6px;
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${colors.gradient.primaryButtonHover};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;