/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * Domain-specific styles for Container Overview Action Buttons
 * 
 * These styles provide container-overview specific theming on top of
 * the atomic ActionButton component
 */
export const containerActionButtonStyles = {
  wrapper: css`
    /* Container Overview specific action button styling */
    .container-overview-action-btn {
      /* Custom container action theme */
      --primary-color: #3545EE;
      --secondary-color: #6B7280;
      --border-radius: 6px;
      --font-weight: 500;
      
      /* Container-specific button sizing */
      min-width: 120px;
      padding: 8px 16px;
      
      /* Action-specific styling */
      &.container-overview-action-btn--edit {
        background-color: transparent;
        border: 1px solid #E5E7EB;
        color: #374151;
        
        &:hover {
          background-color: #F9FAFB;
          border-color: #D1D5DB;
        }
      }
      
      &.container-overview-action-btn--save {
        background-color: var(--primary-color);
        border: 1px solid var(--primary-color);
        color: white;
        
        &:hover {
          background-color: #2937CC;
          border-color: #2937CC;
        }
        
        &:disabled {
          background-color: #9CA3AF;
          border-color: #9CA3AF;
          cursor: not-allowed;
        }
      }
      
      &.container-overview-action-btn--cancel {
        background-color: transparent;
        border: 1px solid #DC2626;
        color: #DC2626;
        
        &:hover {
          background-color: #FEF2F2;
          border-color: #B91C1C;
          color: #B91C1C;
        }
      }
    }
    
    /* Loading state styling */
    .container-overview-action-btn[aria-busy="true"] {
      opacity: 0.8;
      cursor: wait;
    }
    
    /* Responsive adjustments for container overview */
    @media (max-width: 768px) {
      .container-overview-action-btn {
        min-width: 100px;
        padding: 6px 12px;
        font-size: 14px;
      }
    }
    
    /* Focus states for accessibility */
    .container-overview-action-btn:focus {
      outline: 2px solid #3545EE;
      outline-offset: 2px;
    }
  `
};
