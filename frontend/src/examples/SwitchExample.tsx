import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Switch } from '../shared/components/ui/Switch';

/**
 * Example component showcasing the Switch component with different configurations.
 */
const SwitchExample: React.FC = () => {
  // State for tracking toggle states
  const [states, setStates] = useState({
    basic: true,
    withLabel: false,
    small: true,
    custom: false,
    disabled: false
  });

  // Handler for toggle changes
  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setStates({
      ...states,
      [name]: event.target.checked,
    });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: '600px', mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Switch Component Examples</Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Basic switch */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body1">Basic Switch</Typography>
          <Switch
            checked={states.basic}
            onChange={handleChange('basic')}
          />
        </Box>
        
        {/* Switch with label */}
        <Switch
          label="Switch with label"
          checked={states.withLabel}
          onChange={handleChange('withLabel')}
          labelPlacement="start"
        />
        
        {/* Small switch */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body1">Small Switch</Typography>
          <Switch
            size="small"
            checked={states.small}
            onChange={handleChange('small')}
          />
        </Box>
        
        {/* Custom color switch */}
        <Switch
          label="Custom color switch"
          color="#FF5733"
          checked={states.custom}
          onChange={handleChange('custom')}
          labelPlacement="start"
        />
        
        {/* Disabled switch */}
        <Switch
          label="Disabled switch"
          checked={states.disabled}
          onChange={handleChange('disabled')}
          disabled
          labelPlacement="start"
        />
      </Box>
    </Paper>
  );
};

export default SwitchExample;