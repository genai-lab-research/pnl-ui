import styled from '@emotion/styled';
import { toggleGroupTheme } from './theme';

// Styled components using theme values
interface ToggleGroupContainerProps {
  variant?: 'default' | 'outlined' | 'elevated';
  fullWidth?: boolean;
  disabled?: boolean;
}

interface ToggleOptionButtonProps {
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'elevated';
  disabled?: boolean;
  fullWidth?: boolean;
}

export const ToggleGroupContainer = styled.div<ToggleGroupContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${toggleGroupTheme.colors.background.default};
  
  ${(props) => props.fullWidth && `
    width: 100%;
  `}
  
  ${(props) => props.disabled && `
    opacity: 0.5;
    pointer-events: none;
  `}
  
  ${(props) => {
    switch (props.variant) {
      case 'outlined':
        return `
          border: ${toggleGroupTheme.spacing.borderWidth} solid ${toggleGroupTheme.colors.border.unselected};
          border-radius: ${toggleGroupTheme.sizes.md.borderRadius};
        `;
      case 'elevated':
        return `
          box-shadow: ${toggleGroupTheme.shadows.elevated};
          border-radius: ${toggleGroupTheme.sizes.md.borderRadius};
        `;
      default:
        return '';
    }
  }}
`;

export const ToggleOptionButton = styled.button<ToggleOptionButtonProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  border: ${toggleGroupTheme.spacing.borderWidth} solid;
  background-color: ${toggleGroupTheme.colors.background.default};
  font-family: ${toggleGroupTheme.typography.fontFamily};
  font-weight: ${toggleGroupTheme.typography.fontWeight};
  letter-spacing: ${toggleGroupTheme.typography.letterSpacing};
  text-align: ${toggleGroupTheme.typography.textAlign};
  transition: all ${toggleGroupTheme.transitions.duration} ${toggleGroupTheme.transitions.easing};
  
  /* Remove default button styles */
  outline: none;
  user-select: none;
  
  /* Size variations using theme */
  height: ${(props) => toggleGroupTheme.sizes[props.size || 'md'].height};
  padding: ${(props) => `${toggleGroupTheme.sizes[props.size || 'md'].paddingY} ${toggleGroupTheme.sizes[props.size || 'md'].paddingX}`};
  font-size: ${(props) => toggleGroupTheme.sizes[props.size || 'md'].fontSize};
  line-height: ${(props) => toggleGroupTheme.sizes[props.size || 'md'].lineHeight};
  border-radius: ${(props) => toggleGroupTheme.sizes[props.size || 'md'].borderRadius};
  
  ${(props) => props.fullWidth && `
    flex: 1;
  `}
  
  /* Selected/Unselected state styles */
  ${(props) => props.selected ? `
    color: ${toggleGroupTheme.colors.text.selected};
    border-color: ${toggleGroupTheme.colors.border.selected};
    background-color: ${toggleGroupTheme.colors.background.default};
  ` : `
    color: ${toggleGroupTheme.colors.text.unselected};
    border-color: ${toggleGroupTheme.colors.border.unselected};
    background-color: ${toggleGroupTheme.colors.background.default};
  `}
  
  /* Hover states */
  &:hover:not(:disabled) {
    background-color: ${toggleGroupTheme.colors.background.hover};
  }
  
  /* Active/pressed states */
  &:active:not(:disabled) {
    background-color: ${toggleGroupTheme.colors.background.pressed};
  }
  
  /* Focus states */
  &:focus-visible {
    box-shadow: ${toggleGroupTheme.shadows.focus};
    z-index: 1;
  }
  
  /* Disabled states */
  &:disabled {
    color: ${toggleGroupTheme.colors.text.disabled};
    border-color: ${toggleGroupTheme.colors.border.disabled};
    background-color: ${toggleGroupTheme.colors.background.disabled};
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const ToggleOptionLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ToggleOptionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const LoadingSkeleton = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  display: flex;
  gap: 0px;
  
  .skeleton-option {
    height: ${(props) => toggleGroupTheme.sizes[props.size || 'md'].height};
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: ${(props) => toggleGroupTheme.sizes[props.size || 'md'].borderRadius};
    flex: 1;
    min-width: 60px;
  }
  
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
  font-family: ${toggleGroupTheme.typography.fontFamily};
`;
