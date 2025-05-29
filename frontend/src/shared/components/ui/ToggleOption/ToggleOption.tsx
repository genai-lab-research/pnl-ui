import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Switch, SwitchProps } from '../Switch/Switch';

export interface ToggleOptionProps {
  /**
   * The label for the toggle option
   */
  label: string;
  
  /**
   * Whether the toggle is checked
   */
  checked?: boolean;
  
  /**
   * Callback function when the toggle state changes
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  
  /**
   * Whether the toggle is disabled
   */
  disabled?: boolean;
  
  /**
   * The color of the switch when checked
   * Default is primary color #656CFF
   */
  color?: string;
  
  /**
   * Size of the switch
   */
  size?: 'small' | 'medium';
  
  /**
   * Additional class name for styling
   */
  className?: string;
}

const StyledContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

const StyledLabel = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '16.41px',
  color: '#000000',
});

/**
 * ToggleOption component that combines a label and switch for toggling settings
 * 
 * Follows the design specifications from Figma with:
 * - Label on the left side
 * - Switch on the right side
 * - Space between distributed evenly
 */
export const ToggleOption: React.FC<ToggleOptionProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  color = '#656CFF',
  size = 'medium',
  className,
}) => {
  // Switch props extracted to avoid passing label to Switch
  const switchProps: Omit<SwitchProps, 'label'> = {
    checked,
    onChange,
    disabled,
    color,
    size,
    showLabel: false, // Never show label in the Switch component
  };

  return (
    <StyledContainer className={className}>
      <StyledLabel>{label}</StyledLabel>
      <Switch {...switchProps} />
    </StyledContainer>
  );
};

export default ToggleOption;