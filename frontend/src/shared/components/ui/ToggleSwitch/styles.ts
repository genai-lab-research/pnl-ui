import styled, { css } from 'styled-components';

const switchSizes = {
  small: {
    width: '44px',
    height: '24px',
    knobSize: '20px',
    padding: '2px',
    translateX: '20px',
  },
  medium: {
    width: '58px',
    height: '38px',
    knobSize: '30px',
    padding: '4px',
    translateX: '24px',
  },
  large: {
    width: '68px',
    height: '44px',
    knobSize: '36px',
    padding: '4px',
    translateX: '28px',
  },
};

const variantColors = {
  default: '#4C4E64',
  primary: '#1976d2',
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',
};

export const SwitchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SwitchTrack = styled.div<{
  $checked?: boolean;
  $disabled?: boolean;
  $size?: 'small' | 'medium' | 'large';
  $variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  $error?: boolean;
  $focused?: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: ${({ $size = 'medium' }) => switchSizes[$size].width};
  height: ${({ $size = 'medium' }) => switchSizes[$size].height};
  padding: ${({ $size = 'medium' }) => switchSizes[$size].padding};
  background-color: ${({ $checked, $variant = 'default', $error, $disabled }) => {
    if ($disabled) return 'rgba(0, 0, 0, 0.12)';
    if ($error) return $checked ? '#f44336' : 'rgba(244, 67, 54, 0.38)';
    return $checked ? variantColors[$variant] : 'rgba(0, 0, 0, 0.38)';
  }};
  border-radius: 50px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease-in-out;
  
  &:hover:not([aria-disabled="true"]) {
    background-color: ${({ $checked, $variant = 'default', $error }) => {
      if ($error) return $checked ? '#d32f2f' : 'rgba(244, 67, 54, 0.5)';
      return $checked ? 
        `${variantColors[$variant]}dd` : 
        'rgba(0, 0, 0, 0.5)';
    }};
  }
  
  ${({ $focused }) => $focused && css`
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  `}
  
  ${({ $disabled }) => $disabled && css`
    opacity: 0.6;
  `}
`;

export const SwitchKnob = styled.div<{
  $checked?: boolean;
  $disabled?: boolean;
  $size?: 'small' | 'medium' | 'large';
  $pressed?: boolean;
}>`
  position: relative;
  width: ${({ $size = 'medium' }) => switchSizes[$size].knobSize};
  height: ${({ $size = 'medium' }) => switchSizes[$size].knobSize};
  background-color: ${({ $disabled }) => $disabled ? 'rgba(255, 255, 255, 0.8)' : '#FAFAFA'};
  border-radius: 50%;
  box-shadow: 
    0 1px 3px rgba(76, 78, 100, 0.3),
    0 1px 1px rgba(76, 78, 100, 0.3),
    0 2px 1px -1px rgba(76, 78, 100, 0.3);
  transform: translateX(${({ $checked, $size = 'medium' }) => 
    $checked ? switchSizes[$size].translateX : '0'
  }) ${({ $pressed }) => $pressed ? 'scale(1.1)' : 'scale(1)'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${({ $disabled }) => !$disabled && css`
    &:hover {
      box-shadow: 
        0 2px 4px rgba(76, 78, 100, 0.4),
        0 2px 2px rgba(76, 78, 100, 0.4),
        0 3px 2px -1px rgba(76, 78, 100, 0.4);
    }
  `}
`;

export const SwitchInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  
  &:focus + div {
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
`;

export const SwitchIcon = styled.div<{ $size?: 'small' | 'medium' | 'large' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size = 'medium' }) => {
    switch ($size) {
      case 'small': return '12px';
      case 'large': return '20px';
      default: return '16px';
    }
  }};
  height: ${({ $size = 'medium' }) => {
    switch ($size) {
      case 'small': return '12px';
      case 'large': return '20px';
      default: return '16px';
    }
  }};
  color: rgba(76, 78, 100, 0.7);
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const Label = styled.label<{ 
  $required?: boolean; 
  $disabled?: boolean;
  $error?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ $disabled, $error }) => {
    if ($disabled) return 'rgba(0, 0, 0, 0.38)';
    if ($error) return '#f44336';
    return 'rgba(0, 0, 0, 0.87)';
  }};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  user-select: none;
  
  ${({ $required }) => $required && css`
    &::after {
      content: ' *';
      color: #f44336;
    }
  `}
`;

export const HelperText = styled.div<{ $error?: boolean }>`
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${({ $error }) => $error ? '#f44336' : 'rgba(0, 0, 0, 0.6)'};
  margin-top: 4px;
`;

export const LoadingSpinner = styled.div<{ $size?: 'small' | 'medium' | 'large' }>`
  width: ${({ $size = 'medium' }) => {
    switch ($size) {
      case 'small': return '12px';
      case 'large': return '20px';
      default: return '16px';
    }
  }};
  height: ${({ $size = 'medium' }) => {
    switch ($size) {
      case 'small': return '12px';
      case 'large': return '20px';
      default: return '16px';
    }
  }};
  border: 2px solid rgba(76, 78, 100, 0.2);
  border-top: 2px solid rgba(76, 78, 100, 0.6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
