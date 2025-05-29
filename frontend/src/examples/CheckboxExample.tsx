import React, { useState } from 'react';
import { Box, Typography, Divider, Stack } from '@mui/material';
import { Checkbox } from '../shared/components/ui/Checkbox';

const CheckboxExample: React.FC = () => {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);
  const [options, setOptions] = useState({
    option1: false,
    option2: true,
    option3: false,
  });

  const handleSingleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleIndeterminateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIndeterminate(event.target.checked);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({
      ...options,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Checkbox Examples
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Basic Checkboxes
      </Typography>
      
      <Stack spacing={2}>
        <Box>
          <Checkbox 
            checked={checked}
            onChange={handleSingleCheckboxChange}
            label="Default Checkbox"
          />
        </Box>
        
        <Box>
          <Checkbox 
            checked={true}
            label="Checked Checkbox"
            disabled
          />
        </Box>
        
        <Box>
          <Checkbox 
            indeterminate={indeterminate}
            onChange={handleIndeterminateChange}
            label="Indeterminate Checkbox"
          />
        </Box>
        
        <Box>
          <Checkbox 
            disabled
            label="Disabled Checkbox"
          />
        </Box>
      </Stack>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Checkbox Group
      </Typography>
      
      <Stack spacing={1}>
        <Checkbox 
          name="option1"
          checked={options.option1}
          onChange={handleOptionChange}
          label="Option 1"
        />
        <Checkbox 
          name="option2"
          checked={options.option2}
          onChange={handleOptionChange}
          label="Option 2"
        />
        <Checkbox 
          name="option3"
          checked={options.option3}
          onChange={handleOptionChange}
          label="Option 3"
        />
      </Stack>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Checkbox Sizes
      </Typography>
      
      <Stack spacing={1}>
        <Checkbox 
          size="small"
          label="Small Checkbox"
        />
        <Checkbox 
          size="medium"
          label="Medium Checkbox"
        />
      </Stack>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Custom Color
      </Typography>
      
      <Stack spacing={1}>
        <Checkbox 
          checked={true}
          color="#3545EE"
          label="Primary Blue Checkbox"
        />
        <Checkbox 
          checked={true}
          color="#FF5733"
          label="Custom Red Checkbox"
        />
      </Stack>
    </Box>
  );
};

export default CheckboxExample;