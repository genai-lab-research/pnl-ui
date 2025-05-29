import React from 'react';
import { Avatar } from '../shared/components/ui/Avatar';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

/**
 * Example component showcasing Avatar implementations with various options
 */
const AvatarExample: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Avatar Component Examples</Typography>
      
      <Grid container spacing={4}>
        {/* Basic Examples */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Basic Variations</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Avatar src="https://mui.com/static/images/avatar/1.jpg" alt="User Avatar" />
              <Avatar name="John Doe" />
              <Avatar />
              <Avatar fallbackIcon={<PersonIcon />} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              From left to right: Avatar with image, Avatar with name (showing initials), 
              Default Avatar, Avatar with custom fallback icon
            </Typography>
          </Paper>
        </Grid>

        {/* Size Variations */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Size Variations</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar name="XS" size="xsmall" />
              <Avatar name="SM" size="small" />
              <Avatar name="MD" size="medium" />
              <Avatar name="LG" size="large" />
              <Avatar name="XL" size="xlarge" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Avatar sizes from extra small to extra large
            </Typography>
          </Paper>
        </Grid>

        {/* Status Indicators */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Status Indicators</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Avatar name="ON" status="online" />
              <Avatar name="BS" status="busy" />
              <Avatar name="AW" status="away" />
              <Avatar name="OF" status="offline" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Avatars with different status indicators: online, busy, away, offline
            </Typography>
          </Paper>
        </Grid>

        {/* Styling Options */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Styling Options</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Avatar name="E1" elevation={1} />
              <Avatar name="BD" bordered borderColor="#2196f3" />
              <Avatar name="SQ" variant="square" />
              <Avatar name="RD" variant="rounded" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Various styling options: elevation, border, and different shapes
            </Typography>
          </Paper>
        </Grid>
        
        {/* User Profile Example */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>User Profile Integration Examples</Typography>
            <Divider sx={{ mb: 3 }} />
            
            {/* User Profile Card */}
            <Grid container spacing={3}>
              {/* Online User with Photo */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src="https://mui.com/static/images/avatar/2.jpg" 
                    size="large" 
                    status="online"
                    elevation={2}
                    bordered
                    borderColor="white"
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Jane Smith</Typography>
                    <Typography variant="body2" color="success.main">Online</Typography>
                    <Typography variant="caption" color="text.secondary">Product Manager</Typography>
                  </Box>
                </Box>
              </Grid>
              
              {/* Busy User with Initials */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    name="Alex Johnson" 
                    size="large" 
                    status="busy"
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Alex Johnson</Typography>
                    <Typography variant="body2" color="error.main">Busy</Typography>
                    <Typography variant="caption" color="text.secondary">Senior Developer</Typography>
                  </Box>
                </Box>
              </Grid>
              
              {/* Offline User with Fallback Icon */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    size="large" 
                    status="offline"
                    variant="rounded"
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Guest User</Typography>
                    <Typography variant="body2" color="text.secondary">Offline</Typography>
                    <Typography variant="caption" color="text.secondary">Unknown</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Responsive Behavior Notice */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold">Responsive Behavior</Typography>
        <Typography variant="body2" color="text.secondary">
          All avatars automatically adjust their size on smaller screens. 
          Try resizing your browser window to see the responsive behavior in action.
        </Typography>
      </Box>
    </Box>
  );
};

export default AvatarExample;