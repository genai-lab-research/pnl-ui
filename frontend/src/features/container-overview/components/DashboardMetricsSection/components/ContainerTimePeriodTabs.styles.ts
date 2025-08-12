/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * Domain-specific styles for Container Overview Time Period Tabs
 * 
 * These styles provide container-overview specific theming on top of
 * the atomic TimePeriodTabs component
 */
export const containerTimePeriodTabsStyles = {
  wrapper: css`
    /* Container Overview specific time period tab styling */
    .container-overview-time-period-tabs {
      /* Custom container metrics theme */
      --primary-color: #3545EE;
      --text-color: #3545EE;
      --muted-text-color: #49454F;
      --border-color: #E5E7EB;
      --hover-bg-color: #F8FAFC;
      
      /* Ensure proper spacing in dashboard metrics section */
      margin: 0;
      
      /* Override default border radius for container overview style */
      .tab-item {
        border-radius: 6px;
        font-weight: 500;
        font-size: 14px;
        padding: 8px 16px;
        
        /* Container overview hover effects */
        &:hover {
          background-color: var(--hover-bg-color);
          transform: none; /* Remove default transform for consistency */
        }
        
        &.selected {
          background-color: #F0F4FF;
          border-color: var(--primary-color);
          color: var(--text-color);
          font-weight: 600;
        }
      }
    }
    
    /* Responsive behavior for container overview */
    @media (max-width: 768px) {
      .container-overview-time-period-tabs {
        .tab-item {
          padding: 6px 12px;
          font-size: 13px;
        }
      }
    }
    
    /* Loading state styling */
    &.loading {
      .container-overview-time-period-tabs {
        opacity: 0.7;
        pointer-events: none;
      }
    }
  `
};
