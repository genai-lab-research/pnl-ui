import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Switch } from '../Switch';

export interface SettingsOption {
  /**
   * The label text for the toggle option
   */
  label: string;
  
  /**
   * Whether the toggle is checked
   */
  checked: boolean;
  
  /**
   * Callback fired when the toggle changes
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  
  /**
   * Whether the toggle is disabled
   */
  disabled?: boolean;
}

export interface SettingsGroupProps {
  /**
   * The title of the settings group
   */
  title: string;
  
  /**
   * An array of setting options to render
   */
  options: SettingsOption[];
  
  /**
   * Additional CSS class
   */
  className?: string;
}

const StyledContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
}));

const StyledHeader = styled(Typography)(() => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#000000',
}));

const StyledOption = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: '38px',
}));

const StyledLabel = styled(Typography)(() => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '16.41px',
  color: '#000000',
}));

/**
 * SettingsGroup Component
 * 
 * A component that displays a group of settings with a title and toggle switches.
 * Each toggle option has a label and can be individually controlled.
 */
export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  title,
  options,
  className,
}) => {
  return (
    <StyledContainer className={className}>
      <StyledHeader>{title}</StyledHeader>
      {options.map((option, index) => (
        <StyledOption key={index}>
          <StyledLabel>{option.label}</StyledLabel>
          <Switch 
            checked={option.checked}
            onChange={option.onChange}
            disabled={option.disabled}
            size="medium"
            color="#656CFF"
          />
        </StyledOption>
      ))}
    </StyledContainer>
  );
};

export default SettingsGroup;