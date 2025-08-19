import styled, { css } from 'styled-components';

export const SelectContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 372px;
`;

export const SelectWrapper = styled.div<{ 
  $disabled?: boolean; 
  $error?: boolean; 
  $size?: 'small' | 'medium' | 'large';
  $variant?: 'outlined' | 'filled';
}>`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${({ $variant }) => $variant === 'filled' ? '#f5f5f5' : 'transparent'};
  border: 1px solid;
  border-color: ${({ $error }) => $error ? '#f44336' : 'rgba(76, 78, 100, 0.22)'};
  border-radius: 6px;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease-in-out;
  
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return css`
          height: 32px;
          padding: 0 8px;
        `;
      case 'large':
        return css`
          height: 48px;
          padding: 0 16px;
        `;
      default:
        return css`
          height: 40px;
          padding: 0 12px;
        `;
    }
  }}
  
  &:hover:not([aria-disabled="true"]) {
    border-color: ${({ $error }) => $error ? '#f44336' : 'rgba(76, 78, 100, 0.4)'};
  }
  
  &:focus-within {
    border-color: ${({ $error }) => $error ? '#f44336' : '#1976d2'};
    box-shadow: 0 0 0 2px ${({ $error }) => $error ? 'rgba(244, 67, 54, 0.2)' : 'rgba(25, 118, 210, 0.2)'};
  }
  
  ${({ $disabled }) => $disabled && css`
    background-color: rgba(0, 0, 0, 0.04);
    border-color: rgba(0, 0, 0, 0.12);
    color: rgba(0, 0, 0, 0.38);
  `}
`;

export const SelectInput = styled.div<{ $hasValue?: boolean; $disabled?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: ${({ $hasValue, $disabled }) => {
    if ($disabled) return 'rgba(0, 0, 0, 0.38)';
    return $hasValue ? 'rgba(0, 0, 0, 0.87)' : 'rgba(76, 78, 100, 0.6)';
  }};
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SelectIcon = styled.div<{ $isOpen?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: 8px;
  color: ${({ $disabled }) => $disabled ? 'rgba(0, 0, 0, 0.38)' : 'rgba(76, 78, 100, 0.6)'};
  transition: transform 0.2s ease-in-out;
  
  ${({ $isOpen }) => $isOpen && css`
    transform: rotate(180deg);
  `}
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

export const Dropdown = styled.div<{ $isOpen?: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border: 1px solid rgba(76, 78, 100, 0.22);
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transform: ${({ $isOpen }) => $isOpen ? 'translateY(4px)' : 'translateY(0)'};
  transition: all 0.2s ease-in-out;
`;

export const DropdownOption = styled.div<{ 
  $selected?: boolean; 
  $focused?: boolean; 
  $disabled?: boolean; 
}>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  color: ${({ $disabled, $selected }) => {
    if ($disabled) return 'rgba(0, 0, 0, 0.38)';
    if ($selected) return '#1976d2';
    return 'rgba(0, 0, 0, 0.87)';
  }};
  background-color: ${({ $focused, $selected }) => {
    if ($focused) return 'rgba(25, 118, 210, 0.08)';
    if ($selected) return 'rgba(25, 118, 210, 0.04)';
    return 'transparent';
  }};
  
  &:hover:not([aria-disabled="true"]) {
    background-color: rgba(25, 118, 210, 0.08);
  }
  
  ${({ $disabled }) => $disabled && css`
    pointer-events: none;
  `}
`;

export const Label = styled.label<{ $required?: boolean; $disabled?: boolean }>`
  display: block;
  margin-bottom: 4px;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ $disabled }) => $disabled ? 'rgba(0, 0, 0, 0.38)' : 'rgba(0, 0, 0, 0.6)'};
  
  ${({ $required }) => $required && css`
    &::after {
      content: ' *';
      color: #f44336;
    }
  `}
`;

export const HelperText = styled.div<{ $error?: boolean }>`
  margin-top: 4px;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${({ $error }) => $error ? '#f44336' : 'rgba(0, 0, 0, 0.6)'};
`;

export const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(76, 78, 100, 0.2);
  border-top: 2px solid rgba(76, 78, 100, 0.6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
