import React, { useState } from 'react';
import { TextField } from '../shared/components/ui/TextField';
import { Box, Typography, Paper, Grid } from '@mui/material';

const TextFieldExample: React.FC = () => {
  const [textValue, setTextValue] = useState('');
  const [locationValue, setLocationValue] = useState('Lviv');
  const [multilineValue, setMultilineValue] = useState('');

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocationValue(event.target.value);
  };

  const handleMultilineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMultilineValue(event.target.value);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Text Field Example
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Location Text Field (Figma Design)
            </Typography>
            <Box sx={{ maxWidth: '372px' }}>
              <TextField 
                label="Location" 
                value={locationValue} 
                onChange={handleLocationChange} 
              />
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Current value: {locationValue || '(empty)'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Default Text Field
            </Typography>
            <Box sx={{ maxWidth: '372px' }}>
              <TextField 
                placeholder="Notes (optional)" 
                value={textValue} 
                onChange={handleTextChange} 
              />
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Current value: {textValue || '(empty)'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Disabled Text Field
            </Typography>
            <Box sx={{ maxWidth: '372px' }}>
              <TextField 
                placeholder="Notes (optional)" 
                disabled
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Text Field With Label
            </Typography>
            <Box sx={{ maxWidth: '372px' }}>
              <TextField 
                label="Notes"
                placeholder="Enter notes here"
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Error State
            </Typography>
            <Box sx={{ maxWidth: '372px' }}>
              <TextField 
                label="Notes"
                placeholder="Enter notes here"
                error
                helperText="This field is required"
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Multiline Text Field
            </Typography>
            <Box sx={{ maxWidth: '372px' }}>
              <TextField 
                placeholder="Notes (optional)" 
                multiline
                rows={4}
                value={multilineValue}
                onChange={handleMultilineChange}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TextFieldExample;