import { css } from '@emotion/react';
import { breakpoints, colors, typography, spacing, borderRadius, shadows, transitions } from './theme';

export const cardStyles = css`
  border: 1px solid ${colors.borderDefault};
  border-radius: ${borderRadius.md};
  background-color: ${colors.background.card};
  padding: ${spacing.lg};
  min-width: 300px;
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  position: relative;
  transition: box-shadow ${transitions.normal}, border-color ${transitions.normal};
  box-sizing: border-box;

  /* Responsive breakpoints */
  @media (max-width: ${breakpoints.mobile}) {
    padding: ${spacing.md};
    gap: ${spacing.md};
    min-width: 280px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    min-width: 350px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    min-width: 400px;
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
    padding: ${spacing.md};
    gap: ${spacing.md};
  }

  &.variant-outlined {
    border-width: 2px;
  }

  &.variant-elevated {
    box-shadow: ${shadows.md};
  }

  &.size-sm {
    padding: ${spacing.md};
    gap: ${spacing.md};
    min-width: 250px;

    @media (max-width: ${breakpoints.mobile}) {
      padding: ${spacing.sm};
      gap: ${spacing.sm};
      min-width: 220px;
    }
  }

  &.size-lg {
    padding: ${spacing.xl};
    gap: ${spacing.xl};
    min-width: 400px;

    @media (max-width: ${breakpoints.mobile}) {
      padding: ${spacing.lg};
      gap: ${spacing.lg};
      min-width: 320px;
    }

    @media (min-width: ${breakpoints.tablet}) {
      min-width: 450px;
    }
  }
`;

export const headerStyles = css`
  font-family: ${typography.fontFamilies.roboto};
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.bold};
  line-height: ${typography.lineHeights.lg};
  letter-spacing: ${typography.letterSpacing.wide};
  color: ${colors.black};
  margin: 0;
  text-align: left;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${typography.fontSizes.base};
    line-height: ${typography.lineHeights.base};
  }
`;

export const contentAreaStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};

  @media (max-width: ${breakpoints.mobile}) {
    gap: ${spacing.md};
  }
`;

export const fieldsGridStyles = css`
  display: flex;
  flex-direction: row;
  gap: 0;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    gap: ${spacing.md};
  }
`;

export const fieldColumnStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  
  &.labels-column {
    width: 230px;
    flex-shrink: 0;
    
    @media (max-width: ${breakpoints.tablet}) {
      width: 100%;
    }
  }
  
  &.values-column {
    flex: 1;
    
    @media (max-width: ${breakpoints.tablet}) {
      width: 100%;
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    gap: ${spacing.xs};
  }
`;

export const fieldLabelStyles = css`
  font-family: ${typography.fontFamilies.roboto};
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
`;

export const fieldValueStyles = css`
  font-family: ${typography.fontFamilies.inter};
  font-size: ${typography.fontSizes.base};
  font-weight: ${typography.fontWeights.regular};
  line-height: ${typography.lineHeights.base};
  letter-spacing: ${typography.letterSpacing.normal};
  color: ${colors.textPrimary};
  margin: 0;
  text-align: left;
  display: flex;
  align-items: center;
  gap: ${spacing.xs};

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 13px;
    line-height: 18px;
  }
`;

export const statusPillStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 11px;
  border-radius: ${borderRadius.pill};
  font-family: ${typography.fontFamilies.inter};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.semibold};
  line-height: ${typography.lineHeights.sm};
  letter-spacing: ${typography.letterSpacing.normal};
  text-align: center;
  border: none;
  white-space: nowrap;

  &.status-active {
    background-color: ${colors.status.active};
    color: ${colors.statusText.light};
  }

  &.status-inactive {
    background-color: ${colors.status.inactive};
    color: ${colors.statusText.light};
  }

  &.status-pending {
    background-color: ${colors.status.pending};
    color: ${colors.statusText.light};
  }

  &.status-error {
    background-color: ${colors.status.error};
    color: ${colors.statusText.light};
  }

  &.status-success {
    background-color: ${colors.status.success};
    color: ${colors.statusText.light};
  }

  &.status-warning {
    background-color: ${colors.status.warning};
    color: ${colors.statusText.light};
  }

  &.size-sm {
    padding: 2px 8px;
    font-size: ${typography.fontSizes.xs};
    line-height: ${typography.lineHeights.xs};
  }

  &.size-lg {
    padding: 4px 14px;
    font-size: ${typography.fontSizes.base};
    line-height: 18px;
  }
`;

export const descriptionSectionStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

export const descriptionTitleStyles = css`
  font-family: ${typography.fontFamilies.roboto};
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
`;

export const descriptionTextStyles = css`
  font-family: ${typography.fontFamilies.inter};
  font-size: ${typography.fontSizes.base};
  font-weight: ${typography.fontWeights.regular};
  line-height: 16.94px;
  letter-spacing: ${typography.letterSpacing.normal};
  color: ${colors.textPrimary};
  margin: 0;
  text-align: left;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 13px;
    line-height: 16px;
  }
`;

export const iconStyles = css`
  width: 16px;
  height: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
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

  .skeleton-header {
    height: ${typography.lineHeights.lg};
    width: 200px;
    
    @media (max-width: ${breakpoints.mobile}) {
      width: 150px;
    }
  }

  .skeleton-field {
    height: ${typography.lineHeights.base};
    width: 120px;
    
    @media (max-width: ${breakpoints.mobile}) {
      width: 100px;
    }
  }

  .skeleton-value {
    height: ${typography.lineHeights.base};
    width: 160px;
    
    @media (max-width: ${breakpoints.mobile}) {
      width: 120px;
    }
  }

  .skeleton-description {
    height: 40px;
    width: 100%;
  }
`;

export const errorStyles = css`
  color: ${colors.status.error};
  text-align: center;
  font-size: ${typography.fontSizes.base};
  padding: ${spacing.md};
  border: 1px solid #fee2e2;
  border-radius: ${borderRadius.md};
  background-color: ${colors.background.error};
`;