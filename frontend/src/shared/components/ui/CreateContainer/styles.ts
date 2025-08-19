import styled from '@emotion/styled';

export const StyledCreateContainer = styled.button`
  /* Primary button styling matching Figma design */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  /* Dimensions */
  width: 163px;
  height: 40px;
  
  /* Full width variant */
  &.full-width-button {
    width: 100%;
  }
  
  /* Colors */
  background-color: #3545EE;
  color: #FFFFFF;
  border: 1px solid transparent;
  
  /* Typography */
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0px;
  
  /* Layout */
  padding: 10px 12px;
  border-radius: 6px;
  
  /* Cursor and transitions */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  /* Focus and interaction states */
  &:hover:not(:disabled) {
    background-color: #2938d4;
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    background-color: #1e2bb8;
    transform: translateY(0);
  }
  
  &:focus-visible {
    outline: 2px solid #3545EE;
    outline-offset: 2px;
  }
  
  &:disabled {
    background-color: #a8b3cf;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  /* Responsive adjustments */
  @media (max-width: 576px) {
    width: 100%;
    max-width: 163px;
    
    &.full-width-button {
      max-width: 100%;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    padding: 8px 10px;
    height: 36px;
    gap: 6px;
  }
`;

export const PlusIcon = styled.div`
  /* Icon container */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  
  /* Icon SVG styling */
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
  
  /* Responsive adjustments */
  @media (max-width: 480px) {
    width: 14px;
    height: 14px;
  }
`;

export const ButtonText = styled.span`
  /* Text styling */
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  white-space: nowrap;
  
  /* Ensure text doesn't wrap on smaller screens */
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const LoadingSpinner = styled.div`
  /* Loading spinner animation */
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #FFFFFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Responsive adjustments */
  @media (max-width: 480px) {
    width: 14px;
    height: 14px;
  }
`;