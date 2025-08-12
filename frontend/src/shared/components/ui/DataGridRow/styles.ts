import { css } from '@emotion/react';

// Theme colors aligned with existing component patterns
const colors = {
  primary: '#3b82f6',
  border: {
    default: 'rgba(76, 78, 100, 0.1)', // #4C4E64 with 10% opacity from Figma
    hover: '#d4d4d8', // Consistent with KPIStatCard
    focus: '#3b82f6',
  },
  background: {
    default: '#ffffff', // Consistent with KPIStatCard
    hover: '#f9f9f9',
    active: '#f3f3f3',
    selected: '#f0f8ff',
    disabled: '#f5f5f5',
  },
  text: {
    primary: '#000000', // Matching Figma specs
    secondary: '#71717A',
    disabled: '#a1a1aa',
    label: '#09090b', // Consistent with KPIStatCard title
  },
};

export const rowStyles = css`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 3.25rem; /* 52px */
  padding: 0.0625rem 0; /* 1px top/bottom, 0 left/right */
  border: 1px solid ${colors.border.default};
  border-radius: 0.3125rem; /* 5px */
  background-color: ${colors.background.default};
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
  box-sizing: border-box;
  position: relative;

  /* Responsive breakpoints - following existing patterns */
  @media (max-width: 768px) {
    min-height: 3rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  }

  @media (max-width: 480px) {
    min-height: 2.75rem;
    padding: 0.0625rem 0;
  }

  @media (max-width: 360px) {
    min-height: 2.5rem;
  }

  &:hover {
    background-color: ${colors.background.hover};
    border-color: ${colors.border.hover};
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

  &.selected {
    background-color: ${colors.background.selected};
    border-color: ${colors.primary};
  }

  &.disabled {
    background-color: ${colors.background.disabled};
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  &.variant-compact {
    min-height: 2.5rem;
    padding: 0;

    @media (max-width: 480px) {
      min-height: 2.25rem;
    }
  }

  &.variant-elevated {
    box-shadow: 0px 0px 2px 0px rgba(65, 64, 69, 0.25);
    border: none;

    &:hover {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }

  &.variant-outlined {
    border: 1px solid ${colors.border.default};

    &:hover {
      border-color: ${colors.border.hover};
    }
  }

  &.size-sm {
    min-height: 2.5rem;

    @media (max-width: 480px) {
      min-height: 2.25rem;
    }
  }

  &.size-lg {
    min-height: 4rem;

    @media (max-width: 480px) {
      min-height: 3.5rem;
    }
  }
`;

export const cellStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.125rem; /* 50px */
  flex-shrink: 0;
  box-sizing: border-box;
  overflow: hidden;

  /* Cell-specific widths - matching the Figma specs */
  &.cell-icon {
    width: 3.5rem; /* 56px */
    padding: 0 0.75rem;
  }

  &.cell-name {
    width: 19.375rem; /* 310px */
    justify-content: flex-start;
    text-align: left;
  }

  &.cell-tenant {
    width: 11.875rem; /* 190px */
    justify-content: flex-start;
    text-align: left;
  }

  &.cell-environment {
    width: 7.1875rem; /* 115px */
    justify-content: flex-start;
    text-align: left;
  }

  &.cell-location {
    width: 11.875rem; /* 190px */
    justify-content: flex-start;
    text-align: left;
  }

  &.cell-status {
    width: 8.125rem; /* 130px */
  }

  &.cell-date {
    width: 6.3125rem; /* 101px */
    justify-content: flex-start;
    text-align: left;
  }

  &.cell-alert {
    width: 4.4375rem; /* 71px */
  }

  &.cell-menu {
    width: 4.9375rem; /* 79px */
  }

  &.align-left {
    justify-content: flex-start;
    text-align: left;
  }

  &.align-center {
    justify-content: center;
    text-align: center;
  }

  &.align-right {
    justify-content: flex-end;
    text-align: right;
  }

  @media (max-width: 768px) {
    height: 3rem;
    
    &.cell-icon {
      width: 3rem;
      min-width: 3rem;
      padding: 0 0.5rem;
    }

    &.cell-name {
      width: 14rem;
      min-width: 10rem;
    }

    &.cell-tenant {
      width: 9rem;
      min-width: 7rem;
    }

    &.cell-environment {
      width: 6rem;
      min-width: 5rem;
    }

    &.cell-location {
      width: 9rem;
      min-width: 7rem;
    }

    &.cell-status {
      width: 7rem;
      min-width: 6rem;
    }

    &.cell-date {
      width: 5.5rem;
      min-width: 5rem;
    }

    &.cell-alert {
      width: 3.5rem;
      min-width: 3rem;
    }

    &.cell-menu {
      width: 4rem;
      min-width: 3.5rem;
    }
  }

  @media (max-width: 480px) {
    height: 2.75rem;
    
    &.cell-icon {
      width: 2.5rem;
      min-width: 2.5rem;
      padding: 0 0.25rem;
    }

    &.cell-name {
      width: 12rem;
      min-width: 8rem;
    }

    &.cell-tenant {
      width: 7rem;
      min-width: 6rem;
    }

    &.cell-environment {
      width: 5rem;
      min-width: 4rem;
    }

    &.cell-location {
      width: 7rem;
      min-width: 6rem;
    }

    &.cell-status {
      width: 6rem;
      min-width: 5rem;
    }

    &.cell-date {
      width: 5rem;
      min-width: 4.5rem;
    }

    &.cell-alert {
      width: 3rem;
      min-width: 2.5rem;
    }

    &.cell-menu {
      width: 3.5rem;
      min-width: 3rem;
    }
  }

  @media (max-width: 360px) {
    height: 2.5rem;
    min-width: fit-content;
    
    /* Further compression for very small screens */
    &.cell-name {
      width: 10rem;
      min-width: 7rem;
    }
    
    &.cell-tenant {
      width: 6rem;
      min-width: 5rem;
    }
  }
`;

export const containerStyles = css`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 0.75rem; /* 12px */
  box-sizing: border-box;
  min-height: 100%;
  
  &.container-name {
    padding: 1rem 0.75rem 0.9375rem 0.75rem; /* 16px 12px 15px 12px */
    gap: 0.5rem; /* 8px for potential badges/actions */
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  &.container-basic {
    padding: 0.375rem 0.75rem; /* 6px 12px */
  }

  @media (max-width: 768px) {
    padding: 0 0.5rem;

    &.container-name {
      padding: 0.75rem 0.5rem;
      gap: 0.375rem;
    }

    &.container-basic {
      padding: 0.25rem 0.5rem;
    }
  }

  @media (max-width: 480px) {
    padding: 0 0.375rem;

    &.container-name {
      padding: 0.5rem 0.375rem;
    }

    &.container-basic {
      padding: 0.1875rem 0.375rem;
    }
  }
`;

export const textStyles = css`
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.875rem; /* 14px - matching Figma specs */
  font-weight: 400;
  line-height: 1.25rem; /* 20px - matching Figma specs */
  letter-spacing: 0;
  color: ${colors.text.primary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  word-wrap: break-word;

  &.text-name {
    font-weight: 500; /* Matching Figma specs */
    color: ${colors.text.primary};
  }

  &.text-date {
    font-weight: 400;
  }

  /* Responsive typography following KPIStatCard patterns */
  @media (max-width: 768px) {
    font-size: 0.8125rem; /* 13px */
    line-height: 1.1875rem; /* 19px */
  }

  @media (max-width: 480px) {
    font-size: 0.75rem; /* 12px */
    line-height: 1.125rem; /* 18px */
  }

  @media (max-width: 360px) {
    font-size: 0.6875rem; /* 11px */
    line-height: 1rem; /* 16px */
  }
`;

export const iconContainerStyles = css`
  width: 1rem; /* 16px */
  height: 1rem; /* 16px */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: auto;
    display: block;
    max-height: 100%;
    color: currentColor;
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

// Status pill colors following design specifications
const statusColors = {
  active: {
    background: '#479F67',
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
    background: '#494949', // Matching Figma design
    color: '#FAFAFA',
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
  padding: 0.1875rem 0.6875rem; /* 3px 11px */
  border-radius: 62.4375rem; /* 9999px - fully rounded */
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.75rem; /* 12px */
  font-weight: 600;
  line-height: 1rem; /* 16px */
  letter-spacing: 0;
  text-align: center;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background-color 0.2s ease;
  box-sizing: border-box;

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
    font-size: 0.6875rem;
    line-height: 0.9375rem;
  }

  @media (max-width: 480px) {
    font-size: 0.625rem;
    line-height: 0.875rem;
    padding: 0.125rem 0.5rem;
  }
`;

export const iconButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  color: ${colors.text.secondary};

  &:hover {
    background-color: ${colors.background.hover};
    color: ${colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${colors.border.focus};
    outline-offset: 1px;
  }

  &:active {
    transform: translateY(1px);
    background-color: ${colors.background.active};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    padding: 0.1875rem;
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
  }

  .skeleton-text {
    height: 16px;
    border-radius: 4px;
    
    &.skeleton-name {
      width: 120px;
    }
    
    &.skeleton-tenant {
      width: 80px;
    }
    
    &.skeleton-environment {
      width: 70px;
    }
    
    &.skeleton-location {
      width: 100px;
    }
    
    &.skeleton-date {
      width: 70px;
    }
  }

  .skeleton-status {
    height: 22px;
    width: 60px;
    border-radius: 11px;
  }

  @media (max-width: 768px) {
    .skeleton-text {
      height: 15px;
      
      &.skeleton-name { width: 100px; }
      &.skeleton-tenant { width: 70px; }
      &.skeleton-environment { width: 60px; }
      &.skeleton-location { width: 80px; }
      &.skeleton-date { width: 60px; }
    }

    .skeleton-status {
      height: 20px;
      width: 55px;
    }

    .skeleton-icon {
      width: 15px;
      height: 15px;
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
  display: flex;
  align-items: center;
  min-height: 52px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    font-size: 13.5px;
    min-height: 48px;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 13px;
    min-height: 44px;
  }
`;