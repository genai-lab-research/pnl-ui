import styled from '@emotion/styled';
import { colors } from '../../shared/styles';

export const Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${colors.opacity.black50};
  z-index: 1000;
  display: ${props => props.open ? 'block' : 'none'};
`;

export const PanelContainer = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 420px;
  background: ${colors.background.primary};
  box-shadow: -2px 0 8px ${colors.shadow.light};
  transform: translateX(${props => props.open ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  z-index: 1001;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${colors.border.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${colors.text.secondary};
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover {
    color: ${colors.text.primary};
  }
`;

export const FormContainer = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

export const FormSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 16px 0;
`;

export const FormField = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FieldLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${colors.text.primary};
  margin-bottom: 8px;
`;

export const Required = styled.span`
  color: ${colors.status.error};
  margin-left: 2px;
`;

export const HorizontalGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
`;

export const SwitchLabel = styled.span`
  font-size: 14px;
  color: ${colors.text.primary};
`;

export const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
`;

export const CheckboxLabel = styled.span`
  font-size: 14px;
  color: ${colors.text.primary};
`;

export const EnvironmentPanel = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: ${colors.background.secondary};
  border-radius: 8px;
  border: 1px solid ${colors.border.primary};
`;

export const EnvironmentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const EnvironmentLabel = styled.span`
  font-size: 14px;
  color: ${colors.text.primary};
  font-weight: 500;
`;

export const EnvironmentButtons = styled.div`
  display: flex;
  gap: 4px;
`;

export const EnvironmentButton = styled.button<{ active: boolean; disabled?: boolean }>`
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${props => props.active ? colors.status.info : colors.border.primary};
  background: ${props => props.active ? colors.status.info : colors.background.primary};
  color: ${props => props.active ? colors.background.primary : colors.text.primary};
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover:not(:disabled) {
    background: ${props => props.active ? colors.primary.dark : colors.background.secondary};
  }
`;

export const Footer = styled.div`
  padding: 20px 0;
  border-top: 1px solid ${colors.border.primary};
  flex-shrink: 0;
  margin-top: auto;
`;

export const CreateButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  height: 40px;
  background: ${colors.status.info};
  color: ${colors.background.primary};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$loading ? 0.7 : 1};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: ${colors.primary.dark};
  }

  &:disabled {
    background: ${colors.interactive.disabled};
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: ${colors.status.error};
  font-size: 12px;
  margin-top: 4px;
`;

export const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;