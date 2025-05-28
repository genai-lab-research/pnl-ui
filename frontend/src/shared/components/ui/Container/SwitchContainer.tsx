import React from 'react';

import { Box, FormControlLabel, Switch, SwitchProps, Typography } from '@mui/material';

export interface SwitchContainerProps {
  /**
   * Label for the switch
   */
  label?: React.ReactNode;

  /**
   * Current checked state
   */
  checked: boolean;

  /**
   * Handler for switch state changes
   */
  onChange: (checked: boolean) => void;

  /**
   * Size of the switch
   * @default 'medium'
   */
  size?: 'small' | 'medium';

  /**
   * Position of the label relative to the switch
   * @default 'end'
   */
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';

  /**
   * Additional text description to display
   */
  description?: string;

  /**
   * Whether the switch is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * MUI SwitchProps to pass to the Switch component
   */
  switchProps?: Omit<SwitchProps, 'checked' | 'onChange' | 'size' | 'disabled'>;
}

/**
 * SwitchContainer component for toggle controls with labels
 */
export const SwitchContainer: React.FC<SwitchContainerProps> = ({
  label,
  checked,
  onChange,
  size = 'medium',
  labelPlacement = 'end',
  description,
  disabled = false,
  className,
  switchProps,
}) => {
  const handleChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onChange(checked);
  };

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={handleChange}
            size={size}
            disabled={disabled}
            {...switchProps}
          />
        }
        label={
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: disabled ? 'text.disabled' : 'text.primary',
            }}
          >
            {label}
          </Typography>
        }
        labelPlacement={labelPlacement}
        sx={{
          margin: 0,
          alignItems: 'center',
        }}
      />

      {description && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            ml: labelPlacement === 'start' ? 0 : size === 'small' ? 4.5 : 5,
            mr: labelPlacement === 'end' ? 0 : size === 'small' ? 4.5 : 5,
            color: disabled ? 'text.disabled' : 'text.secondary',
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default SwitchContainer;
