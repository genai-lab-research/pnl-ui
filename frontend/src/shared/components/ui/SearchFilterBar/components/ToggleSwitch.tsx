/** @jsxImportSource @emotion/react */
import React from 'react';
import { useToggleSwitch } from '../hooks';
import {
  toggleContainerStyles,
  toggleLabelStyles,
  toggleSwitchStyles,
  toggleKnobStyles,
} from '../styles';

interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * ToggleSwitch - Reusable toggle switch component
 * Provides on/off state switching with proper accessibility
 */
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  loading = false,
}) => {
  const { handleToggle, handleKeyDown, isActive } = useToggleSwitch(
    value,
    onChange,
    disabled || loading
  );

  const isDisabled = disabled || loading;

  return (
    <div css={toggleContainerStyles}>
      <span css={toggleLabelStyles}>{label}</span>
      <div
        css={[
          toggleSwitchStyles,
          isActive && { backgroundColor: '#3b82f6' },
          isDisabled && { opacity: 0.6, pointerEvents: 'none' }
        ]}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="switch"
        tabIndex={isDisabled ? -1 : 0}
        aria-checked={isActive}
        aria-label={`${label} switch`}
      >
        <div
          css={[
            toggleKnobStyles,
            isActive && { transform: 'translateX(20px)' }
          ]}
        />
      </div>
    </div>
  );
};

export default ToggleSwitch;