import { css } from '@emotion/react';

const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
} as const;

const colors = {
  // Text colors  
  textPrimary: '#000000',
  textSecondary: '#71717A',
  
  // Border colors
  borderDefault: 'rgba(69, 81, 104, 0.1)', // #455168 with 10% opacity as per design
  borderHover: 'rgba(69, 81, 104, 0.2)',
  
  // Focus colors
  focus: '#3b82f6',
  
  // Avatar colors
  avatar: {
    default: '#6b7280',
    success: '#489F68', // From the design
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Background colors
  background: {
    card: '#ffffff',
    error: '#fef2f2',
  },
  
  // Loading skeleton
  skeleton: {
    base: '#f0f0f0',
    highlight: '#e0e0e0',
  },
} as const;

const typography = {
  fontFamilies: {
    inter: "'Inter', sans-serif",
  },
  
  fontSizes: {
    xs: '10px',
    sm: '12px', 
    base: '14px',
    lg: '16px',
  },
  
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeights: {
    xs: '14px',
    sm: '16px',
    base: '20px',
    lg: '24px',
  },
  
  letterSpacing: {
    normal: '0px',
  },
} as const;

const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
} as const;

const borderRadius = {
  sm: '4px',
  md: '5px', // From design
  lg: '12px',
  full: '50%',
} as const;

const transitions = {
  fast: '0.15s ease',
  normal: '0.2s ease',
  slow: '0.3s ease',
} as const;

export const cardStyles = css`
  background-color: ${colors.background.card};
  padding-top: ${spacing.md};
  padding-bottom: ${spacing.md};
  padding-left: 0;
  padding-right: 0;
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  position: relative;
  transition: border-color ${transitions.normal};
  box-sizing: border-box;
  max-width: 100%;
  min-height: 64px; // From design

  /* Responsive breakpoints */
  @media (max-width: ${breakpoints.mobile}) {
    padding-top: ${spacing.sm};
    padding-bottom: ${spacing.sm};
    gap: ${spacing.md};
    min-height: 56px;
  }

  &:hover {
    border-color: ${colors.borderHover};
  }

  &.clickable {
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid ${colors.focus};
      outline-offset: 2px;
    }

    &:active {
      transform: translateY(1px);
    }
  }

  &.variant-compact {
    padding-top: ${spacing.sm};
    padding-bottom: ${spacing.sm};
    gap: ${spacing.md};
    min-height: 48px;
  }

  &.variant-outlined {
    border-width: 2px;
  }

  &.variant-elevated {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  }

  &.size-sm {
    padding-top: ${spacing.sm};
    padding-bottom: ${spacing.sm};
    gap: ${spacing.md};
    min-height: 48px;

    @media (max-width: ${breakpoints.mobile}) {
      min-height: 40px;
    }
  }

  &.size-lg {
    padding-top: ${spacing.lg};
    padding-bottom: ${spacing.lg};
    gap: ${spacing.xl};
    min-height: 80px;

    @media (max-width: ${breakpoints.mobile}) {
      padding-top: ${spacing.md};
      padding-bottom: ${spacing.md};
      gap: ${spacing.lg};
      min-height: 72px;
    }
  }
`;

export const avatarStyles = css`
  width: 32px;
  height: 32px;
  border-radius: ${borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 0; // No left margin in horizontal layout

  &.avatar-default {
    background-color: ${colors.avatar.default};
  }

  &.avatar-success {
    background-color: ${colors.avatar.success};
  }

  &.avatar-warning {
    background-color: ${colors.avatar.warning};
  }

  &.avatar-error {
    background-color: ${colors.avatar.error};
  }

  &.avatar-info {
    background-color: ${colors.avatar.info};
  }

  &.size-sm {
    width: 24px;
    height: 24px;
  }

  &.size-lg {
    width: 40px;
    height: 40px;
  }

  svg, img {
    width: 16px;
    height: 16px;
    color: white;
    fill: currentColor;
  }

  &.size-sm svg,
  &.size-sm img {
    width: 12px;
    height: 12px;
  }

  &.size-lg svg,
  &.size-lg img {
    width: 20px;
    height: 20px;
  }
`;

export const contentStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  flex: 1;
  min-width: 0; // Prevents flex overflow
`;

export const messageStyles = css`
  font-family: ${typography.fontFamilies.inter};
  font-size: ${typography.fontSizes.base};
  font-weight: ${typography.fontWeights.medium};
  line-height: ${typography.lineHeights.base};
  letter-spacing: ${typography.letterSpacing.normal};
  color: ${colors.textPrimary};
  margin: 0;
  text-align: left;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 13px;
    line-height: 18px;
  }

  .size-sm & {
    font-size: ${typography.fontSizes.sm};
    line-height: ${typography.lineHeights.sm};
  }

  .size-lg & {
    font-size: ${typography.fontSizes.lg};
    line-height: ${typography.lineHeights.lg};
  }
`;

export const metaStyles = css`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.mobile}) {
    gap: ${spacing.md};
  }
`;

export const timestampStyles = css`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.textSecondary};
`;

export const timestampTextStyles = css`
  font-family: ${typography.fontFamilies.inter};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.regular};
  line-height: ${typography.lineHeights.sm};
  letter-spacing: ${typography.letterSpacing.normal};
  color: ${colors.textSecondary};
  margin: 0;
  white-space: nowrap;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 11px;
    line-height: 14px;
  }

  .size-sm & {
    font-size: ${typography.fontSizes.xs};
    line-height: ${typography.lineHeights.xs};
  }

  .size-lg & {
    font-size: ${typography.fontSizes.base};
    line-height: ${typography.lineHeights.base};
  }
`;

export const authorStyles = css`
  font-family: ${typography.fontFamilies.inter};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.regular};
  line-height: ${typography.lineHeights.sm};
  letter-spacing: ${typography.letterSpacing.normal};
  color: ${colors.textSecondary};
  margin: 0;
  white-space: nowrap;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 11px;
    line-height: 14px;
  }

  .size-sm & {
    font-size: ${typography.fontSizes.xs};
    line-height: ${typography.lineHeights.xs};
  }

  .size-lg & {
    font-size: ${typography.fontSizes.base};
    line-height: ${typography.lineHeights.base};
  }
`;

export const timestampIconStyles = css`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    color: ${colors.textSecondary};
  }

  .size-sm & {
    width: 12px;
    height: 12px;
  }

  .size-lg & {
    width: 18px;
    height: 18px;
  }
`;

export const loadingStyles = css`
  .skeleton {
    background: linear-gradient(90deg, ${colors.skeleton.base} 25%, ${colors.skeleton.highlight} 50%, ${colors.skeleton.base} 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: ${borderRadius.sm};
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .skeleton-avatar {
    width: 32px;
    height: 32px;
    border-radius: ${borderRadius.full};
  }

  .skeleton-message {
    height: ${typography.lineHeights.base};
    width: 200px;
    
    @media (max-width: ${breakpoints.mobile}) {
      width: 150px;
    }
  }

  .skeleton-timestamp {
    height: ${typography.lineHeights.sm};
    width: 120px;
  }

  .skeleton-author {
    height: ${typography.lineHeights.sm};
    width: 80px;
  }
`;

export const errorStyles = css`
  color: ${colors.avatar.error};
  text-align: center;
  font-size: ${typography.fontSizes.base};
  padding: ${spacing.md};
  border: 1px solid #fee2e2;
  border-radius: ${borderRadius.md};
  background-color: ${colors.background.error};
`;