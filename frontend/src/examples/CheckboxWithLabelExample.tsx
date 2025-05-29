import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CheckboxWithLabel } from '../shared/components/ui/CheckboxWithLabel';

const CheckboxWithLabelExample: React.FC = () => {
  const [checked, setChecked] = useState(false);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  
  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Checkbox With Label Example
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Basic Usage
        </Typography>
        <CheckboxWithLabel 
          label="Connect to other systems after creation" 
          checked={checked}
          onChange={handleChange}
        />
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Current state: {checked ? 'Checked' : 'Unchecked'}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Different States
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CheckboxWithLabel label="Default checkbox" />
          <CheckboxWithLabel label="Checked checkbox" checked />
          <CheckboxWithLabel label="Disabled checkbox" disabled />
          <CheckboxWithLabel label="Checked and disabled" checked disabled />
          <CheckboxWithLabel label="Indeterminate checkbox" indeterminate />
        </Box>
      </Box>
      
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Label Placement
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CheckboxWithLabel label="Label at end (default)" labelPlacement="end" />
          <CheckboxWithLabel label="Label at start" labelPlacement="start" />
        </Box>
      </Box>
    </Paper>
  );
};

export default CheckboxWithLabelExample;