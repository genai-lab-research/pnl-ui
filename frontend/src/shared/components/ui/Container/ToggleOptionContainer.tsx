import React from 'react';

import { Box, Switch, SxProps, Theme, Typography } from '@mui/material';

export interface ToggleOptionContainerProps {
  /**
   * The label for the toggle option
   */
  label: string;

  /**
   * Whether the toggle is on or off
   * @default false
   */
  checked?: boolean;

  /**
   * Function called when the toggle is changed
   */
  onChange?: (checked: boolean) => void;

  /**
   * Optional description for the toggle option
   */
  description?: string;

  /**
   * Optional class name for custom styling
   */
  className?: string;

  /**
   * Whether the toggle is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional sx props for custom styling
   */
  sx?: SxProps<Theme>;
}

/**
 * Container for a toggle option with label and optional description
 */
export const ToggleOptionContainer: React.FC<ToggleOptionContainerProps> = ({
  label,
  checked = false,
  onChange,
  description,
  className,
  disabled = false,
  sx,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked);
  };

  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: disabled ? 0.6 : 1,
        ...sx,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body1"
          sx={{
            fontSize: '0.9375rem',
            color: 'text.primary',
          }}
        >
          {label}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.8125rem',
              mt: 0.5,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      <Switch checked={checked} onChange={handleChange} disabled={disabled} color="primary" />
    </Box>
  );
};

export default ToggleOptionContainer;
