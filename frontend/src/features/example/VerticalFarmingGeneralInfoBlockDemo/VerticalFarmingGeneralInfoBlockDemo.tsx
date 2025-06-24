import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { VerticalFarmingGeneralInfoBlock } from '../../../shared/components/ui/VerticalFarmingGeneralInfoBlock';

export const VerticalFarmingGeneralInfoBlockDemo: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Vertical Farming General Info Block Demo
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Default State
        </Typography>
        <Box sx={{ mb: 2 }}>
          <VerticalFarmingGeneralInfoBlock 
            title="General Info" 
          />
        </Box>

        <Typography variant="h6" gutterBottom>
          Expanded State
        </Typography>
        <Box sx={{ mb: 2 }}>
          <VerticalFarmingGeneralInfoBlock 
            title="General Info" 
            isExpanded={true}
          />
        </Box>

        <Typography variant="h6" gutterBottom>
          Interactive Example
        </Typography>
        <Box>
          <VerticalFarmingGeneralInfoBlock 
            title="General Info" 
            isExpanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          />
          {isExpanded && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid #E4E4E7', borderRadius: 1 }}>
              <Typography variant="body2">
                This is the expanded content that would appear when the block is clicked.
                In a real application, this could contain detailed information about vertical farming operations.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
