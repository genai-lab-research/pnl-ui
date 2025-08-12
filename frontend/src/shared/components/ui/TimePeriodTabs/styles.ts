import { css } from '@emotion/react';

// Base container styles
export const containerStyles = css`
  border-radius: 5px;
  border: 1px solid transparent;
  width: 100%;
  max-width: 280px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const tabGroupStyles = css`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 0;
`;

export const tabItemStyles = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  min-height: 32px;
  position: relative;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(53, 69, 238, 0.2);
  }

  &:hover:not(:disabled) {
    background-color: rgba(53, 69, 238, 0.04);
  }

  @media (max-width: 768px) {
    min-height: 28px;
  }
`;

export const tabContentStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 6px 12px;
  }
`;

export const labelStyles = css`
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.5px;
  text-align: center;
  transition: color 0.2s cubic-bezier(0.2, 0, 0, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 11px;
    line-height: 14px;
  }
`;

// Size variants  
export const sizeStyles = {
  sm: css`
    min-height: 24px;
    
    .tab-content {
      padding: 6px 12px;
    }
    
    .tab-label {
      font-size: 11px;
      line-height: 14px;
    }
  `,
  
  lg: css`
    min-height: 40px;
    
    .tab-content {
      padding: 12px 20px;
    }
    
    .tab-label {
      font-size: 14px;
      line-height: 18px;
    }
    
    @media (max-width: 768px) {
      min-height: 36px;
      
      .tab-content {
        padding: 10px 16px;
      }
    }
  `
};

// Variant styles
export const variantStyles = {
  compact: css`
    .tab-item {
      min-height: 24px;
    }
    
    .tab-content {
      padding: 4px 12px;
    }
    
    .tab-label {
      font-size: 11px;
      line-height: 14px;
    }
  `,
  
  outlined: css`
    border-color: #E0E0E0;
    
    .tab-item {
      border-radius: 0;
      
      &:first-of-type {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      
      &:last-of-type {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      
      &.selected {
        background-color: rgba(53, 69, 238, 0.08);
      }
    }
  `
};

// Loading styles
export const loadingStyles = css`
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease-in-out infinite;
    border-radius: 4px;
    height: 16px;
    width: 60%;
  }
  
  @keyframes skeleton-loading {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: -100% 50%;
    }
  }
`;

export const errorStyles = css`
  border-color: #d32f2f;
  
  .tab-label {
    color: #d32f2f;
  }
`;

export const errorMessageStyles = css`
  margin-top: 4px;
  font-size: 12px;
  color: #d32f2f;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 11px;
  }
`;