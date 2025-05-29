import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import ContainerUserHeader from '../shared/components/ui/ContainerUserHeader';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import FaceIcon from '@mui/icons-material/Face';

const ContainerUserHeaderExample: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Container User Header Examples
      </Typography>
      
      <Typography variant="body1" paragraph>
        The ContainerUserHeader component displays information about a container with user attribution.
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Default Example */}
        <Paper elevation={1}>
          <ContainerUserHeader
            title="Seeded Salanova Cousteau in Nursery"
            timestamp="April 13, 2025 - 12:30 PM"
            userName="Emily Chen"
          />
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              This is an example of content that would appear below the header in a real application.
            </Typography>
          </Box>
        </Paper>
        
        {/* Custom Icon Example */}
        <Paper elevation={1}>
          <ContainerUserHeader
            title="Harvest Planning for Plot B12"
            timestamp="April 15, 2025 - 09:15 AM"
            userName="Michael Johnson"
            avatarColor="#4CAF50"
            avatarIcon={<AgricultureIcon />}
          />
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Example with a custom farming icon and green color.
            </Typography>
          </Box>
        </Paper>
        
        {/* Different Color Example */}
        <Paper elevation={1}>
          <ContainerUserHeader
            title="User Activity Report"
            timestamp="April 17, 2025 - 14:45 PM"
            userName="Alex Kim"
            avatarColor="#2196F3"
            avatarIcon={<FaceIcon />}
          />
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Example with a blue avatar and face icon.
            </Typography>
          </Box>
        </Paper>
        
        {/* Long Title Example */}
        <Paper elevation={1}>
          <ContainerUserHeader
            title="This is an example of a container with a very long title that should demonstrate text wrapping behavior across multiple screen sizes"
            timestamp="April 20, 2025 - 11:20 AM"
            userName="Samantha Wilson"
          />
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Example showing how long titles are handled.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ContainerUserHeaderExample;