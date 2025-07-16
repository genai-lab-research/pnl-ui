import styled from '@emotion/styled';

export const Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${props => props.open ? 'block' : 'none'};
`;

export const PanelContainer = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 420px;
  background: #ffffff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transform: translateX(${props => props.open ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  z-index: 1001;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #333;
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
  color: #333;
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
  color: #333;
  margin-bottom: 8px;
`;

export const Required = styled.span`
  color: #f44336;
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
  color: #333;
`;

export const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
`;

export const CheckboxLabel = styled.span`
  font-size: 14px;
  color: #333;
`;

export const EnvironmentPanel = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
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
  color: #333;
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
  border: 1px solid ${props => props.active ? '#1976d2' : '#e0e0e0'};
  background: ${props => props.active ? '#1976d2' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#1565c0' : '#f5f5f5'};
  }
`;

export const Footer = styled.div`
  padding: 20px 0;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
  margin-top: auto;
`;

export const CreateButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  height: 40px;
  background: #1976d2;
  color: white;
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
    background: #1565c0;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: #f44336;
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