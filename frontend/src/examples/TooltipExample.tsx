import React, { useState } from 'react';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import { Tooltip } from '../shared/components/ui/Tooltip';

/**
 * Example component showcasing various ways to use the Tooltip component.
 */
const TooltipExample: React.FC = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const toggleTooltip = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tooltip Component Examples
      </Typography>
      
      <Typography variant="body1" paragraph>
        This page demonstrates the Tooltip component in various configurations.
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Basic example matching the design */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Basic Tooltip (Design Implementation)
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Tooltip title="2 days" placement="bottom" arrow>
                <Button variant="contained">Hover me</Button>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
        
        {/* Different placements */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Different Placements
            </Typography>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item>
                <Tooltip title="Top tooltip" placement="top" arrow>
                  <Button variant="outlined" size="small">Top</Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Right tooltip" placement="right" arrow>
                  <Button variant="outlined" size="small">Right</Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Bottom tooltip" placement="bottom" arrow>
                  <Button variant="outlined" size="small">Bottom</Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Left tooltip" placement="left" arrow>
                  <Button variant="outlined" size="small">Left</Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        
        {/* Interactive and controlled tooltips */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Interactive & Controlled
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Tooltip 
                title="You can hover over this tooltip without it disappearing" 
                placement="top" 
                arrow
                disableInteractive={false}
              >
                <Button variant="text">Interactive tooltip</Button>
              </Tooltip>
              
              <Tooltip 
                title="This tooltip is programmatically controlled" 
                placement="top" 
                arrow 
                open={isTooltipOpen}
              >
                <Button variant="text" onClick={toggleTooltip}>
                  {isTooltipOpen ? 'Close tooltip' : 'Open tooltip'}
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
        
        {/* Different content types */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Different Content Types
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Tooltip title="Simple text tooltip" arrow>
                <Typography component="span" style={{ cursor: 'help' }}>
                  Hover over this text
                </Typography>
              </Tooltip>
              
              <Tooltip 
                title={
                  <React.Fragment>
                    <Typography variant="subtitle2" color="inherit">Rich content tooltip</Typography>
                    <Typography variant="body2" color="inherit">
                      Tooltips can contain formatted content with multiple lines of text.
                    </Typography>
                  </React.Fragment>
                } 
                arrow
              >
                <Button variant="outlined">Rich content</Button>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TooltipExample;