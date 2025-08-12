/** @jsxImportSource @emotion/react */
import React from 'react';
import { useToggleSwitch } from './hooks';
import { 
  toggleSwitchStyles, 
  knobStyles, 
  hiddenInputStyles,
  loadingSpinnerStyles 
} from './styles';
import { ToggleSwitchProps } from './types';

/**
 * ToggleSwitch - A fully responsive and accessible toggle switch component
 * 
 * Features:
 * - Based on Figma design with slide track and circular knob
 * - Supports both controlled and uncontrolled usage patterns
 * - Full keyboard navigation and accessibility support
 * - Loading states with visual feedback
 * - Multiple size variants and responsive scaling
 * - Proper form integration with validation
 * - Theme-based styling for consistency
 * 
 * @example
 * ```tsx
 * // Controlled usage
 * <ToggleSwitch checked={enabled} onChange={setEnabled} ariaLabel="Enable feature" />
 * 
 * // Uncontrolled usage
 * <ToggleSwitch defaultChecked={false} ariaLabel="Toggle setting" />
 * 
 * // With loading state
 * <ToggleSwitch loading={isSubmitting} ariaLabel="Save setting" />
 * ```
 */
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  loading = false,
  variant = 'default',
  size = 'md',
  ariaLabel,
  className = '',
  name,
  value,
  id,
}) => {
  const { 
    isChecked, 
    handleToggle, 
    handleKeyDown, 
    handleInputChange,
    handleFocus,
    handleBlur 
  } = useToggleSwitch(
    checked,
    defaultChecked,
    onChange,
    disabled,
    loading
  );

  const isDisabled = disabled || loading;

  // Build CSS classes with proper null filtering
  const cssClasses = [
    isChecked && 'checked',
    isDisabled && 'disabled',
    loading && 'loading',
    `size-${size}`,
    variant !== 'default' && `variant-${variant}`,
    className,
  ].filter(Boolean).join(' ');

  // Generate unique ID if not provided for accessibility
  const switchId = id || `toggle-switch-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div
      css={toggleSwitchStyles}
      className={cssClasses}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      role="switch"
      tabIndex={isDisabled ? -1 : 0}
      aria-checked={isChecked}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      aria-busy={loading}
      data-testid="toggle-switch"
    >
      {/* Hidden input for form integration and accessibility */}
      <input
        css={hiddenInputStyles}
        type="checkbox"
        checked={isChecked}
        onChange={handleInputChange}
        disabled={isDisabled}
        name={name}
        value={value}
        id={switchId}
        tabIndex={-1}
        aria-hidden="true"
        data-testid="toggle-switch-input"
      />
      
      {/* Toggle knob with proper accessibility */}
      <div 
        css={knobStyles} 
        role="presentation"
        data-testid="toggle-switch-knob"
      />
      
      {/* Loading spinner with accessibility */}
      {loading && (
        <div 
          css={loadingSpinnerStyles}
          role="status" 
          aria-label="Loading"
          data-testid="toggle-switch-spinner"
        />
      )}
    </div>
  );
};

export default ToggleSwitch;