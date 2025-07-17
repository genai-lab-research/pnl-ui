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
  opacity: ${(props: { open: boolean }) => props.open ? 1 : 0};
  visibility: ${(props: { open: boolean }) => props.open ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

export const PanelContainer = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  height: 100vh;
  background: ${colors.background.primary};
  box-shadow: -4px 0 16px ${colors.shadow.light};
  z-index: 1001;
  transform: translateX(${(props: { open: boolean }) => props.open ? '0' : '100%'});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${colors.border.primary};
  background: ${colors.background.primary};
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const Title = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 22px;
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
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background: ${colors.background.secondary};
  }
`;

export const FormContainer = styled.div`
  flex: 1;
  padding: 0 24px;
  padding-bottom: 100px;
`;

export const FormSection = styled.div`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: ${colors.text.primary};
  margin: 0 0 16px 0;
`;

export const FormField = styled.div`
  margin-bottom: 16px;
`;

export const FieldLabel = styled.label`
  display: block;
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${colors.secondary.main};
  margin-bottom: 8px;
`;

export const Required = styled.span`
  color: ${colors.status.error};
`;

export const HorizontalGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${FieldLabel} {
    margin-bottom: 0;
  }
`;

export const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const SwitchLabel = styled.span`
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${colors.text.primary};
`;

export const CheckboxRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
`;

export const CheckboxLabel = styled.label`
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${colors.text.primary};
  cursor: pointer;
  line-height: 1.4;
`;

export const EnvironmentPanel = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: ${colors.background.secondary};
  border-radius: 8px;
`;

export const EnvironmentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const EnvironmentLabel = styled.span`
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${colors.text.primary};
`;

export const EnvironmentButtons = styled.div`
  display: flex;
  gap: 0;
`;

export const EnvironmentButton = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid ${colors.secondary.main};
  background: ${(props: { active?: boolean }) => props.active ? colors.secondary.dark : colors.background.primary};
  color: ${(props: { active?: boolean }) => props.active ? colors.background.primary : colors.secondary.main};
  cursor: pointer;
  transition: all 0.2s ease;

  &:first-child {
    border-radius: 6px 0 0 6px;
  }

  &:last-child {
    border-radius: 0 6px 6px 0;
  }

  &:not(:first-child) {
    border-left: none;
  }

  &:hover:not(:disabled) {
    background: ${(props: { active?: boolean }) => props.active ? colors.secondary.light : colors.background.secondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${colors.secondary.main};
    color: ${colors.background.primary};
  }
`;

export const Footer = styled.div`
  position: sticky;
  bottom: 0;
  background: ${colors.background.primary};
  border-top: 1px solid ${colors.border.primary};
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SaveButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 12px 24px;
  background: ${colors.primary.main};
  color: ${colors.background.primary};
  border: none;
  border-radius: 6px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$loading ? 0.7 : 1};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: ${colors.primary.dark};
  }

  &:disabled {
    background: ${colors.interactive.disabled};
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  background: ${colors.background.primary};
  color: ${colors.secondary.main};
  border: 1px solid ${colors.secondary.main};
  border-radius: 6px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.background.secondary};
    border-color: ${colors.text.primary};
    color: ${colors.text.primary};
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const ErrorMessage = styled.div`
  color: ${colors.status.error};
  font-size: 12px;
  margin-top: 4px;
  font-family: 'Inter', 'Roboto', sans-serif;
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

export const ReadOnlyField = styled.div`
  padding: 12px;
  background: ${colors.background.disabled};
  border: 1px solid ${colors.border.primary};
  border-radius: 6px;
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 14px;
  color: ${colors.text.secondary};
  cursor: not-allowed;
`;