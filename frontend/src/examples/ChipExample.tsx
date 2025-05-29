import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Container, 
  Divider, 
  useMediaQuery,
  Paper,
  useTheme 
} from '@mui/material';
import { Chip } from '../shared/components/ui/Chip';
import { useResponsiveValue } from '../shared/utils/responsive';
import NavigationButtons from './NavigationButtons';

export const ChipExample: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isXSmall = useMediaQuery('@media (max-width: 375px)');
  
  // Example state for interactive demo
  const [selectedChips, setSelectedChips] = useState<string[]>(['Inactive']);
  
  // Use responsive value hook for adaptive components
  const chipSize = useResponsiveValue({
    xs: 'small',
    sm: 'small',
    md: 'medium',
    lg: 'medium',
    xl: 'medium'
  }) as 'small' | 'medium';
  
  const handleChipToggle = (chip: string) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter(c => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h5" gutterBottom>
          Chip Component Examples
        </Typography>
        
        <Typography variant="body2" paragraph>
          This page demonstrates the implementation of the Chip component. 
          It includes the "Inactive" chip from component_429-15032.json specification
          along with other chip variants and styles.
        </Typography>
        
        {/* Component 429-15032.json example */}
        <Paper elevation={1} sx={{ mb: 4, mt: 4, overflow: 'hidden' }}>
          <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Inactive Chip from Component_429-15032.json:
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center', 
              gap: 2, 
              p: 2, 
              bgcolor: '#f8f8f8',
              borderRadius: 1,
              mb: 2
            }}>
              <Chip status="inactive" value="Inactive" />
              <Typography variant="caption" color="text.secondary">
                #F4F4F5 background | #18181B text | Inter SemiBold 12px
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              This chip is implemented exactly according to the design specifications.
              All attributes like font, size, color, and border radius match the design.
            </Typography>
          </Box>
        </Paper>
        
        <Divider sx={{ my: { xs: 3, md: 4 } }} />
        
        {/* Interactive Example */}
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Interactive Example</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Click on chips to toggle their selection:
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ mb: 3, '& > *': { mb: { xs: 1, sm: 0 } } }}
          >
            {['Active', 'Inactive', 'Default', 'In Progress'].map((label) => (
              <Chip
                key={label}
                status={selectedChips.includes(label) ? 
                  label.toLowerCase() === 'active' ? 'active' :
                  label.toLowerCase() === 'inactive' ? 'inactive' :
                  label.toLowerCase() === 'in progress' ? 'in-progress' : 
                  'default'
                : 'inactive'}
                value={label}
                onClick={() => handleChipToggle(label)}
              />
            ))}
          </Stack>
          
          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
            Selected: {selectedChips.join(', ') || 'None'}
          </Typography>
        </Paper>
        
        {/* Status Examples */}
        <Typography variant="subtitle1" sx={{ mt: { xs: 3, md: 4 }, mb: 1 }}>
          Status Chips:
        </Typography>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ mb: 4, '& > *': { mb: { xs: 1, sm: 0 } } }}
        >
          <Chip status="active" value={0} />
          <Chip status="inactive" value={0} />
          <Chip status="default" value={0} />
          <Chip status="in-progress" value="In progress" />
        </Stack>
        
        {/* Text Values */}
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          Text Value Chips:
        </Typography>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ mb: 4, '& > *': { mb: { xs: 1, sm: 0 } } }}
        >
          <Chip status="active" value="Active" />
          <Chip status="inactive" value="Inactive" />
          <Chip status="default" value="Default" />
          <Chip status="in-progress" value="In progress" />
        </Stack>
        
        {/* Size Variations */}
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          Size Variations:
        </Typography>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ mb: 4, '& > *': { mb: { xs: 1, sm: 0 } } }}
          alignItems="flex-start"
        >
          <Chip status="active" value="Small" size="small" />
          <Chip status="active" value="Medium" size="medium" />
          <Chip status="in-progress" value="In progress" size="small" />
          <Chip status="in-progress" value="In progress" size="medium" />
        </Stack>
        
        {/* Variant Styles */}
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          Variant Styles:
        </Typography>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ mb: 4, '& > *': { mb: { xs: 1, sm: 0 } } }}
        >
          <Chip status="active" value="Filled" variant="filled" />
          <Chip status="active" value="Outlined" variant="outlined" />
          <Chip status="in-progress" value="In progress" variant="filled" />
          <Chip status="in-progress" value="In progress" variant="outlined" />
        </Stack>
        
        {/* Disabled State */}
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          Disabled State:
        </Typography>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ mb: 4, '& > *': { mb: { xs: 1, sm: 0 } } }}
        >
          <Chip status="active" value="Disabled" disabled />
          <Chip status="in-progress" value="In progress" disabled />
          <Chip status="inactive" value="Inactive" disabled />
        </Stack>
        
        {/* Text Truncation */}
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          Text Overflow Handling:
        </Typography>
        <Stack 
          direction="column" 
          spacing={2} 
          sx={{ mb: 4 }}
        >
          <Chip status="active" value="Short text" />
          <Chip status="inactive" value="Medium length text that might wrap" />
          <Chip status="default" value="This is a very long text that will be truncated with ellipsis on smaller screens" />
        </Stack>
        
        {/* Responsive Behavior Demo */}
        <Paper elevation={1} sx={{ mt: 4, mb: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Responsive Behavior
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Current screen size: {isXSmall ? 'Extra Small Mobile' : isMobile ? 'Mobile' : 'Tablet/Desktop'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Current chip size: {chipSize}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Desktop View:</Typography>
              <Chip status="active" value="Normal size" />
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Mobile View:</Typography>
              <Box sx={{ transform: 'scale(0.95)', transformOrigin: 'left', mb: 1 }}>
                <Chip status="inactive" value="Slightly smaller" />
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Small Mobile View:</Typography>
              <Box sx={{ transform: 'scale(0.85)', transformOrigin: 'left' }}>
                <Chip status="in-progress" value="Smallest size" />
              </Box>
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
            The chips are fully responsive and will adjust their size on smaller screens.
            Try resizing your browser window to see this behavior.
          </Typography>
        </Paper>
      </Box>
      
      <NavigationButtons next="/buttons" />
    </Container>
  );
};

export default ChipExample;