import { css } from '@emotion/react';

// Theme colors based on existing component patterns
const colors = {
  primary: '#3b82f6',
  border: {
    default: '#e4e4e7',
    hover: '#d4d4d8',
    focus: '#3b82f6',
  },
  background: {
    default: 'transparent',
    hover: '#f9f9f9',
    active: '#f3f3f3',
    elevated: '#ffffff',
  },
  text: {
    primary: '#000000',
    secondary: '#71717A',
    disabled: '#a1a1aa',
  },
};

export const listItemStyles = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0;
  border-radius: 0.3125rem;
  border: 1px solid transparent;
  background-color: ${colors.background.default};
  width: 100%;
  max-width: 25.5rem;
  min-height: 1.375rem;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.1s ease;
  box-sizing: border-box;
  position: relative;

  /* Responsive breakpoints following existing patterns */
  @media (max-width: 768px) {
    gap: 0.625rem;
    max-width: 100%;
    min-height: 1.25rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    max-width: 100%;
    min-height: 1.125rem;
  }

  &:hover {
    background-color: ${colors.background.hover};
  }

  &.clickable {
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid ${colors.border.focus};
      outline-offset: 2px;
    }

    &:active {
      background-color: ${colors.background.active};
      transform: translateY(1px);
    }
  }

  &.variant-compact {
    gap: 8px;
    min-height: 18px;

    @media (max-width: 480px) {
      gap: 6px;
      min-height: 16px;
    }
  }

  &.variant-outlined {
    border: 1px solid ${colors.border.default};
    padding: 8px 12px;

    &:hover {
      border-color: ${colors.border.hover};
    }

    @media (max-width: 480px) {
      padding: 6px 10px;
    }
  }

  &.variant-elevated {
    box-shadow: 0px 0px 2px 0px rgba(65, 64, 69, 0.25);
    background-color: ${colors.background.elevated};
    padding: 8px 12px;
    border-radius: 8px;

    &:hover {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 480px) {
      padding: 6px 10px;
    }
  }

  &.size-sm {
    gap: 8px;
    min-height: 18px;
    max-width: 300px;

    @media (max-width: 768px) {
      max-width: 100%;
    }

    @media (max-width: 480px) {
      gap: 6px;
      min-height: 16px;
    }
  }

  &.size-lg {
    gap: 16px;
    min-height: 28px;
    max-width: 500px;

    @media (max-width: 768px) {
      gap: 14px;
      max-width: 100%;
    }

    @media (max-width: 480px) {
      gap: 12px;
      min-height: 24px;
    }
  }
`;

export const iconContainerStyles = css`
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: auto;
    display: block;
    max-height: 100%;
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    max-height: 100%;
  }

  @media (max-width: 768px) {
    width: 0.9375rem;
    height: 0.9375rem;
  }

  @media (max-width: 480px) {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

export const labelStyles = css`
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.21;
  letter-spacing: 0;
  color: ${colors.text.secondary};
  text-align: left;
  margin: 0;
  flex: 1;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0; /* Allows text truncation to work properly */

  @media (max-width: 768px) {
    font-size: 0.84375rem;
    line-height: 1.19;
  }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
    line-height: 1.15;
  }
`;

// Status pill colors following design specifications
const statusColors = {
  active: {
    background: '#479F67', // Matching the original design
    color: '#FAFAFA',
  },
  success: {
    background: '#479F67',
    color: '#FAFAFA',
  },
  warning: {
    background: '#f59e0b',
    color: '#ffffff',
  },
  error: {
    background: '#ef4444',
    color: '#ffffff',
  },
  info: {
    background: '#3b82f6',
    color: '#ffffff',
  },
  inactive: {
    background: '#6b7280',
    color: '#ffffff',
  },
  pending: {
    background: '#f59e0b',
    color: '#ffffff',
  },
  default: {
    background: '#f4f4f5',
    color: '#52525b',
  },
};

export const statusPillStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.1875rem 0.6875rem;
  border-radius: 62.4375rem;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.33;
  letter-spacing: 0;
  text-align: center;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background-color 0.2s ease, transform 0.1s ease;

  /* Default variant */
  background-color: ${statusColors.default.background};
  color: ${statusColors.default.color};

  /* Status variants */
  &.status-active {
    background-color: ${statusColors.active.background};
    color: ${statusColors.active.color};
  }

  &.status-success {
    background-color: ${statusColors.success.background};
    color: ${statusColors.success.color};
  }

  &.status-warning {
    background-color: ${statusColors.warning.background};
    color: ${statusColors.warning.color};
  }

  &.status-error {
    background-color: ${statusColors.error.background};
    color: ${statusColors.error.color};
  }

  &.status-info {
    background-color: ${statusColors.info.background};
    color: ${statusColors.info.color};
  }

  &.status-inactive {
    background-color: ${statusColors.inactive.background};
    color: ${statusColors.inactive.color};
  }

  &.status-pending {
    background-color: ${statusColors.pending.background};
    color: ${statusColors.pending.color};
  }

  &.status-default {
    background-color: ${statusColors.default.background};
    color: ${statusColors.default.color};
  }

  @media (max-width: 768px) {
    padding: 0.15625rem 0.625rem;
    font-size: 0.71875rem;
    line-height: 1.3;
  }

  @media (max-width: 480px) {
    font-size: 0.6875rem;
    line-height: 1.27;
    padding: 0.125rem 0.5rem;
  }
`;

export const loadingStyles = css`
  opacity: 0.6;
  pointer-events: none;
  
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .skeleton-icon {
    width: 16px;
    height: 16px;
    border-radius: 2px;

    @media (max-width: 768px) {
      width: 15px;
      height: 15px;
    }

    @media (max-width: 480px) {
      width: 14px;
      height: 14px;
    }
  }

  .skeleton-label {
    height: 16px;
    width: 200px;
    flex: 1;
    max-width: 250px;

    @media (max-width: 768px) {
      height: 15px;
      width: 180px;
    }

    @media (max-width: 480px) {
      height: 14px;
      width: 150px;
    }
  }

  .skeleton-status {
    height: 22px;
    width: 60px;
    border-radius: 11px;

    @media (max-width: 768px) {
      height: 20px;
      width: 55px;
    }

    @media (max-width: 480px) {
      height: 18px;
      width: 50px;
    }
  }
`;

export const errorStyles = css`
  color: #ef4444;
  font-size: 14px;
  font-family: Inter, sans-serif;
  font-weight: 500;
  padding: 8px 12px;
  border: 1px solid #fee2e2;
  border-radius: 5px;
  background-color: #fef2f2;
  width: 100%;
  max-width: 408px;
  display: flex;
  align-items: center;
  min-height: 22px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 13.5px;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 13px;
  }
`;