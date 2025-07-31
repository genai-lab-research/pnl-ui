import styled from '@emotion/styled';

export const StyledTimeRangeSelector = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  /* Selector container */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: ${props => {
    switch (props.size) {
      case 'small': return '240px';
      case 'large': return '320px';
      default: return '280px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '28px';
      case 'large': return '36px';
      default: return '32px';
    }
  }};
  border-radius: 5px;
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    width: 100%;
    max-width: ${props => {
      switch (props.size) {
        case 'small': return '240px';
        case 'large': return '320px';
        default: return '280px';
      }
    }};
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    height: auto;
  }
`;

export const OptionsContainer = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  /* Options container */
  display: flex;
  width: 100%;
  height: ${props => {
    switch (props.size) {
      case 'small': return '28px';
      case 'large': return '36px';
      default: return '32px';
    }
  }};
  border-radius: 4px;
  
  /* Responsive adjustments */
  @media (max-width: 480px) {
    flex-direction: column;
    height: auto;
    gap: 4px;
  }
`;

export const TimeRangeOption = styled.button<{ 
  isSelected: boolean; 
  size?: 'small' | 'medium' | 'large';
}>`
  /* Option button */
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 70px;
  padding: 8px 16px;
  background-color: transparent;
  border: ${props => props.isSelected ? '1px solid #3545EE' : '1px solid transparent'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  /* Typography */
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '11px';
      case 'large': return '13px';
      default: return '12px';
    }
  }};
  line-height: ${props => {
    switch (props.size) {
      case 'small': return '14px';
      case 'large': return '18px';
      default: return '16px';
    }
  }};
  letter-spacing: 0.5px;
  text-align: center;
  color: ${props => props.isSelected ? '#3545EE' : '#49454F'};
  
  /* Hover state */
  &:hover:not(:disabled) {
    background-color: ${props => props.isSelected ? 'rgba(53, 69, 238, 0.04)' : 'rgba(73, 69, 79, 0.04)'};
    border-color: ${props => props.isSelected ? '#3545EE' : 'rgba(73, 69, 79, 0.12)'};
  }
  
  /* Focus state */
  &:focus-visible {
    outline: 2px solid #3545EE;
    outline-offset: 2px;
  }
  
  /* Active state */
  &:active:not(:disabled) {
    background-color: ${props => props.isSelected ? 'rgba(53, 69, 238, 0.08)' : 'rgba(73, 69, 79, 0.08)'};
    transform: translateY(1px);
  }
  
  /* Disabled state */
  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
    
    &:hover {
      background-color: transparent;
      border-color: ${props => props.isSelected ? '#3545EE' : 'transparent'};
    }
  }
  
  /* First option */
  &:first-of-type {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  
  /* Last option */
  &:last-of-type {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  
  /* Adjacent borders - avoid double borders */
  & + & {
    margin-left: -1px;
  }
  
  /* Selected option should be on top */
  ${props => props.isSelected && `
    position: relative;
    z-index: 1;
  `}
  
  /* Responsive adjustments */
  @media (max-width: 480px) {
    flex: none;
    width: 100%;
    height: ${props => {
      switch (props.size) {
        case 'small': return '36px';
        case 'large': return '44px';
        default: return '40px';
      }
    }};
    margin-left: 0 !important;
    border-radius: 4px !important;
    
    & + & {
      margin-top: 2px;
    }
  }
`;

export const OptionLabel = styled.span`
  /* Option label */
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  color: inherit;
  text-transform: none;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const TimeRangeLoadingSpinner = styled.div`
  width: 12px;
  height: 12px;
  border: 1.5px solid rgba(53, 69, 238, 0.2);
  border-radius: 50%;
  border-top-color: #3545EE;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;