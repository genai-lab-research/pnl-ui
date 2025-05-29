import React from 'react';
import { FormControlLabel, Switch, SwitchProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface HasAlertsToggleProps {
  /**
   * Whether the toggle is checked
   * @default false
   */
  checked?: boolean;
  /**
   * Callback fired when the state is changed
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  /**
   * If true, the component is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * The label for the toggle
   * @default 'Has Alerts'
   */
  label?: string;
  /**
   * The className applied to the root element
   */
  className?: string;
}

const StyledSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(() => ({
  width: 38,
  height: 22,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#1976D2',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 18,
    height: 18,
    borderRadius: '50%',
    backgroundColor: '#FAFAFA',
    boxShadow: '0px 1px 3px rgba(76, 78, 100, 0.4), 0px 1px 1px rgba(76, 78, 100, 0.28), 0px 2px 1px -1px rgba(76, 78, 100, 0.12)',
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#9E9E9E',
    borderRadius: 20,
  },
}));

/**
 * HasAlertsToggle Component
 * 
 * A toggle switch with a label that allows users to enable or disable alert notifications.
 * Built on top of Material UI's Switch component and follows Material Design guidelines.
 */
export const HasAlertsToggle: React.FC<HasAlertsToggleProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label = 'Has Alerts',
  className,
}) => {
  return (
    <FormControlLabel
      className={className}
      control={
        <StyledSwitch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      }
      label={label}
      labelPlacement="start"
      sx={{
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        '& .MuiFormControlLabel-label': {
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '16.94px',
          marginRight: '8px',
          color: '#000000',
          display: 'flex',
          alignItems: 'center',
          letterSpacing: '0px',
        },
      }}
    />
  );
};

export default HasAlertsToggle;
