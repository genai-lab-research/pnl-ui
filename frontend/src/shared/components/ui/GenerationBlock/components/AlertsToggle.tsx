import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { AlertsToggleProps } from '../types';
import { AlertsToggleContainer } from '../styles';

export const AlertsToggle: React.FC<AlertsToggleProps> = ({
  checked = false,
  onChange,
  className,
  isLoading = false
}) => {
  const [localChecked, setLocalChecked] = useState(checked);
  
  // Update local state when prop changes
  useEffect(() => {
    setLocalChecked(checked);
  }, [checked]);
  
  // Add debouncing for toggle changes
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedOnChange = useCallback((isChecked: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange?.(isChecked);
    }, 100); // 100ms debounce delay
  }, [onChange]);
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setLocalChecked(newChecked); // Update local state immediately
    debouncedOnChange(newChecked); // Debounced notification to parent
  };

  return (
    <AlertsToggleContainer className={className}>
      <FormControlLabel
        sx={{
          margin: 0,
          '& .MuiTypography-root': {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '16.94px',
            color: '#000000',
          }
        }}
        control={
          <Switch
            checked={localChecked}
            onChange={handleToggle}
            inputProps={{
              'aria-label': 'Toggle alerts filter'
            }}
            color="success"
            size="small"
            disabled={isLoading}
          />
        }
        label="Has Alerts"
      />
    </AlertsToggleContainer>
  );
};