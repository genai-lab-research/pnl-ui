import React from 'react';
import { Switch as MuiSwitch, SwitchProps as MuiSwitchProps, FormControlLabel, styled } from '@mui/material';
import { useIsMobile } from '../../../utils/responsive';

export interface SwitchProps extends Omit<MuiSwitchProps, 'size'> {
  /**
   * The label for the switch
   */
  label?: React.ReactNode;

  /**
   * The size of the switch
   */
  size?: 'small' | 'medium';

  /**
   * The placement of the label
   */
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';

  /**
   * The color of the switch when checked
   */
  color?: string;

  /**
   * Whether to show the label
   */
  showLabel?: boolean;

  /**
   * Custom class name for styling
   */
  className?: string;
}

// Styled switch component based on the Figma design
const StyledSwitch = styled(MuiSwitch, {
  shouldForwardProp: (prop) => !['customColor'].includes(prop as string),
})<{ customColor?: string; size: 'small' | 'medium' }>(({ customColor, size, theme }) => ({
  width: size === 'small' ? 48 : 54,
  height: size === 'small' ? 24 : 28,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: size === 'small' ? 4 : 6,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: size === 'small' 
        ? 'translateX(24px)' 
        : 'translateX(26px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: customColor || '#656CFF', // Default primary color from Figma
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: customColor || '#656CFF',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: size === 'small' ? 16 : 18,
    height: size === 'small' ? 16 : 18,
    boxShadow: '0px 1px 3px rgba(76, 78, 100, 0.4), 0px 1px 1px rgba(76, 78, 100, 0.4), 0px 2px 1px -1px rgba(76, 78, 100, 0.12)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 16,
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.38)' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

/**
 * Switch component for toggling between two states.
 * Implementation matches the Figma design with customizable size, color, and label options.
 */
export const Switch: React.FC<SwitchProps> = ({
  label,
  checked,
  onChange,
  size = 'medium',
  labelPlacement = 'start',
  color,
  disabled = false,
  showLabel = true,
  className,
  ...props
}) => {
  const isMobile = useIsMobile();
  
  // If there's no label or showLabel is false, just return the switch
  if (!label || !showLabel) {
    return (
      <StyledSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        size={size}
        customColor={color}
        className={className}
        {...props}
      />
    );
  }

  // If there's a label, wrap in FormControlLabel
  return (
    <FormControlLabel
      control={
        <StyledSwitch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          size={size}
          customColor={color}
          {...props}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
      disabled={disabled}
      className={className}
      sx={{
        margin: 0, // Remove default margin
        // Add appropriate spacing based on label placement
        ...(labelPlacement === 'start' && { mr: 0 }),
        ...(labelPlacement === 'end' && { ml: 0 }),
        // Adjust spacing on mobile
        ...(isMobile && {
          '& .MuiFormControlLabel-label': {
            fontSize: '13px',
          },
        }),
      }}
    />
  );
};

export default Switch;