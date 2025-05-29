import React from 'react';
import { FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Checkbox } from '../Checkbox';

export interface CheckboxWithLabelProps {
  /**
   * The label text to display next to the checkbox
   */
  label: React.ReactNode;
  /**
   * If `true`, the checkbox will show its "checked" state
   */
  checked?: boolean;
  /**
   * If `true`, the checkbox will be disabled
   */
  disabled?: boolean;
  /**
   * If `true`, the component appears indeterminate
   */
  indeterminate?: boolean;
  /**
   * The size of the checkbox
   */
  size?: 'small' | 'medium';
  /**
   * Callback fired when the state is changed
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  /**
   * The position of the label
   */
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
  /**
   * Additional CSS class name for styling
   */
  className?: string;
}

const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  marginLeft: 0,
  marginRight: 0,
  '.MuiFormControlLabel-label': {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgba(9, 9, 11, 1)', // From the Figma design: #09090B
    lineHeight: '20px',
  },
}));

/**
 * CheckboxWithLabel component displays a checkbox with a label, matching the Figma design.
 * 
 * This component extends the base Checkbox component with a consistently styled label.
 * It ensures that the label and checkbox are properly aligned and styled according
 * to the design specifications.
 */
export const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({
  label,
  checked = false,
  disabled = false,
  indeterminate = false,
  size = 'small',
  onChange,
  labelPlacement = 'end',
  className,
}) => {
  return (
    <StyledFormControlLabel
      control={
        <Checkbox
          checked={checked}
          disabled={disabled}
          indeterminate={indeterminate}
          size={size}
          onChange={onChange}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
      disabled={disabled}
      className={className}
    />
  );
};

export default CheckboxWithLabel;