import { css } from '@emotion/react';
import { colors, typography, spacing, borderRadius, transitions, sizes, shadows } from './theme';

export const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  border: 1px solid ${colors.borderTransparent};
  border-radius: ${borderRadius.base};
  font-family: ${typography.fontFamily};
  font-weight: ${typography.weights.medium};
  letter-spacing: ${typography.letterSpacing.normal};
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all ${transitions.normal};
  outline: none;
  position: relative;
  box-sizing: border-box;
  white-space: nowrap;
  
  /* Focus states for accessibility */
  &:focus-visible {
    outline: 2px solid ${colors.focus};
    outline-offset: 2px;
  }
  
  /* Disabled state */
  &:disabled {
    cursor: not-allowed;
    opacity: ${colors.disabled};
  }
  
  /* Active state for tactile feedback */
  &:not(:disabled):active {
    transform: translateY(1px);
  }

  /* Responsive behavior */
  @media (max-width: 640px) {
    &:not(.full-width) {
      min-width: fit-content;
      font-size: calc(${typography.sizes.base} * 0.9);
    }
  }

  /* Variants - Based on Figma design */
  &.variant-default {
    background-color: ${colors.background.default};
    color: ${colors.textLight};
    border-color: ${colors.borderTransparent};
    
    &:hover:not(:disabled) {
      background-color: rgba(42, 55, 204, 0.6);
      box-shadow: ${shadows.base};
    }
    
    &:active:not(:disabled) {
      background-color: rgba(31, 41, 170, 0.7);
      box-shadow: ${shadows.active};
    }
  }
  
  &.variant-compact {
    background-color: ${colors.background.solid};
    color: ${colors.textLight};
    border-color: ${colors.borderPrimary};
    
    &:hover:not(:disabled) {
      background-color: ${colors.primaryHover};
      border-color: ${colors.primaryHover};
      box-shadow: ${shadows.base};
    }
    
    &:active:not(:disabled) {
      background-color: ${colors.primaryActive};
      border-color: ${colors.primaryActive};
    }
  }
  
  &.variant-outlined {
    background-color: ${colors.background.transparent};
    color: ${colors.primary};
    border-color: ${colors.borderPrimary};
    
    &:hover:not(:disabled) {
      background-color: rgba(53, 69, 238, 0.05);
      border-color: ${colors.primaryHover};
      color: ${colors.primaryHover};
    }
    
    &:active:not(:disabled) {
      background-color: rgba(53, 69, 238, 0.1);
    }
  }
  
  &.variant-elevated {
    background-color: ${colors.background.solid};
    color: ${colors.textLight};
    border-color: ${colors.borderPrimary};
    box-shadow: ${shadows.hover};
    
    &:hover:not(:disabled) {
      background-color: ${colors.primaryHover};
      border-color: ${colors.primaryHover};
      box-shadow: ${shadows.elevated};
      transform: translateY(-1px);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0px);
      box-shadow: ${shadows.active};
    }
  }

  /* Responsive sizes - Based on Figma specifications */
  &.size-sm {
    padding: ${sizes.button.sm.padding};
    font-size: ${sizes.button.sm.fontSize};
    line-height: ${sizes.button.sm.lineHeight};
    min-height: ${sizes.button.sm.minHeight};
    gap: ${sizes.button.sm.gap};
    border-radius: ${borderRadius.small};
    
    @media (max-width: 480px) {
      padding: 4px 6px;
      font-size: 11px;
      min-height: 24px;
    }
  }
  
  &.size-md {
    padding: ${sizes.button.base.padding};
    font-size: ${sizes.button.base.fontSize};
    line-height: ${sizes.button.base.lineHeight};
    min-height: ${sizes.button.base.minHeight};
    gap: ${sizes.button.base.gap};
    border-radius: ${borderRadius.base};
    
    @media (max-width: 480px) {
      padding: 8px 10px;
      font-size: 13px;
      min-height: 36px;
    }
  }
  
  &.size-lg {
    padding: ${sizes.button.lg.padding};
    font-size: ${sizes.button.lg.fontSize};
    line-height: ${sizes.button.lg.lineHeight};
    min-height: ${sizes.button.lg.minHeight};
    gap: ${sizes.button.lg.gap};
    border-radius: ${borderRadius.base};
    
    @media (max-width: 480px) {
      padding: 10px 14px;
      font-size: 15px;
      min-height: 44px;
    }
  }
  
  /* Full width utility */
  &.full-width {
    width: 100%;
    max-width: 100%;
    
    @media (max-width: 480px) {
      min-width: 100%;
    }
  }

  /* Loading state with improved spinner */
  &.loading {
    color: transparent;
    position: relative;
    cursor: wait;
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${sizes.icon.base};
      height: ${sizes.icon.base};
      border: 2px solid;
      border-color: ${colors.loading} transparent ${colors.loading} transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    &.size-sm::after {
      width: ${sizes.icon.sm};
      height: ${sizes.icon.sm};
      border-width: 1.5px;
    }
    
    &.size-lg::after {
      width: ${sizes.icon.lg};
      height: ${sizes.icon.lg};
      border-width: 2.5px;
    }
  }

  @keyframes spin {
    0% { 
      transform: translate(-50%, -50%) rotate(0deg); 
    }
    100% { 
      transform: translate(-50%, -50%) rotate(360deg); 
    }
  }
`;

export const iconStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${sizes.icon.base};
  height: ${sizes.icon.base};
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  /* Responsive icon sizes */
  .size-sm & {
    width: ${sizes.icon.sm};
    height: ${sizes.icon.sm};
  }
  
  .size-lg & {
    width: ${sizes.icon.lg};
    height: ${sizes.icon.lg};
  }
`;

export const labelStyles = css`
  font-weight: inherit;
  line-height: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
  
  @media (max-width: 480px) {
    font-size: inherit;
  }
`;

export const errorStyles = css`
  color: ${colors.error};
  font-size: ${typography.sizes.sm};
  line-height: ${typography.lineHeights.sm};
  margin-top: ${spacing.xs};
  text-align: left;
  font-family: ${typography.fontFamily};
  
  @media (max-width: 480px) {
    font-size: 11px;
    margin-top: 2px;
  }
`;