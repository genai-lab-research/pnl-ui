import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Select } from '../shared/components/ui/Select';

const purposeOptions = [
  { value: 'cultivation', label: 'Cultivation' },
  { value: 'research', label: 'Research' },
  { value: 'production', label: 'Production' },
  { value: 'testing', label: 'Testing' },
  { value: 'storage', label: 'Storage' },
];

const SelectExample: React.FC = () => {
  const [selectedPurpose, setSelectedPurpose] = useState('research');

  const handlePurposeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPurpose(event.target.value as string);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Select Component Examples
      </Typography>
      
      <Stack spacing={4} maxWidth={400}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Default Select
          </Typography>
          <Select
            options={purposeOptions}
            label="Purpose"
            value={selectedPurpose}
            onChange={handlePurposeChange}
          />
          <Typography variant="body2" mt={1}>
            Selected: {selectedPurpose}
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Small Select
          </Typography>
          <Select
            options={purposeOptions}
            label="Purpose"
            value={selectedPurpose}
            onChange={handlePurposeChange}
            size="small"
          />
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Disabled Select
          </Typography>
          <Select
            options={purposeOptions}
            label="Purpose"
            value={selectedPurpose}
            disabled
          />
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Error State
          </Typography>
          <Select
            options={purposeOptions}
            label="Purpose"
            value=""
            error
            helperText="Please select a purpose"
          />
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Filled Variant
          </Typography>
          <Select
            options={purposeOptions}
            label="Purpose"
            value={selectedPurpose}
            variant="filled"
            onChange={handlePurposeChange}
          />
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Standard Variant
          </Typography>
          <Select
            options={purposeOptions}
            label="Purpose"
            value={selectedPurpose}
            variant="standard"
            onChange={handlePurposeChange}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default SelectExample;