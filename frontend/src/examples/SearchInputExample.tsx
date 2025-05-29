import React, { useState } from 'react';
import { SearchInput } from '../shared/components/ui/SearchInput';
import { Box, Typography, Paper, Grid } from '@mui/material';

const SearchInputExample: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // In a real application, this would trigger a search or filter operation
  };

  return (
    <Box sx={{ p: 3, maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Search Input Example
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Default Search Input
            </Typography>
            <Box sx={{ maxWidth: '240px' }}>
              <SearchInput 
                placeholder="All types" 
                value={searchValue} 
                onChange={handleSearchChange} 
              />
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Current search value: {searchValue || '(empty)'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Disabled Search Input
            </Typography>
            <Box sx={{ maxWidth: '240px' }}>
              <SearchInput 
                placeholder="All types" 
                disabled={true}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Custom Placeholder
            </Typography>
            <Box sx={{ maxWidth: '240px' }}>
              <SearchInput 
                placeholder="Search types..." 
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              With Initial Value
            </Typography>
            <Box sx={{ maxWidth: '240px' }}>
              <SearchInput 
                placeholder="All types" 
                value="Type filter"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchInputExample;