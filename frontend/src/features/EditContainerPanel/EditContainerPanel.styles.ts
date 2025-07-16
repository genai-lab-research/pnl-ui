import styled from '@emotion/styled';

export const Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
  background: #FFFFFF;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
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
  border-bottom: 1px solid #E0E0E0;
  background: #FFFFFF;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const Title = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background: #F0F0F0;
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
  color: #000000;
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
  color: #4C4E64;
  margin-bottom: 8px;
`;

export const Required = styled.span`
  color: #FF4444;
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
  color: #000000;
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
  color: #000000;
  cursor: pointer;
  line-height: 1.4;
`;

export const EnvironmentPanel = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #F8F9FA;
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
  color: #000000;
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
  border: 1px solid #4C4E64;
  background: ${(props: { active?: boolean }) => props.active ? '#455168' : '#FFFFFF'};
  color: ${(props: { active?: boolean }) => props.active ? '#FFFFFF' : '#4C4E64'};
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
    background: ${(props: { active?: boolean }) => props.active ? '#556080' : '#F0F0F0'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #4C4E64;
    color: #FFFFFF;
  }
`;

export const Footer = styled.div`
  position: sticky;
  bottom: 0;
  background: #FFFFFF;
  border-top: 1px solid #E0E0E0;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SaveButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 12px 24px;
  background: #656CFF;
  color: #FFFFFF;
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
    background: #5A61E6;
  }

  &:disabled {
    background: #B0B0B0;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  background: #FFFFFF;
  color: #4C4E64;
  border: 1px solid #4C4E64;
  border-radius: 6px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #F8F9FA;
    border-color: #333;
    color: #333;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const ErrorMessage = styled.div`
  color: #FF4444;
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
  background: #F5F5F5;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 14px;
  color: #666;
  cursor: not-allowed;
`;