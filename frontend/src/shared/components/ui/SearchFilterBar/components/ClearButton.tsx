/** @jsxImportSource @emotion/react */
import React from 'react';
import { clearButtonStyles, clearButtonLabelStyles } from '../styles';

interface ClearButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * ClearButton - Reusable clear filters button component
 * Provides action to reset all filters
 */
const ClearButton: React.FC<ClearButtonProps> = ({
  label,
  onClick,
  disabled = false,
  loading = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      css={[
        clearButtonStyles,
        isDisabled && { opacity: 0.6, pointerEvents: 'none' }
      ]}
      onClick={onClick}
      disabled={isDisabled}
      type="button"
      aria-label="Clear all filters"
    >
      <span css={clearButtonLabelStyles}>{label}</span>
    </button>
  );
};

export default ClearButton;