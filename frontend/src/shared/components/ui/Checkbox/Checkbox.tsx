import React from 'react';
import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'size'> {
  /**
   * The label to display next to the checkbox
   */
  label?: React.ReactNode;
  /**
   * The size of the checkbox
   */
  size?: 'small' | 'medium';
  /**
   * If `true`, the component appears indeterminate
   */
  indeterminate?: boolean;
  /**
   * The position of the label
   */
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
  /**
   * If `true`, the checkbox will show its "checked" state
   */
  checked?: boolean;
  /**
   * If `true`, the checkbox will be disabled
   */
  disabled?: boolean;
  /**
   * The color of the checkbox when checked
   */
  color?: string;
  /**
   * Additional CSS class name for styling
   */
  className?: string;
}

const StyledCheckbox = styled(MuiCheckbox, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'customColor',
})<{ customColor?: string }>(({ theme, customColor }) => ({
  padding: theme.spacing(0.5),
  '& .MuiSvgIcon-root': {
    fontSize: '1.25rem',
    color: 'rgba(76, 78, 100, 0.6)', // This matches the color from the JSON
  },
  '&.MuiCheckbox-colorPrimary.Mui-checked': {
    color: customColor || theme.palette.primary.main,
  },
  '&.MuiCheckbox-colorSecondary.Mui-checked': {
    color: customColor || theme.palette.secondary.main,
  },
  '&.Mui-checked .MuiSvgIcon-root': {
    color: customColor || theme.palette.primary.main,
  },
  '&.Mui-disabled .MuiSvgIcon-root': {
    color: 'rgba(76, 78, 100, 0.38)',
  },
}));

/**
 * Checkbox component for selecting single items in a list
 * 
 * This component is built on top of Material UI's Checkbox component with
 * styling that matches the Figma design. It supports small and medium sizes,
 * custom colors, labels, and all standard checkbox states.
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  size = 'small',
  indeterminate = false,
  labelPlacement = 'end',
  checked = false,
  disabled = false,
  color,
  className,
  onChange,
  ...props
}) => {
  // If there's no label, return just the checkbox
  if (!label) {
    return (
      <StyledCheckbox
        checked={checked}
        disabled={disabled}
        indeterminate={indeterminate}
        size={size}
        onChange={onChange}
        customColor={color}
        className={className}
        inputProps={{ 'aria-label': 'checkbox' }}
        {...props}
      />
    );
  }

  // If there's a label, wrap it in FormControlLabel
  return (
    <FormControlLabel
      control={
        <StyledCheckbox
          checked={checked}
          disabled={disabled}
          indeterminate={indeterminate}
          size={size}
          onChange={onChange}
          customColor={color}
          {...props}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
      disabled={disabled}
      className={className}
    />
  );
};

export default Checkbox;