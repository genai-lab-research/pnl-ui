import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { GrowthStageImage } from '../shared/components/ui/GrowthStageImage';

// For the example, we'll use a placeholder image path
// In a real application, this would be replaced with actual image paths
const seedlingImagePath = '/assets/placeholder-seedling.jpg';

const GrowthStageImageExample: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        GrowthStageImage Component Examples
      </Typography>
      
      <Typography variant="body1" paragraph>
        The GrowthStageImage component displays plant growth stages with an age indicator overlay.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Default GrowthStageImage
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <GrowthStageImage 
                imageSrc={seedlingImagePath} 
                age="15d" 
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Large Image
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <GrowthStageImage 
                imageSrc={seedlingImagePath} 
                age="15d" 
                width={200}
                height={200}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Rounded Corners
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <GrowthStageImage 
                imageSrc={seedlingImagePath} 
                age="15d" 
                width={150}
                height={150}
                borderRadius={16}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              No Age Label
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <GrowthStageImage 
                imageSrc={seedlingImagePath} 
                width={150}
                height={150}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Small Size
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <GrowthStageImage 
                imageSrc={seedlingImagePath} 
                age="15d"
                width={80}
                height={80}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              With Click Handler
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <GrowthStageImage 
                imageSrc={seedlingImagePath} 
                age="15d"
                width={150}
                height={150}
                onClick={() => alert('Image clicked!')}
              />
            </Box>
            <Typography variant="caption" align="center" display="block" sx={{ mt: 1 }}>
              Click the image to see the interaction
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GrowthStageImageExample;